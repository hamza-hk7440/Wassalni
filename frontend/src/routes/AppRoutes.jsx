import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Import your Layout and Pages
import MainLayout from '../layouts/MainLayout';
import Auth from '../pages/auth/Login';


const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route path="login" element={<Auth />} />
        <Route path="Register" element={<Auth />} />
      </Route>
    </Routes>
  );
};


export default AppRoutes;