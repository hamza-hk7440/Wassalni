import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();
import { TICKET_STATUS } from "../models/ticket.model.js";
import QRCode from "qrcode";

const adminSupabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  },
);

export async function createTicket({ user_id, schedule_id, price }) {
  try {
    const { data: activeCancellation, error: cancellationError } =
      await adminSupabase
        .from("ticket_announcements")
        .select("announcement_id")
        .eq("schedule_id", schedule_id)
        .eq("type", "cancellation")
        .eq("is_active", true)
        .limit(1);

    if (cancellationError && !isMissingSchemaError(cancellationError)) {
      throw cancellationError;
    }

    if (Array.isArray(activeCancellation) && activeCancellation.length > 0) {
      throw new Error(
        "This schedule is cancelled and not valid for ticket purchase",
      );
    }

    const { data: schedule, error: scheduleError } = await adminSupabase
      .from("schedules")
      .select("available_seats")
      .eq("schedule_id", schedule_id)
      .single();

    if (scheduleError || !schedule) {
      throw new Error("Schedule not found");
    }

    const seatsLeft = Number(schedule.available_seats ?? 0);
    if (seatsLeft <= 0) {
      throw new Error("No seats left for this schedule");
    }

    const { data: updatedSchedule, error: seatUpdateError } =
      await adminSupabase
        .from("schedules")
        .update({ available_seats: seatsLeft - 1 })
        .eq("schedule_id", schedule_id)
        .eq("available_seats", seatsLeft)
        .select("schedule_id")
        .single();

    if (seatUpdateError || !updatedSchedule) {
      throw (
        seatUpdateError ?? new Error("Seat availability changed. Please retry.")
      );
    }

    const { data: ticket, error: ticketError } = await adminSupabase
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
      await adminSupabase
        .from("schedules")
        .update({ available_seats: seatsLeft })
        .eq("schedule_id", schedule_id);
      throw ticketError;
    }
    const ticketId = ticket.ticket_id;
    const base = await QRCode.toDataURL(ticketId);
    const qrData = base.replace("data:image/png;base64,", "");
    const { data: qrdata, error: qrError } = await adminSupabase
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
    const { data: qrData, error: qrDataError } = await adminSupabase
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
    const { data: ticket, error: ticketError } = await adminSupabase
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

function normalizeTicketRow(ticket) {
  const disruption = ticket.disruption ?? {};
  const refund = ticket.refund ?? {};

  const schedule = ticket.schedules ?? {};
  const route = schedule.routes ?? {};
  const transport = schedule.transports ?? {};

  return {
    ticket_id: ticket.ticket_id,
    user_id: ticket.user_id ?? null,
    schedule_id: ticket.schedule_id,
    status: ticket.status,
    price: ticket.price,
    purchase_date: ticket.purchase_date,
    purshase_date: ticket.purchase_date,
    qr_data: ticket.qr_data,
    departure_time: schedule.departure_time ?? null,
    arrival_time: schedule.arrival_time ?? null,
    direction: schedule.direction ?? null,
    transport_type: transport.type ?? null,
    departure_station: route.start_station?.name ?? null,
    arrival_station: route.end_station?.name ?? null,
    delay_minutes: disruption.delay_minutes ?? 0,
    is_cancelled: disruption.is_cancelled ?? false,
    disruption_message: disruption.message ?? "",
    refund_status: refund.status ?? "none",
    refund_requested_at: refund.requested_at ?? null,
    refund_completed_at: refund.completed_at ?? null,
  };
}

const TICKET_DETAILS_SELECT = `
  ticket_id,
  user_id,
  schedule_id,
  status,
  price,
  purchase_date,
  qr_data,
  schedules(
    departure_time,
    arrival_time,
    direction,
    routes(
      start_station:stations!routes_start_station_id_fkey(name),
      end_station:stations!routes_end_station_id_fkey(name)
    ),
    transports(type)
  )
`;

function isMissingSchemaError(error) {
  const code = String(error?.code || "").toUpperCase();
  const message = String(error?.message || "").toLowerCase();

  return (
    code === "42P01" ||
    code === "42703" ||
    /relation .* does not exist|column .* does not exist|table .* does not exist/.test(
      message,
    )
  );
}

function isUuid(value) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    String(value || "").trim(),
  );
}

