import { Router } from 'express';
import { OAuth2Client } from 'google-auth-library';
import pool from '../db';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

const router = Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post('/', async (req, res) => {
    const { token } = req.body;

    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        if (!payload || !payload.email) {
            return res.status(400).json({ error: 'Invalid Google Token' });
        }

        const email = payload.email;

        // Check if user exists
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        let user = result.rows[0];

        if (!user) {
            // Create new user with random password
            const randomPassword = uuidv4();
            const hashedPassword = await bcrypt.hash(randomPassword, 10);

            const newUserReq = await pool.query(
                'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email',
                [email, hashedPassword]
            );
            user = newUserReq.rows[0];
        }

        // Generate JWT
        const jwtToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
        res.json({ token: jwtToken, user: { id: user.id, email: user.email } });

    } catch (error) {
        console.error('Google Auth Error:', error);
        res.status(401).json({ error: 'Google authentication failed' });
    }
});

export default router;
