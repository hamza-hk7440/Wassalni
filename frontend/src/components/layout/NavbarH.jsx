import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import tokenLogo from '../../assets/token_logo.png';
import mainLogo from '../../assets/logo1.png';
import useAuth from '../../hooks/useAuth';
import avatar from '../../assets/default_pfp.png';

const Navbar = () => {
    const { tokens, user } = useAuth();
    const location = useLocation();
    const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

    return (
        <nav className="sticky top-0 z-[1000] flex items-center justify-between bg-white px-[5%] py-3 shadow-[0_4px_12px_rgba(0,0,0,0.05)] border-b border-[#eef5f9]">
            <Link 
                to={isAuthPage ? "#" : (user ? "/client" : "/login")} 
                onClick={(e) => isAuthPage && e.preventDefault()}
                className={`flex items-center gap-0 text-[1.8rem] font-extrabold tracking-wider text-[#1e5470] no-underline transition-all ${
                    isAuthPage 
                        ? "pointer-events-none cursor-default opacity-90" 
                        : "cursor-pointer hover:opacity-80 active:scale-95"
                }`}>
                <img src={mainLogo} alt="Wasalni Logo" className="h-10 w-auto object-contain" />
                <span className="ml-[-2px]">asalni</span>
            </Link>

            <div className="flex items-center gap-8 font-sans">
                {!isAuthPage && user && (
                    <>
                        <div className="hidden md:flex items-center gap-8">
                            <Link to="/client" className={`text-[0.95rem] font-semibold no-underline transition-colors hover:text-[#1e5470] ${location.pathname === '/client' ? 'text-[#1e5470]' : 'text-[#34729c]'}`}>
                                Home
                            </Link>
                            <Link to="/active-tickets" className="relative text-[0.95rem] font-semibold text-[#34729c] no-underline transition-colors hover:text-[#1e5470] flex items-center gap-1">
                                My Tickets
                                <span className="flex h-2 w-2 rounded-full bg-[#27ae60]"></span>
                            </Link>

                            <Link to="/about" className="text-[0.95rem] font-semibold text-[#34729c] no-underline transition-colors hover:text-[#1e5470]">
                                About
                            </Link>
                            <Link to="/contact" className="text-[0.95rem] font-semibold text-[#34729c] no-underline transition-colors hover:text-[#1e5470]">
                                Contact Us
                            </Link>
                        </div>

                        <Link 
                            to="/packages" 
                            className="flex items-center gap-2 rounded-[50px] border border-[#d1ecff] bg-[#f0f8ff] px-3.5 py-1.5 no-underline transition-all hover:scale-105 hover:shadow-sm"
                            title="Buy Tokens">
                            <img src={tokenLogo} alt="token" className="h-6 w-6" />
                            <span className="text-[1.1rem] font-extrabold text-[#1e5470]">
                                {tokens?.toLocaleString() || 0}
                            </span>
                            <div className="ml-2 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[#3b759f] text-[12px] font-bold text-white shadow-inner">
                                +
                            </div>
                        </Link>
                        
                        <Link to="/profile" className="flex items-center group">
                            <img 
                                src={avatar} 
                                alt="avatar" 
                                className="h-[38px] w-[38px] rounded-full border-2 border-[#d1ecff] object-cover transition-all group-hover:border-[#3c78a1] group-hover:shadow-md" 
                            />
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;