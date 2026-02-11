import express from "express";
const router = express.Router();
import { createRecharge } from "../controllers/payment.controller.js";
//here we see that payments route contain a router so if the POST contain /recharge so the method createRecharge it will be called this method is comed from payment.controller.js so we go there
router.post("/recharge", createRecharge);

export default router;