async function getActiveDisruptionsByScheduleIds(scheduleIds) {
  if (!scheduleIds.length) {
    return new Map();
  }

  const { data, error } = await adminSupabase
    .from("ticket_announcements")
    .select("schedule_id,type,delay_minutes,message,is_active,created_at")
    .in("schedule_id", scheduleIds)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) {
    if (isMissingSchemaError(error)) {
      return new Map();
    }
    throw error;
  }

  const bySchedule = new Map();

  for (const row of data ?? []) {
    const scheduleId = row.schedule_id;
    if (!scheduleId) {
      continue;
    }

    const existing = bySchedule.get(scheduleId) ?? {
      delay_minutes: 0,
      is_cancelled: false,
      message: "",
    };

    if (row.type === "delay" && existing.delay_minutes === 0) {
      existing.delay_minutes = Number(row.delay_minutes ?? 0);
      if (!existing.message && row.message) {
        existing.message = row.message;
      }
    }

    if (row.type === "cancellation") {
      existing.is_cancelled = true;
      if (row.message) {
        existing.message = row.message;
      }
    }

    bySchedule.set(scheduleId, existing);
  }

  return bySchedule;
}

async function processPendingRefundsForUser({ user_id }) {
  const nowIso = new Date().toISOString();

  const { data: pendingRefunds, error: pendingError } = await adminSupabase
    .from("refund_requests")
    .select("refund_request_id,ticket_id,amount")
    .eq("user_id", user_id)
    .eq("status", "pending")
    .eq("processed", false)
    .lte("release_at", nowIso);

  if (pendingError) {
    if (isMissingSchemaError(pendingError)) {
      // Refund tables/columns not ready yet in DB; skip auto-processing gracefully.
      return;
    }
    throw pendingError;
  }

  for (const refund of pendingRefunds ?? []) {
    const requestId = refund.refund_request_id;

    const { data: lockRow, error: lockError } = await adminSupabase
      .from("refund_requests")
      .update({ processed: true })
      .eq("refund_request_id", requestId)
      .eq("processed", false)
      .select("refund_request_id")
      .single();

    if (lockError || !lockRow) {
      continue;
    }

    const { data: userData, error: userError } = await adminSupabase
      .from("users")
      .select("token_balance")
      .eq("user_id", user_id)
      .single();

    if (userError) {
      throw userError;
    }

    const currentBalance = Number(userData?.token_balance ?? 0);
    const amount = Number(refund.amount ?? 0);

    const { error: updateUserError } = await adminSupabase
      .from("users")
      .update({ token_balance: currentBalance + amount })
      .eq("user_id", user_id);

    if (updateUserError) {
      throw updateUserError;
    }

    const { error: ticketUpdateError } = await adminSupabase
      .from("tickets")
      .update({ status: TICKET_STATUS.REFUNDED })
      .eq("ticket_id", refund.ticket_id);

    if (ticketUpdateError) {
      throw ticketUpdateError;
    }

    const { error: refundDoneError } = await adminSupabase
      .from("refund_requests")
      .update({
        status: "completed",
        completed_at: new Date().toISOString(),
      })
      .eq("refund_request_id", requestId);

    if (refundDoneError) {
      throw refundDoneError;
    }
  }
}

async function getRefundRequestsByTicketIds({ ticketIds, user_id }) {
  if (!ticketIds.length) {
    return new Map();
  }

  const { data, error } = await adminSupabase
    .from("refund_requests")
    .select("ticket_id,status,requested_at,completed_at")
    .eq("user_id", user_id)
    .in("ticket_id", ticketIds)
    .order("requested_at", { ascending: false });

  if (error) {
    if (isMissingSchemaError(error)) {
      return new Map();
    }
    throw error;
  }

  const refundByTicket = new Map();
  for (const row of data ?? []) {
    if (!refundByTicket.has(row.ticket_id)) {
      refundByTicket.set(row.ticket_id, row);
    }
  }

  return refundByTicket;
}

export async function getTicketsByPassenger({ user_id, activeOnly = false }) {
  try {
    await processPendingRefundsForUser({ user_id });

    let query = adminSupabase
      .from("tickets")
      .select(TICKET_DETAILS_SELECT)
      .eq("user_id", user_id)
      .order("purchase_date", { ascending: false });

    if (activeOnly) {
      query = query.eq("status", TICKET_STATUS.ACTIVE);
    }

    const { data, error } = await query;
    if (error) {
      throw error;
    }

    const tickets = data ?? [];
    const scheduleIds = [
      ...new Set(tickets.map((t) => t.schedule_id).filter(Boolean)),
    ];
    const ticketIds = [
      ...new Set(tickets.map((t) => t.ticket_id).filter(Boolean)),
    ];

    const disruptionsBySchedule =
      await getActiveDisruptionsByScheduleIds(scheduleIds);
    const refundByTicket = await getRefundRequestsByTicketIds({
      ticketIds,
      user_id,
    });

    const enriched = tickets.map((ticket) => {
      const scheduleId = ticket.schedule_id;
      const ticketId = ticket.ticket_id;
      const fallbackDisruption = {
        delay_minutes: 0,
        is_cancelled: false,
        message: "",
      };
      const announcementDisruption = disruptionsBySchedule.get(scheduleId);
      const disruption = announcementDisruption
        ? {
            delay_minutes: Number(
              announcementDisruption.delay_minutes ??
                fallbackDisruption.delay_minutes ??
                0,
            ),
            is_cancelled:
              Boolean(announcementDisruption.is_cancelled) ||
              Boolean(fallbackDisruption.is_cancelled),
            message:
              String(announcementDisruption.message || "").trim() ||
              fallbackDisruption.message ||
              "",
          }
        : fallbackDisruption;

      return {
        ...ticket,
        disruption,
        refund: refundByTicket.get(ticketId) ?? {
          status: "none",
          requested_at: null,
          completed_at: null,
        },
      };
    });

    const visibleTickets = activeOnly
      ? enriched.filter((ticket) => !Boolean(ticket?.disruption?.is_cancelled))
      : enriched;

    return visibleTickets.map(normalizeTicketRow);
  } catch (error) {
    console.error("get tickets by passenger error", JSON.stringify(error));
    throw error;
  }
}

