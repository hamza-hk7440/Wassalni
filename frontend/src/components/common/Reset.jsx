import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

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

  const palette = {
    primary: "#00ACC1",   
    secondary: "#4DD0E1", 
    soft: "#B2EBF2",      
    white: "#F3FBFC",     
    textBlack: "#000000", 
    textGray: "#333333",  
  };

  return (
    <>
      <div className="min-h-screen pt-24 p-10 flex flex-col items-center gap-12" style={{ backgroundColor: palette.white }}>

        {/* Bloc Revenus - Lisibilité Totale */}
        <div className="bg-white p-6 md:p-10 shadow-sm w-full max-w-6xl text-center" 
          style={{ borderRadius: "12px", border: `1px solid ${palette.soft}` }}>
          <h1 className="text-sm md:text-lg font-bold uppercase tracking-widest" style={{ color: palette.textGray }}>
            Revenus du {new Date().toLocaleDateString()}
          </h1>
          <div className="mt-2 flex items-center justify-center gap-4">
            <span className="text-4xl md:text-6xl font-black" style={{ color: palette.textBlack }}>
              {totalRevenue.toFixed(2)} <small className="text-2xl font-bold" style={{ color: palette.primary }}>DT</small>
            </span>
            <div className={`text-left ${isPositive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} px-4 py-1 rounded-full text-sm font-bold border border-current`}>
              {isPositive ? '↑' : '↓'} {Math.abs(difference).toFixed(1)}%
            </div>
          </div>
          <p className="text-xs mt-4 font-bold" style={{ color: palette.textGray }}>Basé sur {totalPlaces} transactions validées</p>
        </div>

        {/* Grid des cartes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl px-4">
          
          {/* Métro Card */}
          <div onClick={() => navigate('/metro')} 
            className="bg-white p-6 rounded-xl shadow-sm border-l-4 w-full text-center cursor-pointer transition-all hover:bg-gray-50 hover:shadow-md active:scale-95"
            style={{ borderLeftColor: palette.primary }}>
            <span className="text-4xl mb-2 block">🚈</span> 
            <span className="text-3xl font-black block" style={{ color: palette.textBlack }}>{stats.metroEnService}</span>
            <span className="font-bold uppercase text-xs tracking-tighter" style={{ color: palette.textGray }}>métro en service</span><br />
            <div className="border-t border-gray-100 my-3"></div>
            <span className="text-sm font-medium text-gray-500">total flotte: <span className="font-bold text-black">{stats.NbMetro||0}</span></span>
          </div>

          {/* Bus Card */}
          <div onClick={() => navigate('/bus')} 
            className="bg-white p-6 rounded-xl shadow-sm border-l-4 w-full text-center cursor-pointer transition-all hover:bg-gray-50 hover:shadow-md active:scale-95"
            style={{ borderLeftColor: palette.secondary }}>
            <span className="text-4xl mb-2 block">🚌</span> 
            <span className="text-3xl font-black block" style={{ color: palette.textBlack }}>{stats.busEnservice}</span>
            <span className="font-bold uppercase text-xs tracking-tighter" style={{ color: palette.textGray }}>bus en service</span>
            <div className="border-t border-gray-100 my-3"></div>
            <span className="text-sm font-medium text-gray-500">total flotte: <span className="font-bold text-black">{stats.NbBus||0}</span></span>
          </div>

          {/* Agent Card */}
          <div onClick={() => navigate('/agents')}
            className="bg-white p-6 rounded-xl shadow-sm border-l-4 w-full text-center cursor-pointer transition-all hover:bg-gray-50 hover:shadow-md active:scale-95"
            style={{ borderLeftColor: palette.soft }}>
            <span className="text-4xl mb-2 block">👨‍💼</span> 
            <span className="text-3xl font-black block" style={{ color: palette.textBlack }}>{stats.agentsEnService || 0}</span>
            <span className="font-bold uppercase text-xs tracking-tighter" style={{ color: palette.textGray }}>agents en service</span>
            <div className="border-t border-gray-100 my-3"></div>
            <span className="text-sm font-medium text-gray-500">total équipe: <span className="font-bold text-black">{stats.NbAgents||0}</span></span>
          </div>

        </div>
      </div>
    </>
  );
}

export default MainLayout;