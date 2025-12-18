
import { Router } from 'express';
import pool from '../db';

const router = Router();

// Get all features
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM features ORDER BY name');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching features:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Create feature
router.post('/', async (req, res) => {
    const { code, name, type, description } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO features (code, name, type, description) VALUES ($1, $2, $3, $4) RETURNING *',
            [code, name, type, description]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating feature:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update feature
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { code, name, type, description } = req.body;
    try {
        const result = await pool.query(
            'UPDATE features SET code = $1, name = $2, type = $3, description = $4 WHERE id = $5 RETURNING *',
            [code, name, type, description, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Feature not found' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating feature:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete feature
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM features WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Feature not found' });
        }
        res.json({ message: 'Feature deleted successfully' });
    } catch (error) {
        console.error('Error deleting feature:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
