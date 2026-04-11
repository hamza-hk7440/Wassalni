import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

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
        <div className="flex flex-col items-center justify-center min-h-screen w-screen bg-[#f1f8fb] font-sans p-5">
            {/* Role Switcher */}
            <div className="flex bg-[#eee] p-[5px] rounded-xl mb-[25px] w-fit mx-auto">
                <button 
                    className={`border-none py-2.5 px-5 rounded-lg cursor-pointer font-semibold transition-all duration-200 ${!isAdmin ? 'bg-white shadow-[0_2px_4px_rgba(0,0,0,0.1)] text-[#3b759f]' : 'bg-transparent text-gray-600'}`}
                    onClick={() => setIsAdmin(false)}
                >
                    User Account
                </button>
                <button 
                    className={`border-none py-2.5 px-5 rounded-lg cursor-pointer font-semibold transition-all duration-200 ${isAdmin ? 'bg-white shadow-[0_2px_4px_rgba(0,0,0,0.1)] text-[#3b759f]' : 'bg-transparent text-gray-600'}`}
                    onClick={() => setIsAdmin(true)}
                >
                    Admin Portal
                </button>
            </div>

            <div className="w-full max-w-[450px] bg-white p-10 rounded-[15px] shadow-[0_10px_40px_rgba(0,0,0,0.05)] animate-[fadeIn_0.4s_ease-in-out]">
                {isAdmin ? (
                    /* ADMIN VIEW */
                    <div className="animate-in fade-in duration-500">
                        <h1 className="text-[1.8rem] font-bold text-center text-[#3b759f] mb-2">Admin Access</h1>
                        <p className="text-center text-[#8899a6] text-sm mb-[30px]">Internal Management System</p>
                        
                        <form className="flex flex-col gap-[15px]" onSubmit={(e) => e.preventDefault()}>
                            <Input placeholder="Admin ID (ADM-XXXX)" required />
                            <Input placeholder="Security Key" type="password" required />
                            <Button type="submit" className="custom-btn admin-btn">Verify Identity</Button>
                        </form>
                        <p className="text-[#d9534f] text-[0.8rem] font-bold text-center mt-5">RESTRICTED PERSONNEL ONLY</p>
                    </div>
                ) : (
                    /* USER VIEW */
                    <div className="animate-in fade-in duration-500">
                        <h1 className="text-[1.8rem] font-bold text-center text-[#3b759f] mb-2">
                            {isLogin ? "Welcome Back" : "Create your Account"}
                        </h1>
                        <p className="text-center text-[#8899a6] text-sm mb-[30px]">Join us today!</p>

                        <form className="flex flex-col gap-[15px]" onSubmit={(e) => e.preventDefault()}>
                            {!isLogin && (
                                <div className="flex gap-[15px]">
                                    <Input placeholder="First Name" required />
                                    <Input placeholder="Last Name" required />
                                </div>
                            )}
                            
                            <Input type="email" placeholder="Email" required />
                            <Input type="password" placeholder="Password" required />
                            
                            {!isLogin && (
                                <Input type="password" placeholder="Confirm Password" required />
                            )}

                            <Button type="submit" className="custom-btn">
                                {isLogin ? "Sign In" : "Sign Up"}
                            </Button>
                        </form>

                        <p className="text-center text-[13px] text-[#657786] mt-5">
                            {isLogin ? "Don't have an account? " : "Already have an account? "}
                            <span 
                                className="text-[#3b759f] font-bold cursor-pointer hover:underline" 
                                onClick={toggleAuthMode}
                            >
                                {isLogin ? "Register" : "Login"}
                            </span>
                        </p>

                        <div className="flex items-center text-center my-5 text-[#ccc] text-[12px] before:content-[''] before:flex-1 before:border-b before:border-[#eee] after:content-[''] after:flex-1 after:border-b after:border-[#eee]">
                            <span className="px-2.5">OR</span>
                        </div>

                        <button className="flex items-center justify-center gap-2.5 w-full p-3 bg-white border border-[#e1e8ed] rounded-lg cursor-pointer font-semibold transition-colors hover:bg-gray-50">
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