import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Import your Layout and Pages
import MainLayout from '../layouts/MainLayout';
import Register from '../pages/auth/Register';
import Login from '../pages/auth/Login';


const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register/>} />
      </Route>
    </Routes>
  );
};


export default AppRoutes;