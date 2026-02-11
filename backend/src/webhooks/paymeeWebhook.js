import { supabase } from "../config/supabase.js";
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
export default async function paymeeWebhook(req, res) {
  console.log("Supabase URL:", supabaseUrl);
  console.log("Supabase Key:", supabaseKey);
  try {
    //so the variable payload will contain the data sent by Paymee in the webhook, we can use it to update the transaction status in our database
    const payload = req.body;
    console.log("Received Paymee webhook:", payload);
    //here we will extract the necessary information from the payload, such as order_id, payment_status, amount and check_sum, tha we will need it in security check
    const { order_id, payment_status, amount, check_sum } = payload;
    if (!order_id || !payment_status || !amount || !check_sum) {
      return res.status(400).json({ error: "Invalid webhook payload" });
    }
    //here the payment_status is a boolean value sent by Paymee, it will be true if the payment is successful, and false if it failed, so we will convert it to our transaction status values
    const status = payment_status ? "completed" : "failed";
    const { data: transaction, error } = await supabase
      //update the transaction status in our database based on the order_id, which is the same as the transaction id that we used as reference when creating the payment
      .from("transactions")
      .update({ status })
      .eq("transaction_id", order_id);
    if (error) {
      console.error("Error updating transaction status:", error);
      return res
        .status(500)
        .json({ error: "Failed to update transaction status" });
    }
    console.log("Transaction status updated successfully:", transaction);
    res.status(200).json({ message: "Webhook processed successfully" });
  } catch (error) {
    console.error("Error processing Paymee webhook:", error);
    res.status(500).json({ error: "Failed to process webhook" });
  }
}
