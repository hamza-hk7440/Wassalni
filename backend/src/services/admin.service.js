
import { supabase } from '../config/supabase.js';

export const getDashboardStats = async () => {
    const [users, transactions, busesData, metrosData, ticketsDataQuery] = await Promise.all([
        supabase.from('users').select('user_id', { count: 'exact' }),
        supabase.from('transactions').select('amount', { count: 'exact' }),
        supabase.from('transports').select('transport_id', { count: 'exact' }).eq('type', 'Bus'),
        supabase.from('transports').select('transport_id', { count: 'exact' }).eq('type', 'Metro'),
        supabase.from('tickets').select(`
            price,
            schedules ( transports ( type ) )
        `)
    ]);

    const { data: revenueData, error: revenueError } = await supabase
        .from('transactions')
        .select('amount')
        .eq('status', 'completed');

    if (revenueError) throw revenueError;

    const totalRevenue = revenueData.reduce((sum, transaction) => sum + Number(transaction.amount), 0);
    const ticketsData = ticketsDataQuery.data || [];
    
    let totalRevenueMet = 0;
    let totalRevenueBus = 0;
    let placesVenduesMetro = 0;
    let placesVenduesBus = 0;

    for (const ticket of ticketsData) {
        const type = ticket.schedules?.transports?.type;
        const price = Number(ticket.price) || 0;
        if (type === 'Metro') {
            totalRevenueMet += price;
            placesVenduesMetro += 1;
        } else if (type === 'Bus') {
            totalRevenueBus += price;
            placesVenduesBus += 1;
        }
    }

    return {
        total_users: users.count || 0,
        total_transactions: transactions.count || 0,
        buses_count: busesData.count || 0,
        metros_count: metrosData.count || 0,
        total_revenue: totalRevenue || 0,
        revenue_metro: totalRevenueMet,
        revenue_bus: totalRevenueBus,
        places_vendues_metro: placesVenduesMetro,
        places_vendues_bus: placesVenduesBus,
        total_places: placesVenduesMetro + placesVenduesBus
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