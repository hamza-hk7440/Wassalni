import React from 'react';
import Navbar from '../../components/layout/Navbar';
import MainLayout from '../../components/layout/Main';
import '../../App.css';

function Dashboard() {
  return (
    <div>
      <Navbar />
      <MainLayout/>
    </div>
  );
}

export default Dashboard;