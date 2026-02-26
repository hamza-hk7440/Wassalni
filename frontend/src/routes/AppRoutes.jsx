import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Auth from '../pages/auth/Login';
import Home from '../pages/client/Home';
import Packages from '../pages/client/packages';
import Profile from '../pages/client/profile';



const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route path="login" element={<Auth />} />
        <Route path="Register" element={<Auth />} />
        <Route path="home" element={<Home />} />
        <Route path="profile"element={<Profile />} />
        <Route path="packages" element={<Packages />} />
      </Route>
    </Routes>
  );
};


export default AppRoutes;