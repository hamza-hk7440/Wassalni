import React from 'react';
import '../../App.css';

const TicketCard = ({ ticket }) => {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString([], {
            dateStyle: 'medium',
            timeStyle: 'short'
        });
    };

    return (
        <div className="ticket-card">
            <div className={`ticket-top ${ticket.status}`}>
                <span className="transport-type">{ticket.type || 'Transport'}</span>
                <span className="status-badge">{ticket.status}</span>
            </div>
            <div className="ticket-route">
                <div className="station">
                    <label>From</label>
                    <span className="station-name">{ticket.from_station || 'Departure'}</span>
                </div>
                <div className="route-arrow">→</div>
                <div className="station">
                    <label>To</label>
                    <span className="station-name">{ticket.to_station || 'Destination'}</span>
                </div>
            </div>

            <div className="qr-section">
                <div className="qr-placeholder">
                    <div className="qr-box"></div>
                    <p className="qr-text">{ticket.qr_code}</p>
                </div>
            </div>

            <div className="ticket-details">
                <div className="detail">
                    <label>Valid From</label>
                    <span>{formatDate(ticket.valid_from)}</span>
                </div>
                <div className="detail">
                    <label>Expires At</label>
                    <span className="expiry-text">{formatDate(ticket.valid_to)}</span>
                </div>
            </div>
        </div>
    );
};

export default TicketCard;