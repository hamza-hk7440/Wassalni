import { supabase } from "../config/supabase.js";
export const requireController = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);
    if (error || !user) {
      return res.status(401).json({ error: "Invalid token" });
    }
    const { data: userData, error: dbError } = await supabase
      .from("users")
      .select("role")
      .eq("user_id", user.id)
      .single();
    if (dbError || !userData) {
      return res.status(500).json({ error: "Failed to fetch user data" });
    }
    if (userData.role !== "controller") {
      return res.status(403).json({ error: "Access denied, controllers only" });
    }
    req.user = user;
    req.user.role = userData.role;
    next();
  } catch (err) {
    console.error("Error in requireController middleware:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
