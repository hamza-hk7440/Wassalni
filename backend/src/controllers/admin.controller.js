
import { supabase } from '../config/supabase.js';
import { v4 as uuidv4 } from 'uuid';


// use case mt3 stats fi dashboard

export const getDashboardStats = async (req, res) => {
    try {
        const [users, transactions, buses] = await Promise.all([
            supabase.from('users').select('user_id', { count: 'exact' }),
            supabase.from('transactions').select('amount', { count: 'exact' }),
            supabase.from('transports').select('transport_id', { count: 'exact' })
        ]);

        const { data: revenueData, error: revenueError } = await supabase
            .from('transactions')
            .select('amount')
            .eq('status', 'completed');

        if (revenueError) throw revenueError;

        const totalRevenue = revenueData.reduce((sum, transaction) => sum + Number(transaction.amount), 0);

        res.status(200).json({
            total_users: users.count,
            total_transactions: transactions.count,
            activeBuses: buses.count,
            total_revenue: totalRevenue
        });
    }

    catch (err) {
        console.error('Error fetching dashboard stats:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }   
}


// use case mt3 create controller

export const createController = async (req, res) => {
    try {
        const { email, password, first_name, last_name } = req.body;

        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password
        });

        if (authError) throw authError;

        const controllerCode = `CTRL-${Math.floor(1000 + Math.random() * 9000)}`;

        const { data, error: dbError} = await supabase
            .from('users')
            .insert([{
                user_id: authData.user.id,
                email: email,
                first_name: first_name,
                last_name: last_name,
                role: 'controller',
                controller_code: controllerCode
            }])
            .select();

        if (dbError) throw dbError;

        res.status(201).json({
            message: 'Controller created successfully',
            controller: data[0]
        });

    }

    catch (err) {
        console.error('Error creating controller:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
