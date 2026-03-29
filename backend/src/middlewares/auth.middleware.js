
import { supabase } from '../config/supabase.js';

const requireAdmin = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized, No token provided.' });
        }

        const  { data: { user }, error } = await supabase.auth.getUser(token);
        if (error || !user) {
            return res.status(401).json({ error: 'Unauthorized, Invalid token.' });
        }

        const { data: userData, error: dbError } = await supabase
            .from('users')
            .select('role')
            .eq('user_id', user.id) // FIXED: Changed 'id' to 'user_id'
            .single();

        if (dbError || !userData) {
            return res.status(500).json({ error: 'Failed to fetch user data.' });
        }

        // FIXED: Allow both 'admin' and 'superAdmin' to pass
        if (userData.role !== 'admin' && userData.role !== 'superAdmin') {
            return res.status(403).json({ error: 'Access Denied, Admins only.' });
        }

        req.user = user;
        req.user.role = userData.role;
        next();
    }

    catch (err) {
        console.error('Error in requireAdmin middleware:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export default requireAdmin;