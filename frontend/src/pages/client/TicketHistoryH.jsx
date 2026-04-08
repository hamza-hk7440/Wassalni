import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import TicketCard from '../../components/common/Ticket';
import '../../App.css';

const TicketHistory = () => {
    const navigate = useNavigate();
    const [history, setHistory] = useState([]);
    const [searchTarget, setSearchTarget] = useState('');
    const [dateFilter, setDateFilter] = useState('');

    useEffect(() => {
        const mockData = [
            {
                id: 101, booking_id: "B-001", qr_code: "W-1122",
                issued_at: "2026-03-01 10:00", valid_from: "2026-03-02 08:00", valid_to: "2026-03-02 20:00",
                from_station: "Central Station", to_station: "North Park",
                status: "used", type: "Bus"
            },
            {
                id: 102, booking_id: "B-002", qr_code: "W-3344",
                issued_at: "2026-02-15 14:00", valid_from: "2026-02-16 09:00", valid_to: "2026-02-16 21:00",
                from_station: "Downtown", to_station: "Airport",
                status: "expired", type: "Train"
            },
            {
                id: 103, booking_id: "B-003", qr_code: "W-5566",
                issued_at: "2026-03-10 11:00", valid_from: "2026-03-11 07:00", valid_to: "2026-03-11 19:00",
                from_station: "West End", to_station: "Central Station",
                status: "used", type: "Bus"
            },
            {
                id: 104, booking_id: "B-004", qr_code: "W-7788",
                issued_at: "2026-04-01 10:00", valid_from: "2026-04-02 08:00", valid_to: "2026-04-02 20:00",
                from_station: "South Station", to_station: "North Park",
                status: "active", type: "Bus"
            }
        ];
        setHistory(mockData);
    }, []);
    const filteredHistory = history.filter(ticket => {
        const matchesDestination = ticket.to_station?.toLowerCase().includes(searchTarget.toLowerCase());
        const matchesDate = dateFilter ? ticket.valid_from.startsWith(dateFilter) : true;
        return matchesDestination && matchesDate;
    });

    return (
        <div className="history-page">
            <div className="history-card-container">
                <div className="history-header">
                    <button className="back-btn" onClick={() => navigate(-1)}>
                        &#8592; Back
                    </button>
                    <h2>Ticket History</h2>
                </div>

                <div className="filter-bar">
                    <input
                        type="text"
                        placeholder="Search by destination..."
                        className="input filter-input"
                        value={searchTarget}
                        onChange={(e) => setSearchTarget(e.target.value)}
                    />
                    <input
                        type="date"
                        className="input filter-date"
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                    />
                </div>

                {filteredHistory.length > 0 ? (
                    <div className="tickets-grid">
                        {filteredHistory.map(ticket => (
                            <TicketCard key={ticket.id} ticket={ticket} />
                        ))}
                    </div>
                ) : (
                    <div className="empty-history">
                        <p>No tickets matching your criteria were found.</p>
                        <p>Ready for your next journey? <Link to="/packages" className="link-btn">View Packages</Link></p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TicketHistory;
