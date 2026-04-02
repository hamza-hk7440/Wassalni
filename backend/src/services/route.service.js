import { supabase } from "../config/supabase.js";
class RouteService {
    //create route
    async createFullRoute(routeData,stationSequence) {
        //insert the main route
        const { data:route,error:routeError } = await supabase
            .from("routes")
            .insert([routeData])
            .select()
            .single();
        if (routeError) {
            throw new Error(routeError.message);
        }
        //insert the stops into route_stations table
        //stationSequence is an array of objects with station_id and sequence_order
        const stops= stationSequence.map(stop => ({
            route_id: route.route_id,
            station_id: stop.station_id,
            sequence_order: stop.sequence_order
        }));
        const { error:stopsError } = await supabase
            .from("route_stations")
            .insert(stops);
        if (stopsError) {
            throw new Error(stopsError.message);
        }
        return route;

    }
    //get a route with all its stops
    async getRouteDetails(routeId) {
        const { data, error } = await supabase
            .from("routes")
            .select(`
                *,
                route_stations (
                    sequence_order,
                    stations(name,location)
                )
            `)
            .eq("route_id", routeId)
            .single();
        if (error) {
            throw new Error(error.message);
        }
        data.route_stations.sort((a, b) => a.sequence_order - b.sequence_order);
        return data;
    }
    //get all routes 
    async getAllRoutes() {
        const { data, error } = await supabase
            .from("routes")
            .select('*,start_station:stations!start_station_id(name),end_station:stations!end_station_id(name)')

        if (error) {
            throw new Error(error.message);
        }
        return data;
    }
    //delete route and its stops
    async deleteRoute(routeId) {
        const { error:stopsError } = await supabase
            .from("route_stations")
            .delete()
            .eq("route_id", routeId);
        if (stopsError) {
            throw new Error(stopsError.message);
        }
        const { error:routeError } = await supabase
            .from("routes")
            .delete()
            .eq("route_id", routeId);
        if (routeError) {
            throw new Error(routeError.message);
        }
        return { message: "route deleted successfully" };
    }
}
export default new RouteService();