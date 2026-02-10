import {createClient} from '@supabase/supabase-js';
import { Transaction,TRANSACTION_TYPES,TRANSACTION_METHODS,TRANSACTION_STATUS } from '../models/payment.model';
import axios from 'axios';


const supabase=createClient(supabaseUrl,supabaseKey);
export async function createRecharge({userId, amount}){
    try{
        //to create a recharge transaction, we need to insert a new record in the transactions table with type as recharge, method as online and status as pending
        const {data:transaction,error}=await supabase
        .from('transactions')
        .insert([{
            userId,
            amount,
            type:TRANSACTION_TYPES.RECHARGE,
            method:TRANSACTION_METHODS.ONLINE,
            status:TRANSACTION_STATUS.PENDING,
        }])
        .select()
        .single();
        if(error){
            throw new Error(error.message);
        }
        //after creating the transaction, we need to call the payment gateway API to process the payment
        const paymeentResponse=await axios.post(PAYMEE_API_URL+'/payments/create',{
            amount,
            reference:transaction.id,//supabase will generate a unique id for the transaction, we can use it as reference for the payment gateway
            //this is called when payment is completed, and it must be reachable from the internet, so we will use ngrok to create a public url for our local server
            callback_url:
        }
    }
}