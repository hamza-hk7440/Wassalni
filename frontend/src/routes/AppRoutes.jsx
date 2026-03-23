import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from '../pages/admin/Dashboard';
import Parametre from '../components/layout/parametre';
import Superlog from '../components/layout/superlog';
import CreateEmp from '../pages/admin/CreateEmp';
import Metro from '../pages/admin/Metro';
import Bus from '../pages/admin/Bus';
import Agents from '../pages/admin/Agents';
import Transport from '../pages/admin/Transport';
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/Dashboard" element={<Dashboard />} />
      <Route path="/parametre" element={<Parametre/>} />
      <Route path="/superlog" element={<Superlog />} /> 
      <Route path="/admin" element={<CreateEmp />} />
      <Route path="/bus" element={<Bus />} />
      <Route path="/metro" element={<Metro />} />
      <Route path="/transport" element={<Transport />} />
      <Route path="/agents" element={<Agents />} />
    </Routes>
  );
};


export default AppRoutes;