import { supabase } from "../config/supabase.js";
import dotenv from "dotenv";
dotenv.config();
class ScheduleService {
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
    const { transport_id, departure_time, arrival_time } = scheduleData;
    //check if transport is already busy
    const { data: existingSchedules, error: existingError } = await supabase
      .from("schedules")
      .select("*")
      .eq("transport_id", transport_id)
      .or(
        `(departure_time.lte.${arrival_time},arrival_time.gte.${departure_time})`,
      );
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

    //insert the schedule
    const finalScheduleData = {
      ...scheduleData,
      availbl_seats: transport.capacity,
      current_price: scheduleData.base_price || 0,
    };
    const { data, error } = await supabase
      .from("schedules")
      .insert([finalScheduleData])
      .select()
      .single();
    if (error) {
      throw new Error(error.message);
    }
    return data;
  }
  //get all schedules
  async getAllSchedules(date) {
    const startOfDay = `${date}T00:00:00.000Z`;
    const endOfDay = `${date}T23:59:59.999Z`;

    const { data, error } = await supabase
      .from("schedules")
      .select(
        `
      schedule_id,
      route_id,
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
      .gte("departure_time", startOfDay)
      .lte("departure_time", endOfDay)
      .order("departure_time", { ascending: true });

    if (error) throw new Error(error.message);

    const cancelledIds = await this.getCancelledScheduleIds(
      (data ?? []).map((schedule) => schedule.schedule_id),
    );

    return (data ?? []).filter(
      (schedule) => !cancelledIds.has(schedule.schedule_id),
    );
  }
  //delete schedule
  async deleteSchedule(id) {
    const { error } = await supabase
      .from("schedules")
      .delete()
      .eq("schedule_id", id);
    if (error) {
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

    return (data ?? []).filter(
      (schedule) => !cancelledIds.has(schedule.schedule_id),
    );
  }
}
export default new ScheduleService();
