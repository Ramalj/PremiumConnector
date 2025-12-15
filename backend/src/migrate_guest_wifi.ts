
import pool from './db';

const migrate = async () => {
    try {
        console.log('Migrating wifi_qrs table...');
        await pool.query(`
            ALTER TABLE wifi_qrs 
            ALTER COLUMN user_id DROP NOT NULL;
        `);
        console.log('Made user_id nullable.');

        await pool.query(`
            ALTER TABLE wifi_qrs 
            ADD COLUMN IF NOT EXISTS guest_session_id VARCHAR(255);
        `);
        console.log('Added guest_session_id column.');

    } catch (err) {
        console.error('Migration failed:', err);
    } finally {
        await pool.end();
    }
};

migrate();
