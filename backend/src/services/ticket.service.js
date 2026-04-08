import { supabase } from "../config/supabase.js";
import dotenv from "dotenv";
dotenv.config();
import { TICKET_STATUS } from "../models/ticket.model.js";
import QRCode from "qrcode";
export async function createTicket({ user_id, schedule_id, price }) {
  try {
    const { data: ticket, error: ticketError } = await supabase
      .from("tickets")
      .insert([
        {
          user_id: user_id,
          schedule_id: schedule_id,
          price: price,
          status: TICKET_STATUS.ACTIVE,
          qr_data: null,
        },
      ])
      .select()
      .single();
    if (ticketError) {
      throw ticketError;
    }
    const ticketId = ticket.ticket_id;
    const base = await QRCode.toDataURL(ticketId);
    const qrData = base.replace("data:image/png;base64,", "");
    const { data: qrdata, error: qrError } = await supabase
      .from("tickets")
      .update({ qr_data: qrData })
      .eq("ticket_id", ticketId);
    console.log("the data after the update of qr code", ticket);
    if (qrError) {
      console.error("update error");
      throw qrError;
    }
    return ticketId;
  } catch (error) {
    console.error("start error");
    throw error;
  }
}
export async function getQrDataByTicketId({ ticket_id }) {
  try {
    const { data: qrData, error: qrDataError } = await supabase
      .from("tickets")
      .select("qr_data")
      .eq("ticket_id", ticket_id)
      .single();
    if (qrDataError) {
      throw qrDataError;
    }
    return qrData.qr_data;
  } catch (error) {
    console.error("start error", JSON.stringify(error));
    throw error;
  }
}
export async function getTicketStatusByQrData({ qr_data }) {
  try {
    const { data: ticket, error: ticketError } = await supabase
      .from("tickets")
      .select("status")
      .eq("qr_data", qr_data)
      .single();
    if (ticketError) {
      throw ticketError;
    }
    return ticket.status;
  } catch (error) {
    console.error("start error", JSON.stringify(error));
    throw error;
  }
}
