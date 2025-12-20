import express from 'express';
import { stripe } from '../lib/stripe';
import pool from '../db';
import { authenticateToken } from '../middleware/auth';
import { checkAdmin } from '../middleware/admin';

const router = express.Router();

/**
 * @route POST /api/subscription/create-checkout-session
 * @desc Create a Stripe Checkout session for a subscription plan
 * @access Private
 */
router.post('/create-checkout-session', authenticateToken, async (req: any, res) => {
    const { planId } = req.body;
    const userId = req.user.id;
    const userEmail = req.user.email;

    if (!planId) {
        return res.status(400).json({ error: 'Plan ID is required' });
    }

    try {
        // 1. Get Plan Details from DB
        const planResult = await pool.query(
            'SELECT * FROM plans WHERE id = $1',
            [planId]
        );

        if (planResult.rows.length === 0) {
            return res.status(404).json({ error: 'Plan not found' });
        }

        const plan = planResult.rows[0];

        // Check if plan is active
        if (!plan.is_active) {
            return res.status(400).json({ error: 'Plan is not active' });
        }

        // Check if free plan
        if (parseFloat(plan.price_monthly) === 0 && parseFloat(plan.price_yearly) === 0) {
            return res.status(400).json({ error: 'Cannot create checkout session for free plan' });
        }

        // Ensure stripe_price_id exists. If not, you might want to create it dynamically or error out.
        // For now, let's assume it exists or throw an error.
        if (!plan.stripe_price_id) {
            // Ideally, you'd create the price in Stripe here if it's missing, but for now:
            return res.status(500).json({ error: 'Stripe price ID not found for this plan. Please contact support.' });
        }

        // 2. Get or Create Stripe Customer
        let stripeCustomerId;
        const customerResult = await pool.query(
            'SELECT stripe_customer_id FROM stripe_customers WHERE user_id = $1',
            [userId]
        );

        if (customerResult.rows.length > 0) {
            stripeCustomerId = customerResult.rows[0].stripe_customer_id;
        } else {
            const customer = await stripe.customers.create({
                email: userEmail,
                metadata: {
                    userId: userId,
                },
            });
            stripeCustomerId = customer.id;

            await pool.query(
                'INSERT INTO stripe_customers (user_id, stripe_customer_id) VALUES ($1, $2)',
                [userId, stripeCustomerId]
            );
        }

        // 3. Create Checkout Session
        const session = await stripe.checkout.sessions.create({
            customer: stripeCustomerId,
            mode: 'subscription',
            payment_method_types: ['card'], // Only card for subscriptions usually
            line_items: [
                {
                    price: plan.stripe_price_id,
                    quantity: 1,
                },
            ],
            subscription_data: {
                trial_period_days: 7, // 7-day free trial as requested
                metadata: {
                    userId: userId,
                    planId: planId
                }
            },
            success_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/pricing`,

            metadata: {
                userId: userId,
                planId: planId
            },
        });

        res.json({ url: session.url });
    } catch (error: any) {
        console.error('Error creating checkout session:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
});

/**
 * @route POST /api/subscription/portal-session
 * @desc Create a Stripe Customer Portal session for managing subscriptions
 * @access Private
 */
router.post('/portal-session', authenticateToken, async (req: any, res) => {
    const userId = req.user.id;

    try {
        const customerResult = await pool.query(
            'SELECT stripe_customer_id FROM stripe_customers WHERE user_id = $1',
            [userId]
        );

        if (customerResult.rows.length === 0) {
            return res.status(404).json({ error: 'No Stripe customer found for this user' });
        }

        const stripeCustomerId = customerResult.rows[0].stripe_customer_id;

        const session = await stripe.billingPortal.sessions.create({
            customer: stripeCustomerId,
            return_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/profile`,
        });

        res.json({ url: session.url });
    } catch (error: any) {
        console.error('Error creating portal session:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * @route GET /api/subscription/status
 * @desc Get current subscription status
 * @access Private
 */
router.get('/status', authenticateToken, async (req: any, res) => {
    const userId = req.user.id;

    try {
        const query = `
            SELECT 
                s.status, 
                s.current_period_end, 
                s.cancel_at_period_end,
                p.name as plan_name,
                p.price_monthly,
                p.price_yearly
            FROM subscriptions s
            JOIN plans p ON s.stripe_price_id = p.stripe_price_id
            WHERE s.user_id = $1
            ORDER BY s.created_at DESC
            LIMIT 1
        `;

        const result = await pool.query(query, [userId]);

        if (result.rows.length === 0) {
            return res.json({ status: 'none', plan_name: 'Free' }); // Default to free if no sub
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching subscription status:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * @route GET /api/subscription/history
 * @desc Get payment history
 * @access Private
 */
router.get('/history', authenticateToken, async (req: any, res) => {
    const userId = req.user.id;

    try {
        const query = `
            SELECT 
                amount, 
                currency, 
                status, 
                created_at, 
                receipt_url 
            FROM payments 
            WHERE user_id = $1 
            ORDER BY created_at DESC
        `;

        const result = await pool.query(query, [userId]);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching payment history:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * @route GET /api/subscription/admin/payments
 * @desc Get all payments (Admin only)
 * @access Private/Admin
 */
router.get('/admin/payments', authenticateToken, checkAdmin, async (req: any, res) => {
    try {
        const query = `
            SELECT 
                p.id,
                p.amount,
                p.currency,
                p.status,
                p.created_at,
                p.receipt_url,
                u.email as user_email,
                u.name as user_name
            FROM payments p
            JOIN users u ON p.user_id = u.id
            ORDER BY p.created_at DESC
        `;

        const result = await pool.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching all payments:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * @route GET /api/subscription/admin/subscribers
 * @desc Get all subscribers (Admin only)
 * @access Private/Admin
 */
router.get('/admin/subscribers', authenticateToken, checkAdmin, async (req: any, res) => {
    try {
        const query = `
            SELECT 
                s.id,
                s.status,
                s.current_period_end,
                s.cancel_at_period_end,
                u.email as user_email,
                u.name as user_name,
                p.name as plan_name,
                p.price_monthly,
                p.price_yearly
            FROM subscriptions s
            JOIN users u ON s.user_id = u.id
            JOIN plans p ON s.stripe_price_id = p.stripe_price_id
            ORDER BY s.created_at DESC
        `;

        const result = await pool.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching all subscribers:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
