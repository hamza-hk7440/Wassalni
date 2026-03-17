import { supabase } from "../config/supabase.js";
//next() we  will use it to pass the control to the next middleware or route bcz in routes we will call for example router.get('/profile', requireAuth, getProfile); so we need to pass the control to the getProfile function
//the rreq result will contain 2 main things the header and the body and in the header we habe the authorization that contain the token
export const requireAuth = async (req, res, next) => {
  try {
    //req.headers.authorization contain the token in the format "Bearer <token>" so we need to split it by space and get the second part that contain the token
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "no token provided" });
    }
    //we will use the token to get the user data from supabase and if the token is valid we will pass the user data to the next middleware or route by attaching it to the req object
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);
    if (error || !user) {
      return res.status(401).json({ error: "invalid token" });
    }
    //we attach the user data to the req object so we can access it in the next middleware or route
    req.user = user;
    next();
  } catch (err) {
    console.error("Error in requireAuth middleware:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
