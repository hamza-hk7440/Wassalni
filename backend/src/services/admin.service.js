
import { supabase } from '../config/supabase.js';

export const getDashboardStats = async () => {
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

    return {
        total_users: users.count,
        total_transactions: transactions.count,
        activeBuses: buses.count,
        total_revenue: totalRevenue
    };
};

export const createController = async (controllerData) => {
    const { email, password, first_name, last_name } = controllerData;

    // 1. Create the Auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password
    });

    if (authError) throw authError;

    // 2. Generate the code
    const controllerCode = `CTRL-${Math.floor(1000 + Math.random() * 9000)}`;

    // 3. Insert into the public users table
    const { data, error: dbError } = await supabase
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

    return data[0];
};