import { supabase } from "../config/supabase.js";

class ScheduleService {
  normalizeScheduleStatus(value) {
    const raw = String(value || "").toLowerCase();
    if (["retard", "en_retard", "late", "delayed"].includes(raw)) {
      return "delayed";
    }
    return "on_time";
  }

  normalizeAnnouncementInput(status, delayMinutes, remark) {
    const normalizedStatus = this.normalizeScheduleStatus(status);
    const parsedDelay = Number(delayMinutes ?? 0);
    const safeDelay = Number.isFinite(parsedDelay) && parsedDelay > 0 ? parsedDelay : 0;

    return {
      status: normalizedStatus,
      delay_minutes: normalizedStatus === "delayed" ? safeDelay : 0,
      remark: String(remark || "").trim(),
    };
  }

  async upsertDelayAnnouncement(scheduleId, status, delayMinutes = 0, remark = "") {
    const normalized = this.normalizeAnnouncementInput(status, delayMinutes, remark);

    if (normalized.status !== "delayed") {
      const { error: deactivateDelayError } = await supabase
        .from("ticket_announcements")
        .update({ is_active: false })
        .eq("schedule_id", String(scheduleId))
        .eq("type", "delay")
        .eq("is_active", true);

      if (deactivateDelayError) {
        throw new Error(deactivateDelayError.message);
      }

      return;
    }

    const { error: deactivateExistingDelayError } = await supabase
      .from("ticket_announcements")
      .update({ is_active: false })
      .eq("schedule_id", String(scheduleId))
      .eq("type", "delay")
      .eq("is_active", true);

    if (deactivateExistingDelayError) {
      throw new Error(deactivateExistingDelayError.message);
    }

    const { error: insertDelayError } = await supabase
      .from("ticket_announcements")
      .insert([
        {
          schedule_id: String(scheduleId),
          type: "delay",
          delay_minutes: normalized.delay_minutes,
          message: normalized.remark,
          is_active: true,
        },
      ]);

    if (insertDelayError) {
      throw new Error(insertDelayError.message);
    }
  }

  async getActiveAnnouncementsMap(scheduleIds = []) {
    const cleanedIds = [...new Set((scheduleIds ?? []).filter(Boolean).map((id) => String(id)))];
    if (cleanedIds.length === 0) {
      return new Map();
    }

    const { data, error } = await supabase
      .from("ticket_announcements")
      .select("schedule_id,type,delay_minutes,message,is_active,created_at")
      .eq("is_active", true)
      .in("schedule_id", cleanedIds)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    const map = new Map();
    for (const row of data ?? []) {
      const key = String(row.schedule_id);
      if (!map.has(key)) {
        map.set(key, row);
      }
    }
    return map;
  }

  enrichSchedulesWithStatus(schedules = [], announcementsMap = new Map()) {
    return (schedules ?? []).map((schedule) => {
      const announcement = announcementsMap.get(String(schedule.schedule_id));

      if (!announcement || announcement.type !== "delay") {
        return {
          ...schedule,
          schedule_status: "on_time",
          delay_minutes: 0,
          remark: "",
        };
      }

      return {
        ...schedule,
        schedule_status: "delayed",
        delay_minutes: Number(announcement.delay_minutes ?? 0),
        remark: String(announcement.message || ""),
      };
    });
  }

  buildScheduleWritePayload(scheduleData, defaultPrice = 0) {
    const parsedPrice = Number(scheduleData?.current_price ?? defaultPrice);

    return {
      route_id: scheduleData?.route_id,
      transport_id: scheduleData?.transport_id,
      departure_time: scheduleData?.departure_time,
      arrival_time: scheduleData?.arrival_time,
      available_seats: scheduleData?.available_seats,
      current_price:
        Number.isFinite(parsedPrice) && parsedPrice >= 0 ? parsedPrice : Number(defaultPrice || 0),
      direction: scheduleData?.direction ?? null,
    };
  }

  async getCancelledScheduleIds(scheduleIds = []) {
    const cleanedIds = [...new Set((scheduleIds ?? []).filter(Boolean))];
    if (cleanedIds.length === 0) {
      return new Set();
    }

    const { data, error } = await supabase
      .from("ticket_announcements")
      .select("schedule_id")
      .eq("type", "cancellation")
      .eq("is_active", true)
      .in("schedule_id", cleanedIds);

    if (error) {
      throw new Error(error.message);
    }

    return new Set((data ?? []).map((row) => row.schedule_id));
  }

