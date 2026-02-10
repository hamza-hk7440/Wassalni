import {createClient} from '@supabase/supabase-js';

const supabaseUrl=process.env.SUPABASE_URL;
const supabaseKey=process.env.SUPABASE_KEY;
const supabase=createClient(supabaseUrl,supabaseKey);

export default async function paymeeWebhook(req,res){
    try{
        const payload=req.body;
        console.log('Received Paymee webhook:', payload);
        //we need to update the transaction status based on the payment status received from Paymee
        const {data:transaction,error}=await supabase
        .from('transactions')
        .update({status: status.toLowerCase()})
        .eq('external_ref',external_ref);
        if(error){
            console.error('Error updating transaction status:', error);
            return res.status(500).json({error:'Failed to update transaction status'});
        }
        console.log('Transaction status updated successfully:', transaction);
        res.status(200).json({message:'Webhook processed successfully'});
    }catch(error){
        console.error('Error processing Paymee webhook:', error);
        res.status(500).json({error:'Failed to process webhook'});
    }
}