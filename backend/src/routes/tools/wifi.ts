import { Router, Response } from 'express'; // Import Response
import pool from '../../db';
import { authenticateToken, authenticateOptional, AuthRequest } from '../../middleware/auth';


const router = Router();

// Get all Wi-Fi QRs for the logged-in user or guest session
router.get('/', authenticateOptional, async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        const guestId = req.headers['x-guest-id'] as string;

        if (!userId && !guestId) {
            return res.json([]);
        }

        let queryText = 'SELECT * FROM wifi_qrs WHERE ';
        const queryParams: any[] = [];

        if (userId) {
            queryText += 'user_id = $1';
            queryParams.push(userId);
            if (guestId) {
                queryText += ' OR guest_session_id = $2';
                queryParams.push(guestId);
            }
        } else {
            queryText += 'guest_session_id = $1 AND user_id IS NULL';
            queryParams.push(guestId);
        }

        queryText += ' ORDER BY created_at DESC';

        const result = await pool.query(queryText, queryParams);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch Wi-Fi QRs' });
    }
});

// Create a new Wi-Fi QR
router.post('/', authenticateOptional, async (req: AuthRequest, res: Response) => {
    const { ssid, password, encryption } = req.body;
    const userId = req.user?.id;
    const guestId = req.headers['x-guest-id'] as string;

    try {
        const result = await pool.query(
            'INSERT INTO wifi_qrs (user_id, guest_session_id, ssid, password, encryption) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [userId || null, userId ? null : guestId, ssid, password, encryption || 'WPA']
        );
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create Wi-Fi QR' });
    }
});

// Update Wi-Fi QR (Edit or Toggle)
router.put('/:id', authenticateOptional, async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const { ssid, password, is_active, encryption } = req.body;
    const userId = req.user?.id;
    const guestId = req.headers['x-guest-id'] as string;

    try {
        // Dynamic update
        const fields = [];
        const values = [];
        let query = 'UPDATE wifi_qrs SET ';

        if (ssid !== undefined) {
            fields.push(`ssid = $${fields.length + 1}`);
            values.push(ssid);
        }
        if (password !== undefined) {
            fields.push(`password = $${fields.length + 1}`);
            values.push(password);
        }
        if (is_active !== undefined) {
            fields.push(`is_active = $${fields.length + 1}`);
            values.push(is_active);
        }
        if (encryption !== undefined) {
            fields.push(`encryption = $${fields.length + 1}`);
            values.push(encryption);
        }

        if (fields.length === 0) return res.status(400).json({ error: 'No fields to update' });

        // WHERE clause construction
        let whereClause = ` WHERE id = $${fields.length + 1}`;
        values.push(id);

        if (userId) {
            whereClause += ` AND (user_id = $${fields.length + 2}`;
            values.push(userId);
            if (guestId) {
                whereClause += ` OR guest_session_id = $${fields.length + 3}`;
                values.push(guestId);
            }
            whereClause += ')';
        } else {
            whereClause += ` AND guest_session_id = $${fields.length + 2} AND user_id IS NULL`;
            values.push(guestId);
        }

        query += fields.join(', ') + whereClause + ' RETURNING *';

        const result = await pool.query(query, values);

        if (result.rows.length === 0) return res.status(404).json({ error: 'Wi-Fi QR not found or unauthorized' });

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update Wi-Fi QR' });
    }
});

// Public Endpoint for Scanning (Frontend calls this)
router.get('/public/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT ssid, password, encryption, is_active FROM wifi_qrs WHERE id = $1', [id]);

        if (result.rows.length === 0) return res.status(404).json({ error: 'Wi-Fi QR not found' });

        const wifi = result.rows[0];
        if (!wifi.is_active) return res.status(403).json({ error: 'This Wi-Fi QR is currently disabled' });

        res.json(wifi);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});


export default router;
