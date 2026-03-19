import express from "express";
const router = express.Router();
import {
  createTicket,
  getQrDataByTicketId,
  getTicketStatusByQrData,
} from "../controllers/ticket.controller.js";
import { requireAuth } from "../middlewares/requireAuth.js";
import { requirePassenger } from "../middlewares/requirePassenger.js";
import { requireController } from "../middlewares/requireController.js";

//create Ticket route
router.post("/createticket", requirePassenger, createTicket);
//get the qr data by the ticket id
router.post("/getqrdatabyticketid", requirePassenger, getQrDataByTicketId);
//get ticket status by qr data
router.post(
  "/getticketstatusbyqrdata",
  requireController,
  getTicketStatusByQrData,
);

export default router;
