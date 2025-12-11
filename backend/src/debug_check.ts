
import dotenv from 'dotenv';
import { Pool } from 'pg';
import jwt from 'jsonwebtoken';

dotenv.config();

console.log("Checking environment...");
console.log("DATABASE_URL present:", !!process.env.DATABASE_URL);
if (process.env.DATABASE_URL) {
    // obscure the password in log
    const parts = process.env.DATABASE_URL.split(':');
    console.log("DATABASE_URL format check:", parts.length > 2 ? "Valid format" : "Invalid format");
}
console.log("JWT_SECRET present:", !!process.env.JWT_SECRET);

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function check() {
    try {
        console.log("Connecting to DB...");
        const client = await pool.connect();
        console.log("DB Connected successfully.");

        try {
            const res = await client.query('SELECT NOW()');
            console.log("DB Time:", res.rows[0].now);
        } catch (e: any) {
            console.error("Select NOW() failed:", e.message);
        }

        try {
            const userRes = await client.query('SELECT count(*) FROM users');
            console.log("User count:", userRes.rows[0].count);
        } catch (e: any) {
            console.error("Select users failed (maybe table missing?):", e.message);
        }

        client.release();
    } catch (e: any) {
        console.error("DB Connection Failed:", e.message);
    }

    try {
        console.log("Testing JWT Sign...");
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is missing");
        }
        const token = jwt.sign({ id: 1 }, process.env.JWT_SECRET as string);
        console.log("JWT Sign Success.");
    } catch (e: any) {
        console.error("JWT Sign Failed:", e.message);
    }

    process.exit(0);
}

check();
