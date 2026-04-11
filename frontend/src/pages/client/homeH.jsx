import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import busIcon from '../../assets/bus.png';
import metroIcon from '../../assets/metro.png';
import Button from '../../components/common/Button';

const HomeH = () => {
    const navigate = useNavigate();
    const [showMetroModal, setShowMetroModal] = useState(false);

    const handleMetroSelect = (direction) => {
        setShowMetroModal(false);
        navigate('/metroSchedule', { state: { trajectory: direction } });
    };

    return (
        <div className="flex flex-col min-h-screen bg-[#f4f9fc] font-sans">
            <main className="flex-1 px-[10%] py-16 text-center">
                <section className="mb-5 rounded-b-[50px] bg-gradient-to-b from-[#6ec1d11a] to-transparent px-5 py-[60px] pb-10 text-center">
                    <div className="mb-5 inline-block rounded-[100px] bg-[#1e54701a] px-5 py-2 text-[0.9rem] font-bold uppercase tracking-widest text-[#1e5470]">
                        Welcome to Wasalni
                    </div>
                    <h1 className="mb-4 text-[2.8rem] font-extrabold text-[#1e5470]">
                        Your Journey Starts Here
                    </h1>
                    <p className="mx-auto max-w-[600px] text-[1.1rem] leading-relaxed text-[#718096]">
                        Experience the future of public transport in Tunisia. <br />
                        Fast, reliable, and entirely digital.
                    </p>
                </section>
                <header className="mt-5">
                    <h2 className="text-[2.2rem] font-bold text-[#1e5470]">Where are you going today?</h2>
                    <p className="mt-2 text-[1.1rem] text-[#718096]">
                        Select your preferred mode of transport to view live schedules.
                    </p>
                </header>
                <div className="mt-12 flex flex-wrap justify-center gap-8">
                    <div 
                        className="group flex w-[250px] cursor-pointer flex-col items-center rounded-[25px] bg-white p-12 shadow-[0_10px_30px_rgba(52,114,156,0.1)] transition-all hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(38,82,112,0.2)] border-2 border-transparent hover:border-[#34729C]"
                        onClick={() => navigate('/busSchedule')}
                    >
                        <div className="mb-4 flex items-center justify-center">
                            <img src={busIcon} alt="Bus" className="h-auto w-[60px] object-contain" />
                        </div>
                        <h3 className="text-xl font-bold text-[#1e5470]">Bus Services</h3>
                    </div>
                    <div 
                        className="group flex w-[250px] cursor-pointer flex-col items-center rounded-[25px] bg-white p-12 shadow-[0_10px_30px_rgba(52,114,156,0.1)] transition-all hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(38,82,112,0.2)] border-2 border-transparent hover:border-[#34729C]"
                        onClick={() => setShowMetroModal(true)}
                    >
                        <div className="mb-4 flex items-center justify-center">
                            <img src={metroIcon} alt="Metro" className="h-auto w-[60px] object-contain" />
                        </div>
                        <h3 className="text-xl font-bold text-[#1e5470]">Train Lines</h3>
                    </div>
                </div>
                <section className="mt-[60px] rounded-[24px] bg-white/50 px-5 py-10 text-center">
                    <h2 className="mb-8 text-[1.8rem] text-[#1e5470]">How to use Wasalni</h2>
                    <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-[30px]">
                        <div className="flex flex-col items-center">
                            <div className="mb-[15px] flex h-10 w-10 items-center justify-center rounded-full bg-[#1e5470] text-xl font-bold text-white shadow-[0_4px_10px_rgba(30,84,112,0.2)]">1</div>
                            <h4 className="mb-2.5 font-bold text-[#1e5470]">Pick Transport</h4>
                            <p className="text-[0.9rem] leading-relaxed text-[#718096]">Choose between Bus or Train services to see available routes.</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="mb-[15px] flex h-10 w-10 items-center justify-center rounded-full bg-[#1e5470] text-xl font-bold text-white shadow-[0_4px_10px_rgba(30,84,112,0.2)]">2</div>
                            <h4 className="mb-2.5 font-bold text-[#1e5470]">Check Schedule</h4>
                            <p className="text-[0.9rem] leading-relaxed text-[#718096]">Find the best departure time and check for available seats.</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="mb-[15px] flex h-10 w-10 items-center justify-center rounded-full bg-[#1e5470] text-xl font-bold text-white shadow-[0_4px_10px_rgba(30,84,112,0.2)]">3</div>
                            <h4 className="mb-2.5 font-bold text-[#1e5470]">Book with Tokens</h4>
                            <p className="text-[0.9rem] leading-relaxed text-[#718096]">Use your digital tokens to secure your seat instantly.</p>
                        </div>
                    </div>
                </section>
                {showMetroModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                        <div className="w-[90%] max-w-[400px] rounded-[20px] bg-white p-8 shadow-xl">
                            <h3 className="mb-2 text-2xl font-bold text-[#1e5470]">Select Trajectory</h3>
                            <p className="mb-6 text-[#718096]">Choose your direction for the Sahel Metro:</p>
                            
                            <div className="flex flex-col gap-3">
                                <button 
                                    className="w-full rounded-xl bg-[#f0f7ff] py-4 font-semibold text-[#1e5470] transition-colors hover:bg-[#1e5470] hover:text-white"
                                    onClick={() => handleMetroSelect('Monastir-Mahdia')}
                                >
                                    Monastir → Mahdia
                                </button>
                                <button 
                                    className="w-full rounded-xl bg-[#f0f7ff] py-4 font-semibold text-[#1e5470] transition-colors hover:bg-[#1e5470] hover:text-white"
                                    onClick={() => handleMetroSelect('Mahdia-Monastir')}
                                >
                                    Mahdia → Monastir
                                </button>
                                <Button 
                                    className="mt-2"
                                    onClick={() => setShowMetroModal(false)}
                                >
                                    Back
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default HomeH;