import { supabase } from "../config/supabase.js";
import dotenv from "dotenv";
dotenv.config();
import {
  Transaction,
  TRANSACTION_TYPES,
  TRANSACTION_METHODS,
  TRANSACTION_STATUS,
} from "../models/payment.model.js";
import axios from "axios";
import https from "https";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

function extractTransactionId(rawValue) {
  const raw = String(rawValue || "");
  return (
    raw.match(
      /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/,
    )?.[0] || raw
  );
}

export async function createRecharge({ user_id, amount }) {
  let transactionId = null;

  try {
    //to create a recharge transaction, we need to insert a new record in the transactions table with type as recharge, method as online and status as pending
    const { data: transaction, error: dbError } = await supabase
      .from("transactions")
      .insert([
        {
          user_id: user_id,
          amount: amount,
          type: TRANSACTION_TYPES.RECHARGE,
          method: TRANSACTION_METHODS.ONLINE,
          status: TRANSACTION_STATUS.PENDING,
        },
      ])
      //we use select bcz we want to get the data from the supabase specially the transaction_id that we will need it later
      .select("*") //the * it's very important to be safe
      .single(); //we use single bcz the returned data from supabase is in form of array but we want a single object

    console.log("Supabase returned data:", transaction);
    if (dbError || !transaction) {
      console.error("Supabase Error:", dbError);
      throw new Error(
        dbError?.message || "Transaction record was not returned by database",
      );
    }
    transactionId = transaction.transaction_id;
    //we will build the paymee payload
    //this what we will send to paymee(the fields are from paymee integration documentation)
    const publicBaseUrl = process.env.NGROK_URL || "http://localhost:3000";

    const paymeePayload = {
      amount: amount,
      note: `Recharge Wallet - User ${user_id}`,
      first_name: "Customer",
      last_name: "User",
      email: "test@example.com",
      phone: "21600000000",
      return_url: `${publicBaseUrl}/payment-success?transaction_id=${transaction.transaction_id}`,
      cancel_url: `${publicBaseUrl}/payment-error?transaction_id=${transaction.transaction_id}`,
      webhook_url: `${process.env.NGROK_URL}/webhooks/paymee`, //this is the route that paymee will send to it the response,and like we said it have to be public(on the internet bcz paymee can't communicate to local host ) so we use Ngrok
      order_id: transaction.transaction_id || "temp_id", //here we are verifying if the id is null so we will put to it temp_id to don't crash
    };

    const allowInsecureTls =
      String(process.env.PAYMEE_ALLOW_INSECURE_TLS || "false").toLowerCase() ===
      "true";

    const axiosConfig = {
      headers: {
        Authorization: `Token ${process.env.PAYMEE_API}`,
        "Content-Type": "application/json",
      },
      timeout: 15000,
      ...(allowInsecureTls
        ? {
            httpsAgent: new https.Agent({
              rejectUnauthorized: false,
            }),
          }
        : {}),
    };

    if (allowInsecureTls) {
      console.warn(
        "PAYMEE_ALLOW_INSECURE_TLS is enabled. Disable it outside sandbox/dev.",
      );
    }

    //the axios.post take 3 parameters the first is url is the destination (is the sandbox url given by paymee),the second is the data (the Payload) and the third is config it means how it should be sent
    const response = await axios.post(
      `${process.env.PAYMEE_URL}/payments/create`,
      paymeePayload,
      axiosConfig,
    );
    //and here paymee api will return with a response that contains many fields( guven in paymee doculentation)one of them is data that contains also many fields
    //this data we will need it in the controller
    return response.data;
  } catch (error) {
    if (transactionId) {
      await supabase
        .from("transactions")
        .update({ status: TRANSACTION_STATUS.FAILED })
        .eq("transaction_id", transactionId);
    }

    console.error("Paymee API error:", error.response?.data || error.message);

    if (
      String(error.message || "")
        .toLowerCase()
        .includes("certificate")
    ) {
      throw new Error(
        "Paymee TLS certificate error. If you are in sandbox, set PAYMEE_ALLOW_INSECURE_TLS=true in backend/.env and restart backend.",
      );
    }

    throw error;
  }
}
//to update the tokens ballance after a recharge or a payment
export async function updateTokenBalance({ user_id, amount }) {
  console.log("user_id:", user_id, "amount:", amount);

  try {
    const { data: user, error } = await supabase
      .from("users")
      .select("token_balance")
      .eq("user_id", user_id)
      .single();
    if (error) throw error;
    const { error: dbError } = await supabase
      .from("users")
      .update({ token_balance: user.token_balance + amount })
      .eq("user_id", user_id);
    if (dbError) throw dbError;

    const { data: updatedUser, error: readError } = await supabase
      .from("users")
      .select("token_balance")
      .eq("user_id", user_id)
      .single();

    if (readError) throw readError;

    console.log("updated token_balance:", updatedUser.token_balance);
    return updatedUser.token_balance;
  } catch (error) {
    console.log("balance update error", error.message);
    throw error;
  }
}
//to verify if the tokens that one user have are enough for payment or no
export async function verifyTokensNumber({ user_id, amount }) {
  try {
    const { data: users, error: dbError } = await supabase
      .from("users")
      .select("token_balance")
      .eq("user_id", user_id)
      .single();

    if (dbError) throw dbError;
    return users.token_balance >= amount;
  } catch (error) {
    console.log("balance verify error", error.message);
  }
}
//to get the  token ballance
export async function getTokensBalance({ user_id }) {
  try {
    const { data: users, error: dbError } = await supabase
      .from("users")
      .select("token_balance")
      .eq("user_id", user_id)
      .single();
    if (dbError) throw dbError;
    return users.token_balance;
  } catch (error) {
    console.log("balance verify error", error.message);
  }
}
//convert money to token
export function moneyToToken({ amount }) {
  return amount * 10;
}
//convert token to money
export function tokenToMoney({ amount }) {
  return amount / 10;
}

