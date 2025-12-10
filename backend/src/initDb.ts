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
