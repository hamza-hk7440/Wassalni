import * as ticketService from "../services/ticket.service.js";
export const createTicket = async (req, res) => {
  try {
    const { user_id, schedule_id, price } = req.body;
    if (!user_id || !schedule_id || !price) {
      return res.status(400).json({
        error: "user id,schedule id and price are required",
      });
    }
    const ticketData = await ticketService.createTicket({
      user_id,
      schedule_id,
      price,
    });
    res
      .status(200)
      .json({ message: "ticket created successfully", ticketData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const getQrDataByTicketId = async (req, res) => {
  console.log("req.body:", req.body); // add this

  try {
    const { ticket_id } = req.body;
    if (!ticket_id) {
      return res.status(400).json({
        error: "ticket id is required",
      });
    }
    const qrData = await ticketService.getQrDataByTicketId({ ticket_id });
    res.status(200).json({ message: "qrdata returned succesfully", qrData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const getTicketStatusByQrData = async (req, res) => {
  try {
    const { qr_data } = req.body;
    if (!qr_data) {
      return res.status(400).json({
        error: "qr data is required",
      });
    }
    const status = await ticketService.getTicketStatusByQrData({ qr_data });
    res.status(200).json(status);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getTicketStatusByIdSuffix = async (req, res) => {
  try {
    const { ticket_suffix } = req.body;
    if (!ticket_suffix) {
      return res.status(400).json({ error: "ticket suffix is required" });
    }

    const ticket = await ticketService.getTicketByIdSuffix({
      ticket_suffix,
    });

    return res.status(200).json({
      ticket_id: ticket.ticket_id,
      status: ticket.status,
      ticket_suffix,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getTicketDetailsByInput = async (req, res) => {
  try {
    const { ticket_input } = req.body;
    if (!ticket_input) {
      return res.status(400).json({ error: "ticket_input is required" });
    }

    const result = await ticketService.getTicketByIdentifier({ ticket_input });

    return res.status(200).json({
      message: "ticket details returned successfully",
      match_type: result.match_type,
      ticket: result.ticket,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const markTicketAsUsed = async (req, res) => {
  try {
    const { ticket_id } = req.body;
    if (!ticket_id) {
      return res.status(400).json({ error: "ticket_id is required" });
    }

    const updatedTicket = await ticketService.markTicketAsUsed({ ticket_id });

    return res.status(200).json({
      message: "ticket marked as used",
      ticket: updatedTicket,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getMyActiveTickets = async (req, res) => {
  try {
    const user_id = req.user?.id;
    if (!user_id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const tickets = await ticketService.getTicketsByPassenger({
      user_id,
      activeOnly: true,
    });

    return res
      .status(200)
      .json({ message: "active tickets returned", tickets });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getMyTicketHistory = async (req, res) => {
  try {
    const user_id = req.user?.id;
    if (!user_id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const tickets = await ticketService.getTicketsByPassenger({
      user_id,
      activeOnly: false,
    });

    return res
      .status(200)
      .json({ message: "ticket history returned", tickets });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const createDelayAnnouncement = async (req, res) => {
  try {
    const { schedule_id, delay_minutes, message } = req.body;
    if (!schedule_id) {
      return res.status(400).json({ error: "schedule_id is required" });
    }

    const result = await ticketService.createDelayAnnouncement({
      schedule_id,
      delay_minutes,
      message,
      created_by: req.user?.id,
    });

    return res.status(200).json({
      message: "delay announcement created",
      announcement: result,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const createCancellationAnnouncement = async (req, res) => {
  try {
    const { schedule_id, message } = req.body;
    if (!schedule_id) {
      return res.status(400).json({ error: "schedule_id is required" });
    }

    const result = await ticketService.createCancellationAnnouncement({
      schedule_id,
      message,
      created_by: req.user?.id,
    });

    return res.status(200).json({
      message: "cancellation announcement created",
      announcement: result,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const requestRefund = async (req, res) => {
  try {
    const user_id = req.user?.id;
    const { ticket_id } = req.body;

    if (!user_id) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    if (!ticket_id) {
      return res.status(400).json({ error: "ticket_id is required" });
    }

    const refund = await ticketService.requestRefundByPassenger({
      ticket_id,
      user_id,
    });

    return res.status(200).json({
      message:
        "Refund requested successfully. It will be processed in about 2 minutes (test mode).",
      refund,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getRefundRequests = async (req, res) => {
  try {
    const user_id = req.user?.id;
    if (!user_id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const requests = await ticketService.getRefundRequestsByPassenger({
      user_id,
    });

    return res.status(200).json({
      message: "refund requests returned",
      refund_requests: requests,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
