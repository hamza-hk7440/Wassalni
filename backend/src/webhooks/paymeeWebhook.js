import { supabase } from "../config/supabase.js";
import { completeRechargeTransactionById } from "../services/payment.service.js";

const processingTransactions = new Set();

export default async function paymeeWebhook(req, res) {
  try {
    //so the variable payload will contain the data sent by Paymee in the webhook, we can use it to update the transaction status in our database
    const payload = req.body;
    console.log("Received Paymee webhook:", payload);
    //here we will extract the necessary information from the payload, such as order_id, payment_status, amount and check_sum, tha we will need it in security check
    const { order_id, amount, cost } = payload;
    const payment_status = payload.payment_status;
    if (!order_id) {
      return res.status(400).json({ error: "Invalid webhook payload" });
    }

    const rawOrderId = String(order_id);
    const extractedOrderId =
      rawOrderId.match(
        /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/,
      )?.[0] || rawOrderId;

    if (processingTransactions.has(extractedOrderId)) {
      return res.status(200).json({ message: "Webhook already processing" });
    }

    processingTransactions.add(extractedOrderId);

    const normalizedPaymentStatus = String(payment_status).toLowerCase();
    const isCompleted =
      payment_status === true ||
      normalizedPaymentStatus === "true" ||
      normalizedPaymentStatus === "completed" ||
      normalizedPaymentStatus === "success" ||
      normalizedPaymentStatus === "1";

    //here the payment_status is a boolean value sent by Paymee, it will be true if the payment is successful, and false if it failed, so we will convert it to our transaction status values
    const status = isCompleted ? "completed" : "failed";

    try {
      if (status === "completed") {
        const paidAmount = Number.parseFloat(String(amount ?? cost ?? "0"));

        const completion = await completeRechargeTransactionById({
          transaction_id: extractedOrderId,
          paid_amount: Number.isNaN(paidAmount) ? 0 : paidAmount,
        });

        console.log("Recharge completion result:", completion);
      } else {
        const { error } = await supabase
          .from("transactions")
          .update({ status: "failed" })
          .eq("transaction_id", extractedOrderId);

        if (error) {
          console.error("Error updating transaction status:", error);
          return res
            .status(500)
            .json({ error: "Failed to update transaction status" });
        }
      }
    } finally {
      processingTransactions.delete(extractedOrderId);
    }

    res.status(200).json({ message: "Webhook processed successfully" });
  } catch (error) {
    console.error("Error processing Paymee webhook:", error);
    res.status(500).json({ error: "Failed to process webhook" });
  }
}
