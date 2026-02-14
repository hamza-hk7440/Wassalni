
import React, { useState, useEffect } from 'react';
import { Link,useNavigate } from 'react-router-dom';
function MainLayout() {
const navigate = useNavigate();
 {/* const [stats, setStats] = useState({ paiements: 0, reservations: 0, annulations: 0,pourcentageHier: 0 ,metroEnService: 0 ,busEnservice: 0 ,NbAgents: 0 ,NbMetro: 0 ,NbBus: 0});
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
  if (loading) return <div className="p-10 text-center text-blue-600 font-bold">Chargement...</div>;*/}
  const stats = {
    prixTicket: 2.5,
    placeVenduMet: 20,
    placeVenduBus: 5,
    metroEnService: 10,
    busEnservice: 15,
    NbAgents: 50,
    NbMetro: 20,
    revenuHier: 40,
    NbBus: 30 
  };
  const totalRevenueMet = (stats.placeVenduMet * stats.prixTicket);
  const totalRevenueBus = (stats.placeVenduBus * stats.prixTicket);
  const totalRevenue = totalRevenueMet + totalRevenueBus;
  const totalPlaces = stats.placeVenduMet + stats.placeVenduBus;
  const difference =  ((totalRevenue - stats.revenuHier) / stats.revenuHier) * 100 
  const isPositive = difference >= 0;
  const styles = {
  blue: "#0866FF",        
  bgPage: "#F0F2F5",     
  border: "#CED0D4",     
  textMain: "#050505",   
  textSub: "#65676B",    
  hover: "#E4E6EB",      
  radius: "12px"         
};
  return (
    <>
    
    <div className="min-h-screen pt-24 p-10 flex flex-col items-center gap-12 bg-slate-50" style={{ backgroundColor: styles.bgPage }}>


      <div className="bg-white p-6 md:p-10 shadow-sm w-full max-w-6xl text-center" 
        style={{ borderRadius: styles.radius, border: `1px solid ${styles.border}` }}>
        <h1 className="text-xl text-slate-500 font-medium">Revenus du {new Date().toLocaleDateString()}</h1>
        <div className="mt-2 flex items-center justify-center gap-4">
          <span className="text-5xl font-black text-slate-800">{(totalRevenueMet + totalRevenueBus).toFixed(2)} <small className="text-2xl font-bold text-green-600">DT</small></span>
          <div className={`text-left ${isPositive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'} px-3 py-1 rounded-full text-sm font-bold`}>
            {isPositive ? '↑' : '↓'} {Math.abs(difference).toFixed(1)}%
          </div>
        </div>
        <p className="text-sm text-slate-400 mt-2">Basé sur {stats.paiements} transactions validées</p>
      </div>




      <div  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl px-4"> {/*hadha div li fih les stats w les graphiques ya3ni lkbir*/}
       <div onClick={() => navigate('/metro')} 
className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500 w-64 text-center cursor-pointer transition-all 
hover:bg-gray-50 hover:shadow-md active:scale-95"  >        <span className="text-4xl mb-2 block">🚈</span> 
          <span className="text-3xl font-bold block">{stats.metroEnService}</span>
            <span className="text-gray-500">metro en service</span><br></br>
            <div className="border-t border-gray-100 my-3"></div>
            <span className="text-sm text-gray-400">totale:<span className="font-semibold text-gray-600">{stats.NbMetro||0}</span></span>
       </div>
       <div onClick={() => navigate('/bus')} 
       className="bg-white p-6 rounded-xl shadow-sm border-l-4 
       border-green-500 w-64 text-center cursor-pointer 
       transition-all hover:bg-gray-50 
    hover:shadow-md active:scale-95">
          <span className="text-4xl mb-2 block">🚌</span> 
          <span className="text-3xl font-bold block">{stats.busEnservice}</span>
          <span className="text-gray-500">bus en service</span>
          <div className="border-t border-gray-100 my-3"></div>
            <span className="text-sm text-gray-400">totale:
              <span className="font-semibold text-gray-600">{stats.NbBus||0}</span>
            </span>
        </div>
        

  
        <div onClick={() => navigate('/agents')}
        className="bg-white p-6 rounded-xl shadow-sm 
        border-l-4 border-green-500 w-64 text-center 
        cursor-pointer transition-all hover:bg-gray-50 
        hover:shadow-md active:scale-95">
          <span className="text-4xl mb-2 block">👨‍💼</span> 
          <span className="text-3xl font-bold block">{stats.agentsEnService || 0}</span>
          <span className="text-gray-500">agents en service</span>
          <div className="border-t border-gray-100 my-3"></div>
            <span className="text-sm text-gray-400">totale:
              <span className="font-semibold text-gray-600">{stats.NbAgents||0}</span>
            </span>
        </div>

         <div onClick={() => navigate('/agents')}
        className="bg-white p-6 rounded-xl shadow-sm 
        border-l-4 border-green-500 w-64 text-center 
        cursor-pointer transition-all hover:bg-gray-50 
        hover:shadow-md active:scale-95">
          <span className="text-4xl mb-2 block">👨‍💼</span> 
          <span className="text-3xl font-bold block">{stats.agentsEnService || 0}</span>
          <span className="text-gray-500">agents en service</span>
          <div className="border-t border-gray-100 my-3"></div>
            <span className="text-sm text-gray-400">totale:
              <span className="font-semibold text-gray-600">{stats.NbAgents||0}</span>
            </span>
        </div>
      </div>
       

    </div>
    </>
  );
}

export default MainLayout;