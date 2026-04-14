import React from 'react';
import { Link } from 'react-router-dom';
import tokenLogo from '../../assets/token_logo.png';
import useAuth from '../../hooks/useAuth';
import '../../App.css';
const Navbar = () => {
  const { tokens } = useAuth();
  return (
    <nav className="navbar">
      <div className="logo">Wasalni</div>
      <div className="nav-links">
        <span className="balance-amount">{tokens?.toLocaleString() || 0}</span>
        <img src={tokenLogo} alt="token" className="token-icon" />
        <Link to="/profile">My Profile</Link>
      </div>
    </nav>
  );
};
export default Navbar