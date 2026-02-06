import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Input from '../../components/common/Input';
import './Login.css';

const Auth = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Determine if we show Login or Register based on the URL
  const [isLogin, setIsLogin] = useState(location.pathname === '/login');
  const [isAdmin, setIsAdmin] = useState(false);

  // Sync state if URL changes (e.g., user clicks back button)
  useEffect(() => {
    setIsLogin(location.pathname === '/login');
  }, [location.pathname]);

  const toggleAuthMode = () => {
    const newPath = isLogin ? '/register' : '/login';
    navigate(newPath);
    setIsLogin(!isLogin);
  };

  return (
    <div className="login-page-wrapper">
      
      {/* Role Toggle: Stays fixed at the top */}
      <div className="role-toggle-container">
        <button 
          className={`toggle-btn ${!isAdmin ? 'active-user' : ''}`}
          onClick={() => setIsAdmin(false)}
        >
          User Account
        </button>
        <button 
          className={`toggle-btn ${isAdmin ? 'active-admin' : ''}`}
          onClick={() => setIsAdmin(true)}
        >
          Admin Portal
        </button>
      </div>

      <div className="perspective-container">
        <div className={`flip-card-inner ${isAdmin ? 'is-flipped' : ''}`}>
          
          {/* --- FRONT FACE: USER (Swaps between Login/Register) --- */}
          <div className="card-face face-front">
            <h1 className="form-title">{isLogin ? "Login" : "Register"}</h1>
            
            <form className="flex flex-col gap-4">
              {/* Conditional Fields for Register */}
              {!isLogin && (
                <div className="fade-in-fields">
                  <Input label="Full Name" placeholder="John Doe" required />
                </div>
              )}

              <Input label="Email" type="email" placeholder="user@example.com" required />
              
              <Input label="Password" type="password" placeholder="••••••••" required />

              {!isLogin && (
                <div className="fade-in-fields">
                  <Input label="Confirm Password" type="password" placeholder="••••••••" required />
                </div>
              )}

              <button className="custom-submit-btn" type="submit">
                {isLogin ? "Sign In" : "Create Account"}
              </button>
            </form>

            <p className="card-footer-text">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button className="link-btn" onClick={toggleAuthMode}>
                {isLogin ? "Register here" : "Login here"}
              </button>
            </p>
          </div>

          {/* --- BACK FACE: ADMIN --- */}
          <div className="card-face face-back">
            <h1 className="form-title" style={{ color: '#1E5470' }}>Admin Access</h1>
            <form className="flex flex-col gap-4">
              <Input label="Admin ID" placeholder="ADM-XXXX" required />
              <Input label="Security Key" type="password" placeholder="Enter Secret Key" required />
              <button className="custom-submit-btn admin-btn" type="submit">
                Verify Identity
              </button>
            </form>
            <p className="card-footer-text" style={{ fontSize: '11px', color: '#999', letterSpacing: '2px' }}>
              RESTRICTED PERSONNEL ONLY
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Auth;