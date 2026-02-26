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
    setIsLogin(!isLogin);
  };

  return (
   <div className='auth-container'>
      <div className='role-switcher'>
        <Button variant={!isAdmin ? 'active-user':''} onClick={()=>setIsAdmin(false)}>User Account</Button>
        <Button variant={!isAdmin ? 'active-user':''} onClick={()=>setIsAdmin(true)}>admin portal</Button>
      </div>
      <div className='container'>
        <div className={`card-flip-engine ${isAdmin ? 'is-flipped' : ''}`}> {/*responsable for the animation of the card flipping*/}
        <div className='card-face-user'>
          <h1 className='user-title'>{isLogin?"login":"register"}</h1>
          <form action="" className='auth-form'>
            {!isLogin&& <Input label="Full Name" placeholder="Full Name" required/>}
            <Input label="Email" type='email'placeholder="user@example.com"required/>
            <Input label="Password" type='password'placeholder="••••••••"required/>
            {!isLogin && (
            <div className="fade-in-fields"><Input label="Confirm Password" type="password" placeholder="••••••••" required /></div> )}
            <Button type='submit'variant='submit-primary'>{isLogin?"sign In":"Create Account"}</Button>
          </form>
          <p className='card-footer-text'>{isLogin?"Don't have an account?":"Already have an account "}
            <Button variant='link-bnt'onClick={toggleAuthMode}>
              {isLogin?"Register here":"login here"}
            </Button>
          </p>
        </div>
      </div>
      <div className='card-face-admin'>
        <h1 className='admin-title'>Admin Access</h1>
        <form action="" className='auth-form'>
          <Input label="Admin ID" placeholder="ADM-XXXX"required/>
          <Input label="Security key"placeholder="Enter Secret Key" type='password'required/>
          <Button type='submit' variant='submit-admin'>Verify Identity</Button>
        </form>
        <p className='card-footer-text'>RESTRICTED PERSONNEL ONLY</p>
      </div>
      
      </div>
   </div>
  );
};

export default Auth;