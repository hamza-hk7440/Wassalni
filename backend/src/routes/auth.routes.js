import express from 'express';
import requireAdmin from '../middlewares/auth.middleware.js';

const router = express.Router();

// Test route for admin access
router.get('/admin/test', requireAdmin, (req, res) => {
    res.status(200).json({ 
        message: 'Admin access granted!',
        user: {
            id: req.user.id,
            email: req.user.email,
            role: req.user.role
        }
    });
});

// Public test route (no auth required)
router.get('/test', (req, res) => {
    res.status(200).json({ message: 'Public route - no auth needed' });
});

export default router;