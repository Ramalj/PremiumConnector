
import { stripe } from './lib/stripe';
import pool from './db';

async function syncPlans() {
    console.log('Starting Stripe Plan Sync...');
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // 1. Fetch all plans from DB
        const res = await client.query('SELECT * FROM plans WHERE price_monthly > 0'); // Skip free plan usually
        const plans = res.rows;

        for (const plan of plans) {
            console.log(`Processing plan: ${plan.name}`);

            if (plan.stripe_price_id) {
                console.log(`  - Already has ID: ${plan.stripe_price_id}. Skipping.`);
                continue;
            }

            // 2. Check/Create Product
            console.log(`  - Searching for product '${plan.name}' in Stripe...`);
            const products = await stripe.products.search({
                query: `name:'${plan.name}'`,
            });

            let productId;
            if (products.data.length > 0) {
                productId = products.data[0].id;
                console.log(`  - Found existing product: ${productId}`);
            } else {
                console.log(`  - Creating new product...`);
                const product = await stripe.products.create({
                    name: plan.name,
                    description: `Subscription to ${plan.name} plan`,
                });
                productId = product.id;
            }

            // 3. Check/Create Price (Monthly)
            // Note: Simplification - we are just creating a monthly price for now to unblock the user.
            // Ideally we'd handle yearly too or check if the exact price exists.
            console.log(`  - Creating price for ${plan.price_monthly}/month...`);

            // We create a new price to ensure it matches our DB. Stripe allows multiple prices per product.
            const price = await stripe.prices.create({
                product: productId,
                unit_amount: Math.round(parseFloat(plan.price_monthly) * 100), // cents
                currency: 'usd',
                recurring: {
                    interval: 'month',
                },
                metadata: {
                    planId: plan.id
                }
            });

            console.log(`  - Created new price: ${price.id}`);

            // 4. Update DB
            await client.query(
                'UPDATE plans SET stripe_price_id = $1, stripe_product_id = $2 WHERE id = $3',
                [price.id, productId, plan.id]
            );
            console.log(`  - Updated DB.`);
        }

        await client.query('COMMIT');
        console.log('Sync completed successfully.');

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error syncing plans:', error);
    } finally {
        client.release();
        pool.end();
    }
}

syncPlans();
