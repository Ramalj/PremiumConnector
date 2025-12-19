import pool from './db';

const updateStripeSchema = async () => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        console.log('Starting Stripe schema updates...');

        // 1. Add Stripe columns to plans table
        console.log('Updating plans table...');
        await client.query(`
      ALTER TABLE plans 
      ADD COLUMN IF NOT EXISTS stripe_price_id VARCHAR(255),
      ADD COLUMN IF NOT EXISTS stripe_product_id VARCHAR(255);
    `);

        // 2. Create Stripe Customers Table
        console.log('Creating stripe_customers table...');
        await client.query(`
      CREATE TABLE IF NOT EXISTS stripe_customers (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
        stripe_customer_id VARCHAR(255) UNIQUE NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

        // 3. Create Subscriptions Table
        console.log('Creating subscriptions table...');
        await client.query(`
      CREATE TABLE IF NOT EXISTS subscriptions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        stripe_subscription_id VARCHAR(255) UNIQUE NOT NULL,
        stripe_price_id VARCHAR(255) NOT NULL,
        status VARCHAR(50) NOT NULL, -- active, trialing, canceled, etc.
        current_period_start TIMESTAMP WITH TIME ZONE,
        current_period_end TIMESTAMP WITH TIME ZONE,
        cancel_at_period_end BOOLEAN DEFAULT FALSE,
        trial_start TIMESTAMP WITH TIME ZONE,
        trial_end TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

        // 4. Create Payments Table
        console.log('Creating payments table...');
        await client.query(`
      CREATE TABLE IF NOT EXISTS payments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE SET NULL,
        stripe_payment_intent_id VARCHAR(255),
        stripe_invoice_id VARCHAR(255),
        amount DECIMAL(10, 2) NOT NULL,
        currency VARCHAR(10) DEFAULT 'usd',
        status VARCHAR(50) NOT NULL, -- succeeded, pending, failed
        receipt_url TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

        await client.query('COMMIT');
        console.log('Stripe schema updates completed successfully.');
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error updating Stripe schema:', error);
    } finally {
        client.release();
        pool.end();
    }
};

updateStripeSchema();
