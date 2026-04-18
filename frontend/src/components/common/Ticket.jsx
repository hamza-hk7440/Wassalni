import React, { useState } from 'react';

const TicketCard = ({ ticket }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString([], {
            dateStyle: 'medium',
            timeStyle: 'short'
        });
    };

    const statusStyles = {
        valid: "bg-gradient-to-r from-[#6ec1d1] to-[#4da8ba]",
        active: "bg-gradient-to-r from-[#6ec1d1] to-[#4da8ba]",
        used: "bg-[#e53e3e]", 
        expired: "bg-[#94a3b8]",
        refunded: "bg-[#f39c12]"
    };

    const toggleModal = () => setIsModalOpen(!isModalOpen);

    return (
        <>
            <div 
                onClick={toggleModal}
                className={`relative mx-auto mb-5 w-full max-w-[750px] overflow-hidden rounded-[15px] border border-[#e2e8f0] bg-white shadow-[0_8px_20px_rgba(0,0,0,0.08)] cursor-pointer transition-transform hover:scale-[1.01] active:scale-100 
                ${ticket.status === 'expired' || (ticket.status === 'used' && false) ? 'grayscale-[0.8] opacity-60' : ''}`}>
                <div className={`flex items-center justify-between px-[25px] py-3 text-[0.8rem] font-bold uppercase tracking-[1.2px] text-white ${statusStyles[ticket.status] || 'bg-gray-500'}`}>
                    <span>{ticket.type || 'Transport'}</span>
                    <span className="rounded-[20px] bg-white/20 px-3 py-1 text-[0.7rem] backdrop-blur-[4px]">
                        {ticket.status}
                    </span>
                </div>
                <div className="relative flex items-center justify-around border-b-2 border-dashed border-[#e2e8f0] bg-white px-[30px] py-5">
                    <div className="absolute -bottom-[11px] -left-[11px] z-[2] h-5 w-5 rounded-full border border-[#e2e8f0] bg-[#f8fafc]"></div>
                    <div className="text-center">
                        <label className="block text-[0.65rem] font-bold uppercase text-[#94a3b8]">From</label>
                        <span className="text-[1.2rem] font-extrabold text-[#1e5470]">{ticket.from_station || 'Departure'}</span>
                    </div>
                    <div className={`text-[1.3rem] font-bold ${ticket.status === 'used' ? 'text-[#e53e3e]' : 'text-[#6ec1d1]'}`}>→</div>
                    <div className="text-center">
                        <label className="block text-[0.65rem] font-bold uppercase text-[#94a3b8]">To</label>
                        <span className="text-[1.2rem] font-extrabold text-[#1e5470]">{ticket.to_station || 'Destination'}</span>
                    </div>
                    <div className="absolute -bottom-[11px] -right-[11px] z-[2] h-5 w-5 rounded-full border border-[#e2e8f0] bg-[#f8fafc]"></div>
                </div>
                <div className="flex flex-col items-center bg-white p-5">
                    <div className="flex items-center gap-5">
                        <div className="relative flex h-20 w-20 items-center justify-center rounded-lg border-[6px] border-[#f1f5f9] bg-[#f1f5f9]">
                            {ticket.qr_image ? (
                                <img src={ticket.qr_image} alt="QR Code" className="w-full h-full object-contain" />
                            ) : (
                                <div className="font-bold text-[#cbd5e1]">QR</div>
                            )}
                            {(ticket.status === 'refunded' || ticket.status === 'used') && (
                                <div className="absolute inset-0 flex items-center justify-center bg-[#f1f5f9]/80 text-[0.8rem] font-bold text-[#e53e3e]">
                                    {ticket.status === 'used' ? 'USED' : 'VOID'}
                                </div>
                            )}
                        </div>
                        <div>
                            <p className="m-0 font-mono text-base tracking-[2px] text-[#64748b]">
                                {ticket.qr_code}
                            </p>
                            <p className={`text-[0.65rem] font-bold uppercase mt-1 ${ticket.status === 'used' ? 'text-[#e53e3e]' : 'text-[#6ec1d1]'}`}>
                                {ticket.status === 'used' ? 'Ticket Processed' : 'Click to enlarge'}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex justify-between border-t border-[#e2e8f0] bg-[#f8fafc] px-[30px] py-[15px]">
                    <div className="flex flex-col">
                        <label className="text-[0.6rem] font-bold uppercase text-[#94a3b8]">Valid From</label>
                        <span className="text-[0.85rem] font-semibold text-[#475569]">{formatDate(ticket.valid_from)}</span>
                    </div>
                    <div className="flex flex-col text-right">
                        <label className="text-[0.6rem] font-bold uppercase text-[#94a3b8]">Expires At</label>
                        <span className={`text-[0.85rem] font-semibold ${ticket.status === 'expired' || ticket.status === 'used' ? 'font-extrabold text-[#e53e3e]' : 'text-[#2c3e50]'}`}>
                            {formatDate(ticket.valid_to)}
                        </span>
                    </div>
                </div>
            </div>
            {isModalOpen && (
                <div 
                    className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-5 animate-in fade-in duration-200"
                    onClick={toggleModal}>
                    <div 
                        className="relative flex flex-col items-center bg-white p-8 rounded-[30px] shadow-2xl max-w-sm w-full animate-in zoom-in-95 duration-200"
                        onClick={(e) => e.stopPropagation()} >
                        <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl font-bold" onClick={toggleModal}>✕</button>
                        <h3 className={`font-bold text-lg mb-2 ${ticket.status === 'used' ? 'text-[#e53e3e]' : 'text-[#1e5470]'}`}>
                            {ticket.status === 'used' ? 'Ticket Already Used' : 'Scan Ticket'}
                        </h3>
                        <p className="text-gray-400 text-sm mb-6 text-center">
                            {ticket.status === 'used' ? 'This ticket has been scanned and is no longer valid for travel.' : 'Present this to the driver or scanner'}
                        </p>
                        <div className="relative flex h-56 w-56 items-center justify-center rounded-2xl border-[12px] border-[#f1f5f9] bg-[#f1f5f9] mb-6">
                            {ticket.qr_image ? (
                                <img src={ticket.qr_image} alt="QR Code" className="w-full h-full object-contain" />
                            ) : (
                                <div className="text-4xl font-bold text-[#cbd5e1]">QR</div>
                            )}
                            {(ticket.status === 'refunded' || ticket.status === 'used') && (
                                <div className="absolute inset-0 flex items-center justify-center bg-[#f1f5f9]/80 text-xl font-bold text-[#e53e3e]">
                                    {ticket.status === 'used' ? 'USED' : 'VOID'}
                                </div>
                            )}
                        </div>
                        <div className="text-center">
                            <span className="block font-mono text-xl tracking-[4px] font-bold text-[#1e5470]">{ticket.qr_code}</span>
                            <span className="text-xs text-gray-400 mt-1 block uppercase font-bold tracking-widest">{ticket.type} Ticket</span>
                        </div>
                        <button onClick={toggleModal} className={`mt-8 w-full py-3 text-white rounded-xl font-bold transition-colors ${ticket.status === 'used' ? 'bg-[#e53e3e] hover:bg-red-700' : 'bg-[#1e5470] hover:bg-[#1a4a63]'}`}>Done</button>
                    </div>
                </div>
            )}
        </>
    );
};

export default TicketCard;