
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

        // Prefer database role, but gracefully fall back to token metadata role.
        // This avoids hard 500s when users table row is temporarily unavailable.
        const roleFromDb = userData?.role;
        const roleFromMetadata = user?.user_metadata?.role || user?.app_metadata?.role;
        const finalRole = roleFromDb || roleFromMetadata;

        if (dbError && !finalRole) {
            return res.status(401).json({
                error: 'Unauthorized, could not resolve user role.',
                details: dbError.message,
            });
        }

        if (!finalRole) {
            return res.status(403).json({ error: 'Access Denied, role not assigned.' });
        }

        // FIXED: Allow both 'admin' and 'superAdmin' to pass
        if (finalRole !== 'admin' && finalRole !== 'superAdmin') {
            return res.status(403).json({ error: 'Access Denied, Admins only.' });
        }

        req.user = user;
        req.user.role = finalRole;
        next();
    }

    catch (err) {
        console.error('Error in requireAdmin middleware:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export default requireAdmin;