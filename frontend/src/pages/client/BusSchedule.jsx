import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';

const BusSchedule = () => {
    const navigate = useNavigate();
    const [selectedDate, setSelectedDate] = useState(10);
    const [showModal, setShowModal] = useState(false);

    const days = [
        { name: 'FRI', date: 10 }, { name: 'SAT', date: 11 }, { name: 'SUN', date: 12 },
        { name: 'MON', date: 13 }, { name: 'TUE', date: 14 }, { name: 'WED', date: 15 }
    ];

    return (
        <div className="min-h-screen bg-[#f4f7f9] px-5 py-10 font-sans">
            <div className="mx-auto max-w-[850px] rounded-[25px] bg-white p-6 md:p-12 shadow-[0_10px_30px_rgba(0,0,0,0.05)]">
                
                {/* Header Section */}
                <div className="mb-6 flex items-center gap-5 border-b border-[#dee2e6] pb-5">
                    <button 
                        onClick={() => navigate(-1)} 
                        className="flex items-center text-base font-semibold text-[#1E5470] transition-opacity hover:opacity-70"
                    >
                        ← Back
                    </button>
                    <h1 className="text-2xl font-bold text-[#1a3a4a]">Bus Schedule</h1>
                </div>
                <input 
                    type="text" 
                    placeholder="Search for a station..." 
                    className="mb-5 w-full rounded-xl border border-[#cbd5e0] p-3.5 outline-none focus:border-[#6ec1d1]"
                />

                <div className="no-scrollbar mb-[30px] flex gap-4 overflow-x-auto py-2.5">
                    {days.map((day) => (
                        <div 
                            key={day.date}
                            onClick={() => setSelectedDate(day.date)}
                            className={`flex min-w-[75px] cursor-pointer flex-col items-center rounded-2xl border p-4 transition-all duration-200 ${
                                selectedDate === day.date 
                                ? 'border-[#1a3a4a] bg-[#1a3a4a] text-white shadow-md' 
                                : 'border-[#e0e6ed] bg-white text-gray-600 hover:border-[#6ec1d1]'
                            }`}
                        >
                            <span className="text-[0.8rem] font-semibold opacity-80">{day.name}</span>
                            <span className="text-xl font-bold">{day.date}</span>
                        </div>
                    ))}
                </div>
                <div className="flex flex-col gap-4">
                    {[1, 2].map((item) => (
                        <div key={item} className="group flex flex-col md:flex-row items-center justify-between rounded-[18px] border-l-[6px] border-[#6ec1d1] bg-white p-6 shadow-[0_4px_6px_rgba(0,0,0,0.02)] transition-transform hover:-translate-y-1">
                            
                            <div className="flex flex-1 items-center gap-5">
                                <div className="text-left">
                                    <label className="block text-[0.7rem] font-bold uppercase text-gray-500">From</label>
                                    <span className="text-lg font-bold text-[#1a3a4a]">Sfax</span>
                                </div>
                                <div className="text-xl font-bold text-[#6ec1d1]">→</div>
                                <div className="text-left">
                                    <label className="block text-[0.7rem] font-bold uppercase text-gray-500">To</label>
                                    <span className="text-lg font-bold text-[#1a3a4a]">Tunis</span>
                                </div>
                            </div>

                            <div className="my-4 flex flex-1 justify-center gap-10 md:my-0">
                                <div className="text-center">
                                    <label className="block text-[0.7rem] font-bold uppercase text-gray-500">Time</label>
                                    <span className="font-semibold text-gray-700">08:30 AM</span>
                                </div>
                                <div className="text-center">
                                    <label className="block text-[0.7rem] font-bold uppercase text-gray-500">Seats</label>
                                    <span className="font-extrabold text-[#38a169]">12 Available</span>
                                </div>
                            </div>

                            <div className="flex flex-1 flex-col items-end gap-2 text-right">
                                <span className="text-xl font-extrabold text-[#1a3a4a]">20 Tokens</span>
                                <Button 
                                    className="!w-fit px-6 py-2 text-sm" 
                                    onClick={() => setShowModal(true)}
                                >
                                    Book Seat
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {showModal && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="w-[90%] max-w-[420px] rounded-[25px] bg-white p-10 text-center shadow-2xl animate-in zoom-in duration-300">
                        <h2 className="text-2xl font-bold text-[#1a3a4a]">Confirm Booking</h2>
                        <p className="mt-4 text-gray-600">You are about to book a seat from <strong>Sfax</strong> to <strong>Tunis</strong>.</p>
                        
                        <div className="my-5 rounded-xl bg-[#f7fafc] p-4 text-lg font-bold text-[#1E5470]">
                            Total Price: 20 Tokens
                        </div>

                        <div className="flex gap-3 justify-center">
                            <button 
                                onClick={() => setShowModal(false)}
                                className="flex-1 rounded-xl bg-gray-100 py-3 font-bold text-gray-600 transition-colors hover:bg-gray-200"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={() => {
                                    alert("Successfully booked!");
                                    setShowModal(false);
                                }}
                                className="flex-1 rounded-xl bg-[#6ec1d1] py-3 font-bold text-white transition-all hover:bg-[#5bb0c0] shadow-md"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BusSchedule;