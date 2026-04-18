import { url } from "inspector";
import * as userService from "../services/user.service.js";
import { changeUserPassword } from "../services/user.service.js";
import { supabase } from "../config/supabase.js";

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
      const generatedCode =
        typeof authData === "string"
          ? authData
          : authData?.generated_code ||
            authData?.controller_code ||
            authData?.admin_code ||
            null;

      return res.status(201).json({
        message: "user created successfully",
        user: authData?.user || authData || null,
        generated_code: generatedCode,
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
    const requestedUserId = req.body?.user_id;
    const authenticatedUserId = req.user?.id;
    const user_id = requestedUserId || authenticatedUserId;

    if (!user_id) {
      return res.status(400).json({
        error: "user_id is required",
      });
    }

    if (
      requestedUserId &&
      authenticatedUserId &&
      String(requestedUserId) !== String(authenticatedUserId)
    ) {
      return res.status(403).json({
        error: "forbidden: cannot access another user profile",
      });
    }

    const user_info = await userService.getUserEssentialInfo({ user_id });

    if (!user_info) {
      // Fallback profile from token so session restore can continue even if
      // the public users row is missing or delayed.
      return res.status(200).json({
        first_name: req.user?.user_metadata?.first_name ?? "",
        last_name: req.user?.user_metadata?.last_name ?? "",
        email: req.user?.email ?? "",
        role: req.user?.user_metadata?.role ?? req.user?.app_metadata?.role ?? null,
        token_balance: 0,
      });
    }

    res.status(200).json(user_info);
  } catch (error) {
    const message = String(error?.message || "Internal Server Error");
    const isAuthError = /invalid token|jwt|unauthorized/i.test(message);

    if (isAuthError) {
      return res.status(401).json({ error: message });
    }

    // Last-resort fallback to avoid breaking session restore on transient DB issues.
    if (req.user) {
      return res.status(200).json({
        first_name: req.user?.user_metadata?.first_name ?? "",
        last_name: req.user?.user_metadata?.last_name ?? "",
        email: req.user?.email ?? "",
        role: req.user?.user_metadata?.role ?? req.user?.app_metadata?.role ?? null,
        token_balance: 0,
      });
    }

    res.status(500).json({ error: message });
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
    const isWeb = String(req.query.platform || "").toLowerCase() === "web";
    const defaultWebRedirect = process.env.WEB_OAUTH_REDIRECT_URL || "http://localhost:5173/login";
    const webRedirect = String(req.query.web_redirect || defaultWebRedirect);

    const redirectTo = isWeb
      ? `${process.env.GOOGLE_OAUTH_REDIRECT_URL}?web_redirect=${encodeURIComponent(webRedirect)}`
      : process.env.GOOGLE_OAUTH_REDIRECT_URL;

    const data = await userService.signUpWithGoogle({ redirectTo });
    res.status(200).json({ url: data.url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
//this function will get the code in the callback url to give it to the service
export const googleSignUpCallback = async (req, res) => {
  try {
    const { code, web_redirect } = req.query;
    const data = await userService.handleAuthCallback(code);
    const { data: userData } = await supabase
      .from("users")
      .select("role, first_name, last_name, token_balance")
      .eq("user_id", data.user.id)
      .single();

    const token = data.session.access_token;
    const userJson = encodeURIComponent(
      JSON.stringify({
        id: data.user.id,
        email: data.user.email,
        role: userData?.role ?? "passenger",
        first_name: userData?.first_name ?? "",
        last_name: userData?.last_name ?? "",
        token_balance: userData?.token_balance ?? 0,
      }),
    );

    const webRedirect = String(web_redirect || "");
    if (webRedirect.startsWith("http://") || webRedirect.startsWith("https://")) {
      const separator = webRedirect.includes("?") ? "&" : "?";
      return res.redirect(`${webRedirect}${separator}token=${encodeURIComponent(token)}&user=${userJson}`);
    }

    res.redirect(`myapp://auth/callback?token=${token}&user=${userJson}`);
  } catch (error) {
    const webRedirect = String(req.query.web_redirect || "");
    if (webRedirect.startsWith("http://") || webRedirect.startsWith("https://")) {
      const separator = webRedirect.includes("?") ? "&" : "?";
      return res.redirect(`${webRedirect}${separator}error=${encodeURIComponent(error.message)}`);
    }
    res.redirect(
      `myapp://auth/callback?error=${encodeURIComponent(error.message)}`,
    );
  }
};

export const changePassword = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { new_password } = req.body;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!new_password || String(new_password).length < 6) {
      return res.status(400).json({
        error: "New password is required and must be at least 6 characters",
      });
    }

    await changeUserPassword({
      user_id: userId,
      new_password: String(new_password),
    });

    return res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { first_name, last_name, email } = req.body;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!first_name || !last_name || !email) {
      return res.status(400).json({ error: "first_name, last_name and email are required" });
    }

    const updatedUser = await userService.updateUserProfile({
      user_id: userId,
      first_name,
      last_name,
      email,
    });

    return res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
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
export const unifiedMobileLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
    const result = await userService.unifiedMobileLogin({ email, password });
    return res.status(200).json(result);
  } catch (error) {
    console.error("Unified mobile login error:", error);
    return res
      .status(500)
      .json({ error: error.message || "An unexpected error occurred" });
  }
};
export const verifyRoleCode = async (req, res) => {
  try {
    const { session, code } = req.body;
    if (!session || !code) {
      return res.status(400).json({ error: "Session and code are required" });
    }
    const userData = await userService.getPendingSession(session);
    console.log("🔍 pending session data:", userData);
    if (!userData) {
      return res.status(401).json({ error: "Invalid session" });
    }
    let isValid = false;
    if (userData.role === "controller") {
      isValid = await userService.verifycontrollerCode({
        user_id: userData.user_id,
        code,
      });
    } else if (userData.role === "superAdmin") {
      isValid = await userService.verifySuperAdminCode({
        user_id: userData.user_id,
        code,
      });
    }
    if (!isValid) {
      return res.status(401).json({ error: "Invalid code" });
    }
    userService.deletePendingSession(session);
    return res.status(200).json({
      message: "Login successful",
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
    console.error("Verification error:", error);
    return res.status(500).json({ error: "An unexpected error occurred" });
  }
};