  //create schedule
  async createSchedule(scheduleData) {
    const { route_id, transport_id } = scheduleData;
    const departureDate = new Date(scheduleData?.departure_time);
    const arrivalDate = new Date(scheduleData?.arrival_time);

    if (!route_id || !transport_id || !scheduleData?.departure_time || !scheduleData?.arrival_time) {
      throw new Error("route_id, transport_id, departure_time and arrival_time are required");
    }

    if (Number.isNaN(departureDate.getTime()) || Number.isNaN(arrivalDate.getTime())) {
      throw new Error("Invalid date format for departure_time or arrival_time");
    }

    const departure_time = departureDate.toISOString();
    const arrival_time = arrivalDate.toISOString();

    if (departureDate >= arrivalDate) {
      throw new Error("arrival_time must be after departure_time");
    }

    //check if transport is already busy
    const { data: existingSchedules, error: existingError } = await supabase
      .from("schedules")
      .select("*")
      .eq("transport_id", transport_id)
      .lte("departure_time", arrival_time)
      .gte("arrival_time", departure_time);

    if (existingError) {
      throw new Error(existingError.message);
    }

    if (existingSchedules && existingSchedules.length > 0) {
      throw new Error(
        "Transport is already scheduled for the given time range",
      );
    }

    //get capacity from transport to set availbl_seats
    const { data: transport, error: transportError } = await supabase
      .from("transports")
      .select("capacity")
      .eq("transport_id", transport_id)
      .single();
    if (transportError) {
      throw new Error(transportError.message);
    }

    const { data: route, error: routeError } = await supabase
      .from("routes")
      .select("base_price")
      .eq("route_id", route_id)
      .single();

    if (routeError) {
      throw new Error(routeError.message);
    }

    //insert the schedule
    const finalScheduleData = this.buildScheduleWritePayload(
      {
        ...scheduleData,
        available_seats: transport.capacity,
        departure_time,
        arrival_time,
      },
      route?.base_price ?? 0,
    );

    const { data, error } = await supabase
      .from("schedules")
      .insert([finalScheduleData])
      .select()
      .single();
    if (error) {
      throw new Error(error.message);
    }

    await this.upsertDelayAnnouncement(
      data.schedule_id,
      scheduleData?.schedule_status,
      scheduleData?.delay_minutes,
      scheduleData?.remark,
    );

    return data;
  }
  //get all schedules
  async getAllSchedules(date) {
    let query = supabase
      .from("schedules")
      .select(
        `
      schedule_id,
      route_id,
      transport_id,
      departure_time,
      arrival_time,
      available_seats,
      current_price,
      direction,
      routes (
        name,
        base_price,
        start_station:stations!routes_start_station_id_fkey (name),
        end_station:stations!routes_end_station_id_fkey (name)
      ),
      transports (
        type,
        license_plate
      )
    `,
      )
      .order("departure_time", { ascending: true });

    if (date) {
      const startOfDay = `${date}T00:00:00.000Z`;
      const endOfDay = `${date}T23:59:59.999Z`;
      query = query.gte("departure_time", startOfDay).lte("departure_time", endOfDay);
    }

    const { data, error } = await query;

    if (error) throw new Error(error.message);

    const cancelledIds = await this.getCancelledScheduleIds(
      (data ?? []).map((schedule) => schedule.schedule_id),
    );

    const visibleSchedules = (data ?? []).filter(
      (schedule) => !cancelledIds.has(schedule.schedule_id),
    );

    const announcementsMap = await this.getActiveAnnouncementsMap(
      visibleSchedules.map((schedule) => schedule.schedule_id),
    );

    return this.enrichSchedulesWithStatus(visibleSchedules, announcementsMap);
  }
  //delete schedule
  async deleteSchedule(id) {
    const { error } = await supabase
      .from("schedules")
      .delete()
      .eq("schedule_id", id);

    if (error) {
      const message = String(error.message || "");
      const isFkConstraint = /foreign key|violates|constraint/i.test(message);

      if (isFkConstraint) {
        // If tickets already reference this schedule, keep data history and hide
        // schedule from listings via cancellation announcement fallback.
        const { error: annError } = await supabase
          .from("ticket_announcements")
          .insert([
            {
              schedule_id: String(id),
              type: "cancellation",
              delay_minutes: 0,
              message: "Schedule cancelled by admin",
              is_active: true,
            },
          ]);

        if (annError) {
          throw new Error(`${message} | cancellation fallback failed: ${annError.message}`);
        }

        return {
          message:
            "Schedule has linked tickets, so it was cancelled (hidden) instead of permanently deleted",
        };
      }

      throw new Error(error.message);
    }
    return { message: "Schedule deleted successfully" };
  }

  async getSchedulesByRoute(routeId) {
    const { data, error } = await supabase
      .from("schedules")
      .select(
        `
      schedule_id,
      departure_time,
      arrival_time,
      available_seats,
      current_price
    `,
      )
      .eq("route_id", routeId)
      .order("departure_time", { ascending: true });

    if (error) throw new Error(error.message);

    const cancelledIds = await this.getCancelledScheduleIds(
      (data ?? []).map((schedule) => schedule.schedule_id),
    );

    const visibleSchedules = (data ?? []).filter(
      (schedule) => !cancelledIds.has(schedule.schedule_id),
    );

    const announcementsMap = await this.getActiveAnnouncementsMap(
      visibleSchedules.map((schedule) => schedule.schedule_id),
    );

    return this.enrichSchedulesWithStatus(visibleSchedules, announcementsMap);
  }
  //update schedule
  async updateSchedule(id, updateData) {
    const parsedDeparture = updateData?.departure_time
      ? new Date(updateData.departure_time)
      : null;
    const parsedArrival = updateData?.arrival_time
      ? new Date(updateData.arrival_time)
      : null;

    if (
      parsedDeparture &&
      parsedArrival &&
      !Number.isNaN(parsedDeparture.getTime()) &&
      !Number.isNaN(parsedArrival.getTime()) &&
      parsedDeparture >= parsedArrival
    ) {
      throw new Error("arrival_time must be after departure_time");
    }

    const writePayload = this.buildScheduleWritePayload(
      {
        ...updateData,
        departure_time:
          parsedDeparture && !Number.isNaN(parsedDeparture.getTime())
            ? parsedDeparture.toISOString()
            : updateData?.departure_time,
        arrival_time:
          parsedArrival && !Number.isNaN(parsedArrival.getTime())
            ? parsedArrival.toISOString()
            : updateData?.arrival_time,
      },
      updateData?.current_price ?? 0,
    );

    const { data, error } = await supabase
      .from("schedules")
      .update(writePayload)
      .eq("schedule_id", id)
      .select()
      .single();
    if (error) {
      throw new Error(error.message);
    }

    await this.upsertDelayAnnouncement(
      id,
      updateData?.schedule_status,
      updateData?.delay_minutes,
      updateData?.remark,
    );

    return data;
  }
}
export default new ScheduleService();

