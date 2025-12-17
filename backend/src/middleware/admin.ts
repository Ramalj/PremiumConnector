
import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';

export const checkAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
    const userRole = (req.user as any)?.role;
    console.log('Admin Check - User:', req.user);
    console.log('Admin Check - Role:', userRole);

    if (userRole && userRole.toLowerCase() === 'admin') {
        next();
    } else {
        console.log('Admin Check - Access Denied');
        res.status(403).json({ error: 'Access denied. Admins only.' });
    }
};
