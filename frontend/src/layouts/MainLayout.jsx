import { Outlet } from 'react-router-dom';

const MainLayout = () => {
  return (
    <div>
      {/* If you have a Navbar, it goes here */}
      <main>
        <Outlet /> {/* <--- WITHOUT THIS, LOGIN.JSX IS INVISIBLE */}
      </main>
    </div>
  );
};

export default MainLayout;