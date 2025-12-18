import pool from './db';

const createTables = async () => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Create Users Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);


    // Create WiFi QRs Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS wifi_qrs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id),
        ssid VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        encryption VARCHAR(50) DEFAULT 'WPA',
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create Plans Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS plans (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL UNIQUE,
        price_monthly DECIMAL(10, 2) NOT NULL DEFAULT 0,
        price_yearly DECIMAL(10, 2) NOT NULL DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create Features Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS features (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        code VARCHAR(255) NOT NULL UNIQUE,
        name VARCHAR(255) NOT NULL,
        type VARCHAR(50) DEFAULT 'boolean',
        description TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create Plan_Features Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS plan_features (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        plan_id UUID REFERENCES plans(id) ON DELETE CASCADE,
        feature_id UUID REFERENCES features(id) ON DELETE CASCADE,
        value TEXT,
        display_text VARCHAR(255),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(plan_id, feature_id)
      );
    `);

    // Seed Default Plans
    const plans = [
      { name: 'Free', price_monthly: 0, price_yearly: 0, is_active: true },
      { name: 'Pro', price_monthly: 9.99, price_yearly: 99.99, is_active: true },
      { name: 'Premium', price_monthly: 19.99, price_yearly: 199.99, is_active: true },
    ];

    for (const plan of plans) {
      await client.query(`
        INSERT INTO plans (name, price_monthly, price_yearly, is_active)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (name) DO NOTHING;
      `, [plan.name, plan.price_monthly, plan.price_yearly, plan.is_active]);
    }

    // Seed Default Features
    const features = [
      { code: 'wifi_qr', name: 'WiFi QR Code', type: 'boolean', description: 'Create WiFi QR Codes' },
      { code: 'analytics', name: 'Analytics', type: 'boolean', description: 'View scan analytics' },
      { code: 'custom_design', name: 'Custom Design', type: 'boolean', description: 'Customize QR code design' },
    ];

    for (const feature of features) {
      await client.query(`
        INSERT INTO features (code, name, type, description)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (code) DO NOTHING;
      `, [feature.code, feature.name, feature.type, feature.description]);
    }


    await client.query('COMMIT');
    console.log('Tables created successfully');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating tables', error);
  } finally {
    client.release();
    pool.end();
  }
};

createTables();
