import { supabase } from "../config/supabase.js";


class TransportService {
  //create transport
  async createTransport(transport) {
    const { type, capacity, status, license_plate } = transport;
    const { data, error } = await supabase
      .from("transports")
      .insert([{ type, capacity, status, license_plate }])
      .select()
      .single();
    if (error) {
      throw new Error(error.message);
    }
    return data;
  }
  //get all transports
  async getAllTransports() {
    const { data, error } = await supabase
      .from("transports")
      .select("*")
      .order("license_plate", { ascending: true });
    if (error) {
      throw new Error(error.message);
    }
    return data;
  }
  //get specific transport details by id
  async getTransportById(id) {
    const { data, error } = await supabase
      .from("transports")
      .select("*")
      .eq("transport_id", id)
      .single();
    if (error) {
      throw new Error(error.message);
    }
    return data;
  }
  //update transport
  async updateTransport(id, updateData) {
    const { data, error } = await supabase
      .from("transports")
      .update(updateData)
      .eq("transport_id", id)
      .select()
      .single();
    if (error) {
      throw new Error(error.message);
    }
    return data;
  }
  //delete transport
  async deleteTransport(id) {
    const { error } = await supabase
      .from("transports")
      .delete()
      .eq("transport_id", id);
    if (error) {
      throw new Error(error.message);
    }
    return { message: "Transport deleted successfully" };
  }
}
export default new TransportService();
