import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import '../../App.css';

const Auth = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(location.pathname === '/login');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setIsLogin(location.pathname === '/login');
  }, [location.pathname]);

  const toggleAuthMode = () => {
    const newPath = isLogin ? '/register' : '/login';
    navigate(newPath);
  };

  return (
    <div className='auth-container'>
      {/* Role Switcher */}
      <div className='role-switcher'>
        <button 
          className={`switcher-btn ${!isAdmin ? 'active' : ''}`} 
          onClick={() => setIsAdmin(false)}
        >
          User Account
        </button>
        <button 
          className={`switcher-btn ${isAdmin ? 'active' : ''}`} 
          onClick={() => setIsAdmin(true)}
        >
          Admin Portal
        </button>
      </div>

      <div className='auth-card'>
        {isAdmin ? (
          /* ADMIN*/
          <div className='content-fade-in'>
            <h1 className='admin-title'>Admin Access</h1>
            <p className='subtitle'>Internal Management System</p>
            <form className='auth-form' onSubmit={(e) => e.preventDefault()}>
              <Input placeholder="Admin ID (ADM-XXXX)" required />
              <Input placeholder="Security Key" type='password' required />
              <Button type='submit' className="custom-btn admin-btn">Verify Identity</Button>
            </form>
            <p className='restricted-text'>RESTRICTED PERSONNEL ONLY</p>
          </div>
        ) : (
          /* USER*/
          <div className='content-fade-in'>
            <h1 className='user-title'>{isLogin ? "Welcome Back" : "Create your Account"}</h1>
            <p className='subtitle'>Join us today!</p>

            <form className='auth-form' onSubmit={(e) => e.preventDefault()}>
              {!isLogin && (
                <div className='name-row'>
                  <Input placeholder="First Name" required />
                  <Input placeholder="Last Name" required />
                </div>
              )}
              
              <Input type='email' placeholder="Email" required />
              <Input type='password' placeholder="Password" required />
              
              {!isLogin && (
                <Input type="password" placeholder="Confirm Password" required />
              )}

              <Button type='submit' className="custom-btn">
                {isLogin ? "Sign In" : "Sign Up"}
              </Button>
            </form>

            <p className='card-footer-text'>
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <span className='link-btn' onClick={toggleAuthMode}>
                {isLogin ? "Register" : "Login"}
              </span>
            </p>

            <div className="divider"><span>OR</span></div>
            
            <button className="google-btn">
              <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_Logo.svg" alt="google" width="18" />
              Continue with Google
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Auth;