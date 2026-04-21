import { supabase } from "../config/supabase.js";
import * as userService from "./user.service.js";

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
        // todo : passenger only
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
  const { email, password, first_name, last_name, role } = controllerData;

  if (!email || !password || !first_name || !last_name) {
    throw new Error("email, password, first_name and last_name are required");
  }

  if (role && !["admin", "controller"].includes(role)) {
    throw new Error("role must be 'controller' or 'admin'");
  }

  const userRole = role === "admin" ? "admin" : "controller";

  // Reuse the stable user creation flow used by the rest of the app.
  // It creates auth + users row and returns the generated verification code.
  const generatedCode = await userService.createUser({
    email,
    password,
    role: userRole,
    first_name,
    last_name,
  });

  if (!generatedCode || typeof generatedCode !== "string") {
    throw new Error("Failed to generate verification code");
  }

  const { data: createdUser, error: userError } = await supabase
    .from("users")
    .select("user_id,email,first_name,last_name,role,controller_code,admin_code")
    .eq("email", email)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (userError) {
    throw new Error(userError.message);
  }

  const referenceCodeDetails = {
    code: generatedCode,
    calculation: {
      formula: "verification_code = random_6_digits",
      random_range: "100000-999999",
      random_value: Number(generatedCode),
      for_role: userRole,
    },
  };

  return {
    ...(createdUser || {
      email,
      first_name,
      last_name,
      role: userRole,
    }),
    reference_code: generatedCode,
    reference_code_details: referenceCodeDetails,
  };
};

// zedna lpart bch nfetchou l users lkoll bch nalgouhom fl dashboard, w zedna el delete user zeda
export const getAllUsers = async () => {
  const { data, error } = await supabase
    .from("users")
    .select(
      `
            user_id,
            email,
            first_name,
            last_name,
            role,
            token_balance,
            created_at
        `,
    )
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return data;
};

export const deleteUser = async (userId) => {
  const { data, error } = await supabase.auth.admin.deleteUser(userId);

  if (error) throw new Error(error.message);

  return data;
};

export const updateUser = async (userId, data) => {
  const { first_name, last_name, email, password, token_balance } = data;

  // 1. Update Auth User if email or password provided
  const authUpdates = {};
  if (email) authUpdates.email = email;
  if (password) authUpdates.password = password;

  if (Object.keys(authUpdates).length > 0) {
    const { error: authError } = await supabase.auth.admin.updateUserById(userId, authUpdates);
    if (authError) throw new Error(authError.message);
  }

  // 2. Update Public Users Table
  const dbUpdates = {};
  if (first_name !== undefined) dbUpdates.first_name = first_name;
  if (last_name !== undefined) dbUpdates.last_name = last_name;
  if (email !== undefined) dbUpdates.email = email;

  if (token_balance !== undefined) {
    const parsedTokenBalance = Number(token_balance);

    if (!Number.isFinite(parsedTokenBalance) || parsedTokenBalance < 0) {
      throw new Error("token_balance must be a valid number greater than or equal to 0");
    }

    dbUpdates.token_balance = parsedTokenBalance;
  }

  if (Object.keys(dbUpdates).length > 0) {
    const { data: updatedUser, error: dbError } = await supabase
      .from("users")
      .update(dbUpdates)
      .eq("user_id", userId)
      .select();

    if (dbError) throw new Error(dbError.message);
    return updatedUser[0];
  }
  return { message: "Aucune donnée à mettre à jour" };
};

// w zedna fetch l transactions w tickets zeda
export const getAllTransactions = async () => {
  const { data, error } = await supabase
    .from("transactions")
    .select(`*`)
    .order("timestamp", { ascending: false });

  if (error) throw new Error(error.message);

  return data;
};

export const getAllTickets = async () => {
  const { data, error } = await supabase
    .from("tickets")
    .select(`
      *,
      users (first_name, last_name, email),
      schedules (
        departure_time,
        routes (
          start_station:stations!routes_start_station_id_fkey(name),
          end_station:stations!routes_end_station_id_fkey(name)
        ),
        transports (type)
      )
    `)
    .order("purchase_date", { ascending: false });

  if (error) throw new Error(error.message);

  return data;
};
