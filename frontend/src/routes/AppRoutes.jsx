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
import Stations from '../pages/admin/Stations';
import RoutesPage from '../pages/admin/RoutesPage';
import Schedules from '../pages/admin/SchedulesAd';
import BookTicket from '../pages/client/BookTicket';
import Home from '../pages/client/Home';
import Auth from '../pages/auth/Login';
import Packages from '../pages/client/packages';
import Profile from '../pages/client/profile';
import HomeH from '../pages/client/homeH';
import About from '../pages/client/About';
import Contact from '../pages/client/Contact';
import BusSchedule from '../pages/client/BusSchedule';
import ActiveTickets from '../pages/client/active-tickets';
import TicketHistory from '../pages/client/TicketHistory';
import MetroSchedule from '../pages/client/metroSchedule';
import RefundRequest from '../pages/client/refundRequest';
import ProtectedRoute from './ProtectedRoute';

const AppRoutes = () => {
    return (
        <Routes>
            {/* Public/Auth Routes */}
            <Route path="/" element={<Auth />} />
            <Route path="/login" element={<Auth />} />
            <Route path="/Register" element={<Auth />} />
            
            {/* Passenger / Client Protected Routes */}
            <Route element={<ProtectedRoute allowedRoles={['passenger']} />}>
                <Route element={<MainLayout />}>
                    <Route path="/Home" element={<HomeH />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/packages" element={<Packages />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/active-tickets" element={<ActiveTickets />} />
                    <Route path="/history" element={<TicketHistory />} />
                    <Route path="/busSchedule" element={<BusSchedule />} />
                    <Route path="/metroSchedule" element={<MetroSchedule />} />
                    <Route path="/refundRequest" element={<RefundRequest />} />
                </Route>
            </Route>

            {/* Admin and SuperAdmin Protected Routes */}
            <Route element={<ProtectedRoute allowedRoles={['admin', 'superAdmin']} />}>
                <Route path="/Dashboard" element={<Dashboard />} />
                <Route path="/parametre" element={<Parametre />} />
                <Route path="/superlog" element={<Superlog />} />
                <Route path="/admin" element={<CreateEmp />} />
                <Route path="/BookTicket" element={<BookTicket />} />
                <Route path="/bus" element={<Bus />} />
                <Route path="/metro" element={<Metro />} />
                <Route path="/transport" element={<Transport />} />
                <Route path="/stations" element={<Stations />} />
                <Route path="/routes" element={<RoutesPage />} />
                <Route path="/schedules" element={<Schedules />} />
                <Route path="/HomeRa" element={<Home/>} />
                <Route path="/Controller" element={<ControllerEmp/>} />
            </Route>

            {/* Controller Protected Routes */}
            <Route element={<ProtectedRoute allowedRoles={['controller']} />}>
                <Route path="/controller" element={<ControllerEmp />} />
            </Route>

            {/* General fallback */}
            <Route path="*" element={<Auth />} />
        </Routes>
    );
};

export default AppRoutes;
