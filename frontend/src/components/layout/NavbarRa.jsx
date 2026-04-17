import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import palette from '../common/pallette';
import { useAuth } from '../../hooks/useAuth';


function Navbar() {
  const navigator = useNavigate();
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifications = [{ id: 1, title: 'Nouveau ticket validé', detail: 'Ticket traité', time: '2 min' },
    { id: 2, title: 'Admin créé', detail: 'Compte admin ajouté', time: '10 min' },
    { id: 3, title: 'Maintenance', detail: 'Vérification bus 12', time: '1 h' },];

  const states = {
    nom: user?.last_name || "Utilisateur",
    prenom: user?.first_name || "",
    email: user?.email || "",
    role: user?.role || "Utilisateur"
  };

  const closeAllPanels = () => {
    setIsOpen(false);
    setIsProfileOpen(false);
    setIsNotifOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigator('/login');
  };


  return (
    <>
      {(isOpen || isProfileOpen || isNotifOpen) && (
        <div
          className="fixed inset-0 z-30"
          onClick={closeAllPanels}
          style={{ backgroundColor: 'rgba(16, 62, 79, 0.28)', backdropFilter: 'blur(2px)' }}
        ></div>
      )}

  
      <div className='fixed top-0 left-0 right-0 h-[72px] bg-white/95 border-b z-30 flex items-center px-4 md:px-8 shadow-sm justify-between backdrop-blur-sm border-frostBlue'>
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="p-2.5 rounded-xl transition-all border shadow-sm cursor-pointer"
            style={{ backgroundColor: isOpen ? '#fee2e2' : palette.iceWhite, borderColor: isOpen ? '#fecaca' : palette.frostBlue, color: isOpen ? '#b91c1c' : palette.deepOcean }}
            onClick={() => setIsOpen((previous) => !previous)}
            aria-label={isOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          >
            <span className="text-lg">{isOpen ? '✕' : '☰'}</span>
          </button>

          <h1 className="text-lg md:text-2xl font-extrabold tracking-tight text-deepOcean">
            WASSALNI
          </h1>
        </div>

        
        <div className="flex items-center gap-3 md:gap-4">
          
          {/* Profile Button */}
          <button onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="w-10 h-10 md:w-11 md:h-11 rounded-full flex items-center justify-center text-white font-bold shadow-md border-2 border-white hover:scale-105 transition-transform cursor-pointer bg-deepOcean">
                {(states.prenom ? states.prenom.charAt(0).toUpperCase() : '')}{(states.nom ? states.nom.charAt(0).toUpperCase() : '')}
            </button>

            {isProfileOpen && (
              <div className="absolute top-[76px] right-4 md:right-8 w-[18rem] bg-white rounded-2xl shadow-2xl p-5 z-40 border border-frostBlue">
                {/* Profile Header */}
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-frostBlue">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg bg-deepOcean">
                    {(states.prenom ? states.prenom.charAt(0).toUpperCase() : '')}{(states.nom ? states.nom.charAt(0).toUpperCase() : '')}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-sm text-deepOcean">
                    {states.prenom} {states.nom}
                  </p>
                  <p className="text-xs text-skyBlue">
                    {states.email}
                  </p>
                </div>
              </div>

              {/* Role Badge */}
              <div className="mb-4">
                <p className="text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg inline-block bg-iceWhite text-deepOcean">
                  ⭐ {states.role}
                </p>
              </div>

              {/* Menu Items */}
              <div className="space-y-1 mb-4">
                <button className="w-full text-left px-3 py-2 text-sm font-semibold rounded-lg hover:bg-gray-50 transition-all text-deepOcean"
                        onClick={() => {
                          navigator('/parametre');
                          setIsProfileOpen(false);
                        }}>
                  ⚙️ Paramètres
                </button>
              </div>

              {/* Logout */}
              <Link to="/login" 
                    className="w-full flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-bold rounded-lg hover:bg-red-50 transition-all text-red-600 border border-red-200"
                  onClick={handleLogout}>
                <span>🚪</span> Déconnexion
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar */}
      <nav className={`fixed top-[72px] left-0 h-[calc(100vh-72px)] w-[18rem] bg-white shadow-2xl z-40 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
           style={{ borderRight: `1px solid ${palette.frostBlue}` }}>
        
        <div className="flex flex-col h-full p-5 md:p-6">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] mb-5 text-deepOcean">Menu Principal</p>
          
          <ul className="flex flex-col space-y-1 flex-grow">
            <li>
              <Link to="/dashboard" onClick={() => setIsOpen(false)} 
                className="flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 text-[15px] font-semibold group hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 active:scale-95 text-deepOcean">
                <span className="text-xl group-hover:scale-125 transition-transform">🏠</span> 
                <span>Tableau de bord</span>
              </Link>
            </li>
            <li>
              <Link to="/HomeRa" onClick={() => setIsOpen(false)} 
                className="flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 text-[15px] font-semibold group hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 active:scale-95 text-deepOcean">
                <span className="text-xl group-hover:scale-125 transition-transform">👤</span> 
                <span>Client</span>
              </Link>
            </li>
          
           
            <li>
              <Link to="/superlog?target=admin" onClick={() => setIsOpen(false)} 
                className="flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 text-[15px] font-semibold group hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 active:scale-95 text-deepOcean">
                <span className="text-xl group-hover:scale-125 transition-transform">⚙️</span> 
                <span>Gestion Admin</span>
              </Link>
            </li>
            <li>
              <Link to="/superlog?target=controller" onClick={() => setIsOpen(false)} 
                className="flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 text-[15px] font-semibold group hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 active:scale-95 text-deepOcean">
                <span className="text-xl group-hover:scale-125 transition-transform">🔍</span> 
                <span>Gestion Contrôleur</span>
              </Link>
            </li>
            <li>
              <Link to="/transport" onClick={() => setIsOpen(false)} 
                className="flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 text-[15px] font-semibold group hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 active:scale-95 text-deepOcean">
                <span className="text-xl group-hover:scale-125 transition-transform">🚌</span> 
                <span>Transport</span>
              </Link>
            </li>
            <li>
              <Link to="/stations" onClick={() => setIsOpen(false)} 
                className="flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 text-[15px] font-semibold group hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 active:scale-95 text-deepOcean">
                <span className="text-xl group-hover:scale-125 transition-transform">📍</span> 
                <span>Stations</span>
              </Link>
            </li>
            <li>
              <Link to="/routes" onClick={() => setIsOpen(false)} 
                className="flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 text-[15px] font-semibold group hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 active:scale-95 text-deepOcean">
                <span className="text-xl group-hover:scale-125 transition-transform">🛣️</span> 
                <span>Routes</span>
              </Link>
            </li>
            <li>
              <Link to="/schedules" onClick={() => setIsOpen(false)} 
                className="flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 text-[15px] font-semibold group hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 active:scale-95 text-deepOcean">
                <span className="text-xl group-hover:scale-125 transition-transform">⏰</span> 
                <span>Schedules</span>
              </Link>
            </li>
            <li>
              <Link to="/BookTicket" onClick={() => setIsOpen(false)} 
                className="flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 text-[15px] font-semibold group hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 active:scale-95 text-deepOcean">
                <span className="text-xl group-hover:scale-125 transition-transform">🎫</span> 
                <span>Ticket</span>
              </Link>
            </li>
          </ul>

          {/* Status Indicator */}
          <div className="mt-auto pt-6 border-t border-frostBlue">
            <div className="mb-4 px-4">
              <p className="text-xs font-bold uppercase tracking-wider mb-2 text-skyBlue">
                Statut
              </p>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-sm font-semibold text-deepOcean">En ligne</span>
              </div>
            </div>
            
            <Link to="/login" onClick={handleLogout} 
              className="flex items-center justify-center gap-3 mx-4 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 font-bold group border-2 border-red-200 active:scale-95">
              <span className="text-lg group-hover:rotate-12 transition-transform">🚪</span> 
              <span>Déconnexion</span>
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
