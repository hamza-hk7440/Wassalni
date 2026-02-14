import React, { useState,useEffect } from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
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
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const states = {
    nom: "rayen",
    prenom: "raddaoui",
    email: "raddaoui.rayen@gmail.com",
    role: "Administrateur"
  };
  const closeProfile = () => {
    setIsProfileOpen(false);
  };

  return (
    <>
    
    <div className="fixed inset-0  z-30  "
          onClick={() => { setIsOpen(false); closeProfile(); }} style={{ backgroundColor: isOpen ? 'rgba(0, 0, 0, 0.5)' : 'transparent' }}></div>
      {/* hadhi lbar lfo9ania  */}
      <div className='fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-100 z-30 
      flex items-center  px-8 shadow-sm justify-between'>      
        <h1 className="text-blue-600 text-xl font-black tracking-tight ml-16">
          TRANSPORT<span className="text-slate-400 font-light">PRO</span>
        </h1>

        {/* lprofil ta3 l'admin*/}
          <div className="flex items-center"  >
              <button onClick={() => setIsProfileOpen(true)}
               className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold shadow-md border-2 
                border-white hover:scale-105 transition-transform">
                {states.prenom.charAt(0).toUpperCase()}{states.nom.charAt(0).toUpperCase()}
              </button>
            {isProfileOpen ? <div className="absolute top-16
             right-8 w-48 bg-white rounded-lg shadow-lg p-4 z-40">
             <p className="text-[11px] text-slate-500 truncate w-full mb-1">{states.email}</p>
             <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded">{states.role}</p>
           <button className="mt-2 text-xs text-red-500 hover:text-red-700" onClick={() => setIsProfileOpen(false)}>Fermer</button>
          </div> : null}
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
        isOpen  ? 'translate-x-0' : '-translate-x-full'}`}>
        
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