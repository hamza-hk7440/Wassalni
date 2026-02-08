import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="text-2xl font-bold text-white">
            Transport System
          </div>

          {/* Menu Items */}
          <ul className="flex space-x-8">
            <li>
              <Link 
                to="/" 
                className="hover:text-blue-200 transition duration-300 font-semibold hover:underline"
              >
                👤 Client
              </Link>
            </li>
            <li>
              <Link 
                to="/controleur" 
                className="hover:text-blue-200 transition duration-300 font-semibold hover:underline"
              >
                👨‍💼 Contrôleur
              </Link>
            </li>
            <li>
              <Link 
                to="/transport" 
                className="hover:text-blue-200 transition duration-300 font-semibold hover:underline"
              >
                🚌 Transport
              </Link>
            </li>
            <li>
              <Link 
                to="/ticket" 
                className="hover:text-blue-200 transition duration-300 font-semibold hover:underline"
              >
                🎫 Ticket
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;