
import pool from './db';

async function checkPlans() {
    try {
        const res = await pool.query('SELECT id, name, price_monthly, price_yearly, stripe_price_id FROM plans');
        console.table(res.rows);
    } catch (e) {
        console.error(e);
    } finally {
        await pool.end();
    }
}

checkPlans();
