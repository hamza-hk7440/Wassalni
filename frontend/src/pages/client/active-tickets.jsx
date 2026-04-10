import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TicketCard from '../../components/common/Ticket';

const ActiveTickets = () => {
    const navigate = useNavigate();
    const [tickets, setTickets] = useState([]);

    useEffect(() => {
        setTickets([
            { 
                id: 1, qr_code: "W-8821", 
                valid_from: "2026-04-04 08:00", valid_to: "2026-04-04 20:00", 
                status: "active", type: "Bus", 
                from_station: "Central Station", to_station: "North Park" 
            },
            { 
                id: 2, qr_code: "W-9942", 
                valid_from: "2026-04-05 09:00", valid_to: "2026-04-05 21:00", 
                status: "active", type: "Train", 
                from_station: "Downtown", to_station: "Airport" 
            }
        ]);
    }, []);

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

                {tickets.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6 animate-in fade-in slide-in-from-bottom-3 duration-500">
                        {tickets.map(t => (
                            <div key={t.id} className="relative group">
                                <TicketCard ticket={t} />

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
        </div>
    );
};

export default ActiveTickets;