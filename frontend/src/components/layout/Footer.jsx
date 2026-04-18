import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import mainLogo from '../../assets/logo1.png';

const Footer = () => {
    const location = useLocation();
    const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
    const handleDisabledClick = (e) => {
        if (isAuthPage) e.preventDefault();
    };

    const linkStyles = `text-[0.95rem] text-[#C8E1EC] no-underline transition-all ${
        isAuthPage 
            ? "pointer-events-none cursor-default opacity-50" 
            : "hover:text-white hover:translate-x-1 cursor-pointer"
    }`;

    return (
        <footer className="bg-[#1E5470] text-[#D1ECFF] px-[5%] py-16 pb-8 font-sans border-t-4 border-[#34729C]">
            <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1.5fr] gap-12 max-w-[1200px] mx-auto">
                <div className="flex flex-col">
                    <div className={`flex items-center gap-2.5 mb-5 ${isAuthPage ? "opacity-70" : ""}`}>
                        <img 
                            src={mainLogo} 
                            alt="Wasalni Logo" 
                            className="h-[35px] w-auto object-contain brightness-0 invert" 
                        />
                        <span className="text-[1.6rem] font-extrabold text-white tracking-tighter">
                            asalni
                        </span>
                    </div>
                    <p className="text-[0.9rem] leading-relaxed text-[#C8E1EC] max-w-[280px] m-0">
                        Revolutionizing public transport with a seamless bus network and train scheduling.
                    </p>
                </div>
                <div className="flex flex-col">
                    <h3 className="text-[#6EC1D1] mb-6 text-[1.1rem] font-bold uppercase tracking-widest">
                        Quick Links
                    </h3>
                    <div className="flex flex-col gap-3">
                        <Link to="/Home" onClick={handleDisabledClick} className={linkStyles}>Home</Link>
                        <Link to="/packages" onClick={handleDisabledClick} className={linkStyles}>Buy Tokens</Link>
                        <Link to="/profile" onClick={handleDisabledClick} className={linkStyles}>My Profile</Link>
                        <Link to="/about" onClick={handleDisabledClick} className={linkStyles}>About Us</Link>
                    </div>
                </div>
                <div className="flex flex-col">
                    <h3 className="text-[#6EC1D1] mb-6 text-[1.1rem] font-bold uppercase tracking-widest">
                        Services
                    </h3>
                    <div className="flex flex-col gap-3">
                        <Link to="/busSchedule" onClick={handleDisabledClick} className={linkStyles}>Bus Schedule</Link>
                        <Link to="/metroSchedule" onClick={handleDisabledClick} className={linkStyles}>Metro Schedule</Link>
                        <Link to="/active-tickets" onClick={handleDisabledClick} className={linkStyles}>Active Tickets</Link>
                        <Link to="/history" onClick={handleDisabledClick} className={linkStyles}>Ticket History</Link>
                    </div>
                </div>
                <div className="flex flex-col">
                    <h3 className="text-[#6EC1D1] mb-6 text-[1.1rem] font-bold uppercase tracking-widest">
                        Contact Us
                    </h3>
                    <div className="flex flex-col gap-3 text-[0.95rem]">
                        <p className="flex flex-col m-0">
                            <span className="text-[#6EC1D1] font-semibold">Email:</span>
                            support@wasalni.tn
                        </p>
                        <p className="flex flex-col m-0 mt-3">
                            <span className="text-[#6EC1D1] font-semibold">Phone:</span>
                            +216 555 123 456
                        </p>
                    </div>
                </div>
            </div>
            <div className="text-center mt-16 pt-8 border-t border-[#6cb1da33] text-[0.85rem] text-[#d1ecff99]">
                <p>&copy; {new Date().getFullYear()} Wasalni Transport. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;