export async function getTicketByIdSuffix({ ticket_suffix }) {
  try {
    const cleanedSuffix = String(ticket_suffix || "").trim();
    if (!cleanedSuffix) {
      throw new Error("ticket suffix is required");
    }

    const { data, error } = await adminSupabase
      .from("tickets")
      .select("ticket_id, status")
      .order("purchase_date", { ascending: false })
      .limit(500);

    if (error) {
      throw error;
    }

    const loweredSuffix = cleanedSuffix.toLowerCase();
    const rows = (data ?? []).filter((row) =>
      String(row.ticket_id ?? "")
        .toLowerCase()
        .endsWith(`-${loweredSuffix}`),
    );

    if (rows.length == 0) {
      throw new Error("No ticket found for this ID part");
    }
    if (rows.length > 1) {
      throw new Error(
        "Multiple tickets found. Please enter a longer last part of the ticket ID",
      );
    }

    return rows[0];
  } catch (error) {
    console.error("get ticket by id suffix error", JSON.stringify(error));
    throw error;
  }
}

export async function getTicketByIdentifier({ ticket_input }) {
  try {
    const cleanedInput = String(ticket_input || "").trim();
    if (!cleanedInput) {
      throw new Error("ticket input is required");
    }

    if (isUuid(cleanedInput)) {
      const exact = await adminSupabase
        .from("tickets")
        .select(TICKET_DETAILS_SELECT)
        .eq("ticket_id", cleanedInput)
        .limit(2);

      if (exact.error) {
        throw exact.error;
      }

      if ((exact.data ?? []).length === 1) {
        return {
          match_type: "ticket_id",
          ticket: normalizeTicketRow(exact.data[0]),
        };
      }
    }

    const cleanedSuffix = cleanedInput.includes("-")
      ? cleanedInput.split("-").pop()
      : cleanedInput;

    const { data, error } = await adminSupabase
      .from("tickets")
      .select(TICKET_DETAILS_SELECT)
      .order("purchase_date", { ascending: false })
      .limit(500);

    if (error) {
      throw error;
    }

    const loweredSuffix = String(cleanedSuffix || "").toLowerCase();
    const rows = (data ?? []).filter((row) =>
      String(row.ticket_id ?? "")
        .toLowerCase()
        .endsWith(`-${loweredSuffix}`),
    );

    if (rows.length === 0) {
      throw new Error("No ticket found for this ID");
    }
    if (rows.length > 1) {
      throw new Error(
        "Multiple tickets found. Please enter a longer ticket code",
      );
    }

    return {
      match_type: "suffix",
      ticket: normalizeTicketRow(rows[0]),
    };
  } catch (error) {
    console.error("get ticket by identifier error", JSON.stringify(error));
    throw error;
  }
}

export async function markTicketAsUsed({ ticket_id }) {
  try {
    const cleanedTicketId = String(ticket_id || "").trim();
    if (!cleanedTicketId) {
      throw new Error("ticket_id is required");
    }

    const { data: ticket, error: ticketError } = await adminSupabase
      .from("tickets")
      .select("ticket_id,status")
      .eq("ticket_id", cleanedTicketId)
      .single();

    if (ticketError || !ticket) {
      throw new Error("Ticket not found");
    }

    const status = String(ticket.status ?? "").toLowerCase();
    if (status === TICKET_STATUS.USED.toLowerCase()) {
      throw new Error("Ticket already used");
    }

    if (status !== TICKET_STATUS.ACTIVE.toLowerCase()) {
      throw new Error(
        `Ticket cannot be validated in its current status: ${ticket.status}`,
      );
    }

    const { data: updated, error: updateError } = await adminSupabase
      .from("tickets")
      .update({ status: TICKET_STATUS.USED })
      .eq("ticket_id", cleanedTicketId)
      .select("ticket_id,status")
      .single();

    if (updateError) {
      throw updateError;
    }

    return updated;
  } catch (error) {
    console.error("mark ticket as used error", JSON.stringify(error));
    throw error;
  }
}

