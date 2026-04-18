import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import Navbar from './components/layout/Navbar'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { AdminLanguageProvider } from './components/common/language.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AdminLanguageProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </AdminLanguageProvider>
    </BrowserRouter>
);
