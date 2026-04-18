import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import palette from '../common/pallette';
import { useAuth } from '../../hooks/useAuth';
import logo1 from '../../assets/logo1.png';

import {
  TRANSLATIONS,
  useAdminLanguage,
} from '../common/language.jsx';


function Navbar() {
  const navigator = useNavigate();
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const { language, setLanguage, t } = useAdminLanguage();
  const notifications = [{ id: 1, title: 'Nouveau ticket validé', detail: 'Ticket traité', time: '2 min' },
    { id: 2, title: 'Admin créé', detail: 'Compte admin ajouté', time: '10 min' },
    { id: 3, title: 'Maintenance', detail: 'Vérification bus 12', time: '1 h' },];

  const dict = TRANSLATIONS[language] || TRANSLATIONS.fr;
  const roleKey = user?.role ? `role_${String(user.role).toLowerCase()}` : 'user';
  const roleLabel = dict[roleKey] || user?.role || t('user', 'User');

  const states = {
    nom: user?.last_name || t('user', 'User'),
    prenom: user?.first_name || "",
    email: user?.email || t('noEmail', 'No email'),
    role: roleLabel
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
          style={{ backgroundColor: 'rgba(30, 84, 112, 0.28)', backdropFilter: 'blur(2px)' }}
        ></div>
      )}

  
      <div
        className='fixed top-0 left-0 right-0 h-[72px] border-b z-30 flex items-center px-4 md:px-8 justify-between backdrop-blur-sm'
        style={{
          background: 'linear-gradient(90deg, rgba(255, 255, 255, 0.94) 0%, rgba(209, 236, 255, 0.88) 100%)',
          borderColor: palette.frostBlue,
          boxShadow: '0 8px 18px rgba(30, 84, 112, 0.12)',
        }}
      >
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="p-2.5 rounded-xl transition-all border shadow-sm cursor-pointer"
            style={{
              backgroundColor: isOpen ? palette.dangerSoft : palette.iceWhite,
              borderColor: isOpen ? palette.dangerText : palette.frostBlue,
              color: isOpen ? palette.dangerText : palette.deepOcean,
              boxShadow: isOpen ? '0 6px 14px rgba(180, 35, 60, 0.22)' : '0 6px 14px rgba(30, 84, 112, 0.1)',
            }}
            onClick={() => setIsOpen((previous) => !previous)}
            aria-label={isOpen ? t('closeMenu', 'Close menu') : t('openMenu', 'Open menu')}
          >
            <span className="text-lg">{isOpen ? '✕' : '☰'}</span>
          </button>

          <h1 className="flex items-center text-lg md:text-2xl font-extrabold tracking-tight leading-none">
            <img src={logo1} alt="W" className="h-7 w-7 md:h-8 md:w-8 object-contain drop-shadow-sm" />
            <span
              className="-ml-0.5 md:-ml-1 translate-y-[1px]"
              style={{
                color: palette.deepOcean,
                letterSpacing: '0.02em',
                textShadow: '0 1px 0 rgba(255, 255, 255, 0.8)',
              }}
            >
              ASSALNI
            </span>
          </h1>
        </div>

        
        <div className="flex items-center gap-3 md:gap-4">
          <label className="flex items-center gap-2 rounded-xl border px-2 py-1.5 text-xs font-bold" style={{ borderColor: palette.frostBlue, color: palette.deepOcean, backgroundColor: palette.pureWhite }}>
            <span>{t('language', 'Language')}</span>
            <select
              value={language}
              onChange={(event) => setLanguage(event.target.value)}
              className="rounded-md border px-1.5 py-1 outline-none"
              style={{ borderColor: palette.frostBlue, color: palette.deepOcean, backgroundColor: palette.pureWhite }}
              aria-label={t('language', 'Language')}
            >
              <option value="fr">FR</option>
              <option value="en">EN</option>
            </select>
          </label>
          
          {/* Profile Button */}
          <button onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="w-10 h-10 md:w-11 md:h-11 rounded-full flex items-center justify-center text-white font-bold shadow-md border-2 border-white hover:scale-105 transition-transform cursor-pointer"
              style={{ background: `linear-gradient(145deg, ${palette.deepOcean}, ${palette.classicBlue})` }}>
                {(states.prenom ? states.prenom.charAt(0).toUpperCase() : '')}{(states.nom ? states.nom.charAt(0).toUpperCase() : '')}
            </button>

            {isProfileOpen && (
              <div
                className="absolute top-[76px] right-4 md:right-8 w-[18rem] rounded-2xl p-5 z-40 border"
                style={{
                  background: `linear-gradient(180deg, ${palette.pureWhite} 0%, ${palette.iceWhite} 140%)`,
                  borderColor: palette.frostBlue,
                  boxShadow: '0 18px 36px rgba(30, 84, 112, 0.18)',
                }}
              >
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
                <button className="w-full text-left px-3 py-2 text-sm font-semibold rounded-lg transition-all text-deepOcean"
                        style={{ backgroundColor: 'rgba(255, 255, 255, 0.7)' }}
                        onClick={() => {
                          navigator('/parametre');
                          setIsProfileOpen(false);
                        }}>
                  ⚙️ {t('settings', 'Settings')}
                </button>
              </div>

              {/* Logout */}
              <Link to="/login" 
                    className="w-full flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-bold rounded-lg transition-all border"
                    style={{ color: palette.dangerText, borderColor: palette.dangerSoft, backgroundColor: 'rgba(255, 255, 255, 0.7)' }}
                  onClick={handleLogout}>
                <span>🚪</span> {t('logout', 'Logout')}
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar */}
      <nav
        className={`fixed top-[72px] left-0 h-[calc(100vh-72px)] w-[18rem] z-40 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{
          borderRight: `1px solid ${palette.frostBlue}`,
          background: `linear-gradient(180deg, ${palette.pureWhite} 0%, ${palette.iceWhite} 140%)`,
          boxShadow: '10px 0 24px rgba(30, 84, 112, 0.14)',
        }}
      >
        
        <div className="flex flex-col h-full p-5 md:p-6">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] mb-5 text-deepOcean">{t('mainMenu', 'Main Menu')}</p>
          
          <ul className="flex flex-col space-y-1 flex-grow">
            <li>
              <Link to="/dashboard" onClick={() => setIsOpen(false)} 
                className="flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 text-[15px] font-semibold group hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 active:scale-95 text-deepOcean">
                <span className="text-xl group-hover:scale-125 transition-transform">🏠</span> 
                <span>{t('dashboard', 'Dashboard')}</span>
              </Link>
            </li>
            <li>
              <Link to="/HomeRa" onClick={() => setIsOpen(false)} 
                className="flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 text-[15px] font-semibold group hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 active:scale-95 text-deepOcean">
                <span className="text-xl group-hover:scale-125 transition-transform">👤</span> 
                <span>{t('client', 'Client')}</span>
              </Link>
            </li>
          
           
            <li>
              <Link to="/superlog?target=admin" onClick={() => setIsOpen(false)} 
                className="flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 text-[15px] font-semibold group hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 active:scale-95 text-deepOcean">
                <span className="text-xl group-hover:scale-125 transition-transform">⚙️</span> 
                <span>{t('adminManagement', 'Admin Management')}</span>
              </Link>
            </li>
            <li>
              <Link to="/superlog?target=controller" onClick={() => setIsOpen(false)} 
                className="flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 text-[15px] font-semibold group hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 active:scale-95 text-deepOcean">
                <span className="text-xl group-hover:scale-125 transition-transform">🔍</span> 
                <span>{t('controllerManagement', 'Controller Management')}</span>
              </Link>
            </li>
            <li>
              <Link to="/transport" onClick={() => setIsOpen(false)} 
                className="flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 text-[15px] font-semibold group hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 active:scale-95 text-deepOcean">
                <span className="text-xl group-hover:scale-125 transition-transform">🚌</span> 
                <span>{t('transport', 'Transport')}</span>
              </Link>
            </li>
            <li>
              <Link to="/stations" onClick={() => setIsOpen(false)} 
                className="flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 text-[15px] font-semibold group hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 active:scale-95 text-deepOcean">
                <span className="text-xl group-hover:scale-125 transition-transform">📍</span> 
                <span>{t('stations', 'Stations')}</span>
              </Link>
            </li>
            <li>
              <Link to="/routes" onClick={() => setIsOpen(false)} 
                className="flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 text-[15px] font-semibold group hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 active:scale-95 text-deepOcean">
                <span className="text-xl group-hover:scale-125 transition-transform">🛣️</span> 
                <span>{t('routes', 'Routes')}</span>
              </Link>
            </li>
            <li>
              <Link to="/schedules" onClick={() => setIsOpen(false)} 
                className="flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 text-[15px] font-semibold group hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 active:scale-95 text-deepOcean">
                <span className="text-xl group-hover:scale-125 transition-transform">⏰</span> 
                <span>{t('schedules', 'Schedules')}</span>
              </Link>
            </li>
            <li>
              <Link to="/BookTicket" onClick={() => setIsOpen(false)} 
                className="flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 text-[15px] font-semibold group hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 active:scale-95 text-deepOcean">
                <span className="text-xl group-hover:scale-125 transition-transform">🎫</span> 
                <span>{t('ticket', 'Ticket')}</span>
              </Link>
            </li>
          </ul>

          {/* Status Indicator */}
          <div className="mt-auto pt-6 border-t border-frostBlue">
            <div className="mb-4 px-4">
              <p className="text-xs font-bold uppercase tracking-wider mb-2 text-skyBlue">
                {t('status', 'Status')}
              </p>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-sm font-semibold text-deepOcean">{t('online', 'Online')}</span>
              </div>
            </div>
            
            <Link to="/login" onClick={handleLogout} 
              className="flex items-center justify-center gap-3 mx-4 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 font-bold group border-2 border-red-200 active:scale-95">
              <span className="text-lg group-hover:rotate-12 transition-transform">🚪</span> 
              <span>{t('logout', 'Logout')}</span>
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
