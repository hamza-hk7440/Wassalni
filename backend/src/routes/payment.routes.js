import express from "express";
const router = express.Router();
import {
  createRecharge,
  tokenToMoney,
  updateTokenBalance,
  verifyTokensNumber,
  getTokensBalance,
  moneyToToken,
  getUserIdByTransactionId,
} from "../controllers/payment.controller.js";
//here we see that payments route contain a router so if the POST contain /recharge so the method createRecharge it will be called this method is comed from payment.controller.js so we go there
router.post("/recharge", createRecharge);
//to update the token balance
router.post("/updatetokenbalance", updateTokenBalance);
//verify number of tokens
router.post("/verifynumberoftokens", verifyTokensNumber);
//to get the tokens balance
router.post("/gettokenbalance", getTokensBalance);
//convert money to token
router.post("/convertmoneytotoken", moneyToToken);
//convert token to money
router.post("/converttokentomoney", tokenToMoney);
//to get the user id by transaction id
router.post("/getuseridbytransactionid", getUserIdByTransactionId);

export default router;
