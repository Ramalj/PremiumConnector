import Stripe from 'stripe';
import { Pool } from 'pg';

// Remove apiVersion to use default
const stripe = new Stripe('sk_test_REDACTED');

const connectionString = 'postgres://qr_app_user:2b12mHEKivysTQo5U@localhost:5432/qr_generator?sslmode=disable';

const pool = new Pool({
    connectionString,
    ssl: false
});

const fixPlans = async () => {
    try {
        console.log('Creating Pro Product...');
        const proProduct = await stripe.products.create({
            name: 'Pro Plan Gen 2',
            description: 'Unlock more power for professionals and creators.'
        });
        console.log('Created Pro Product:', proProduct.id);

        console.log('Creating Pro Price...');
        const proPrice = await stripe.prices.create({
            product: proProduct.id,
            unit_amount: 999, // $9.99
            currency: 'usd',
            recurring: {
                interval: 'month',
            },
        });
        console.log('Created Pro Price:', proPrice.id);

        console.log('Updating DB...');
        await pool.query(
            `UPDATE plans SET stripe_price_id = $1, stripe_product_id = $2 WHERE name = 'Pro'`,
            [proPrice.id, proProduct.id]
        );
        console.log('Updated Pro Plan in DB successfully.');

        process.exit(0);
    } catch (error) {
        console.error('Error fixing plans:', error);
        // @ts-ignore
        if (error.raw) {
            // @ts-ignore
            console.error('Stripe Raw Error:', error.raw);
        }
        process.exit(1);
    }
};

fixPlans();
