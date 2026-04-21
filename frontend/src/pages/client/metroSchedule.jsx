import React, { useState, useMemo, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import { getAllSchedules } from '../../api/admin';
import { createTicket } from '../../api/tickets';
import { redeemTokens } from '../../api/auth';
import { AuthContext } from '../../context/AuthContext';

const MetroSchedule = () => {
    const navigate = useNavigate();
    const { user, setUser } = useContext(AuthContext);

    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDayKey, setSelectedDayKey] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [bookingDetails, setBookingDetails] = useState(null);
    const [popup, setPopup] = useState(null); 
    const [isBooking, setIsBooking] = useState(false);

    // Generate next 7 days
    const days = useMemo(() => {
        const result = [];
        const now = new Date();
        for (let i = 0; i < 7; i++) {
            const d = new Date();
            d.setDate(now.getDate() + i);
            const dayName = d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
            const dateNum = d.getDate();
            const fullDate = d.toISOString().split('T')[0];
            result.push({ name: dayName, date: dateNum, key: fullDate });
        }
        return result;
    }, []);

    useEffect(() => {
        if (days.length > 0 && !selectedDayKey) {
            setSelectedDayKey(days[0].key);
        }
    }, [days, selectedDayKey]);

    useEffect(() => {
        if (selectedDayKey) {
            fetchSchedules(selectedDayKey);
        }
    }, [selectedDayKey]);

    const fetchSchedules = async (date) => {
        setLoading(true);
        try {
            const data = await getAllSchedules(date);
            // Filter only metro transport types
            const metroSchedules = data.filter(s => s.transports?.type?.toLowerCase() === 'metro');
            setSchedules(metroSchedules);
        } catch (err) {
            console.error('Failed to fetch schedules', err);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenBooking = (schedule) => {
        setBookingDetails(schedule);
        setShowModal(true);
    };

    const handleConfirm = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        if (user.token_balance < bookingDetails.current_price) {
            setShowModal(false);
            setPopup('error');
            return;
        }

        setIsBooking(true);
        try {
            // 1. Create the ticket
            await createTicket({
                user_id: user.id,
                schedule_id: bookingDetails.schedule_id,
                price: bookingDetails.current_price
            });

            // 2. Redeem tokens
            const balanceResponse = await redeemTokens(user.id, bookingDetails.current_price);
            
            // 3. Update local user context
            setUser(prev => ({ ...prev, token_balance: balanceResponse.newBalance }));

            setShowModal(false);
            setPopup('success');
        } catch (err) {
            console.error('Booking failed', err);
            alert(err.response?.data?.error || 'Booking failed. Please try again.');
        } finally {
            setIsBooking(false);
        }
    };

    const isInsufficient = bookingDetails && user && user.token_balance < bookingDetails.current_price;

    const formatTime = (isoString) => {
        if (!isoString) return '';
        return new Date(isoString).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    };

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
                    {loading ? (
                        <div className="py-10 text-center text-gray-400">Loading schedules...</div>
                    ) : schedules.length > 0 ? (
                        schedules.map((schedule) => (
                            <div
                                key={schedule.schedule_id}
                                className="flex items-center justify-between rounded-2xl border border-gray-50 bg-white p-6 shadow-[0_2px_15px_rgba(0,0,0,0.04)] hover:-translate-y-0.5 transition-transform duration-200">                                
                                <div className="flex items-center gap-5">
                                    <div>
                                        <p className="text-[0.6rem] font-bold uppercase text-gray-400">From</p>
                                        <p className="text-lg font-extrabold text-[#1a3a4a]">{schedule.routes?.start_station?.name}</p>
                                    </div>
                                    <div className="text-[#6ec1d1]">
                                        <MetroIcon />
                                    </div>
                                    <div>
                                        <p className="text-[0.6rem] font-bold uppercase text-gray-400">To</p>
                                        <p className="text-lg font-extrabold text-[#1a3a4a]">{schedule.routes?.end_station?.name}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex flex-col items-end mr-4">
                                         <span className="text-xs text-gray-400 font-bold">{formatTime(schedule.departure_time)}</span>
                                         {schedule.schedule_status === 'delayed' && (
                                            <span className="text-[10px] text-red-400 font-bold">+{schedule.delay_minutes}m</span>
                                         )}
                                    </div>
                                    <span className="flex items-center gap-1.5 rounded-full bg-orange-50 px-3 py-1 text-sm font-bold text-orange-500">
                                        <TokenIcon size={13} />
                                        {schedule.current_price}
                                    </span>
                                    <Button
                                        onClick={() => handleOpenBooking(schedule)}
                                        className="!w-fit bg-[#1a3a4a] px-8 py-2.5 rounded-xl font-bold transition-transform active:scale-95">
                                        Book
                                    </Button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="py-10 text-center text-gray-400">No metro trips available for this day.</div>
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
                                <span className="text-lg font-bold text-[#1E5470]">{bookingDetails.routes?.start_station?.name}</span>
                            </div>
                            <div className="flex flex-col items-center gap-1 text-[#6ec1d1]">
                                <MetroIcon />
                                <span className="text-[10px] font-bold text-gray-300">Direct</span>
                            </div>
                            <div className="text-center">
                                <span className="block text-[0.65rem] font-bold uppercase text-gray-400">To</span>
                                <span className="text-lg font-bold text-[#1E5470]">{bookingDetails.routes?.end_station?.name}</span>
                            </div>
                        </div>
                        <div className="flex gap-3 mb-6">
                            <div className="flex-1 rounded-2xl bg-orange-50 p-4 text-center">
                                <p className="text-[0.65rem] font-bold uppercase text-orange-400 mb-1">Ticket Price</p>
                                <p className="text-xl font-extrabold text-orange-500 flex items-center justify-center gap-1.5">
                                    <TokenIcon size={16} /> {bookingDetails.current_price}
                                </p>
                            </div>
                            <div className={`flex-1 rounded-2xl p-4 text-center ${isInsufficient ? 'bg-red-50' : 'bg-gray-50'}`}>
                                <p className={`text-[0.65rem] font-bold uppercase mb-1 ${isInsufficient ? 'text-red-400' : 'text-gray-400'}`}>Your Balance</p>
                                <p className={`text-xl font-extrabold flex items-center justify-center gap-1.5 ${isInsufficient ? 'text-red-500' : 'text-[#1E5470]'}`}>
                                    <TokenIcon size={16} /> {user?.token_balance || 0}
                                </p>
                            </div>
                        </div>

                        {isInsufficient && user && (
                            <p className="text-center text-sm font-semibold text-red-400 mb-4 animate-in fade-in duration-200">
                                Not enough tokens for this trip.
                            </p>
                        )}
                        <div className="mb-10 rounded-2xl bg-gray-50 p-4 text-center">
                             <p className="text-[0.65rem] font-bold uppercase text-gray-400 mb-1">Departure Time</p>
                             <p className="font-bold text-[#1E5470]">{formatTime(bookingDetails.departure_time)}</p>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={() => setShowModal(false)}
                                className="flex-1 py-4 font-bold text-gray-400 hover:text-gray-600 transition-colors">
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirm}
                                disabled={isBooking || isInsufficient}
                                className={`flex-1 rounded-2xl py-4 font-bold text-white transition-colors ${
                                    isInsufficient
                                        ? 'bg-red-400 cursor-not-allowed'
                                        : 'bg-[#1E5470] hover:bg-[#16425a]'}`}>
                                {isBooking ? 'Processing...' : isInsufficient ? 'Insufficient Tokens' : 'Confirm'}
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
                                <TokenIcon size={14} /> {user?.token_balance}
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
                                <TokenIcon size={14} /> {user?.token_balance || 0}
                            </span>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setPopup(null)}
                                className="flex-1 py-4 rounded-2xl bg-gray-100 text-gray-500 font-bold hover:bg-gray-200 transition-colors">
                                Dismiss
                            </button>
                            <button
                                onClick={() => { setPopup(null); navigate('/packages'); }}
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
