
const { supabase } = require('../config/supabase');
const { v4: uuidv4 } = require('uuid');


// use case mt3 stats fi dashboard

const getDashboardStats = async (req, res) => {
    try {
        const [users, transactions, buses] = await Promise.all([
            supabase.from('users').select('user_id', { count: 'exact' }),
            supabase.from('transactions').select('amount', { count: 'exact' }),
            supabase.from('transports').select('transport_id', { count: 'exact' })
        ]);

        const { data: revenueData } = await supabase
            .from('transactions')
            .select('amount')
            .eq('status', 'success');

        const totalRevenue = revenueData.reduce((sum, transaction) => sum + transaction.amount, 0);

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

const createController = async (req, res) => {
    try {
        const { email, password, full_name } = req.body;

        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password
        });

        if (authError) throw authError;

        const uniqueCode = `CTRL-${Math.floor(1000 + Math.random() * 9000)}`;

        const { data, error: dbError} = await supabase
            .from('users')
            .insert([{
                user_id: authData.user.id,
                email: email,
                full_name: full_name,
                role: 'controller',
                unique_code: uniqueCode
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

module.exports = {
    getDashboardStats,
    createController
};