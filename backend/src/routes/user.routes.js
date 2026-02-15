import express from "express";
const router = express.Router();
import {
  createUser,
  getUserEssentialInfo,
  redeemTokensFromUser,
} from "../controllers/user.controller.js";
//create user route
router.post("/createuser", createUser);
//get essential info ny user id(first name, last name, email,role)
router.post("/getuseressentialinfo", getUserEssentialInfo);
//redem an amount of tokens from user
router.post("/redeemtokensfromuser", redeemTokensFromUser);
export default router;
