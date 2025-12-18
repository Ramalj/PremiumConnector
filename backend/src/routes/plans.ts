
import { Router } from 'express';
import pool from '../db';

const router = Router();

// Get all plans with their features
router.get('/', async (req, res) => {
    try {
        const plansResult = await pool.query('SELECT * FROM plans ORDER BY price_monthly');
        const plans = plansResult.rows;

        for (const plan of plans) {
            const featuresResult = await pool.query(`
                SELECT f.*, pf.value, pf.display_text, 
                CASE WHEN pf.id IS NOT NULL THEN true ELSE false END as feature_active_in_plan
                FROM features f
                LEFT JOIN plan_features pf ON f.id = pf.feature_id AND pf.plan_id = $1
            `, [plan.id]);
            plan.features = featuresResult.rows;
        }

        res.json(plans);
    } catch (error) {
        console.error('Error fetching plans:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update plan details
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, price_monthly, price_yearly, is_active } = req.body;
    try {
        const result = await pool.query(
            'UPDATE plans SET name = $1, price_monthly = $2, price_yearly = $3, is_active = $4 WHERE id = $5 RETURNING *',
            [name, price_monthly, price_yearly, is_active, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Plan not found' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating plan:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update plan features (Toggle assignment / Update values)
router.put('/:id/features', async (req, res) => {
    const { id } = req.params;
    const { feature_id, value, display_text, is_assigned } = req.body; // is_assigned true = assign, false = unassign

    try {
        if (is_assigned) {
            // Assign or Update
            const result = await pool.query(`
                INSERT INTO plan_features (plan_id, feature_id, value, display_text)
                VALUES ($1, $2, $3, $4)
                ON CONFLICT (plan_id, feature_id) 
                DO UPDATE SET value = $3, display_text = $4
                RETURNING *;
            `, [id, feature_id, value, display_text]);
            res.json(result.rows[0]);
        } else {
            // Unassign
            await pool.query('DELETE FROM plan_features WHERE plan_id = $1 AND feature_id = $2', [id, feature_id]);
            res.json({ message: 'Feature unassigned from plan' });
        }
    } catch (error) {
        console.error('Error updating plan features:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
