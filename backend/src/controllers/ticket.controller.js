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
