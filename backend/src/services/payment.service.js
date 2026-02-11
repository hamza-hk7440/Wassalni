import { createClient } from "@supabase/supabase-js";
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

const supabase = createClient(supabaseUrl, supabaseKey);
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
      order_id: transaction?.transaction_id?.toString() || "temp_id", //here we are verifying if the id is null so we will put to it temp_id to don't crash
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
