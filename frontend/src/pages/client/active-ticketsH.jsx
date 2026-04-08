import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TicketCard from '../../components/common/Ticket';
import '../../App.css';

const ActiveTickets = () => {
    const navigate = useNavigate();
    const [tickets, setTickets] = useState([]);

    useEffect(() => {
        setTickets([
            { id: 1, qr_code: "W-8821", valid_from: "2026-04-04 08:00", valid_to: "2026-04-04 20:00", status: "active", type: "Bus", from_station: "Central Station", to_station: "North Park" },
            { id: 2, qr_code: "W-9942", valid_from: "2026-04-05 09:00", valid_to: "2026-04-05 21:00", status: "active", type: "Train", from_station: "Downtown", to_station: "Airport" }
        ]);
    }, []);

    return (
        <div className="history-page">
            <div className="history-card-container">
                <div className="history-header">
                    <button className="back-btn" onClick={() => navigate(-1)}>
                        &#8592; Back
                    </button>
                    <h2>Active Tickets</h2>
                </div>
                {tickets.length > 0 ? (
                    <div className="tickets-grid">
                        {tickets.map(t => <TicketCard key={t.id} ticket={t} />)}
                    </div>
                ) : (
                    <div className="empty-history">
                        <p>You have no active tickets right now.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
export default ActiveTickets;