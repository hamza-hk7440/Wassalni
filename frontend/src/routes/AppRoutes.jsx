import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from '../pages/admin/Dashboard';
import MainLayout from '../components/layout/Main';


const AppRoutes = () => {
  return (
    <Routes>
        <Route path="/" element={<Dashboard />} />
        {/*<Route path="/metro" element={<MetroLayout />} /> 
        <Route path="/bus" element={<busLayout/>} />
        <Route path="/agents" element={<agentsLayout />} />*/}
        
    </Routes>
  );
};


export default AppRoutes;