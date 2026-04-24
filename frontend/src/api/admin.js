import api from "./axios";

const normalizeList = (payload, keys = []) => {
  if (Array.isArray(payload)) {
    return payload;
  }

  for (const key of keys) {
    if (Array.isArray(payload?.[key])) {
      return payload[key];
    }
  }

  return [];
};

// ==========================================
// Dashboard & General Admin Stats
// ==========================================
export const getDashboardStats = async () => {
  const response = await api.get("/admin/dashboard");
  return response.data;
};

export const getAllUsers = async () => {
  const response = await api.get("/admin/users");
  return response.data;
};

export const deleteUser = async (userId) => {
  const response = await api.delete(`/admin/users/${userId}`);
  return response.data;
};

export const updateUser = async (userId, data) => {
  const response = await api.put(`/admin/users/${userId}`, data);
  return response.data;
};

export const getAllTransactions = async () => {
  const response = await api.get("/admin/transactions");
  return response.data;
};

export const getAllTickets = async () => {
  const response = await api.get("/admin/tickets");
  return response.data;
};

export const createController = async (data) => {
  const response = await api.post("/admin/createcontroller", data);
  return response.data;
};

// ==========================================
// Transports Management
// ==========================================
export const getTransports = async () => {
  const response = await api.get("/transports");
  return normalizeList(response.data, ["data", "transports"]);
};

export const createTransport = async (data) => {
  const response = await api.post("/transports", data);
  return response.data;
};

export const updateTransport = async (id, data) => {
  const response = await api.put(`/transports/${id}`, data);
  return response.data;
};

export const deleteTransport = async (id) => {
  const response = await api.delete(`/transports/${id}`);
  return response.data;
};

// ==========================================
// Stations Management
// ==========================================
export const getAllStations = async () => {
  const response = await api.get("/stations");
  return normalizeList(response.data, ["data", "stations"]);
};

export const createStation = async (data) => {
  const response = await api.post("/stations", data);
  return response.data;
};

export const updateStation = async (id, data) => {
  const response = await api.put(`/stations/${id}`, data);
  return response.data;
};

export const deleteStation = async (id) => {
  const response = await api.delete(`/stations/${id}`);
  return response.data;
};

// ==========================================
// Routes Management
// ==========================================
export const getAllRoutes = async () => {
  const response = await api.get("/routes");
  return normalizeList(response.data, ["routes", "data"]);
};

export const createRoute = async (data) => {
  const hasLegacyShape = data?.routeData && data?.stationSequence;
  const normalizeBasePrice = (value) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
  };

  const payload = hasLegacyShape
    ? {
        ...data,
        routeData: {
          ...data.routeData,
          base_price: normalizeBasePrice(data?.routeData?.base_price),
        },
      }
    : {
        routeData: {
          name: data?.name,
          start_station_id: data?.start_station_id,
          end_station_id: data?.end_station_id,
          base_price: normalizeBasePrice(data?.base_price),
        },
        stationSequence: [
          { station_id: data?.start_station_id, sequence_order: 1 },
          { station_id: data?.end_station_id, sequence_order: 2 },
        ],
      };

  const response = await api.post("/routes", payload);
  return response.data;
};

export const updateRoute = async (id, data) => {
  const hasLegacyShape = data?.routeData && data?.stationSequence;
  const normalizeBasePrice = (value) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
  };

  const payload = hasLegacyShape
    ? {
        ...data,
        routeData: {
          ...data.routeData,
          base_price: normalizeBasePrice(data?.routeData?.base_price),
        },
      }
    : {
        routeData: {
          name: data?.name,
          start_station_id: data?.start_station_id,
          end_station_id: data?.end_station_id,
          base_price: normalizeBasePrice(data?.base_price),
        },
        stationSequence: [
          { station_id: data?.start_station_id, sequence_order: 1 },
          { station_id: data?.end_station_id, sequence_order: 2 },
        ],
      };

  const response = await api.put(`/routes/${id}`, payload);
  return response.data;
};

export const deleteRoute = async (id) => {
  const response = await api.delete(`/routes/${id}`);
  return response.data;
};

// ==========================================
// Schedules Management
// ==========================================
export const getAllSchedules = async (date) => {
  const queryString = date ? `?date=${date}` : "";
  const response = await api.get(`/schedules/all${queryString}`);
  return normalizeList(response.data, ["data", "schedules"]);
};

export const createSchedule = async (data) => {
  const response = await api.post("/schedules", data);
  return response.data;
};

export const updateSchedule = async (id, data) => {
  const response = await api.put(`/schedules/${id}`, data);
  return response.data;
};

export const deleteSchedule = async (id) => {
  const response = await api.delete(`/schedules/${id}`);
  return response.data;
};

// Backward-compatible aliases for older imports.
export const getStations = getAllStations;
export const getRoutes = getAllRoutes;
export const getSchedules = getAllSchedules;
