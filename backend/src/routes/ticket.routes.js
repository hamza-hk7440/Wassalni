import express from "express";
const router = express.Router();
import {
  createCancellationAnnouncement,
  createDelayAnnouncement,
  createTicket,
  getMyActiveTickets,
  getMyTicketHistory,
  getTicketDetailsByInput,
  getQrDataByTicketId,
  getTicketStatusByIdSuffix,
  getTicketStatusByQrData,
  getRefundRequests,
  markTicketAsUsed,
  requestRefund,
} from "../controllers/ticket.controller.js";
import requireAdmin from "../middlewares/auth.middleware.js";
import { requirePassenger } from "../middlewares/requirePassenger.js";
import { requireController } from "../middlewares/requireController.js";

//create Ticket route
router.post("/createticket", requirePassenger, createTicket);
//get active tickets for current passenger
router.get("/mytickets/active", requirePassenger, getMyActiveTickets);
//get all tickets history for current passenger
router.get("/mytickets/history", requirePassenger, getMyTicketHistory);
//get the qr data by the ticket id
router.post("/getqrdatabyticketid", requirePassenger, getQrDataByTicketId);
//get ticket status by qr data
router.post(
  "/getticketstatusbyqrdata",
  requireController,
  getTicketStatusByQrData,
);
router.post(
  "/getticketstatusbyidsuffix",
  requireController,
  getTicketStatusByIdSuffix,
);
router.post(
  "/getticketdetailsbyinput",
  requireController,
  getTicketDetailsByInput,
);
router.post("/markticketasused", requireController, markTicketAsUsed);

router.post("/requestrefund", requirePassenger, requestRefund);
router.get("/refundrequests", requirePassenger, getRefundRequests);

router.post("/admin/announcement/delay", requireAdmin, createDelayAnnouncement);

router.post(
  "/admin/announcement/cancellation",
  requireAdmin,
  createCancellationAnnouncement,
);

export default router;
