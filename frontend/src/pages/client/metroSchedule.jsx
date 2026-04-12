import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';

const MetroSchedule = () => {
    const navigate = useNavigate();

    const [selectedDayKey, setSelectedDayKey] = useState('MON-8');
    const [showModal, setShowModal] = useState(false);
    const [bookingDetails, setBookingDetails] = useState(null);
    const [tokenBalance, setTokenBalance] = useState(22);
    const [popup, setPopup] = useState(null); 

    const days = [
        { name: 'MON', date: 8,  key: 'MON-8'  },
        { name: 'TUE', date: 9,  key: 'TUE-9'  },
        { name: 'WED', date: 10, key: 'WED-10' },
        { name: 'THU', date: 11, key: 'THU-11' },
        { name: 'FRI', date: 12, key: 'FRI-12' },
        { name: 'SAT', date: 13, key: 'SAT-13' },
    ];

    const allTrips = {
        'MON-8': [
            { id: 1, from: 'Tunis Marine', to: 'La Marsa',   price: 5,  times: ['07:00 - 07:28', '09:15 - 09:43'] },
            { id: 2, from: 'Bardo',        to: 'Ariana',     price: 4,  times: ['08:30 - 08:52'] },
        ],
        'TUE-9': [
            { id: 3, from: 'Tunis Marine', to: 'Carthage',   price: 6,  times: ['10:00 - 10:35'] },
        ],
        'WED-10': [
            { id: 4, from: 'El Manar',     to: 'Tunis Marine', price: 5, times: ['06:45 - 07:15', '13:00 - 13:30'] },
            { id: 5, from: 'Bardo',        to: 'La Marsa',   price: 8,  times: ['15:20 - 16:00'] },
        ],
        'THU-11': [],
        'FRI-12': [
            { id: 6, from: 'Ariana',       to: 'Carthage',   price: 5,  times: ['08:00 - 08:40'] },
        ],
        'SAT-13': [],
    };

    const currentTrips = useMemo(() => allTrips[selectedDayKey] || [], [selectedDayKey]);

    const handleOpenBooking = (trip) => {
        setBookingDetails({ ...trip, selectedTime: trip.times[0] });
        setShowModal(true);
    };

    const handleConfirm = () => {
        if (tokenBalance < bookingDetails.price) {
            setShowModal(false);
            setPopup('error');
        } else {
            setTokenBalance(prev => prev - bookingDetails.price);
            setShowModal(false);
            setPopup('success');
        }
    };

    const isInsufficient = bookingDetails && tokenBalance < bookingDetails.price;
    const MetroIcon = () => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="6" width="20" height="12" rx="3"/>
            <path d="M6 18v2M18 18v2"/>
            <path d="M2 11h20"/>
            <circle cx="7" cy="14.5" r="1" fill="currentColor" stroke="none"/>
            <circle cx="17" cy="14.5" r="1" fill="currentColor" stroke="none"/>
        </svg>
    );

    const CheckIcon = () => (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
        </svg>
    );

    const XIcon = () => (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
    );

    const TokenIcon = ({ size = 14 }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="12" r="10"/><text x="12" y="16" textAnchor="middle" fontSize="11" fill="white" fontWeight="bold">T</text>
        </svg>
    );

    const ArrowRight = () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
        </svg>
    );

    return (
        <div className="min-h-screen bg-[#f4f7f9] px-5 py-10 font-sans">
            <div className="mx-auto max-w-[850px] rounded-[30px] bg-white p-6 shadow-sm">
                <div className="mb-8 flex items-center justify-between px-2">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="text-gray-400 hover:text-[#1a3a4a] transition-colors">
                            ←
                        </button>
                        <h1 className="text-2xl font-bold text-[#1a3a4a]">Metro Schedule</h1>
                    </div>
                </div>
                <div className="no-scrollbar mb-10 flex justify-between overflow-x-auto pb-2">
                    {days.map((day) => (
                        <div
                            key={day.key}
                            onClick={() => setSelectedDayKey(day.key)}
                            className={`flex min-w-[70px] cursor-pointer flex-col items-center rounded-2xl py-4 transition-all duration-200 ${
                                selectedDayKey === day.key
                                    ? 'bg-[#1a3a4a] text-white shadow-lg scale-105'
                                    : 'text-gray-400 hover:text-gray-600'
                            }`}>
                            <span className="text-[0.65rem] font-bold mb-1">{day.name}</span>
                            <span className="text-xl font-bold">{day.date}</span>
                        </div>
                    ))}
                </div>
                <div className="flex flex-col gap-4">
                    {currentTrips.length > 0 ? (
                        currentTrips.map((trip) => (
                            <div
                                key={trip.id}
                                className="flex items-center justify-between rounded-2xl border border-gray-50 bg-white p-6 shadow-[0_2px_15px_rgba(0,0,0,0.04)] hover:-translate-y-0.5 transition-transform duration-200">                                
                                <div className="flex items-center gap-5">
                                    <div>
                                        <p className="text-[0.6rem] font-bold uppercase text-gray-400">From</p>
                                        <p className="text-lg font-extrabold text-[#1a3a4a]">{trip.from}</p>
                                    </div>
                                    <div className="text-[#6ec1d1]">
                                        <MetroIcon />
                                    </div>
                                    <div>
                                        <p className="text-[0.6rem] font-bold uppercase text-gray-400">To</p>
                                        <p className="text-lg font-extrabold text-[#1a3a4a]">{trip.to}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="flex items-center gap-1.5 rounded-full bg-orange-50 px-3 py-1 text-sm font-bold text-orange-500">
                                        <TokenIcon size={13} />
                                        {trip.price}
                                    </span>
                                    <Button
                                        onClick={() => handleOpenBooking(trip)}
                                        className="!w-fit bg-[#1a3a4a] px-8 py-2.5 rounded-xl font-bold transition-transform active:scale-95">
                                        Book
                                    </Button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="py-10 text-center text-gray-400">No trips available for this day.</div>
                    )}
                </div>
            </div>
            {showModal && bookingDetails && (
                <div className="fixed inset-0 z-[1000] flex items-end justify-center bg-black/40 backdrop-blur-sm md:items-center">
                    <div className="w-full max-w-[450px] rounded-t-[40px] bg-white p-10 shadow-2xl md:rounded-[40px] animate-in slide-in-from-bottom duration-300">
                        <div className="mx-auto mb-8 h-1 w-12 rounded-full bg-gray-200" />
                        <h2 className="text-center text-xl font-bold text-[#1E5470] mb-10">Metro Ticket Details</h2>
                        <div className="flex items-center justify-between mb-6">
                            <div className="text-center">
                                <span className="block text-[0.65rem] font-bold uppercase text-gray-400">From</span>
                                <span className="text-lg font-bold text-[#1E5470]">{bookingDetails.from}</span>
                            </div>
                            <div className="flex flex-col items-center gap-1 text-[#6ec1d1]">
                                <MetroIcon />
                                <span className="text-[10px] font-bold text-gray-300">Direct</span>
                            </div>
                            <div className="text-center">
                                <span className="block text-[0.65rem] font-bold uppercase text-gray-400">To</span>
                                <span className="text-lg font-bold text-[#1E5470]">{bookingDetails.to}</span>
                            </div>
                        </div>
                        <div className="flex gap-3 mb-6">
                            <div className="flex-1 rounded-2xl bg-orange-50 p-4 text-center">
                                <p className="text-[0.65rem] font-bold uppercase text-orange-400 mb-1">Ticket Price</p>
                                <p className="text-xl font-extrabold text-orange-500 flex items-center justify-center gap-1.5">
                                    <TokenIcon size={16} /> {bookingDetails.price}
                                </p>
                            </div>
                            <div className={`flex-1 rounded-2xl p-4 text-center ${isInsufficient ? 'bg-red-50' : 'bg-gray-50'}`}>
                                <p className={`text-[0.65rem] font-bold uppercase mb-1 ${isInsufficient ? 'text-red-400' : 'text-gray-400'}`}>Your Balance</p>
                                <p className={`text-xl font-extrabold flex items-center justify-center gap-1.5 ${isInsufficient ? 'text-red-500' : 'text-[#1E5470]'}`}>
                                    <TokenIcon size={16} /> {tokenBalance}
                                </p>
                            </div>
                        </div>

                        {isInsufficient && (
                            <p className="text-center text-sm font-semibold text-red-400 mb-4 animate-in fade-in duration-200">
                                Not enough tokens for this trip.
                            </p>
                        )}
                        <div className="mb-10 rounded-2xl bg-gray-50 p-1">
                            <select
                                value={bookingDetails.selectedTime}
                                onChange={(e) => setBookingDetails({ ...bookingDetails, selectedTime: e.target.value })}
                                className="w-full bg-transparent p-4 font-bold text-[#1E5470] outline-none cursor-pointer">
                                {bookingDetails.times.map((t) => (
                                    <option key={t} value={t}>{t}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={() => setShowModal(false)}
                                className="flex-1 py-4 font-bold text-gray-400 hover:text-gray-600 transition-colors">
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirm}
                                className={`flex-1 rounded-2xl py-4 font-bold text-white transition-colors ${
                                    isInsufficient
                                        ? 'bg-red-400 cursor-not-allowed'
                                        : 'bg-[#1E5470] hover:bg-[#16425a]'}`}>
                                {isInsufficient ? 'Insufficient Tokens' : 'Confirm'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {popup === 'success' && (
                <div className="fixed inset-0 z-[1001] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="w-full max-w-[380px] rounded-[30px] bg-white p-10 shadow-2xl text-center animate-in zoom-in-95 fade-in duration-300">
                        <div className="w-16 h-16 rounded-full bg-green-100 text-green-500 flex items-center justify-center mx-auto mb-6">
                            <CheckIcon />
                        </div>
                        <h2 className="text-xl font-extrabold text-[#1a3a4a] mb-2">Booking Confirmed!</h2>
                        <p className="text-gray-500 text-sm mb-5 leading-relaxed">
                            Your purchase was successful. You can find your ticket in the{' '}
                            <span className="font-bold text-[#1E5470]">Active Tickets</span> section in your profile.
                        </p>
                        <div className="bg-green-50 rounded-2xl p-4 mb-8 flex items-center justify-between">
                            <span className="text-sm font-bold text-gray-500">New Balance</span>
                            <span className="flex items-center gap-1.5 font-extrabold text-green-600">
                                <TokenIcon size={14} /> {tokenBalance}
                            </span>
                        </div>
                        <button
                            onClick={() => setPopup(null)}
                            className="w-full py-4 rounded-2xl bg-[#1E5470] text-white font-bold hover:bg-[#16425a] transition-colors">
                            Great, thanks!
                        </button>
                    </div>
                </div>
            )}
            {popup === 'error' && (
                <div className="fixed inset-0 z-[1001] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="w-full max-w-[380px] rounded-[30px] bg-white p-10 shadow-2xl text-center animate-in zoom-in-95 fade-in duration-300">
                        <div className="w-16 h-16 rounded-full bg-red-100 text-red-500 flex items-center justify-center mx-auto mb-6">
                            <XIcon />
                        </div>
                        <h2 className="text-xl font-extrabold text-[#1a3a4a] mb-2">Insufficient Tokens</h2>
                        <p className="text-gray-500 text-sm mb-5 leading-relaxed">
                            You don't have enough tokens to book this trip. Please top up your wallet to continue.
                        </p>
                        <div className="bg-red-50 rounded-2xl p-4 mb-8 flex items-center justify-between">
                            <span className="text-sm font-bold text-gray-500">Current Balance</span>
                            <span className="flex items-center gap-1.5 font-extrabold text-red-500">
                                <TokenIcon size={14} /> {tokenBalance}
                            </span>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setPopup(null)}
                                className="flex-1 py-4 rounded-2xl bg-gray-100 text-gray-500 font-bold hover:bg-gray-200 transition-colors">
                                Dismiss
                            </button>
                            <button
                                onClick={() => setPopup(null)}
                                className="flex-1 py-4 rounded-2xl bg-[#1E5470] text-white font-bold hover:bg-[#16425a] transition-colors">
                                Top Up
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MetroSchedule;