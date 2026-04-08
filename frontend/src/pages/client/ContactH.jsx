import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../App.css';

const Contact = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
    const [status, setStatus] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // test
        setStatus('sending');
        setTimeout(() => {
            setStatus('success');
            setFormData({ name: '', email: '', subject: '', message: '' });
            setTimeout(() => setStatus(''), 4000);
        }, 1500);
    };

    return (
        <div className="history-page">
            <div className="history-card-container contact-container">
                <div className="history-header">
                    <button className="back-btn" onClick={() => navigate(-1)}>
                        &#8592; Back
                    </button>
                    <h2>Contact Us</h2>
                </div>
                
                <div className="contact-content">
                    <p className="about-intro">
                        Have a question or need assistance with your travels? We'd love to hear from you. Fill out the form below and our team will get back to you shortly.
                    </p>

                    {status === 'success' && (
                        <div className="success-banner">
                            ✅ Your message has been sent successfully! We'll be in touch soon.
                        </div>
                    )}

                    <form className="contact-form" onSubmit={handleSubmit}>
                        <div className="form-group-row">
                            <div className="form-group">
                                <label>Full Name</label>
                                <input 
                                    className="input" 
                                    type="text" 
                                    name="name" 
                                    placeholder="Jane Doe" 
                                    value={formData.name}
                                    onChange={handleChange}
                                    required 
                                />
                            </div>
                            <div className="form-group">
                                <label>Email Address</label>
                                <input 
                                    className="input" 
                                    type="email" 
                                    name="email" 
                                    placeholder="jane@example.com" 
                                    value={formData.email}
                                    onChange={handleChange}
                                    required 
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Subject</label>
                            <input 
                                className="input" 
                                type="text" 
                                name="subject" 
                                placeholder="How can we help?" 
                                value={formData.subject}
                                onChange={handleChange}
                                required 
                            />
                        </div>

                        <div className="form-group">
                            <label>Message</label>
                            <textarea 
                                className="input contact-textarea" 
                                name="message" 
                                rows="5" 
                                placeholder="Start typing your message here..."
                                value={formData.message}
                                onChange={handleChange}
                                required
                            ></textarea>
                        </div>

                        <button 
                            type="submit" 
                            className="custom-btn contact-submit-btn" 
                            disabled={status === 'sending'}
                        >
                            {status === 'sending' ? 'Sending...' : 'Send Message'}
                        </button>
                    </form>

                    <div className="contact-info-boxes">
                        <div className="info-box">
                            <span className="info-icon">📍</span>
                            <h4>Location</h4>
                            <p>123 Transit Hub, Monastir, Tunisia</p>
                        </div>
                        <div className="info-box">
                            <span className="info-icon">📧</span>
                            <h4>Email Support</h4>
                            <p>support@wasalni.tn</p>
                        </div>
                        <div className="info-box">
                            <span className="info-icon">📞</span>
                            <h4>Call Us</h4>
                            <p>+216 555 123 456</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
