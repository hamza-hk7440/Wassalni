import api from './axios';

// Create a new ticket (book a ride)
export const createTicket = async (data) => {
    const response = await api.post('/ticket/createticket', data);
    return response.data;
};

// Retrieve QR code for a specific ticket
export const getTicketQR = async (ticketId) => {
    const response = await api.post('/ticket/getqrdatabyticketid', { ticket_id: ticketId });
    return response.data;
};

// Controller: Verify a ticket using scanned QR data
export const verifyTicket = async (qrData) => {
    const response = await api.post('/ticket/getticketstatusbyqrdata', { qr_data: qrData });
    return response.data;
};
