import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigator = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifications = [{ id: 1, title: 'Nouveau ticket valide', detail: 'Ticket traite', time: '2 min' },
    { id: 2, title: 'Admin cree', detail: 'Compte admin ajoute', time: '10 min' },
    { id: 3, title: 'Maintenance', detail: 'Verification bus 12', time: '1 h' },];
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
const coolPalette = {
  deepOcean: "#1E5470", 
  classicBlue: "#34729C",
  skyBlue: "#6CB1DA",
  softTeal: "#6EC1D1",   
  frostBlue: "#C8EAEC",
  iceWhite: "#D1ECFF"    
};

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

  
      <div className='fixed top-0 left-0 right-0 h-16 bg-white/95 border-b z-30 flex items-center px-6 md:px-8 shadow-sm justify-between backdrop-blur-sm'
           style={{ borderColor: coolPalette.frostBlue }}>
        <h1 className="text-xl font-black tracking-tight ml-14 md:ml-16" style={{ color: coolPalette.deepOcean }}>
          TRANSPORT<span className="font-light" style={{ color: coolPalette.softTeal }}>PRO</span>
        </h1>

        
        <div className="flex items-center gap-4">
          {/* Notification Bell */}
          <button
            className="relative p-2 hover:bg-slate-100 rounded-lg transition-all"
            onClick={toggleNotifications}
          >
            <span className="text-xl">🔔</span>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-white text-xs font-bold flex items-center justify-center"
                    style={{ backgroundColor: coolPalette.softTeal }}>
                {unreadCount}
              </span>
            )}
          </button>

          {isNotifOpen && (
            <div
              className="absolute top-16 right-20 md:right-28 w-80 bg-white rounded-2xl shadow-2xl p-4 z-40 border"
              style={{ borderColor: coolPalette.frostBlue }}
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-bold" style={{ color: coolPalette.deepOcean }}>
                  Notifications
                </p>
                <span className="text-xs font-semibold" style={{ color: coolPalette.skyBlue }}>
                  {unreadCount}
                </span>
              </div>

              <div className="space-y-3 max-h-64 overflow-auto">
                {notifications.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl border bg-blue-50"
                    style={{ borderColor: coolPalette.frostBlue }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold" style={{ color: coolPalette.deepOcean }}>
                          {item.title}
                        </p>
                        <p className="text-xs" style={{ color: coolPalette.skyBlue }}>
                          {item.detail}
                        </p>
                      </div>
                      <span className="text-[10px] font-bold" style={{ color: coolPalette.softTeal }}>
                        {item.time}
                      </span>
                    </div>
                  </div>
                ))}

                {notifications.length === 0 && (
                  <p className="text-xs text-center" style={{ color: coolPalette.skyBlue }}>
                    Aucune notification
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Profile Button */}
          <button onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-md border-2 border-white hover:scale-105 transition-transform"
                  style={{ backgroundColor: coolPalette.deepOcean }}>
            {states.prenom.charAt(0).toUpperCase()}{states.nom.charAt(0).toUpperCase()}
          </button>

          {isProfileOpen && (
            <div className="absolute top-16 right-6 md:right-8 w-64 bg-white rounded-2xl shadow-2xl p-5 z-40 border"
                 style={{ borderColor: coolPalette.frostBlue }}>
              {/* Profile Header */}
              <div className="flex items-center gap-3 mb-4 pb-4 border-b" style={{ borderColor: coolPalette.frostBlue }}>
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
                     style={{ backgroundColor: coolPalette.deepOcean }}>
                  {states.prenom.charAt(0).toUpperCase()}{states.nom.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-sm" style={{ color: coolPalette.deepOcean }}>
                    {states.prenom} {states.nom}
                  </p>
                  <p className="text-xs" style={{ color: coolPalette.skyBlue }}>
                    {states.email}
                  </p>
                </div>
              </div>

              {/* Role Badge */}
              <div className="mb-4">
                <p className="text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg inline-block"
                   style={{ backgroundColor: coolPalette.iceWhite, color: coolPalette.deepOcean }}>
                  ⭐ {states.role}
                </p>
              </div>

              {/* Menu Items */}
              <div className="space-y-1 mb-4">
                <button className="w-full text-left px-3 py-2 text-sm font-semibold rounded-lg hover:bg-gray-50 transition-all"
                        style={{ color: coolPalette.deepOcean }}
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

      {/* Boutons d'ouverture/fermeture */}
      {!isOpen ? (
        <button className="fixed top-3.5 left-4 z-50 p-2 rounded-lg transition-all border" 
                style={{ backgroundColor: coolPalette.iceWhite, borderColor: coolPalette.frostBlue, color: coolPalette.deepOcean }}
                onClick={() => setIsOpen(true)}>
          <span className="">☰</span>
        </button>
      ) : (
        <button className="fixed top-3.5 left-4 z-50 p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all border border-red-100" 
                onClick={() => setIsOpen(false)}>
          <span className="text-xl">✕</span>
        </button>
      )}   

      {/* Sidebar latérale */}
      <nav className={`fixed inset-y-0 left-0 w-72 bg-white shadow-2xl z-40 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
           style={{ borderRight: `1px solid ${coolPalette.frostBlue}` }}>
        
        <div className="flex flex-col h-full p-6 pt-24">
          <p className="text-xs font-bold uppercase tracking-[0.2em] mb-6" style={{ color: coolPalette.deepOcean }}>Menu Principal</p>
          
          <ul className="flex flex-col space-y-1 flex-grow">
            <li>
              <Link to="/dashboard" onClick={() => setIsOpen(false)} 
                className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-semibold group hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 active:scale-95"
                style={{ color: coolPalette.deepOcean }}>
                <span className="text-xl group-hover:scale-125 transition-transform">🏠</span> 
                <span>Tableau de bord</span>
              </Link>
            </li>
            <li>
              <Link to="/client" onClick={() => setIsOpen(false)} 
                className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-semibold group hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 active:scale-95"
                style={{ color: coolPalette.deepOcean }}>
                <span className="text-xl group-hover:scale-125 transition-transform">👤</span> 
                <span>Client</span>
              </Link>
            </li>
            <li>
              <Link to="/superlog" onClick={() => setIsOpen(false)} 
                className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-semibold group hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 active:scale-95"
                style={{ color: coolPalette.deepOcean }}>
                <span className="text-xl group-hover:scale-125 transition-transform">👨‍💼</span> 
                <span>Contrôleur</span>
              </Link>
            </li>
            <li>
              <Link to="/superlog" onClick={() => setIsOpen(false)} 
                className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-semibold group hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 active:scale-95"
                style={{ color: coolPalette.deepOcean }}>
                <span className="text-xl group-hover:scale-125 transition-transform">⚙️</span> 
                <span>Nouveau Admin</span>
              </Link>
            </li>
            <li>
              <Link to="/transport" onClick={() => setIsOpen(false)} 
                className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-semibold group hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 active:scale-95"
                style={{ color: coolPalette.deepOcean }}>
                <span className="text-xl group-hover:scale-125 transition-transform">🚌</span> 
                <span>Transport</span>
              </Link>
            </li>
            <li>
              <Link to="/ticket" onClick={() => setIsOpen(false)} 
                className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-semibold group hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 active:scale-95"
                style={{ color: coolPalette.deepOcean }}>
                <span className="text-xl group-hover:scale-125 transition-transform">🎫</span> 
                <span>Ticket</span>
              </Link>
            </li>
          </ul>

          {/* Status Indicator */}
          <div className="mt-auto pt-6 border-t" style={{ borderColor: coolPalette.frostBlue }}>
            <div className="mb-4 px-4">
              <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: coolPalette.skyBlue }}>
                Statut
              </p>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-sm font-semibold" style={{ color: coolPalette.deepOcean }}>En ligne</span>
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