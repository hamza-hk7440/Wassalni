import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayoutH';
import Dashboard from '../pages/admin/Dashboard';
import Parametre from '../components/layout/parametre';
import Superlog from '../components/layout/superlog';
import CreateEmp from '../pages/admin/CreateEmp';
import ControllerEmp from '../pages/admin/ControllerEmp';
import Metro from '../pages/admin/Metro';
import Bus from '../pages/admin/Bus';
import Transport from '../pages/admin/Transport';
import BookTicket from '../pages/client/BookTicket';
import Home from '../pages/client/Home';
import Auth from '../pages/auth/Login';
import Packages from '../pages/client/packages';
import Profile from '../pages/client/profile';
import HomeH from '../pages/client/HomeH';
import About from '../pages/client/About';
import Contact from '../pages/client/Contact';
import BusSchedule from '../pages/client/BusSchedule';
import ActiveTickets from '../pages/client/active-tickets';
import TicketHistory from '../pages/client/TicketHistory';
import MetroSchedule from '../pages/client/metroSchedule';
import RefundRequest from '../pages/client/refundRequest';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Auth />} />
      <Route path="/Mainlayout" element={<MainLayout />} />
      <Route path="/Dashboard" element={<Dashboard />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/parametre" element={<Parametre/>} />
      <Route path="/superlog" element={<Superlog />} /> 
      <Route path="/admin" element={<CreateEmp />} />
      <Route path="/controller" element={<ControllerEmp />} />
      <Route path="/bus" element={<Bus />} />
      <Route path="/metro" element={<Metro />} />
      <Route path="/transport" element={<Transport />} />
      <Route path="/home" element={<Home />} />
<Route element={<MainLayout />}> 
    <Route path="/login" element={<Auth />} />
    <Route path="/about" element={<About />} />
    <Route path="/contact" element={<Contact />} />
    <Route path="/Register" element={<Auth />} />
    <Route path="/client" element={<HomeH/>} />
    <Route path="/packages" element={<Packages />} />
    <Route path="/home" element={<Home />} />
    <Route path="/profile" element={<Profile />} />
    <Route path="/ticket" element={<BookTicket />} />
    <Route path="/client" element={<Home />} />
    <Route path="/active-tickets" element={<ActiveTickets />} />
    <Route path="/history" element={<TicketHistory />} />
    <Route path="/busSchedule" element={<BusSchedule />} />
    <Route path="metroSchedule" element={<MetroSchedule/>}/>
    <Route path="refundRequest" element={<RefundRequest/>}/>
</Route>
    
      
      
    </Routes>
  );
};


export default AppRoutes;