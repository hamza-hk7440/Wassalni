import { Outlet } from 'react-router-dom';
import Navbar from '../components/layout/NavbarH';
import Footer from '../components/layout/Footer';

const MainLayout = () => {
  return (
    <div className="app-layout">
      <Navbar /> 
      <main className="main-content-wrapper">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;