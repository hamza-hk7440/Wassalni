import express from "express";
const router = express.Router();
import {
  createTicket,
  getQrDataByTicketId,
  getTicketStatusByQrData,
} from "../controllers/ticket.controller.js";

//create Ticket route
router.post("/createticket", createTicket);
//get the qr data by the ticket id
router.post("/getqrdatabyticketid", getQrDataByTicketId);
//get ticket status by qr data
router.post("/getticketstatusbyqrdata", getTicketStatusByQrData);

export default router;
