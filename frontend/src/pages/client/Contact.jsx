import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Contact = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
    const [status, setStatus] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setStatus('sending');
        setTimeout(() => {
            setStatus('success');
            setFormData({ name: '', email: '', subject: '', message: '' });
            setTimeout(() => setStatus(''), 4000);
        }, 1500);
    };

    const inputClasses = "w-full px-4 py-3 rounded-xl border border-[#e1e9f5] outline-none focus:border-[#6EC1D1] focus:ring-4 focus:ring-[#6EC1D1]/10 transition-all placeholder:text-gray-300";

    return (
        <div className="min-h-screen bg-[#f8fafc] px-5 py-10 flex flex-col items-center font-sans">
            <div className="w-[95%] max-w-[1100px] bg-white p-6 md:p-11 rounded-[25px] shadow-[0_10px_30px_rgba(0,0,0,0.05)]">
                
                <div className="fle items-center gap-5 mb-9 pb-5 border-b-2 border-[#f1f5f9]">
                    <button 
                        onClick={() => navigate(-1)} 
                        className="text-[#1E5470] font-semibold hover:opacity-70 transition-opacity"
                    >
                        ← Back
                    </button>
                    <h2 className="text-3xl font-bold text-[#1E5470]">Contact Us</h2>
                </div>

                <div className="max-w-[800px] mx-auto">
                    <p className="text-[#4a5568] text-[1.1rem] leading-relaxed mb-8 text-center">
                        Have a question or need assistance with your travels? We'd love to hear from you. 
                        Fill out the form below and our team will get back to you shortly.
                    </p>
                    {status === 'success' && (
                        <div className="mb-6 p-4 bg-[#f0fdf4] border border-[#bcf0da] text-[#166534] rounded-xl text-center animate-in fade-in zoom-in duration-300">
                            ✅ Your message has been sent successfully! We'll be in touch soon.
                        </div>
                    )}
                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-[#1E5470] ml-1">Full Name</label>
                                <input 
                                    className={inputClasses} 
                                    type="text" 
                                    name="name" 
                                    placeholder="Jane Doe" 
                                    value={formData.name}
                                    onChange={handleChange}
                                    required 
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-[#1E5470] ml-1">Email Address</label>
                                <input 
                                    className={inputClasses} 
                                    type="email" 
                                    name="email" 
                                    placeholder="jane@example.com" 
                                    value={formData.email}
                                    onChange={handleChange}
                                    required 
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-[#1E5470] ml-1">Subject</label>
                            <input 
                                className={inputClasses} 
                                type="text" 
                                name="subject" 
                                placeholder="How can we help?" 
                                value={formData.subject}
                                onChange={handleChange}
                                required 
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-[#1E5470] ml-1">Message</label>
                            <textarea 
                                className={`${inputClasses} resize-none`} 
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
                            disabled={status === 'sending'}
                            className="w-full py-4 bg-[#1E5470] text-white font-bold rounded-xl shadow-lg hover:bg-[#1a4a63] disabled:bg-gray-400 disabled:cursor-not-allowed transition-all transform active:scale-[0.98]"
                        >
                            {status === 'sending' ? 'Sending...' : 'Send Message'}
                        </button>
                    </form>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
                        {[
                            { icon: "📍", title: "Location", detail: "123 Transit Hub, Monastir, Tunisia" },
                            { icon: "📧", title: "Email Support", detail: "support@wasalni.tn" },
                            { icon: "📞", title: "Call Us", detail: "+216 555 123 456" }
                        ].map((info, idx) => (
                            <div key={idx} className="bg-[#f8fafc] p-6 rounded-2xl border border-[#f1f5f9] text-center hover:shadow-md transition-shadow">
                                <span className="text-2xl mb-2 block">{info.icon}</span>
                                <h4 className="font-bold text-[#1E5470] mb-1">{info.title}</h4>
                                <p className="text-sm text-gray-500">{info.detail}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
