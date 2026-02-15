import { supabase } from "../config/supabase.js";
import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();
//in this function we will create a user by role,we will use the signUP supabase function
//the user when he created her will be inserted in the auth and users table by the function written on sql in supabase the function in supabase is called : handle_new_user
export async function createUser({
  email,
  role,
  first_name,
  last_name,
  password,
}) {
  try {
    switch (role) {
      case "passenger": {
        const { data: typeOne, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              role,
              first_name,
              last_name,
              token_balance: 0,
              controller_code: null,
              super_admin_code: null,
              admin_code: null,
            },
          },
        });

        if (error) throw error;
        //if the case was a passenger the full data of this passenger will be returned
        console.log("passenger created successfully ", typeOne.user);
        return { user: typeOne.user };
      }

      case "admin": {
        let finalCode;
        let saved = false;

        while (!saved) {
          const code = crypto.randomInt(100000, 999999).toString();
          const { data: typeTwo, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                role,
                first_name,
                last_name,
                token_balance: 0,
                controller_code: null,
                super_admin_code: null,
                admin_code: code,
              },
            },
          });

          if (!error) {
            finalCode = code;
            saved = true;
            console.log("admin created successfully ", typeTwo.user);
          } else if (error.code === "23505") {
            console.log("unique violation");
          } else {
            throw error;
          }
        }
        //if the  case is admin the unique code of the admin will be returned and as succeed msg
        return finalCode;
      }

      case "controller": {
        let finalCode;
        let saved = false;

        while (!saved) {
          const code = crypto.randomInt(100000, 999999).toString();
          const { data: typeThree, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                role,
                first_name,
                last_name,
                token_balance: 0,
                controller_code: code,
                super_admin_code: null,
                admin_code: null,
              },
            },
          });

          if (!error) {
            finalCode = code;
            saved = true;
            console.log("Controller created successfully:", typeThree.user);
          } else if (error.code === "23505") {
            console.log("Unique violation, retrying...");
          } else {
            throw error;
          }
        }
        //if the  case is controller the unique code of the controller will be returned and as succeed msg
        return finalCode;
      }

      case "super_admin": {
        let finalCode;
        let saved = false;

        while (!saved) {
          const code1 = crypto.randomInt(100000, 999999).toString();
          const code2 = crypto.randomInt(1000, 9999).toString();
          const { data: typeFour, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                role,
                first_name,
                last_name,
                token_balance: 0,
                controller_code: null,
                super_admin_code: code2,
                admin_code: code1,
              },
            },
          });

          if (!error) {
            finalCode = code;
            saved = true;
            console.log("Super admin created successfully:", typeFour.user);
          } else if (error.code === "23505") {
            console.log("Unique violation, retrying...");
          } else {
            throw error;
          }
        }

        return finalCode;
      }

      default:
        throw new Error(`Unknown role: ${role}`);
    }
  } catch (error) {
    console.error("createUser error:", error.message);
    throw error;
  }
}
export async function getUserEssentialInfo({ user_id }) {
  try {
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("first_name, last_name, email, role,token_balance")
      .eq("user_id", user_id)
      .single();
    if (userError) {
      throw userError;
    }
    return userData;
  } catch (error) {
    console.error("get user info", error.message);
    throw error;
  }
}
export async function redeemTokensFromUser({ user_id, amount }) {
  try {
    const { data: tokenBalance, error: tokenError } = await supabase
      .from("users")
      .select("token_balance")
      .eq("user_id", user_id)
      .single();
    if (tokenError) {
      throw tokenError;
    }
    const currentBalance = tokenBalance.token_balance;
    await supabase
      .from("users")
      .update({ token_balance: currentBalance - amount })
      .eq("user_id", user_id);
  } catch (error) {
    console.error("redeem token operation failed", error.message);
    throw error;
  }
}
