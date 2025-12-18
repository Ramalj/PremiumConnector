
import { Router, Response } from 'express';
import pool from '../db';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { checkAdmin } from '../middleware/admin';
import bcrypt from 'bcryptjs';

const router = Router();

// Get Total User Count (Admin only)
router.get('/count', authenticateToken, checkAdmin, async (req: AuthRequest, res: Response) => {
    try {
        const result = await pool.query('SELECT COUNT(*) FROM users');
        res.json({ count: parseInt(result.rows[0].count) });
    } catch (error) {
        console.error('Error fetching user count:', error);
        res.status(500).json({ error: 'Failed to fetch user count' });
    }
});

// Get All Users (Admin only)
router.get('/', authenticateToken, checkAdmin, async (req: AuthRequest, res: Response) => {
    try {
        const result = await pool.query('SELECT id, email, name, role, created_at FROM users ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

// Update User Role (Admin only)
router.put('/:id/role', authenticateToken, checkAdmin, async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const { role } = req.body;

    const normalizedRole = role.toLowerCase();
    if (!['admin', 'customer'].includes(normalizedRole)) {
        return res.status(400).json({ error: 'Invalid role' });
    }

    try {
        const result = await pool.query(
            'UPDATE users SET role = $1 WHERE id = $2 RETURNING id, email, role',
            [role, id]
        );
        if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating role:', error);
        res.status(500).json({ error: 'Failed to update role' });
    }
});

// Update User Details (Admin only)
router.put('/:id', authenticateToken, checkAdmin, async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const { name, email } = req.body;

    try {
        const result = await pool.query(
            'UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING id, email, name, role',
            [name, email, id]
        );
        if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Failed to update user' });
    }
});

export default router;
