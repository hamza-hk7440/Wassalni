import api from './axios';

// ==========================================
// Dashboard & General Admin Stats
// ==========================================

export const getDashboardStats = async () => {
    const response = await api.get('/admin/dashboard');
    return response.data;
};

export const getAllUsers = async () => {
    const response = await api.get('/admin/users');
    return response.data;
};

export const deleteUser = async (userId) => {
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
};

export const getAllTransactions = async () => {
    const response = await api.get('/admin/transactions');
    return response.data;
};

export const getAllTickets = async () => {
    const response = await api.get('/admin/tickets');
    return response.data;
};

export const createController = async (data) => {
    const response = await api.post('/admin/createcontroller', data);
    return response.data;
};

// ==========================================
// Transports Management
// ==========================================

export const getTransports = async () => {
    const response = await api.get('/transport');
    return response.data;
};

export const createTransport = async (data) => {
    const response = await api.post('/transport', data);
    return response.data;
};

export const updateTransport = async (id, data) => {
    const response = await api.put(`/transport/${id}`, data);
    return response.data;
};

export const deleteTransport = async (id) => {
    const response = await api.delete(`/transport/${id}`);
    return response.data;
};

// ==========================================
// Stations Management
// ==========================================

export const getStations = async () => {
    const response = await api.get('/station');
    return response.data;
};

export const createStation = async (data) => {
    const response = await api.post('/station', data);
    return response.data;
};

export const updateStation = async (id, data) => {
    const response = await api.put(`/station/${id}`, data);
    return response.data;
};

export const deleteStation = async (id) => {
    const response = await api.delete(`/station/${id}`);
    return response.data;
};

// ==========================================
// Routes Management
// ==========================================

export const getRoutes = async () => {
    const response = await api.get('/route');
    return response.data;
};

export const createRoute = async (data) => {
    // data should contain { routeData, stationSequence }
    const response = await api.post('/route', data);
    return response.data;
};

export const updateRoute = async (id, data) => {
    const response = await api.put(`/route/${id}`, data);
    return response.data;
};

export const deleteRoute = async (id) => {
    const response = await api.delete(`/route/${id}`);
    return response.data;
};

// ==========================================
// Schedules Management
// ==========================================

export const getSchedules = async (date) => {
    const queryString = date ? `?date=${date}` : '';
    const response = await api.get(`/schedule/all${queryString}`);
    return response.data;
};

export const createSchedule = async (data) => {
    const response = await api.post('/schedule', data);
    return response.data;
};

export const updateSchedule = async (id, data) => {
    const response = await api.put(`/schedule/${id}`, data);
    return response.data;
};

export const deleteSchedule = async (id) => {
    const response = await api.delete(`/schedule/${id}`);
    return response.data;
};
