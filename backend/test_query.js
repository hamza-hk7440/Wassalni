import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
    const { data: ticketsData, error: ticketsError } = await supabase
        .from('tickets')
        .select(`
            price,
            schedules (
                transports ( type )
            )
        `);
    console.log(JSON.stringify(ticketsData, null, 2));
    console.log(ticketsError);
}
test();
