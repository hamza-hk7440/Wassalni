import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import tokenLogo from '../../assets/token_logo.png';
import mainLogo from '../../assets/logo1.png';
import useAuth from '../../hooks/useAuth';
import '../../App.css';
import avatar from '../../assets/default_pfp.png'

const Navbar = () => {
  const { tokens, user } = useAuth();
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <nav className="navbar">
      <Link to={user ? "/home" : "/login"} className="logo" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0' }}>
        <img src={mainLogo} alt="" style={{ height: '40px', width: 'auto', objectFit: 'contain' }} />
        asalni
      </Link>

      <div className="nav-links">
        {!isAuthPage && user && (
          <>
            <Link to="/home" className="nav-text-link">Home</Link>
            <Link to="/about" className="nav-text-link">About</Link>
            <Link to="/contact" className="nav-text-link">Contact Us</Link>
            <Link to="/packages" className="balance-pill" style={{ textDecoration: 'none', cursor: 'pointer' }} title="Buy Tokens">
              <img src={tokenLogo} alt="token" className="token-icon" />
              <span className="balance-amount">{tokens?.toLocaleString() || 0}</span>
              <div style={{ 
                marginLeft: '8px', 
                backgroundColor: '#3b759f', 
                color: 'white', 
                borderRadius: '50%', 
                width: '18px', 
                height: '18px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontSize: '14px', 
                fontWeight: 'bold' 
              }}>+</div>
            </Link>
            <Link to="/profile" className="profile-btn">
              <img
                src={avatar}
                alt="avatar"
                className="profile-img-nav"
              />
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
