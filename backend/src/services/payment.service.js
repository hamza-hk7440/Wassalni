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

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
export async function createRecharge({ user_id, amount }) {
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
    //we will build the paymee payload
    //this what we will send to paymee(the fields are from paymee integration documentation)
    const paymeePayload = {
      amount: amount,
      note: `Recharge Wallet - User ${user_id}`,
      first_name: "Customer",
      last_name: "User",
      email: "test@example.com",
      phone: "21600000000",
      return_url: "https://localhost:3000/payment-success",
      cancel_url: "https://localhost:3000/payment-error",
      webhook_url: `${process.env.NGROK_URL}/webhooks/paymee`, //this is the route that paymee will send to it the response,and like we said it have to be public(on the internet bcz paymee can't communicate to local host ) so we use Ngrok
      order_id: transaction.transaction_id || "temp_id", //here we are verifying if the id is null so we will put to it temp_id to don't crash
    };
    //the axios.post take 3 parameters the first is url is the destination (is the sandbox url given by paymee),the second is the data (the Payload) and the third is config it means how it should be sent
    const response = await axios.post(
      `${process.env.PAYMEE_URL}/payments/create`,
      paymeePayload,
      {
        headers: {
          Authorization: `Token ${process.env.PAYMEE_API}`,
          "Content-Type": "application/json",
        },
      },
    );
    //and here paymee api will return with a response that contains many fields( guven in paymee doculentation)one of them is data that contains also many fields
    //this data we will need it in the controller
    return response.data;
  } catch (error) {
    console.error("Paymee API error:", error.response?.data || error.message);
    throw error;
  }
}
//to update the tokens ballance after a recharge or a payment
export async function updateTokenBalance({ user_id, amount }) {
  try {
    //the rpc can call a supabase function ,so in our case the function is called increment_token
    const { data: users, error: dbError } = await supabase.rpc(
      "increment_tokens",
      {
        target_user_id: user_id,
        add_amount: amount,
      },
    );
    if (dbError) throw dbError;
    return users;
  } catch (error) {
    console.log("balance update error", error.message);
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
//to get the equivalent between money and token
export function moneyAndTokensEquivalent({ amount }) {
  return amount * 10;
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
  }
}
