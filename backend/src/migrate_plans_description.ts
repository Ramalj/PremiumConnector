
import pool from './db';

const migrate = async () => {
    try {
        console.log('Migrating plans table...');

        // Add description column
        await pool.query(`
            ALTER TABLE plans 
            ADD COLUMN IF NOT EXISTS description TEXT;
        `);
        console.log('Added description column to plans.');

        // Update existing plans with descriptions matching frontend
        const updates = [
            { name: 'Free', description: 'Perfect for getting started with basic QR needs.' },
            { name: 'Pro', description: 'Unlock more power for professionals and creators.' },
            { name: 'Premium', description: 'Ultimate toolkit for businesses and agencies.' }
        ];

        for (const update of updates) {
            await pool.query(`
                UPDATE plans 
                SET description = $1 
                WHERE name = $2
            `, [update.description, update.name]);
        }
        console.log('Updated existing plans with descriptions.');

    } catch (err) {
        console.error('Migration failed:', err);
    } finally {
        await pool.end();
    }
};

migrate();
