import api from './axios';

/**
 * Fetch all schedules, optionally filtered by date (YYYY-MM-DD).
 * @param {string} [date] - ISO date string (YYYY-MM-DD)
 */
export const getAllSchedules = async (date) => {
    const response = await api.get('/schedules/all', {
        params: date ? { date } : {},
    });
    return response.data;
};

/**
 * Fetch schedules for a specific route.
 * @param {string} routeId
 */
export const getSchedulesByRoute = async (routeId) => {
    const response = await api.get(`/schedules/route/${routeId}`);
    return response.data;
};
