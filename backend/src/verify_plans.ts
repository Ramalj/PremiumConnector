import { Pool } from 'pg';

// Hardcoded for debugging
const connectionString = 'postgres://qr_app_user:2b12mHEKivysTQo5U@localhost:5432/qr_generator?sslmode=disable';

const pool = new Pool({
    connectionString,
    ssl: false // Disable SSL for localhost
});

const verifyPlans = async () => {
    try {
        console.log('Connecting to database...');
        const res = await pool.query('SELECT * FROM plans');
        console.log('Plans found:', res.rows.length);
        console.log(JSON.stringify(res.rows, null, 2));
        process.exit(0);
    } catch (err) {
        console.error('Error querying plans:', err);
        process.exit(1);
    }
};

verifyPlans();
