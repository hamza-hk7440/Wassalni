import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TicketCard from '../../components/common/Ticket';
import { getActiveTickets, requestRefund } from '../../api/tickets';
const toCardStatus = (status) => {
    const normalized = String(status || '').toLowerCase();
    if (normalized === 'active') return 'active';
    if (normalized === 'used') return 'used';
    if (normalized === 'refunded') return 'refunded';
    return 'active';
};

const toShortTicketCode = (ticketId) => {
    const raw = String(ticketId || '').trim();
    if (!raw) return '-';
    const suffix = raw.includes('-') ? raw.split('-').pop() : raw;
    return suffix.toUpperCase();
};

const mapTicketForCard = (ticket) => ({
    ...ticket,
    id: ticket.id || ticket.ticket_id,
    status: toCardStatus(ticket.status),
    type: ticket.transport_type || 'Transport',
    from_station: ticket.from_station || ticket.departure_station || 'Departure',
    to_station: ticket.to_station || ticket.arrival_station || 'Destination',
    qr_code: toShortTicketCode(ticket.ticket_id),
    qr_image: ticket.qr_data ? `data:image/png;base64,${ticket.qr_data}` : null,
    valid_from: ticket.valid_from || ticket.purchase_date,
    valid_to: ticket.valid_to || ticket.arrival_time || ticket.departure_time,
});

const canRequestRefund = (ticket) => {
    const refundedOrPending = ['pending', 'completed'].includes(String(ticket.refund_status || '').toLowerCase());
    return Boolean(ticket.is_cancelled) && !refundedOrPending;
};

const ActiveTickets = () => {
    const navigate = useNavigate();
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [refundReason, setRefundReason] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                setLoading(true);
                setError('');
                const data = await getActiveTickets();
                const list = Array.isArray(data) ? data : (data.tickets || []);
                setTickets(list.map(mapTicketForCard));
            } catch (err) {
                console.error('Failed to load active tickets', err);
                setError('Could not load your tickets. Please try again.');
            } finally {
                setLoading(false);
            }
        };
        fetchTickets();
    }, []);

    const handleRefundClick = (ticket) => {
        setSelectedTicket(ticket);
        setIsModalOpen(true);
    };

    const submitRefund = async () => {
        if (!refundReason) {
            alert("Please provide a reason for the refund.");
            return;
        }
        try {
            setSubmitting(true);
            await requestRefund(selectedTicket.id || selectedTicket.ticket_id);
            // Remove refunded ticket from active list
            setTickets(prev => prev.filter(t => (t.id || t.ticket_id) !== (selectedTicket.id || selectedTicket.ticket_id)));
            setIsModalOpen(false);
            setRefundReason("");
        } catch (err) {
            console.error('Failed to submit refund', err);
            alert(err?.response?.data?.error || 'Failed to submit refund request.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] px-5 py-10 flex flex-col items-center font-sans">
            <div className="w-[95%] max-w-[1100px] bg-white p-6 md:p-11 rounded-[25px] shadow-[0_10px_30px_rgba(0,0,0,0.05)]">
                <div className="flex items-center gap-5 mb-9 pb-5 border-b-2 border-[#f1f5f9]">
                    <button 
                        className="flex items-center text-[#1E5470] font-semibold hover:opacity-70 transition-opacity" 
                        onClick={() => navigate(-1)}
                    >
                        ← Back
                    </button>
                    <div className="flex flex-col">
                        <h2 className="text-3xl font-bold text-[#1E5470]">Active Tickets</h2>
                        <p className="text-sm text-[#27ae60] font-bold uppercase mt-1">Ready for travel</p>
                    </div>
                </div>

                {loading ? (
                    <div className="py-24 text-center text-gray-400 font-medium">Loading your tickets...</div>
                ) : error ? (
                    <div className="py-24 text-center text-red-500 font-medium">{error}</div>
                ) : tickets.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6 animate-in fade-in slide-in-from-bottom-3 duration-500">
                        {tickets.map(t => (
                            <div key={t.id || t.ticket_id} className="relative group">
                                <TicketCard ticket={t} />
                                <div className="mt-2 flex justify-end">
                                    {canRequestRefund(t) ? (
                                        <button 
                                            onClick={() => handleRefundClick(t)}
                                            className="text-sm font-bold text-red-400 hover:text-red-600 transition-colors flex items-center gap-1 px-2"
                                        >
                                            ✕ Request Refund
                                        </button>
                                    ) : (
                                        <span className="text-xs font-semibold text-gray-400 px-2">
                                            {t.is_cancelled ? 'Refund already requested' : 'Refund available only for cancelled trips'}
                                        </span>
                                    )}
                                </div>

                                <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-[#27ae60]/20 pointer-events-none transition-colors" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-24 text-center flex flex-col items-center gap-5">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-4xl grayscale opacity-30">
                            🎟️
                        </div>
                        <div className="space-y-1">
                            <p className="text-xl text-gray-500 font-medium">You have no active tickets right now.</p>
                            <p className="text-gray-400">Your purchased and unused tickets will appear here.</p>
                        </div>
                        <button 
                            onClick={() => navigate('/packages')}
                            className="mt-4 px-8 py-3 bg-[#1E5470] text-white rounded-xl font-bold hover:bg-[#1a4a63] transition-all hover:shadow-lg"
                        >
                            Buy New Ticket
                        </button>
                    </div>
                )}
            </div>
            {isModalOpen && (
                <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
                    <div className="w-full max-w-[450px] bg-white rounded-[25px] p-8 shadow-2xl animate-in zoom-in duration-200">
                        <h3 className="text-2xl font-bold text-[#1E5470] mb-2">Request Refund</h3>
                        <p className="text-gray-500 mb-6">
                            You are requesting a refund for Ticket <span className="font-bold text-[#6EC1D1]">{selectedTicket?.qr_code}</span>.
                        </p>
                        
                        <label className="block text-sm font-bold text-[#1E5470] mb-2">Reason for refund</label>
                        <select 
                            className="w-full p-3 rounded-xl border-2 border-[#f1f5f9] outline-none focus:border-[#6EC1D1] mb-6 text-gray-600"
                            value={refundReason}
                            onChange={(e) => setRefundReason(e.target.value)}
                        >
                            <option value="">Select a reason...</option>
                            <option value="Delay">Service Delay / Cancellation</option>
                            <option value="Mistake">Purchased by mistake</option>
                            <option value="Technical">Technical issues with app</option>
                            <option value="Other">Other</option>
                        </select>

                        <div className="flex gap-4">
                            <button 
                                onClick={() => setIsModalOpen(false)} 
                                className="flex-1 py-3 rounded-xl bg-gray-100 font-bold text-gray-500 hover:bg-gray-200 transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={submitRefund}
                                disabled={submitting}
                                className="flex-1 py-3 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 shadow-md transition-all disabled:opacity-50"
                            >
                                {submitting ? 'Submitting...' : 'Submit Request'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ActiveTickets;