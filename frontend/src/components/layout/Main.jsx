import React from 'react';
import { useNavigate } from 'react-router-dom';

function MainLayout() {
  const navigate = useNavigate();

  const stats = {
    prixTicket: 2.5,
    placeVenduMet: 20,
    placeVenduBus: 5,
    metroEnService: 10,
    busEnservice: 15,
    NbAgents: 50,
    agentsEnService: 12,
    NbMetro: 20,
    revenuHier: 400,
    NbBus: 30 
  };

  const totalRevenueMet = (stats.placeVenduMet * stats.prixTicket);
  const totalRevenueBus = (stats.placeVenduBus * stats.prixTicket);
  const totalRevenue = totalRevenueMet + totalRevenueBus;
  const totalPlaces = stats.placeVenduMet + stats.placeVenduBus;
  const difference = ((totalRevenue - stats.revenuHier) / stats.revenuHier) * 100;
  const isPositive = difference >= 0;

  const coolPalette = {
    deepOcean: '#1E5470',
    classicBlue: '#34729C',
    skyBlue: '#6CB1DA',
    softTeal: '#6EC1D1',
    frostBlue: '#C8EAEC',
    iceWhite: '#D1ECFF',
    textGray: '#5B7181',
    warmAccent: '#F0B35D',
  };

  return (
    <>
      <div
        className="min-h-screen pt-24 p-6 md:p-10 flex flex-col items-center gap-8 md:gap-10"
        style={{
          background: `radial-gradient(circle at 5% -20%, rgba(108,177,218,0.25), transparent 38%), linear-gradient(180deg, ${coolPalette.iceWhite} 0%, #eff8ff 45%, #f7fbff 100%)`,
        }}
      >

       
        <div
          className="bg-white/95 backdrop-blur-sm p-6 md:p-9 shadow-xl w-full max-w-6xl text-center rounded-3xl border"
          style={{ borderColor: coolPalette.frostBlue }}
        >
          <h1 className="text-sm md:text-lg font-bold uppercase tracking-widest" style={{ color: coolPalette.deepOcean }}>
            Revenus du {new Date().toLocaleDateString()}
          </h1>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-4">
            <span className="text-4xl md:text-6xl font-black leading-none" style={{ color: coolPalette.deepOcean }}>
              {totalRevenue.toFixed(2)} <small className="text-2xl font-bold" style={{ color: coolPalette.softTeal }}>DT</small>
            </span>
            <div className={`text-left ${isPositive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} px-4 py-1 rounded-full text-sm font-bold border border-current`}>
              {isPositive ? '↑' : '↓'} {Math.abs(difference).toFixed(1)}%
            </div>
          </div>
          <p className="text-xs mt-4 font-bold" style={{ color: coolPalette.textGray }}>
            Basé sur {totalPlaces} transactions validées
          </p>
        </div>
        <div className="bg-white p-6 md:p-8 shadow-xl w-full max-w-6xl rounded-3xl border" style={{ borderColor: coolPalette.frostBlue }}>
  
  
  <h2 className="text-sm font-black mb-6 uppercase tracking-widest" style={{ color: coolPalette.deepOcean }}>
    📊 Performance des deux derniers jours
  </h2>
  <div className="space-y-6">
    
    <div className="space-y-2">
      <div className="flex justify-between text-xs font-bold" style={{ color: coolPalette.deepOcean }}>
        <span>{new Date().toLocaleDateString('fr-FR', { weekday: 'long' })} (Aujourd'hui)</span>
        <span>{totalRevenue.toFixed(2)} DT</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
        <div 
          className="h-full rounded-full transition-all duration-700" 
          style={{ width: '85%', backgroundColor: coolPalette.softTeal }}
        ></div>
      </div>
    </div>


    <div className="space-y-2">
      <div className="flex justify-between text-xs font-bold" style={{ color: coolPalette.deepOcean }}>
        <span>{new Date(new Date().setDate(new Date().getDate() - 1)).toLocaleDateString('fr-FR', { weekday: 'long' })} (Hier)</span>
        <span>{stats.revenuHier.toFixed(2)} DT</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
        <div 
          className="h-full rounded-full transition-all duration-700" 
          style={{ width: '65%', backgroundColor: coolPalette.classicBlue }}
        ></div>
      </div>
    </div>

    
  </div>

  <p className="mt-6 text-[10px] font-bold text-gray-400 text-center uppercase tracking-wide">
    Le remplissage des barres est relatif à l'objectif quotidien (60 DT)
  </p>
</div>
        {/* Grid des cartes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
          
          {/* Métro Card */}
          <div onClick={() => navigate('/metro')} 
            className="bg-white p-6 rounded-3xl shadow-xl border w-full text-center cursor-pointer transition-all hover:-translate-y-1 hover:shadow-2xl active:scale-95"
            style={{ borderColor: coolPalette.frostBlue, borderLeftWidth: '6px', borderLeftColor: coolPalette.deepOcean }}>
            <span className="text-4xl mb-2 block">🚈</span> 
            <span className="text-3xl font-black block" style={{ color: coolPalette.deepOcean }}>{stats.metroEnService}</span>
            <span className="font-bold uppercase text-xs tracking-tighter" style={{ color: coolPalette.textGray }}>métro en service</span><br />
            <div className="border-t border-gray-100 my-3"></div>
            <span className="text-sm font-medium text-gray-500">total flotte: <span className="font-bold text-black">{stats.NbMetro||0}</span></span>
          </div>

          {/* Bus Card */}
          <div onClick={() => navigate('/bus')} 
            className="bg-white p-6 rounded-3xl shadow-xl border w-full text-center cursor-pointer transition-all hover:-translate-y-1 hover:shadow-2xl active:scale-95"
            style={{ borderColor: coolPalette.frostBlue, borderLeftWidth: '6px', borderLeftColor: coolPalette.softTeal }}>
            <span className="text-4xl mb-2 block">🚌</span> 
            <span className="text-3xl font-black block" style={{ color: coolPalette.deepOcean }}>{stats.busEnservice}</span>
            <span className="font-bold uppercase text-xs tracking-tighter" style={{ color: coolPalette.textGray }}>bus en service</span>
            <div className="border-t border-gray-100 my-3"></div>
            <span className="text-sm font-medium text-gray-500">total flotte: <span className="font-bold text-black" >{stats.NbBus||0}</span></span>
          </div>

          {/* Agent Card */}
          <div onClick={() => navigate('/agents')}
            className="bg-white p-6 rounded-3xl shadow-xl border w-full text-center cursor-pointer transition-all hover:-translate-y-1 hover:shadow-2xl active:scale-95"
            style={{ borderColor: coolPalette.frostBlue, borderLeftWidth: '6px', borderLeftColor: coolPalette.warmAccent }}>
            <span className="text-4xl mb-2 block">👨‍💼</span> 
            <span className="text-3xl font-black block" style={{ color: coolPalette.deepOcean }}>{stats.agentsEnService || 0}</span>
            <span className="font-bold uppercase text-xs tracking-tighter" style={{ color: coolPalette.textGray }}>agents en service</span>
            <div className="border-t border-gray-100 my-3"></div>
            <span className="text-sm font-medium text-gray-500">total équipe: <span className="font-bold text-black">{stats.NbAgents||0}</span></span>
          </div>
          

        </div>
      </div>
    </>
  );
}

export default MainLayout;