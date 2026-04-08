import React from 'react';
import { Link } from 'react-router-dom';
import mainLogo from '../../assets/logo1.png';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-section brand">
                    <div className="footer-logo-container">
                        <img src={mainLogo} alt="Wasalni" className="footer-logo-img" />
                        <h2 className="footer-logo-text">asalni</h2>
                    </div>
                    <p>Revolutionizing public transport with seamless bus network and train scheduling.</p>
                </div>
                
                <div className="footer-section links">
                    <h3>Quick Links</h3>
                    <Link to="/home">Home</Link>
                    <Link to="/packages">Buy Tokens</Link>
                    <Link to="/profile">My Profile</Link>
                    <Link to="/about">About Us</Link>
                </div>
                
                <div className="footer-section links">
                    <h3>Services</h3>
                    <Link to="/home">Bus & Train Schedule</Link>
                    <Link to="/active-tickets">Active Tickets</Link>
                    <Link to="/TicketHistory">Ticket History</Link>
                </div>
                
                <div className="footer-section contact">
                    <h3>Contact Us</h3>
                    <p>Email: support@wasalni.tn</p>
                    <p>Phone: +216 555 123 456</p>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} Wasalni Transportation. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;