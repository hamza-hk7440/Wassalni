import express from "express";
const router = express.Router();
import {
  controllerLogin,
  createUser,
  getUserEssentialInfo,
  googleSignIn,
  googleSignUpCallback,
  loginForPassengerAdminAndSuperAdmin,
  redeemTokensFromUser,
  secondStepLoginForAdminAndSuperAdmin,
  unifiedMobileLogin,
  userLoginForMobile,
  verifyRoleCode,
} from "../controllers/user.controller.js";
import { requireAuth } from "../middlewares/requireAuth.js";
//create user route
router.post("/createuser", createUser);
//get essential info ny user id(first name, last name, email,role)
router.post("/getuseressentialinfo", requireAuth, getUserEssentialInfo);
//redem an amount of tokens from user
router.post("/redeemtokensfromuser", redeemTokensFromUser);
router.get("/auth/google", googleSignIn);
router.get("/auth/callback", googleSignUpCallback);
router.post("/loginwebfirststep", loginForPassengerAdminAndSuperAdmin);
router.post("/loginwebsecondstep", secondStepLoginForAdminAndSuperAdmin);
router.post("/loginmobile", userLoginForMobile);
router.post("/controllerlogin", controllerLogin);
router.post("/loginunified", unifiedMobileLogin);
router.post("/loginunified/verify", verifyRoleCode);
export default router;
