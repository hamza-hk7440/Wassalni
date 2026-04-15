import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import TicketCard from '../../components/common/Ticket';
import { getTicketHistory } from '../../api/tickets';

const TicketHistory = () => {
    const navigate = useNavigate();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTarget, setSearchTarget] = useState('');
    const [dateFilter, setDateFilter] = useState('');

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                setLoading(true);
                setError('');
                const data = await getTicketHistory();
                const list = Array.isArray(data) ? data : (data.tickets || []);
                setHistory(list);
            } catch (err) {
                console.error('Failed to load ticket history', err);
                setError('Could not load your ticket history.');
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    const resetFilters = () => {
        setSearchTarget('');
        setDateFilter('');
    };

    const filteredHistory = history.filter(ticket => {
        const dest = ticket.to_station || ticket.destination || '';
        const matchesDestination = dest.toLowerCase().includes(searchTarget.toLowerCase());
        const validFrom = ticket.valid_from || ticket.issued_at || '';
        const matchesDate = dateFilter ? validFrom.startsWith(dateFilter) : true;
        return matchesDestination && matchesDate;
    });

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
                    <h2 className="text-3xl font-bold text-[#1E5470]">Ticket History</h2>
                </div>

                <div className="flex flex-col md:flex-row gap-4 mb-8">
                    <div className="flex-[2] relative">
                        <input
                            type="text"
                            placeholder="Search by destination..."
                            className="w-full px-4 py-3.5 rounded-xl border border-[#e1e9f5] outline-none focus:border-[#6EC1D1] focus:ring-4 focus:ring-[#6EC1D1]/10 transition-all"
                            value={searchTarget}
                            onChange={(e) => setSearchTarget(e.target.value)}
                        />
                    </div>
                    <div className="flex-1 relative">
                        <input
                            type="date"
                            className="w-full px-4 py-3.5 rounded-xl border border-[#e1e9f5] outline-none focus:border-[#6EC1D1] focus:ring-4 focus:ring-[#6EC1D1]/10 transition-all text-gray-500"
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="py-20 text-center text-gray-400 font-medium">Loading ticket history...</div>
                ) : error ? (
                    <div className="py-20 text-center text-red-500 font-medium">{error}</div>
                ) : filteredHistory.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6">
                        {filteredHistory.map(ticket => (
                            <TicketCard key={ticket.id || ticket.ticket_id} ticket={ticket} />
                        ))}
                    </div>
                ) : (
                    <div className="py-20 text-center flex flex-col items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="text-6xl grayscale opacity-20">🎫</div>
                        <p className="text-xl text-gray-500 font-medium">No tickets or refunds matching your criteria were found.</p>
                        
                        <div className="flex flex-col sm:flex-row gap-4 mt-2">
                            <button 
                                onClick={resetFilters}
                                className="px-6 py-2 rounded-lg bg-gray-100 text-gray-600 font-semibold hover:bg-gray-200 transition-colors"
                            >
                                Clear Filters
                            </button>
                            <Link 
                                to="/packages" 
                                className="px-6 py-2 rounded-lg bg-[#1E5470] text-white font-semibold hover:bg-[#1a4a63] transition-colors"
                            >
                                View Packages
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TicketHistory;