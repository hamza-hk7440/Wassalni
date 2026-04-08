<<<<<<< HEAD
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import tokenLogo from '../../assets/token_logo.png';
import mainLogo from '../../assets/logo1.png';
import useAuth from '../../hooks/useAuth';
import '../../App.css';
import avatar from '../../assets/default_pfp.png'

const Navbar = () => {
  const { tokens, user } = useAuth();
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <nav className="navbar">
      <Link to={user ? "/home" : "/login"} className="logo" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0' }}>
        <img src={mainLogo} alt="" style={{ height: '40px', width: 'auto', objectFit: 'contain' }} />
        asalni
      </Link>

      <div className="nav-links">
        {!isAuthPage && user && (
          <>
            <Link to="/home" className="nav-text-link">Home</Link>
            <Link to="/about" className="nav-text-link">About</Link>
            <Link to="/contact" className="nav-text-link">Contact Us</Link>
            <Link to="/packages" className="balance-pill" style={{ textDecoration: 'none', cursor: 'pointer' }} title="Buy Tokens">
              <img src={tokenLogo} alt="token" className="token-icon" />
              <span className="balance-amount">{tokens?.toLocaleString() || 0}</span>
              <div style={{ 
                marginLeft: '8px', 
                backgroundColor: '#3b759f', 
                color: 'white', 
                borderRadius: '50%', 
                width: '18px', 
                height: '18px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontSize: '14px', 
                fontWeight: 'bold' 
              }}>+</div>
            </Link>
            <Link to="/profile" className="profile-btn">
              <img
                src={avatar}
                alt="avatar"
                className="profile-img-nav"
              />
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
=======
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import palette from '../common/pallette';

function Navbar() {
  const navigator = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifications = [{ id: 1, title: 'Nouveau ticket validé', detail: 'Ticket traité', time: '2 min' },
    { id: 2, title: 'Admin créé', detail: 'Compte admin ajouté', time: '10 min' },
    { id: 3, title: 'Maintenance', detail: 'Vérification bus 12', time: '1 h' },];
{/*const [stats, setStats] = useState({nom:"",prenom:"",email:"",role:""});
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    fetch('http://votre-api.com/stats') 
      .then(response => response.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(error => console.error("Erreur backend:", error));
  }, []);
  if (loading) return <div className="p-10 text-center text-blue-600 font-bold">Chargement...</div>;
  */}
  const states = {
    nom: "rayen",
    prenom: "raddaoui",
    email: "raddaoui.rayen@gmail.com",
    role: "Administrateur"
  };

  const closeAllPanels = () => {
    setIsOpen(false);
    setIsProfileOpen(false);
    setIsNotifOpen(false);
  };

  const handleLogout = () => {
  
    setIsOpen(false);
    setIsProfileOpen(false);
    setIsNotifOpen(false);
  };

  const unreadCount = notifications.length;

  const toggleNotifications = () => {
    setIsNotifOpen((previous) => !previous);
    setIsProfileOpen(false);
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

  
      <div className='fixed top-0 left-0 right-0 h-[72px] bg-white/95 border-b z-30 flex items-center px-4 md:px-8 shadow-sm justify-between backdrop-blur-sm'
           style={{ borderColor: palette.frostBlue }}>
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

          <h1 className="text-lg md:text-2xl font-extrabold tracking-tight" style={{ color: palette.deepOcean }}>
            WASSALNI
          </h1>
        </div>

        
        <div className="flex items-center gap-3 md:gap-4">
          {/* Notification Bell */}
          <button
            className="relative p-2.5 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
            onClick={toggleNotifications}
          >
            <span className="text-lg md:text-xl">🔔</span>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-white text-xs font-bold flex items-center justify-center"
                    style={{ backgroundColor: palette.softTeal }}>
                {unreadCount}
              </span>
            )}
          </button>

          {isNotifOpen && (
            <div
              className="absolute top-[76px] right-16 md:right-24 w-[20rem] bg-white rounded-2xl shadow-2xl p-4 z-40 border"
              style={{ borderColor: palette.frostBlue }}
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-bold" style={{ color: palette.deepOcean }}>
                  Notifications
                </p>
                <span className="text-xs font-semibold" style={{ color: palette.skyBlue }}>
                  {unreadCount}
                </span>
              </div>

              <div className="space-y-3 max-h-64 overflow-auto">
                {notifications.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl border bg-blue-50/80"
                    style={{ borderColor: palette.frostBlue }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold" style={{ color: palette.deepOcean }}>
                          {item.title}
                        </p>
                        <p className="text-xs" style={{ color: palette.skyBlue }}>
                          {item.detail}
                        </p>
                      </div>
                      <span className="text-[10px] font-bold" style={{ color: palette.softTeal }}>
                        {item.time}
                      </span>
                    </div>
                  </div>
                ))}

                {notifications.length === 0 && (
                  <p className="text-xs text-center" style={{ color: palette.skyBlue }}>
                    Aucune notification
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Profile Button */}
          <button onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="w-10 h-10 md:w-11 md:h-11 rounded-full flex items-center justify-center text-white font-bold shadow-md border-2 border-white hover:scale-105 transition-transform cursor-pointer"
                  style={{ backgroundColor: palette.deepOcean }}>
            {states.prenom.charAt(0).toUpperCase()}{states.nom.charAt(0).toUpperCase()}
          </button>

          {isProfileOpen && (
            <div className="absolute top-[76px] right-4 md:right-8 w-[18rem] bg-white rounded-2xl shadow-2xl p-5 z-40 border"
                 style={{ borderColor: palette.frostBlue }}>
              {/* Profile Header */}
              <div className="flex items-center gap-3 mb-4 pb-4 border-b" style={{ borderColor: palette.frostBlue }}>
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
                     style={{ backgroundColor: palette.deepOcean }}>
                  {states.prenom.charAt(0).toUpperCase()}{states.nom.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-sm" style={{ color: palette.deepOcean }}>
                    {states.prenom} {states.nom}
                  </p>
                  <p className="text-xs" style={{ color: palette.skyBlue }}>
                    {states.email}
                  </p>
                </div>
              </div>

              {/* Role Badge */}
              <div className="mb-4">
                <p className="text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg inline-block"
                   style={{ backgroundColor: palette.iceWhite, color: palette.deepOcean }}>
                  ⭐ {states.role}
                </p>
              </div>

              {/* Menu Items */}
              <div className="space-y-1 mb-4">
                <button className="w-full text-left px-3 py-2 text-sm font-semibold rounded-lg hover:bg-gray-50 transition-all"
                        style={{ color: palette.deepOcean }}
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
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] mb-5" style={{ color: palette.deepOcean }}>Menu Principal</p>
          
          <ul className="flex flex-col space-y-1 flex-grow">
            <li>
              <Link to="/dashboard" onClick={() => setIsOpen(false)} 
                className="flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 text-[15px] font-semibold group hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 active:scale-95"
                style={{ color: palette.deepOcean }}>
                <span className="text-xl group-hover:scale-125 transition-transform">🏠</span> 
                <span>Tableau de bord</span>
              </Link>
            </li>
            <li>
              <Link to="/client" onClick={() => setIsOpen(false)} 
                className="flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 text-[15px] font-semibold group hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 active:scale-95"
                style={{ color: palette.deepOcean }}>
                <span className="text-xl group-hover:scale-125 transition-transform">👤</span> 
                <span>Client</span>
              </Link>
            </li>
          
           
            <li>
              <Link to="/superlog?target=admin" onClick={() => setIsOpen(false)} 
                className="flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 text-[15px] font-semibold group hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 active:scale-95"
                style={{ color: palette.deepOcean }}>
                <span className="text-xl group-hover:scale-125 transition-transform">⚙️</span> 
                <span>Gestion Admin</span>
              </Link>
            </li>
            <li>
              <Link to="/superlog?target=controller" onClick={() => setIsOpen(false)} 
                className="flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 text-[15px] font-semibold group hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 active:scale-95"
                style={{ color: palette.deepOcean }}>
                <span className="text-xl group-hover:scale-125 transition-transform">🔍</span> 
                <span>Gestion Contrôleur</span>
              </Link>
            </li>
            <li>
              <Link to="/transport" onClick={() => setIsOpen(false)} 
                className="flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 text-[15px] font-semibold group hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 active:scale-95"
                style={{ color: palette.deepOcean }}>
                <span className="text-xl group-hover:scale-125 transition-transform">🚌</span> 
                <span>Transport</span>
              </Link>
            </li>
            <li>
              <Link to="/ticket" onClick={() => setIsOpen(false)} 
                className="flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 text-[15px] font-semibold group hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 active:scale-95"
                style={{ color: palette.deepOcean }}>
                <span className="text-xl group-hover:scale-125 transition-transform">🎫</span> 
                <span>Ticket</span>
              </Link>
            </li>
          </ul>

          {/* Status Indicator */}
          <div className="mt-auto pt-6 border-t" style={{ borderColor: palette.frostBlue }}>
            <div className="mb-4 px-4">
              <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: palette.skyBlue }}>
                Statut
              </p>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-sm font-semibold" style={{ color: palette.deepOcean }}>En ligne</span>
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
>>>>>>> 973fc2852388843731e34950cce2302d6531215f
