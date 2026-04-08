import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../App.css';

const About = () => {
    const navigate = useNavigate();

    return (
        <div className="history-page">
            <div className="history-card-container">
                <div className="history-header">
                    <button className="back-btn" onClick={() => navigate(-1)}>
                        &#8592; Back
                    </button>
                    <h2>About Wasalni</h2>
                </div>
                <div className="about-content">
                    <p className="about-intro">
                        Welcome to <strong>Wasalni</strong>, your all-in-one digital transit companion. We are dedicated to modernizing your daily commute by providing a fast, secure, and seamless way to purchase and manage transportation tickets.
                    </p>
                    
                    <div className="about-section">
                        <h3>Our Mission</h3>
                        <p>Our goal is to eliminate the hassle of physical tickets and exact change. With our token-based wallet system, you can easily top up your balance, select your destination, and generate a QR code ticket in just a few taps.</p>
                    </div>

                    <div className="about-section">
                        <h3>How We Operate</h3>
                        <ul className="about-list">
                            <li><strong>Digital Wallet:</strong> Buy token packages safely and track your real-time balance.</li>
                            <li><strong>Instant Booking:</strong> Purchase tickets for trains, buses, and local transits continuously 24/7.</li>
                            <li><strong>QR Boarding:</strong> Your active tickets give you a scannable QR code. Just show it at boarding and proceed!</li>
                        </ul>
                    </div>

                    <div className="about-footer">
                        <p>Have a smooth journey with Wasalni.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
