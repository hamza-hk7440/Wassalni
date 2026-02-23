import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from '../pages/admin/Dashboard';
import MainLayout from '../components/layout/Main';
import Parametre from '../components/layout/parametre';
import Superlog from '../components/layout/superlog';
import CreateEmp from '../pages/admin/CreateEmp';


const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
        <Route path="/Dashboard" element={<Dashboard />} />
            <Route path="/parametre" element={<Parametre/>} />
            <Route path="/superlog" element={<Superlog />} /> 
        <Route path="/admin" element={<CreateEmp />} />
        {/*<Route path="/metro" element={<MetroLayout />} /> 
        <Route path="/bus" element={<busLayout/>} />
        <Route path="/agents" element={<agentsLayout />} />*/}
        
    </Routes>
  );
};


export default AppRoutes;