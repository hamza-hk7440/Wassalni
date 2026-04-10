import React from 'react';
import { useNavigate } from 'react-router-dom';

const About = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#f8fafc] px-5 py-10 flex flex-col items-center font-sans">
            <div className="w-[95%] max-w-[1100px] bg-white p-6 md:p-11 rounded-[25px] shadow-[0_10px_30px_rgba(0,0,0,0.05)]">
                <div className="flex items-center gap-5 mb-9 pb-5 border-b-2 border-[#f1f5f9]">
                    <button 
                        onClick={() => navigate(-1)} 
                        className="flex items-center bg-transparent border-none text-[#1E5470] text-base font-semibold cursor-pointer transition-opacity hover:opacity-70"
                    >
                        ← Back
                    </button>
                    <h2 className="text-[2.2rem] font-bold text-[#1E5470] m-0">About Wasalni</h2>
                </div>

                <div className="text-[#4a5568] leading-[1.8]">
                    <p className="text-[1.1rem] mb-[30px] text-[#2d3748]">
                        Welcome to <strong className="text-[#1E5470]">Wasalni</strong>, your all-in-one digital companion for modern transportation in Tunisia. We bridge the gap between traditional transit and digital convenience.
                    </p>

                    <div className="mb-[35px]">
                        <h3 className="flex items-center text-[1.4rem] font-bold text-[#1E5470] mb-3 after:content-[''] after:flex-1 after:h-[1px] after:bg-[#e2e8f0] after:ml-[15px]">
                            Our Mission
                        </h3>
                        <p>
                            To simplify daily commutes by providing a unified platform for bus and metro schedules, 
                            real-time seat availability, and a secure digital token payment system.
                        </p>
                    </div>
                    <div className="mb-[35px]">
                        <h3 className="flex items-center text-[1.4rem] font-bold text-[#1E5470] mb-3 after:content-[''] after:flex-1 after:h-[1px] after:bg-[#e2e8f0] after:ml-[15px]">
                            Core Features
                        </h3>
                        <ul className="list-none p-0">
                            {[
                                { title: "Digital Wallet", desc: "Recharge tokens easily and pay for your rides without carrying cash." },
                                { title: "Real-time Schedules", desc: "Access the latest bus and metro timings updated daily." },
                                { title: "Smart Booking", desc: "Reserve your seat in seconds and manage your active tickets." }
                            ].map((feature, idx) => (
                                <li 
                                    key={idx} 
                                    className="bg-[#f8fafc] mb-3 p-[15px] rounded-[10px] border-l-4 border-[#6EC1D1] transition-transform duration-200 hover:translate-x-[5px] hover:bg-[#f1f5f9]"
                                >
                                    <strong className="block mb-1 text-[#1E5470]">{feature.title}</strong>
                                    <span className="text-sm">{feature.desc}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="mt-[50px] pt-5 border-t border-[#f1f5f9] text-center">
                        <p className="italic text-[#718096] font-medium">
                            Wasalni — Moving Tunisia forward, one token at a time.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;