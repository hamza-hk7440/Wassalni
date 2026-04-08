import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import '../../App.css';

const BusSchedule = () => {
    const navigate = useNavigate();
    const { user, tokens } = useAuth(); 

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [bookingSuccess, setBookingSuccess] = useState(false);
    const mockSchedules = [
        { id: 1, from: 'Monastir City', to: 'Ksar Hellal', departure: '08:00 AM', arrival: '08:45 AM', price: 15, seats: 12 },
        { id: 2, from: 'Monastir City', to: 'Moknine', departure: '09:30 AM', arrival: '10:15 AM', price: 20, seats: 4 },
        { id: 3, from: 'Sahline', to: 'Jemmal', departure: '11:00 AM', arrival: '11:50 AM', price: 25, seats: 0 },
        { id: 4, from: 'Monastir Airport', to: 'Teboulba', departure: '01:15 PM', arrival: '02:00 PM', price: 18, seats: 30 },
        { id: 5, from: 'Ksar Hellal', to: 'Monastir City', departure: '04:00 PM', arrival: '04:45 PM', price: 15, seats: 2 },
    ];
    const filteredSchedules = mockSchedules.filter(route => 
        route.from.toLowerCase().includes(searchQuery.toLowerCase()) || 
        route.to.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const handleBookClick = (route) => {
        setSelectedTicket(route);
        setBookingSuccess(false);
    };
    const confirmBooking = () => {
        setBookingSuccess(true);
        setTimeout(() => {
            setSelectedTicket(null);
            setBookingSuccess(false);
        }, 2500);
    };

    const closeModal = () => {
        setSelectedTicket(null);
        setBookingSuccess(false);
    };

    return (
        <div className="history-page">
            <div className="history-card-container">
                <div className="history-header">
                    <button className="back-btn" onClick={() => navigate(-1)}>
                        &#8592; Back
                    </button>
                    <h2>Bus Schedule</h2>
                </div>

                <div className="filter-bar">
                    <input 
                        type="text" 
                        placeholder="Search destination or departure..." 
                        className="input filter-input"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="schedule-list">
                    {filteredSchedules.length > 0 ? (
                        filteredSchedules.map(route => (
                            <div key={route.id} className="schedule-card">
                                <div className="schedule-route-info">
                                    <div className="station">
                                        <label>From</label>
                                        <span className="station-name">{route.from}</span>
                                    </div>
                                    <div className="route-arrow">→</div>
                                    <div className="station">
                                        <label>To</label>
                                        <span className="station-name">{route.to}</span>
                                    </div>
                                </div>
                                <div className="schedule-time-info">
                                    <div className="detail">
                                        <label>Departure</label>
                                        <span>{route.departure}</span>
                                    </div>
                                    <div className="detail">
                                        <label>Arrival</label>
                                        <span>{route.arrival}</span>
                                    </div>
                                    <div className="detail">
                                        <label>Seats Left</label>
                                        <span style={{ color: route.seats === 0 ? '#d35400' : '#27ae60', fontWeight: 'bold' }}>
                                            {route.seats === 0 ? 'Full' : route.seats}
                                        </span>
                                    </div>
                                </div>
                                <div className="schedule-action">
                                    <span className="route-price">{route.price} Tokens</span>
                                    <button 
                                        className="custom-btn book-btn" 
                                        onClick={() => handleBookClick(route)}
                                        disabled={route.seats === 0}
                                        style={{ opacity: route.seats === 0 ? 0.5 : 1, cursor: route.seats === 0 ? 'not-allowed' : 'pointer' }}
                                    >
                                        {route.seats === 0 ? 'Sold Out' : 'Book Ticket'}
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="empty-history">
                            <p>No bus routes found matching your search.</p>
                        </div>
                    )}
                </div>
            </div>
            {selectedTicket && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        {!bookingSuccess ? (
                            <>
                                <h3>Confirm Booking</h3>
                                <p>Are you sure you want to book a ticket from <strong>{selectedTicket.from}</strong> to <strong>{selectedTicket.to}</strong>?</p>
                                <p className="modal-price">Total Cost: <strong>{selectedTicket.price} Tokens</strong></p>
                                <div className="modal-actions">
                                    <button className="custom-btn cancel-btn" onClick={closeModal}>Cancel</button>
                                    <button className="custom-btn confirm-btn" onClick={confirmBooking}>Confirm Purchase</button>
                                </div>
                            </>
                        ) : (
                            <>
                                <h3 className="success-text">Booking Successful! 🎉</h3>
                                <p>Your ticket has been added to your account.</p>
                                <button className="custom-btn" onClick={closeModal} style={{ marginTop: '20px' }}>Done</button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default BusSchedule;
