import { supabase } from "../config/supabase";
class ScheduleService {
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
  async getAllSchedules() {
    const { data, error } = await supabase
      .from("schedules")
      .select(
        `*,
                routes(name),
                transports(license_plate,type)
            `,
      )
      .order("departure_time", { ascending: true });
    if (error) {
      throw new Error(error.message);
    }
    return data;
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
}
export default new ScheduleService();
