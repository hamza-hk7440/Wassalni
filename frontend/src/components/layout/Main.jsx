import React from 'react';
import { useNavigate } from 'react-router-dom';
import palette from '../common/pallette';

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

  return (
    <>
      <div
        className="min-h-screen pt-24 md:pt-28 p-4 md:p-10 flex flex-col items-center gap-6 md:gap-8"
        style={{
          background: `radial-gradient(circle at 5% -20%, rgba(108,177,218,0.25), transparent 38%), linear-gradient(180deg, ${palette.iceWhite} 0%, #eff8ff 45%, #f7fbff 100%)`,
        }}
      >

       
        <div
          className="bg-white/95 backdrop-blur-sm p-5 md:p-10 shadow-xl w-full max-w-6xl text-center rounded-[28px] border"
          style={{ borderColor: palette.frostBlue }}
        >
          <h1 className="text-[11px] md:text-sm font-extrabold uppercase tracking-[0.22em]" style={{ color: palette.deepOcean }}>
            Revenus du {new Date().toLocaleDateString()}
          </h1>
          <div className="mt-3 md:mt-5 flex flex-wrap items-center justify-center gap-3 md:gap-4">
            <span className="text-4xl md:text-6xl font-black leading-none tracking-tight" style={{ color: palette.deepOcean }}>
              {totalRevenue.toFixed(2)} <small className="text-xl md:text-2xl font-bold" style={{ color: palette.softTeal }}>DT</small>
            </span>
            <div className={`text-left ${isPositive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} px-3 md:px-4 py-1.5 rounded-full text-xs md:text-sm font-bold border border-current`}>
              {isPositive ? '↑' : '↓'} {Math.abs(difference).toFixed(1)}%
            </div>
          </div>
          <p className="text-[11px] md:text-xs mt-3 md:mt-4 font-bold" style={{ color: palette.textGray }}>
            Basé sur {totalPlaces} transactions validées
          </p>
        </div>
        <div className="bg-white p-5 md:p-8 shadow-xl w-full max-w-6xl rounded-[28px] border" style={{ borderColor: palette.frostBlue }}>
  
  <h2 className="text-xs md:text-sm font-black mb-5 uppercase tracking-[0.18em]" style={{ color: palette.deepOcean }}>
    📊 Performance des deux derniers jours
  </h2>
  <div className="space-y-5">
    
    <div className="space-y-2">
      <div className="flex justify-between text-[11px] md:text-xs font-bold" style={{ color: palette.deepOcean }}>
        <span>{new Date().toLocaleDateString('fr-FR', { weekday: 'long' })} (Aujourd'hui)</span>
        <span>{totalRevenue.toFixed(2)} DT</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-3.5 overflow-hidden">
        <div 
          className="h-full rounded-full transition-all duration-700" 
          style={{ width: '85%', backgroundColor: palette.softTeal }}
        ></div>
      </div>
    </div>


    <div className="space-y-2">
      <div className="flex justify-between text-[11px] md:text-xs font-bold" style={{ color: palette.deepOcean }}>
        <span>{new Date(new Date().setDate(new Date().getDate() - 1)).toLocaleDateString('fr-FR', { weekday: 'long' })} (Hier)</span>
        <span>{stats.revenuHier.toFixed(2)} DT</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-3.5 overflow-hidden">
        <div 
          className="h-full rounded-full transition-all duration-700" 
          style={{ width: '65%', backgroundColor: palette.classicBlue }}
        ></div>
      </div>
    </div>

    
  </div>

  <p className="mt-5 text-[10px] font-bold text-gray-400 text-center uppercase tracking-[0.1em]">
    Le remplissage des barres est relatif à l'objectif quotidien 
  </p>
</div>
        {/* Grid des cartes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 w-full max-w-6xl">
          
          {/* Métro Card */}
          <div onClick={() => navigate('/metro')} 
            className="bg-white p-5 md:p-6 rounded-[26px] shadow-xl border w-full text-center cursor-pointer transition-all hover:-translate-y-1 hover:shadow-2xl active:scale-95"
            style={{ borderColor: palette.frostBlue, borderLeftWidth: '6px', borderLeftColor: palette.softTeal }}>
            <span className="text-4xl mb-1.5 block">🚈</span> 
            <span className="text-3xl md:text-[32px] font-black block leading-none" style={{ color: palette.deepOcean }}>{stats.metroEnService}</span>
            <span className="font-bold uppercase text-[11px] tracking-wide" style={{ color: palette.textGray }}>métro en service</span><br />
            <div className="border-t border-gray-100 my-3"></div>
            <span className="text-sm font-medium text-gray-500">total flotte: <span className="font-bold text-black">{stats.NbMetro || 0}</span></span>
          </div>

          {/* Bus Card */}
          <div onClick={() => navigate('/bus')} 
            className="bg-white p-5 md:p-6 rounded-[26px] shadow-xl border w-full text-center cursor-pointer transition-all hover:-translate-y-1 hover:shadow-2xl active:scale-95"
            style={{ borderColor: palette.frostBlue, borderLeftWidth: '6px', borderLeftColor: palette.softTeal }}>
            <span className="text-4xl mb-1.5 block">🚌</span> 
            <span className="text-3xl md:text-[32px] font-black block leading-none" style={{ color: palette.deepOcean }}>{stats.busEnservice}</span>
            <span className="font-bold uppercase text-[11px] tracking-wide" style={{ color: palette.textGray }}>bus en service</span>
            <div className="border-t border-gray-100 my-3"></div>
            <span className="text-sm font-medium text-gray-500">total flotte: <span className="font-bold text-black">{stats.NbBus || 0}</span></span>
          </div>

          {/* Agent Card */}
          <div onClick={() => navigate('/agent')}
            className="bg-white p-5 md:p-6 rounded-[26px] shadow-xl border w-full text-center cursor-pointer transition-all hover:-translate-y-1 hover:shadow-2xl active:scale-95"
            style={{ borderColor: palette.frostBlue, borderLeftWidth: '6px', borderLeftColor: palette.softTeal }}>
            <span className="text-4xl mb-1.5 block">👨‍💼</span> 
            <span className="text-3xl md:text-[32px] font-black block leading-none" style={{ color: palette.deepOcean }}>{stats.agentsEnService || 0}</span>
            <span className="font-bold uppercase text-[11px] tracking-wide" style={{ color: palette.textGray }}>agents en service</span>
            <div className="border-t border-gray-100 my-3"></div>
            <span className="text-sm font-medium text-gray-500">total équipe: <span className="font-bold text-black">{stats.NbAgents || 0}</span></span>
          </div>
          

        </div>
      </div>
    </>
  );
}

export default MainLayout;
