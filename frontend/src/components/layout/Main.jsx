
import React, { useState, useEffect } from 'react';
function MainLayout() {

 {/* const [stats, setStats] = useState({ paiements: 0, reservations: 0, annulations: 0, metroEnService: 0 ,busEnservice: 0});
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
    paiements: 75,
    reservations: 20,
    annulations: 5,
    metroEnService: 10,
    busEnservice: 15
  };
  return (
    <>
    
    <div className=" min-h-screen pt-24 p-10 flex flex-col items-center gap-12 bg-slate-50">


      <div className="flex gap-8 w-full justify-center"> {/*hadha div li fih les stats w les graphiques ya3ni lkbir*/}
       <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500 w-64 text-center">{/* hadha div ta3 kol karou*/}
          <span className="text-3xl font-bold block">{stats.metroEnService}</span>
            <span className="text-gray-500">metro en service</span>
       </div>
      <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500 w-64 text-center">
          <span className="text-3xl font-bold block">{stats.busEnservice}</span>
          <span className="text-gray-500">bus en service</span>
        </div>
      </div>
       
       

      <div className="flex justify-center gap-15">
      
        <div className="flex flex-col items-center gap-5">
          <div className="pie" style={{ "--p": stats.paiements, "--c": "#3b82f6" }}> {stats.paiements}% </div>
          <span className="font-medium text-gray-600">Paiements</span>
        </div>

  
        <div className="flex flex-col items-center gap-5">
          <div className="pie" style={{ "--p": stats.reservations, "--c": "#10b981" }}> {stats.reservations}% </div>
          <span className="font-medium text-gray-600">Réservations</span>
        </div>

      
        <div className="flex flex-col items-center gap-5">
          <div className="pie" style={{ "--p": stats.annulations, "--c": "#ef4444" }}> {stats.annulations}% </div>
          <span className="font-medium text-gray-600">Annulations</span>
        </div>
      </div>

    </div>
    </>
  );
}

export default MainLayout;