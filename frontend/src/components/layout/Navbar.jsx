import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
    <div className="fixed inset-0  z-30 "
          onClick={() => setIsOpen(false)} style={{ backgroundColor: isOpen ? 'rgba(0, 0, 0, 0.5)' : 'transparent' }}></div>
      {/* hadhi lbar lfo9ania  */}
      <div className='fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-100 z-30 
      flex items-center px-8 shadow-sm justify-between'>      
        <h1 className="text-blue-600 text-xl font-black tracking-tight ml-16">
          TRANSPORT<span className="text-slate-400 font-light">PRO</span>
        </h1>
        <div className="flex items-center gap-4 text-slate-500 text-sm font-medium">
            Admin Panel
        </div>
      </div>

      {/* bottonati ili y7ilo w ysakrou lbar 3la jnab */}
      {!isOpen ? (  
        <button className="fixed top-3.5 left-4 z-50 p-2 bg-slate-50 text-slate-600 rounded-lg 
        hover:bg-blue-50 hover:text-blue-600 transition-all border border-slate-200" 
        onClick={() => setIsOpen(true)}>
          <span className="">☰</span>
        </button>
      ) : (  
        <button className="fixed top-3.5 left-4 z-50 p-2 bg-red-50 text-red-600 rounded-lg 
        hover:bg-red-100 transition-all border border-red-100" 
        onClick={() => setIsOpen(false)}>
          <span className="text-xl">✕</span>
        </button>
      )}   

      {/* lbar 3la jnab */}
      <nav className={`fixed inset-y-0 left-0 w-72 bg-white shadow-2xl z-40 transform transition-transform duration-500  ${
        isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        <div className="flex flex-col h-full p-6 pt-24">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-6">Menu Principal</p>
          
          <ul className="flex flex-col space-y-2 flex-grow">
            <li>
              <Link to="/client" onClick={() => setIsOpen(false)} 
                className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all duration-200 font-semibold group">
                <span className="group-hover:scale-120 transition-transform">👤</span> Client
              </Link>
            </li>
            <li>
              <Link to="/controleur" onClick={() => setIsOpen(false)} 
                className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all duration-200 font-semibold group">
                <span className="group-hover:scale-120 transition-transform">👨‍💼</span> Contrôleur
              </Link>
            </li>
            <li>
              <Link to="/NvAdmin" onClick={() => setIsOpen(false)} 
                className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all duration-200 font-semibold group">
                <span className="group-hover:scale-120 transition-transform">⚙️</span> Nouveau Admin
              </Link>
            </li>
            <li>
              <Link to="/transport" onClick={() => setIsOpen(false)} 
                className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all duration-200 font-semibold group">
                <span className="group-hover:scale-120 transition-transform">🚌</span> Transport
              </Link>
            </li>
            <li>
              <Link to="/ticket" onClick={() => setIsOpen(false)} 
                className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all duration-200 font-semibold group">
                <span className="group-hover:scale-120 transition-transform">🎫</span> Ticket
              </Link>
            </li>
          </ul>

          
          <div className="mt-auto pt-6 border-t border-slate-100">
            <Link to="/login" onClick={() => setIsOpen(false)} 
              className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200 font-bold group">
              <span className="group-hover:rotate-12 transition-transform">🚪</span> Deconnexion
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;