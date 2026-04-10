import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';

const MetroSchedule = () => {
    const navigate = useNavigate();
    const [selectedDate, setSelectedDate] = useState(10);
    const [showBookingModal, setShowBookingModal] = useState(false);

    return (
        <div className="min-h-screen bg-[#f4f7f9] px-5 py-10 font-sans flex flex-col items-center">
            
            <div className="text-center px-5 py-10 bg-gradient-to-b from-[#6ec1d1]/5 to-transparent w-full max-w-[850px]">
                <span className="inline-block bg-[#1E5470]/10 text-[#1E5470] px-4 py-1.5 rounded-full text-[0.85rem] font-bold mb-4">
                    Metro Service
                </span>
                <h1 className="text-3xl font-bold text-[#1a3a4a] mb-2">Plan Your Journey</h1>
                <p className="text-gray-500">Fast, reliable, and digital-first transportation.</p>
            </div>

            <div className="w-full max-w-[850px] bg-white p-6 md:p-11 rounded-[25px] shadow-[0_10px_30px_rgba(0,0,0,0.05)]">
                {/* Header */}
                <div className="flex items-center gap-5 mb-6 pb-5 border-b border-[#dee2e6]">
                    <button onClick={() => navigate(-1)} className="text-[#1E5470] font-semibold hover:opacity-70 transition-opacity">
                        ← Back
                    </button>
                    <div className="flex flex-col">
                        <h2 className="text-2xl font-bold text-[#1a3a4a]">Metro Schedule</h2>
                        <span className="w-fit bg-[#e2e8f0] text-[#4a5568] px-3 py-1 rounded-xl text-[0.8rem] font-semibold mt-1">
                            Available Daily
                        </span>
                    </div>
                </div>

                <input 
                    type="text" 
                    placeholder="Search stations..." 
                    className="w-full p-3.5 rounded-xl border border-[#cbd5e0] mb-5 outline-none focus:border-[#6ec1d1] focus:ring-4 focus:ring-[#6ec1d1]/10 transition-all"
                />

                <div className="flex gap-4 overflow-x-auto pb-4 mb-[30px] no-scrollbar">
                    {[10, 11, 12, 13, 14].map((date) => (
                        <div 
                            key={date}
                            onClick={() => setSelectedDate(date)}
                            className={`min-w-[75px] p-4 rounded-2xl text-center cursor-pointer border transition-all duration-200 ${
                                selectedDate === date 
                                ? 'bg-[#1a3a4a] text-white border-[#1a3a4a] shadow-md' 
                                : 'bg-white text-gray-600 border-[#e0e6ed] hover:border-[#6ec1d1]'
                            }`}
                        >
                            <span className="block text-[0.8rem] opacity-80 uppercase font-semibold">Apr</span>
                            <span className="text-xl font-bold">{date}</span>
                        </div>
                    ))}
                </div>

                <div className="space-y-4">
                    {[1, 2].map((i) => (
                        <div key={i} className="flex flex-col md:flex-row items-center justify-between p-6 bg-white rounded-[18px] border-l-[6px] border-[#1E5470] shadow-[0_4px_6px_rgba(0,0,0,0.02)] transition-transform hover:-translate-y-1">
                            <div className="flex items-center gap-5 flex-[2]">
                                <div className="station-point">
                                    <small className="text-[0.7rem] text-[#718096] font-bold uppercase">Departure</small>
                                    <p className="font-bold text-[#1a3a4a] text-lg">Tunis Marine</p>
                                </div>
                                <span className="text-[#6ec1d1] font-bold text-xl">→</span>
                                <div className="station-point">
                                    <small className="text-[0.7rem] text-[#718096] font-bold uppercase">Arrival</small>
                                    <p className="font-bold text-[#1a3a4a] text-lg">La Marsa</p>
                                </div>
                            </div>

                            <div className="flex flex-1 justify-center gap-10 my-4 md:my-0">
                                <div className="text-center">
                                    <small className="block text-[0.7rem] text-[#718096] font-bold uppercase">Status</small>
                                    <span className="font-extrabold text-[#38a169]">Available</span>
                                </div>
                            </div>

                            <div className="flex flex-col items-end flex-1">
                                <span className="text-lg font-extrabold text-[#1a3a4a] mb-2">5 Tokens</span>
                                <Button onClick={() => setShowBookingModal(true)} className="!py-2 !px-4 text-sm !w-fit">
                                    Select
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {showBookingModal && (
                <div className="fixed inset-0 z-[999] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white p-10 rounded-[25px] text-center w-full max-w-[420px] shadow-2xl animate-in fade-in zoom-in duration-200">
                        <div className="w-[60px] h-[60px] bg-[#fff5f5] text-[#e53e3e] rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-5">
                            !
                        </div>
                        <h2 className="text-xl font-bold text-[#1a3a4a]">Confirm Purchase</h2>
                        <p className="text-gray-500 mt-2">5 tokens will be deducted from your wallet for this trip.</p>
                        
                        <div className="bg-[#f7fafc] p-4 rounded-xl my-5 font-bold text-[#1E5470] text-lg">
                            Price: 5 Tokens
                        </div>

                        <div className="flex flex-col gap-3">
                            <Button onClick={() => setShowBookingModal(false)}>
                                Confirm Booking
                            </Button>
                            <button 
                                onClick={() => setShowBookingModal(false)}
                                className="w-full py-3 rounded-xl bg-[#edf2f7] text-[#4a5568] font-bold hover:bg-[#e2e8f0] transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MetroSchedule;