import pool from './db';

const updateSchema = async () => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        console.log('Adding profile columns to users table...');

        const queries = [
            "ALTER TABLE users ADD COLUMN IF NOT EXISTS name VARCHAR(255);",
            "ALTER TABLE users ADD COLUMN IF NOT EXISTS address TEXT;",
            "ALTER TABLE users ADD COLUMN IF NOT EXISTS company VARCHAR(255);",
            "ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(50);",
            "ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'Customer';"
        ];

        for (const query of queries) {
            await client.query(query);
        }

        await client.query('COMMIT');
        console.log('Schema updated successfully');
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error updating schema', error);
    } finally {
        client.release();
        pool.end();
    }
};

updateSchema();
