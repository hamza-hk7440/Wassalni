import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from '../pages/admin/Dashboard';
import Parametre from '../components/layout/parametre';
import Superlog from '../components/layout/superlog';
import CreateEmp from '../pages/admin/CreateEmp';
import ControllerEmp from '../pages/admin/ControllerEmp';
import Metro from '../pages/admin/Metro';
import Bus from '../pages/admin/Bus';
import Agent from '../pages/admin/Agent';

import Transport from '../pages/admin/Transport';
import BookTicket from '../pages/client/BookTicket';
import Home from '../pages/client/Home';
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/Dashboard" element={<Dashboard />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/parametre" element={<Parametre/>} />
      <Route path="/superlog" element={<Superlog />} /> 
      <Route path="/admin" element={<CreateEmp />} />
      <Route path="/controller" element={<ControllerEmp />} />
      <Route path="/agent" element={<Agent />} />
      <Route path="/bus" element={<Bus />} />
      <Route path="/metro" element={<Metro />} />
      <Route path="/transport" element={<Transport />} />
      <Route path="/ticket" element={<BookTicket />} />
      <Route path="/client" element={<Home />} />
      
      
      
    </Routes>
  );
};


export default AppRoutes;