import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';

const BusSchedule = () => {
    const navigate = useNavigate();

    const [tokenBalance, setTokenBalance] = useState(3);
    const [selectedDayKey, setSelectedDayKey] = useState('MON-8');
    const [showModal, setShowModal] = useState(false);
    const [bookingDetails, setBookingDetails] = useState(null);
    const [popup, setPopup] = useState(null); // 'success' | 'error' | null

    const days = [
        { name: 'MON', date: 8,  key: 'MON-8'  },
        { name: 'TUE', date: 7,  key: 'TUE-7'  },
        { name: 'WED', date: 8,  key: 'WED-8'  },
        { name: 'THU', date: 9,  key: 'THU-9'  },
        { name: 'FRI', date: 10, key: 'FRI-10' },
        { name: 'SAT', date: 11, key: 'SAT-11' },
    ];

    const allTrips = {
        'MON-8': [
            { id: 1, from: 'Stah Jaber', to: 'Skanes', price: 20, times: ['11:38 - 12:08', '14:00 - 14:30'] },
            { id: 2, from: 'Sfax',       to: 'Tunis',  price: 25, times: ['08:00 - 11:30'] },
        ],
        'TUE-7': [
            { id: 3, from: 'Sousse', to: 'Monastir', price: 5, times: ['09:00 - 09:30'] },
        ],
        'WED-8': [
            { id: 4, from: 'Tunis',      to: 'Bizerte', price: 15, times: ['10:00 - 11:15'] },
            { id: 5, from: 'Stah Jaber', to: 'Skanes',  price: 20, times: ['16:00 - 16:30'] },
        ],
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
            setTokenBalance((prev) => prev - bookingDetails.price);
            setShowModal(false);
            setPopup('success');
        }
    };

    const canAfford = bookingDetails && tokenBalance >= bookingDetails.price;

    /* ── SVG icons ── */
    const BusIcon = () => (
        <svg width="28" height="18" viewBox="0 0 28 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="1" y="1" width="26" height="13" rx="3" stroke="#94a3b8" strokeWidth="1.6" fill="none"/>
            <rect x="3" y="3" width="5" height="5" rx="1" fill="#cbd5e1"/>
            <rect x="11" y="3" width="5" height="5" rx="1" fill="#cbd5e1"/>
            <rect x="19" y="3" width="5" height="5" rx="1" fill="#cbd5e1"/>
            <line x1="1" y1="10" x2="27" y2="10" stroke="#94a3b8" strokeWidth="1.2"/>
            <circle cx="6"  cy="16" r="2" fill="#64748b"/>
            <circle cx="22" cy="16" r="2" fill="#64748b"/>
        </svg>
    );

    const CheckIcon = () => (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="16" fill="#dcfce7"/>
            <polyline points="8,17 13,22 24,11" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        </svg>
    );

    const ErrorIcon = () => (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="16" fill="#fee2e2"/>
            <line x1="10" y1="10" x2="22" y2="22" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round"/>
            <line x1="22" y1="10" x2="10" y2="22" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round"/>
        </svg>
    );

    const TokenIcon = ({ size = 14 }) => (
        <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
            <circle cx="7" cy="7" r="7" fill="#f97316"/>
            <circle cx="7" cy="7" r="4" fill="#fdba74"/>
            <circle cx="7" cy="7" r="2" fill="#f97316"/>
        </svg>
    );

    const ClockIcon = () => (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <circle cx="6" cy="6" r="5.5" stroke="#94a3b8" strokeWidth="1"/>
            <polyline points="6,3 6,6 8,7.5" stroke="#94a3b8" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    );

    const ArrowIcon = () => (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <polyline points="4,8 12,8" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round"/>
            <polyline points="9,5 12,8 9,11" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    );

    return (
        <div className="min-h-screen bg-[#f0f4f8] px-5 py-10 font-sans">
            <div className="mx-auto max-w-[850px] rounded-[30px] bg-white p-6 shadow-sm">
                <div className="mb-8 flex items-center px-2">
                    <button
                        onClick={() => navigate(-1)}
                        className="mr-4 text-gray-400 hover:text-gray-600 text-xl leading-none"
                    >
                        &#8592;
                    </button>
                    <h1 className="text-2xl font-bold text-[#1a3a4a]">Bus Schedule</h1>
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
                            }`}
                        >
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
                                className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_2px_15px_rgba(0,0,0,0.04)]">
                                <div className="flex items-center gap-5">
                                    <div>
                                        <p className="text-[0.6rem] font-bold uppercase text-gray-400 mb-0.5">From</p>
                                        <p className="text-base font-extrabold text-[#1a3a4a]">{trip.from}</p>
                                    </div>
                                    <div className="flex flex-col items-center gap-1">
                                        <BusIcon />
                                        <ArrowIcon />
                                    </div>
                                    <div>
                                        <p className="text-[0.6rem] font-bold uppercase text-gray-400 mb-0.5">To</p>
                                        <p className="text-base font-extrabold text-[#1a3a4a]">{trip.to}</p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <div className="flex items-center gap-1.5 rounded-full bg-orange-50 px-3 py-1">
                                        <TokenIcon size={13} />
                                        <span className="text-sm font-extrabold text-orange-500">{trip.price}</span>
                                        <span className="text-[0.6rem] font-semibold text-orange-400">tokens</span>
                                    </div>
                                    {trip.times.map((t) => (
                                        <div key={t} className="flex items-center gap-1 text-[0.7rem] text-gray-400">
                                            <ClockIcon />
                                            <span className="font-medium">{t}</span>
                                        </div>
                                    ))}
                                    <Button
                                        onClick={() => handleOpenBooking(trip)}
                                        className="!w-fit !mt-1 bg-[#1a3a4a] px-7 py-2 rounded-xl font-bold text-sm transition-transform active:scale-95">
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
                        <h2 className="text-center text-xl font-bold text-[#1E5470] mb-8">Bus Ticket Details</h2>
                        <div className="flex items-center justify-between mb-8">
                            <div className="text-center">
                                <span className="block text-[0.65rem] font-bold uppercase text-gray-400 mb-1">From</span>
                                <span className="text-lg font-bold text-[#1E5470]">{bookingDetails.from}</span>
                            </div>
                            <div className="flex flex-col items-center gap-1">
                                <BusIcon />
                                <span className="text-[10px] font-bold text-gray-300">Direct</span>
                            </div>
                            <div className="text-center">
                                <span className="block text-[0.65rem] font-bold uppercase text-gray-400 mb-1">To</span>
                                <span className="text-lg font-bold text-[#1E5470]">{bookingDetails.to}</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between mb-6 rounded-2xl bg-orange-50 px-5 py-3">
                            <div className="flex items-center gap-2">
                                <TokenIcon size={16} />
                                <span className="text-sm font-bold text-orange-500">{bookingDetails.price} tokens</span>
                            </div>
                            <div className="text-right">
                                <p className="text-[0.6rem] text-gray-400 font-semibold uppercase">Your balance</p>
                                <p className={`text-sm font-extrabold ${canAfford ? 'text-[#1E5470]' : 'text-red-500'}`}>
                                    {tokenBalance} tokens
                                </p>
                            </div>
                        </div>
                        {!canAfford && (
                            <p className="mb-4 text-center text-xs font-semibold text-red-400">
                                Not enough tokens to book this trip.
                            </p>
                        )}
                        <div className="mb-8 rounded-2xl bg-gray-50 p-1">
                            <select
                                value={bookingDetails.selectedTime}
                                onChange={(e) => setBookingDetails({ ...bookingDetails, selectedTime: e.target.value })}
                                className="w-full bg-transparent p-4 font-bold text-[#1E5470] outline-none">
                                {bookingDetails.times.map((t) => (
                                    <option key={t} value={t}>{t}</option>))}
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
                                className={`flex-1 rounded-2xl py-4 font-bold text-white transition-all ${
                                    canAfford
                                        ? 'bg-[#1E5470] hover:bg-[#16404f] active:scale-95'
                                        : 'bg-red-400 cursor-not-allowed'}`}>
                                {canAfford ? 'Confirm' : 'Insufficient Tokens'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {popup === 'success' && (
                <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/40 backdrop-blur-sm px-6">
                    <div className="w-full max-w-[380px] rounded-[30px] bg-white p-8 shadow-2xl text-center animate-in zoom-in duration-300">
                        <div className="flex justify-center mb-4">
                            <CheckIcon />
                        </div>
                        <h3 className="text-xl font-extrabold text-[#1E5470] mb-2">Purchase Successful!</h3>
                        <p className="text-sm text-gray-500 mb-1">
                            Your ticket from <span className="font-bold text-[#1E5470]">{bookingDetails?.from}</span> to <span className="font-bold text-[#1E5470]">{bookingDetails?.to}</span> has been booked.
                        </p>
                        <p className="text-sm text-gray-500 mb-5">
                            You can find it in the <span className="font-bold text-[#1E5470]">Active Tickets</span> section in your profile.
                        </p>
                        <div className="flex items-center justify-center gap-2 rounded-xl bg-orange-50 px-4 py-2 mb-6 mx-auto w-fit">
                            <TokenIcon size={14} />
                            <span className="text-sm font-bold text-orange-500">Remaining balance: {tokenBalance} tokens</span>
                        </div>
                        <button
                            onClick={() => setPopup(null)}
                            className="w-full rounded-2xl bg-[#1E5470] py-3.5 font-bold text-white hover:bg-[#16404f] transition-colors active:scale-95">
                            Done
                        </button>
                    </div>
                </div>
            )}
            {popup === 'error' && (
                <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/40 backdrop-blur-sm px-6">
                    <div className="w-full max-w-[380px] rounded-[30px] bg-white p-8 shadow-2xl text-center animate-in zoom-in duration-300">
                        <div className="flex justify-center mb-4">
                            <ErrorIcon />
                        </div>
                        <h3 className="text-xl font-extrabold text-red-600 mb-2">Not Enough Tokens</h3>
                        <p className="text-sm text-gray-500 mb-2">
                            This trip costs <span className="font-bold text-[#1E5470]">{bookingDetails?.price} tokens</span> but your balance is only{' '}
                            <span className="font-bold text-red-500">{tokenBalance} tokens</span>.
                        </p>
                        <p className="text-sm text-gray-400 mb-6">Please top up your wallet to continue.</p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setPopup(null)}
                                className="flex-1 py-3.5 rounded-2xl border border-gray-200 font-bold text-gray-400 hover:bg-gray-50 transition-colors">
                                Dismiss
                            </button>
                            <button
                                onClick={() => { setPopup(null); navigate('/wallet'); }}
                                className="flex-1 py-3.5 rounded-2xl bg-orange-500 font-bold text-white hover:bg-orange-600 transition-colors active:scale-95">
                                Top Up
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BusSchedule;