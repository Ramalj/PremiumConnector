import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../db';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = Router();

// Register
router.post('/register', async (req, res) => {
    const { email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(
            'INSERT INTO users (email, password, role) VALUES ($1, $2, $3) RETURNING id, email, role',
            [email, hashedPassword, 'Customer']
        );
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'User registration failed' });
    }
});

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) return res.status(400).json({ error: 'User not found' });

        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
        res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
});

// Get Current User
router.get('/me', authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
        const result = await pool.query('SELECT id, email, name, address, company, phone, role FROM users WHERE id = $1', [req.user?.id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch user details' });
    }
});

// Update Profile
router.put('/update-profile', authenticateToken, async (req: AuthRequest, res: Response) => {
    const { name, address, company, phone } = req.body;
    try {
        const result = await pool.query(
            'UPDATE users SET name = $1, address = $2, company = $3, phone = $4 WHERE id = $5 RETURNING id, email, name, address, company, phone',
            [name, address, company, phone, req.user?.id]
        );
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update profile' });
    }
});

export default router;
