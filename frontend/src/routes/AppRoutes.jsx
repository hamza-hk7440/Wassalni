import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from '../pages/admin/DashboardRa';
import Parametre from '../components/layout/parametreRa';
import Superlog from '../components/layout/superlogRa';
import CreateEmp from '../pages/admin/CreateEmpRa';
import ControllerEmp from '../pages/admin/ControllerEmpRa';
import Metro from '../pages/admin/MetroRa';
import Bus from '../pages/admin/BusRa';
import Transport from '../pages/admin/TransportRa';
import BookTicket from '../pages/client/BookTicketRa';
import Home from '../pages/client/HomeRa';
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
      <Route path="/bus" element={<Bus />} />
      <Route path="/metro" element={<Metro />} />
      <Route path="/transport" element={<Transport />} />
      <Route path="/ticket" element={<BookTicket />} />
      <Route path="/client" element={<Home />} />
    
      
      
    </Routes>
  );
};


export default AppRoutes;