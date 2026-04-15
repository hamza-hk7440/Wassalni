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

// Passenger: Get active tickets
export const getActiveTickets = async () => {
    const response = await api.get('/ticket/mytickets/active');
    return response.data;
};

// Passenger: Get ticket history (all tickets including used/refunded)
export const getTicketHistory = async () => {
    const response = await api.get('/ticket/mytickets/history');
    return response.data;
};

// Passenger: Request a refund for a cancelled ticket
export const requestRefund = async (ticketId) => {
    const response = await api.post('/ticket/requestrefund', { ticket_id: ticketId });
    return response.data;
};

// Passenger: Get all refund requests
export const getRefundRequests = async () => {
    const response = await api.get('/ticket/refundrequests');
    return response.data;
};

// Controller: Mark a ticket as used after scanning
export const markTicketAsUsed = async (ticketId) => {
    const response = await api.post('/ticket/markticketasused', { ticket_id: ticketId });
    return response.data;
};
