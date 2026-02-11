import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
<div className='fixed top-0 left-0 right-0 h-20 bg-blue-600 z-30 
flex items-center px-4 shadow-md'>      
<h1 className="text-white text-2xl font-bold ml-25">
        Mon Application
    </h1>
    </div>
    {isOpen === false && (  
      <button className="fixed top-4 left-4 z-50 p-2 bg-blue-600 text-white rounded-md 
      shadow-lg hover:bg-blue-700 transition-colors" onClick={() => setIsOpen(true)}>☰ menu</button>
    )}
    {isOpen === true && (  
      <button className="fixed top-4 left-4 z-50 p-2 bg-red-600 text-white rounded-md shadow-lg 
      hover:bg-red-700 transition-colors" onClick={() => setIsOpen(false)}>✖️ close</button>
    )}   
  <nav className={`fixed top-0 left-0 h-full w-54 bg-white shadow-2xl z-40 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 pt-20">
          <ul className="flex flex-col space-y-10">
            <li>
              <Link to="/client" onClick={() => setIsOpen(false)} className="hover:text-blue-200 
                transition duration-300 font-semibold
                 hover:underline">
                👤 Client
              </Link>
            </li>
            <li>
              <Link 
              onClick={() => setIsOpen(false)}
                to="/controleur" 
                className="hover:text-blue-200 transition duration-300 font-semibold hover:underline"
              >
                👨‍💼 Contrôleur
              </Link>
            </li>
            <li>
              <Link 
              onClick={() => setIsOpen(false)}
                to="/transport" 
                className="hover:text-blue-200 transition duration-300 font-semibold hover:underline"
              >
                🚌 Transport
              </Link>
            </li>
            <li>
              <Link 
                to="/ticket" 
                onClick={() => setIsOpen(false)}
                className="hover:text-blue-200 transition duration-300 font-semibold hover:underline "
              >
                🎫 Ticket
              </Link>
            </li>
          </ul>

          <ul>
            <li className="mt-auto border-t pt-6">
              <Link 
                to="/login" 
                onClick={() => setIsOpen(false)}
                className="flex items-center text-red-600 hover:text-red-800 transition duration-300 
                font-bold hover:underline space-y-40">
               🚪 deconnexion
              </Link>
            </li>
          </ul>
          </div>
    </nav>
    
    </>
  );
}

export default Navbar;