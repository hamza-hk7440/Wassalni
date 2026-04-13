import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const RefundRequest = () => {
    const navigate = useNavigate();
    const [requests, setRequests] = useState([]);
    const [searchTarget, setSearchTarget] = useState('');
    const [dateFilter, setDateFilter] = useState('');

    useEffect(() => {
        const mockRequests = [
            {
                id: 1,
                ticket_id: "W-1122",
                request_date: "2026-03-05",
                amount: "15 Tokens",
                reason: "Bus delayed over 60 minutes",
                status: "pending"
            },
            {
                id: 2,
                ticket_id: "W-3344",
                request_date: "2026-02-20",
                amount: "10 Tokens",
                reason: "Accidental purchase",
                status: "approved"
            },
            {
                id: 3,
                ticket_id: "W-5566",
                request_date: "2026-03-12",
                amount: "12 Tokens",
                reason: "Technical error at terminal",
                status: "rejected"
            }
        ];
        setRequests(mockRequests);
    }, []);

    const resetFilters = () => {
        setSearchTarget('');
        setDateFilter('');
    };

    const filteredRequests = requests.filter(req => {
        const matchesTicket = req.ticket_id?.toLowerCase().includes(searchTarget.toLowerCase());
        const matchesDate = dateFilter ? req.request_date === dateFilter : true;
        return matchesTicket && matchesDate;
    });
    const getStatusStyle = (status) => {
        switch (status) {
            case 'approved': return 'bg-green-100 text-green-700';
            case 'rejected': return 'bg-red-100 text-red-700';
            default: return 'bg-yellow-100 text-yellow-700';
        }
    };

    return (
        <div className="min-h-screen bg-[#f4f9fc] px-5 py-10 flex flex-col items-center font-sans">
            <div className="w-[95%] max-w-[1100px] bg-white p-6 md:p-11 rounded-[25px] shadow-[0_15px_35px_rgba(30,84,112,0.05)]">
                <div className="flex items-center gap-5 mb-9 pb-5 border-b-2 border-[#f1f5f9]">
                    <button 
                        className="flex items-center text-[#1E5470] font-semibold hover:opacity-70 transition-opacity" 
                        onClick={() => navigate(-1)}
                    >
                        ← Back
                    </button>
                    <h2 className="text-3xl font-bold text-[#1E5470]">Refund Requests</h2>
                </div>
                <div className="flex flex-col md:flex-row gap-4 mb-8">
                    <div className="flex-[2] relative">
                        <input
                            type="text"
                            placeholder="Search by Ticket ID (e.g., W-1122)..."
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
                {filteredRequests.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4">
                        {filteredRequests.map(req => (
                            <div 
                                key={req.id} 
                                className="p-6 border border-[#f1f5f9] rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-[#D1ECFF] hover:bg-[#fcfdfe] transition-all"
                            >
                                <div className="flex flex-col gap-1">
                                    <span className="text-sm font-bold text-[#6EC1D1] uppercase tracking-wider">Ticket {req.ticket_id}</span>
                                    <h4 className="text-lg font-bold text-[#1E5470]">{req.reason}</h4>
                                    <p className="text-sm text-gray-400">Requested on: {req.request_date}</p>
                                </div>
                                
                                <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end border-t md:border-none pt-4 md:pt-0">
                                    <div className="text-right">
                                        <p className="text-xs font-bold text-gray-400 uppercase">Amount</p>
                                        <p className="text-lg font-extrabold text-[#1E5470]">{req.amount}</p>
                                    </div>
                                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase ${getStatusStyle(req.status)}`}>
                                        {req.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-20 text-center flex flex-col items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="text-6xl grayscale opacity-20">💸</div>
                        <p className="text-xl text-gray-500 font-medium">No refund requests matching your search.</p>
                        
                        <button 
                            onClick={resetFilters}
                            className="mt-2 px-6 py-2 rounded-lg bg-gray-100 text-gray-600 font-semibold hover:bg-gray-200 transition-colors"
                        >
                            Clear Filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RefundRequest;