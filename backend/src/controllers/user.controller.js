import * as userService from "../services/user.service.js";

export const createUser = async (req, res) => {
  try {
    const { email, role, first_name, last_name, password } = req.body;

    if (!email || !role || !first_name || !last_name || !password) {
      return res.status(400).json({
        error: "email, role, first_name, last_name and password are required",
      });
    }

    const authData = await userService.createUser({
      email,
      role,
      first_name,
      last_name,
      password,
    });

    const isPassenger = role === "passenger";

    if (isPassenger) {
      return res.status(201).json({
        message: "user created successfully",
        user: authData.user,
      });
    } else {
      return res.status(201).json({
        message: "user created successfully",
        special_code: authData,
      });
    }
  } catch (error) {
    console.error("controller error:", error.message);
    return res.status(500).json({
      error: "failed to create user",
      details: error.message,
    });
  }
};
export const getUserEssentialInfo = async (req, res) => {
  try {
    const { user_id } = req.body;
    if (!user_id) {
      return res.status(400).json({
        error: "qr data is required",
      });
    }
    const user_info = await userService.getUserEssentialInfo({ user_id });
    res.status(200).json(user_info);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const redeemTokensFromUser =async (req, res) => {
  try {
    const { user_id, amount } = req.body;
    if (!user_id || !amount) {
      return res.status(400).json({
        error: "user id and amount are required",
      });
    }
    const newBalance = await userService.redeemTokensFromUser({ user_id, amount });
    res.status(200).json({ message: "tokens redeemed successfully", newBalance });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