//get the user id by the transaction id
export async function getUserIdByTransactionId({ transaction_id }) {
  try {
    const { data: transactions, error: dbError } = await supabase
      .from("transactions")
      .select("user_id")
      .eq("transaction_id", transaction_id)
      .single();
    if (dbError) throw dbError;
    return transactions.user_id;
  } catch (error) {
    console.log(" get User Id By Transaction Id verify error", error.message);
    throw error;
  }
}

export async function completeRechargeTransactionById({
  transaction_id,
  paid_amount,
}) {
  const cleanTransactionId = extractTransactionId(transaction_id);

  if (!cleanTransactionId) {
    throw new Error("transaction_id is required to complete recharge");
  }

  const { data: updatedTx, error: updateStatusError } = await supabase
    .from("transactions")
    .update({ status: TRANSACTION_STATUS.COMPLETED, credited: true })
    .eq("transaction_id", cleanTransactionId)
    .eq("credited", false)
    .select("transaction_id, user_id, amount, status, credited")
    .maybeSingle();

  if (updateStatusError) {
    throw updateStatusError;
  }

  if (!updatedTx) {
    const { data: existingTx, error: existingTxError } = await supabase
      .from("transactions")
      .select("transaction_id, user_id, amount, status, credited")
      .eq("transaction_id", cleanTransactionId)
      .maybeSingle();

    if (existingTxError) {
      throw existingTxError;
    }

    if (!existingTx) {
      return {
        transaction_id: cleanTransactionId,
        credited: false,
        reason: "not_found",
      };
    }

    if (existingTx.credited === true) {
      return {
        transaction_id: cleanTransactionId,
        credited: false,
        reason: "already_credited",
      };
    }

    const { data: forceUpdatedTx, error: forceUpdateError } = await supabase
      .from("transactions")
      .update({ status: TRANSACTION_STATUS.COMPLETED, credited: true })
      .eq("transaction_id", cleanTransactionId)
      .eq("credited", false)
      .select("transaction_id, user_id, amount, status, credited")
      .maybeSingle();

    if (forceUpdateError) {
      throw forceUpdateError;
    }

    if (!forceUpdatedTx) {
      return {
        transaction_id: cleanTransactionId,
        credited: false,
        reason: "already_credited",
      };
    }

    const forcedBaseAmount =
      typeof paid_amount === "number" &&
      !Number.isNaN(paid_amount) &&
      paid_amount > 0
        ? paid_amount
        : Number(forceUpdatedTx.amount || 0);

    const forcedTokensAdded = moneyToToken({ amount: forcedBaseAmount });

    const forcedNewBalance = await updateTokenBalance({
      user_id: forceUpdatedTx.user_id,
      amount: forcedTokensAdded,
    });

    return {
      transaction_id: cleanTransactionId,
      user_id: forceUpdatedTx.user_id,
      tokens_added: forcedTokensAdded,
      new_balance: forcedNewBalance,
      credited: true,
    };
  }

  const baseAmount =
    typeof paid_amount === "number" &&
    !Number.isNaN(paid_amount) &&
    paid_amount > 0
      ? paid_amount
      : Number(updatedTx.amount || 0);

  const tokensAdded = moneyToToken({ amount: baseAmount });

  const newBalance = await updateTokenBalance({
    user_id: updatedTx.user_id,
    amount: tokensAdded,
  });

  return {
    transaction_id: cleanTransactionId,
    user_id: updatedTx.user_id,
    tokens_added: tokensAdded,
    new_balance: newBalance,
    credited: true,
  };
}
