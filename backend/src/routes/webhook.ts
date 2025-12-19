import express from 'express';
import { stripe } from '../lib/stripe';
import pool from '../db';

const router = express.Router();

/**
 * @route POST /api/webhook/stripe
 * @desc Handle Stripe webhooks
 * @access Public (Stripe ignores auth headers, but validates signature)
 */
router.post('/stripe', express.raw({ type: 'application/json' }), async (req: express.Request, res: express.Response) => {
    const sig = req.headers['stripe-signature'];

    let event;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
        console.error('STRIPE_WEBHOOK_SECRET is not defined');
        return res.status(500).send('Server configuration error');
    }

    try {
        event = stripe.webhooks.constructEvent(req.body, sig as string, webhookSecret);
    } catch (err: any) {
        console.error(`Webhook signature verification failed: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    try {
        switch (event.type) {
            case 'checkout.session.completed':
                const session = event.data.object;
                // Logic to finalize subscription if needed, though 'customer.subscription.created' often handles the core logic.
                // If you are needing to link the user_id from metadata to the stripe_customer_id in case it wasn't done before:
                if (session.metadata?.userId && session.customer) {
                    await pool.query(
                        `INSERT INTO stripe_customers (user_id, stripe_customer_id) 
                 VALUES ($1, $2) 
                 ON CONFLICT (user_id) DO UPDATE SET stripe_customer_id = $2`,
                        [session.metadata.userId, session.customer]
                    );
                }
                break;

            case 'customer.subscription.created':
            case 'customer.subscription.updated':
            case 'customer.subscription.deleted':
                const subscription = event.data.object;
                await handleSubscriptionChange(subscription);
                break;

            case 'invoice.payment_succeeded':
                const invoice = event.data.object;
                await handleInvoicePaymentSucceeded(invoice);
                break;

            case 'invoice.payment_failed':
                const invoiceFailed = event.data.object;
                // Handle failed payment (e.g., notify user, update status)
                console.log('Payment failed for invoice:', invoiceFailed.id);
                break;

            default:
                console.log(`Unhandled event type ${event.type}`);
        }

        res.json({ received: true });
    } catch (error) {
        console.error('Error handling webhook event:', error);
        res.status(500).send('Internal Server Error');
    }
});


async function handleSubscriptionChange(subscription: any) {
    const stripeCustomerId = subscription.customer;
    const status = subscription.status;
    const stripeSubscriptionId = subscription.id;
    // Assuming single item per subscription for simplicity
    const stripePriceId = subscription.items.data[0]?.price.id;

    const currentPeriodStart = new Date(subscription.current_period_start * 1000);
    const currentPeriodEnd = new Date(subscription.current_period_end * 1000);
    const cancelAtPeriodEnd = subscription.cancel_at_period_end;
    const trialStart = subscription.trial_start ? new Date(subscription.trial_start * 1000) : null;
    const trialEnd = subscription.trial_end ? new Date(subscription.trial_end * 1000) : null;

    try {
        // Find user by stripe_customer_id
        const userResult = await pool.query(
            'SELECT user_id FROM stripe_customers WHERE stripe_customer_id = $1',
            [stripeCustomerId]
        );

        if (userResult.rows.length === 0) {
            console.error(`User not found for stripe customer id: ${stripeCustomerId}`);
            return;
        }

        const userId = userResult.rows[0].user_id;

        // Upsert subscription
        await pool.query(`
            INSERT INTO subscriptions (
                id, user_id, stripe_subscription_id, stripe_price_id, status, 
                current_period_start, current_period_end, cancel_at_period_end, 
                trial_start, trial_end, updated_at
            )
            VALUES (
                gen_random_uuid(), $1, $2, $3, $4, 
                $5, $6, $7, 
                $8, $9, CURRENT_TIMESTAMP
            )
            ON CONFLICT (stripe_subscription_id) 
            DO UPDATE SET 
                stripe_price_id = $3,
                status = $4,
                current_period_start = $5,
                current_period_end = $6,
                cancel_at_period_end = $7,
                trial_start = $8,
                trial_end = $9,
                updated_at = CURRENT_TIMESTAMP
        `, [
            userId, stripeSubscriptionId, stripePriceId, status,
            currentPeriodStart, currentPeriodEnd, cancelAtPeriodEnd,
            trialStart, trialEnd
        ]);

        console.log(`Subscription ${stripeSubscriptionId} updated/created.`);

    } catch (error) {
        console.error('Error updating subscription in DB:', error);
    }
}

async function handleInvoicePaymentSucceeded(invoice: any) {
    if (!invoice.payment_intent) return; // subscription verification invoices might not have payment intents immediately

    const stripeCustomerId = invoice.customer;
    const amount = invoice.amount_paid / 100; // Convert cents to dollars
    const currency = invoice.currency;
    const stripePaymentIntentId = invoice.payment_intent;
    const stripeInvoiceId = invoice.id;
    const receiptUrl = invoice.hosted_invoice_url;

    try {
        // Find user by stripe_customer_id
        const userResult = await pool.query(
            'SELECT user_id FROM stripe_customers WHERE stripe_customer_id = $1',
            [stripeCustomerId]
        );

        const userId = userResult.rows.length > 0 ? userResult.rows[0].user_id : null;

        await pool.query(`
            INSERT INTO payments (
                user_id, stripe_payment_intent_id, stripe_invoice_id, amount, currency, status, receipt_url
            ) VALUES ($1, $2, $3, $4, $5, 'succeeded', $6)
        `, [userId, stripePaymentIntentId, stripeInvoiceId, amount, currency, receiptUrl]);

        console.log(`Payment recorded for invoice ${stripeInvoiceId}`);

    } catch (error) {
        console.error('Error recording payment:', error);
    }
}

export default router;
