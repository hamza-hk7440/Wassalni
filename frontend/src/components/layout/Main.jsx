function MainLayout() {
  return (
   
    <div className="min-h-screen pt-24 p-10 flex flex-col items-center gap-12 bg-slate-50">
       <div>
       </div>
      
      <div className="flex justify-center gap-15">
      
        <div className="flex flex-col items-center gap-5">
          <div className="pie" style={{ "--p": 75, "--c": "#3b82f6" }}> 75% </div>
          <span className="font-medium text-gray-600">Paiements</span>
        </div>

  
        <div className="flex flex-col items-center gap-5">
          <div className="pie" style={{ "--p": 20, "--c": "#10b981" }}> 20% </div>
          <span className="font-medium text-gray-600">Réservations</span>
        </div>

      
        <div className="flex flex-col items-center gap-5">
          <div className="pie" style={{ "--p": 5, "--c": "#ef4444" }}> 5% </div>
          <span className="font-medium text-gray-600">Annulations</span>
        </div>
      </div>

    </div>
  );
}

export default MainLayout;