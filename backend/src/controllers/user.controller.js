import { url } from "inspector";
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
        user: authData.user,
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
export const redeemTokensFromUser = async (req, res) => {
  try {
    const { user_id, amount } = req.body;
    if (!user_id || !amount) {
      return res.status(400).json({
        error: "user id and amount are required",
      });
    }
    const newBalance = await userService.redeemTokensFromUser({
      user_id,
      amount,
    });
    res
      .status(200)
      .json({ message: "tokens redeemed successfully", newBalance });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const googleSignIn = async (req, res) => {
  try {
    const data = await userService.signUpWithGoogle();
    res.status(200).json({ url: data.url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
//this function will get the code in the callback url to give it to the service
export const googleSignUpCallback = async (req, res) => {
  try {
    //req.query will contain the code that google sends
    const { code } = req.query;
    const data = await userService.handleAuthCallback(code);
    res.status(200).json({ user: data.user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const controllerLogin = async (req, res) => {
  try {
    const { email, password, code } = req.body;
    if (!email || !password || !code) {
      return res
        .status(400)
        .json({ error: "email and password and code are required" });
    }
    const userData = await userService.controllerLogin({ email, password });
    if (
      await userService.verifycontrollerCode({
        user_id: userData.user.id,
        code,
      })
    ) {
      return res.status(200).json({
        message: "login successful",
        token: userData.token,
        user: userData.user,
      });
    } else {
      return res.status(401).json({ error: "invalid code" });
    }
  } catch (error) {
    res.status(500).json({
      error: "failed to login",
    });
  }
};
export const loginForPassengerAdminAndSuperAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        error: "email and password are required",
      });
    }
    const userData = await userService.loginForPassengerAdminAndSuperAdmin({
      email,
      password,
    });
    if (userData.role === "passenger") {
      return res.status(200).json({
        message: "login successful",
        token: userData.token,
        user: userData.user,
      });
    }
    if (userData.role === "admin_or_super_admin") {
      return res.status(200).json({
        message:
          "first step of login successful, please enter the admin code to complete the login process",
        token_temp: userData.session,
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const secondStepLoginForAdminAndSuperAdmin = async (req, res) => {
  try {
    const { session, admin_code } = req.body;
    if (!session || !admin_code) {
      return res.status(400).json({
        error: "session and admin code are required",
      });
    }
    const userData = await userService.getPendingSession(session);
    if (!userData) {
      return res.status(401).json({
        error: "invalid admin code",
      });
    }
    const isCodeValid = await userService.verifyAdminCode({
      user_id: userData.user_id,
      code: admin_code,
    });
    if (!isCodeValid) {
      return res.status(401).json({
        error: "invalid admin code",
      });
    }
    userService.deletePendingSession(session);
    return res.status(200).json({
      message: "login successful",
      token: userData.token,
      user: {
        id: userData.user_id,
        email: userData.email,
        role: userData.role,
        first_name: userData.first_name,
        last_name: userData.last_name,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const userLoginForMobile = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const userData = await userService.userLoginForMobile({ email, password });
    console.log("userData:", userData);

    if (userData.user.role !== "passenger") {
      return res.status(403).json({ error: "Access denied: passengers only" });
    }

    return res.status(200).json({
      message: "Login successful",
      token: userData.token,
      user: userData.user,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "An unexpected error occurred" });
  }
};
