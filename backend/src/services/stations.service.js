import { supabase } from "../config/supabase.js";

class StationsService {
    //create station
    async createStation(station) {
        const { name, location } = station;

        const { data, error } = await supabase
            .from("stations")
            .insert([{ name, location }])
            .select("*")
            .single();
        if (error) {
            throw new Error(error.message);
        }
        return data;
    }
    //get all stations
    async getAllStations() {
        const { data, error } = await supabase.from("stations").select("*").order("name", { ascending: true });
        if (error) {
            throw new Error(error.message);
        }
        return data;
    }
    //get station by id
    async getStationById(id) {
        const { data, error } = await supabase
            .from("stations")
            .select("*")
            .eq("station_id", id)
            .single();
        if (error) {
            throw new Error(error.message);
        }
        return data;
    }
    //update station
    async updateStation(id, station) {
        const { name, location } = station;
        const { data, error } = await supabase
            .from("stations")
            .update({ name, location })
            .eq("station_id", id)
            .select("*")
            .single();
        if (error) {
            throw new Error(error.message);
        }
        return data;
    }
    //delete station
    async deleteStation(id) {
        const { data, error } = await supabase
            .from("stations")
            .delete()
            .eq("station_id", id)
            .select("*")
            .single();
        if (error) {
            throw new Error(error.message);
        }
        return data;
    }
}    