export async function createDelayAnnouncement({
  schedule_id,
  delay_minutes,
  message,
  created_by,
}) {
  try {
    if (!schedule_id) {
      throw new Error("schedule_id is required");
    }

    const delay = Number(delay_minutes ?? 0);
    if (Number.isNaN(delay) || delay < 0) {
      throw new Error("delay_minutes must be a number >= 0");
    }

    await adminSupabase
      .from("ticket_announcements")
      .update({ is_active: false })
      .eq("schedule_id", schedule_id)
      .eq("type", "delay")
      .eq("is_active", true);

    const { data, error } = await adminSupabase
      .from("ticket_announcements")
      .insert([
        {
          schedule_id,
          type: "delay",
          delay_minutes: delay,
          message: message ?? "",
          is_active: true,
          created_by: created_by ?? null,
        },
      ])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("create delay announcement error", JSON.stringify(error));
    throw error;
  }
}

export async function createCancellationAnnouncement({
  schedule_id,
  message,
  created_by,
}) {
  try {
    if (!schedule_id) {
      throw new Error("schedule_id is required");
    }

    await adminSupabase
      .from("ticket_announcements")
      .update({ is_active: false })
      .eq("schedule_id", schedule_id)
      .eq("type", "cancellation")
      .eq("is_active", true);

    const { data, error } = await adminSupabase
      .from("ticket_announcements")
      .insert([
        {
          schedule_id,
          type: "cancellation",
          delay_minutes: 0,
          message: message ?? "",
          is_active: true,
          created_by: created_by ?? null,
        },
      ])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error(
      "create cancellation announcement error",
      JSON.stringify(error),
    );
    throw error;
  }
}

export async function requestRefundByPassenger({ ticket_id, user_id }) {
  try {
    if (!ticket_id || !user_id) {
      throw new Error("ticket_id and user_id are required");
    }

    await processPendingRefundsForUser({ user_id });

    const { data: ticket, error: ticketError } = await adminSupabase
      .from("tickets")
      .select("ticket_id,user_id,schedule_id,price,status")
      .eq("ticket_id", ticket_id)
      .single();

    if (ticketError || !ticket) {
      throw new Error("Ticket not found");
    }

    if (ticket.user_id !== user_id) {
      throw new Error("This ticket does not belong to current user");
    }

    if (String(ticket.status).toLowerCase() === "refunded") {
      throw new Error("Ticket already refunded");
    }

    const { data: activeCancellation, error: cancellationError } =
      await adminSupabase
        .from("ticket_announcements")
        .select("announcement_id")
        .eq("schedule_id", ticket.schedule_id)
        .eq("type", "cancellation")
        .eq("is_active", true)
        .limit(1);

    if (cancellationError) {
      throw cancellationError;
    }

    if (!activeCancellation || activeCancellation.length === 0) {
      throw new Error("Refund is available only for cancelled tickets");
    }

    const { data: existingRefund } = await adminSupabase
      .from("refund_requests")
      .select("status")
      .eq("ticket_id", ticket_id)
      .eq("user_id", user_id)
      .order("requested_at", { ascending: false })
      .limit(1);

    if (existingRefund && existingRefund.length > 0) {
      const previous = String(existingRefund[0].status || "").toLowerCase();
      if (previous === "pending") {
        throw new Error("Refund request already pending for this ticket");
      }
      if (previous === "completed") {
        throw new Error("Refund already completed for this ticket");
      }
    }

    const releaseAt = new Date(Date.now() + 2 * 60 * 1000).toISOString();

    const { data: requestData, error: requestError } = await adminSupabase
      .from("refund_requests")
      .insert([
        {
          ticket_id,
          user_id,
          amount: Number(ticket.price ?? 0),
          status: "pending",
          requested_at: new Date().toISOString(),
          release_at: releaseAt,
          processed: false,
        },
      ])
      .select("refund_request_id,status,requested_at,release_at")
      .single();

    if (requestError) {
      throw requestError;
    }

    return requestData;
  } catch (error) {
    console.error("request refund by passenger error", JSON.stringify(error));
    throw error;
  }
}

export async function getRefundRequestsByPassenger({ user_id }) {
  try {
    if (!user_id) {
      throw new Error("user_id is required");
    }

    const { data, error } = await adminSupabase
      .from("refund_requests")
      .select(
        "refund_request_id,ticket_id,user_id,amount,status,requested_at,release_at,completed_at,processed",
      )
      .eq("user_id", user_id)
      .order("requested_at", { ascending: false });

    if (error) {
      throw error;
    }

    return data ?? [];
  } catch (error) {
    console.error(
      "get refund requests by passenger error",
      JSON.stringify(error),
    );
    throw error;
  }
}
