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
  userLoginForMobile,
} from "../controllers/user.controller.js";
//create user route
router.post("/createuser", createUser);
//get essential info ny user id(first name, last name, email,role)
router.post("/getuseressentialinfo", getUserEssentialInfo);
//redem an amount of tokens from user
router.post("/redeemtokensfromuser", redeemTokensFromUser);
router.get("/auth/google", googleSignIn);
router.get("/auth/callback", googleSignUpCallback);
router.post("/loginwebfirststep", loginForPassengerAdminAndSuperAdmin);
router.post("/loginwebsecondstep", secondStepLoginForAdminAndSuperAdmin);
router.post("/loginmobile", userLoginForMobile);
router.post("/controllerlogin", controllerLogin);
export default router;
