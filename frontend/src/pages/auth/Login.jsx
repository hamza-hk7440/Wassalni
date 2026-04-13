import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { loginWebFirstStep, loginWebSecondStep, registerUser, controllerLogin } from '../../api/auth';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import google from '../../assets/google.jpg';

const Auth = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { loginUser } = useContext(AuthContext);

    const [isLogin, setIsLogin] = useState(location.pathname !== '/Register');
    const [isAdmin, setIsAdmin] = useState(false);
    const [isController, setIsController] = useState(false);
    
    // Form States
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    
    // Admin / Controller Extra Fields
    const [adminCode, setAdminCode] = useState('');
    const [controllerCode, setControllerCode] = useState('');
    
    // Two-step admin login state
    const [pendingSession, setPendingSession] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setIsLogin(location.pathname !== '/Register');
    }, [location.pathname]);

    // Cleanup form on tab switch
    useEffect(() => {
        setError(null);
        setPendingSession(null);
    }, [isAdmin, isController, isLogin]);

    const toggleAuthMode = () => {
        const newPath = isLogin ? '/Register' : '/login';
        navigate(newPath);
    };

    const handleUserSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            if (isLogin) {
                const data = await loginWebFirstStep({ email, password });
                
                if (data.token) {
                    // Passenger successfully authenticated
                    loginUser(data.token, data.user || { role: 'passenger' });
                    navigate('/home');
                } else if (data.session) {
                   // Unexpectedly got an admin session under user login
                   setError("This account requires admin login tab.");
                }
            } else {
                // Register Passenger
                const data = await registerUser({
                    email,
                    password,
                    first_name: firstName,
                    last_name: lastName,
                    role: 'passenger'
                });
                
                // Usually register returns the fresh user or demands login next.
                // Assuming it just creates user, we toggle them to login.
                setIsLogin(true);
                navigate('/login');
            }
        } catch (err) {
            setError(err.response?.data?.error || "Authentication failed.");
        } finally {
            setLoading(false);
        }
    };

    const handleAdminSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            if (!pendingSession) {
                // Step 1: Get temp session
                const data = await loginWebFirstStep({ email, password });
                if (data.session) {
                    setPendingSession(data.session);
                } else if (data.token) {
                    setError("This is a passenger account. Switch to User tab.");
                }
            } else {
                // Step 2: Validate admin code
                const data = await loginWebSecondStep({ 
                    session: pendingSession, 
                    admin_code: adminCode 
                });
                loginUser(data.token, data.user);
                navigate('/Dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.error || "Admin authentication failed.");
            if(err.response?.status === 401 && pendingSession) {
                // Keep pending session so they can re-type the code
            } else {
                setPendingSession(null);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleControllerSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const data = await controllerLogin({ email, password, code: controllerCode });
            loginUser(data.token, data.user);
            navigate('/controller');
        } catch (err) {
            setError(err.response?.data?.error || "Controller authentication failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen w-screen bg-[#f1f8fb] font-sans p-5">
            <div className="flex bg-[#eee] p-[5px] rounded-xl mb-[25px] w-fit mx-auto">
                <button
                    className={`border-none py-2.5 px-5 rounded-lg cursor-pointer font-semibold transition-all duration-200 ${!isAdmin && !isController ? 'bg-white shadow-[0_2px_4px_rgba(0,0,0,0.1)] text-[#3b759f]' : 'bg-transparent text-gray-600'}`}       
                    onClick={() => { setIsAdmin(false); setIsController(false); }}
                >
                    Passenger
                </button>
                <button
                    className={`border-none py-2.5 px-5 rounded-lg cursor-pointer font-semibold transition-all duration-200 ${isController ? 'bg-white shadow-[0_2px_4px_rgba(0,0,0,0.1)] text-[#3b759f]' : 'bg-transparent text-gray-600'}`}        
                    onClick={() => { setIsAdmin(false); setIsController(true); }}
                >
                    Controller
                </button>
                <button
                    className={`border-none py-2.5 px-5 rounded-lg cursor-pointer font-semibold transition-all duration-200 ${isAdmin ? 'bg-white shadow-[0_2px_4px_rgba(0,0,0,0.1)] text-[#3b759f]' : 'bg-transparent text-gray-600'}`}        
                    onClick={() => { setIsAdmin(true); setIsController(false); }}
                >
                    Admin Portal
                </button>
            </div>

            <div className="w-full max-w-[450px] bg-white p-10 rounded-[15px] shadow-[0_10px_40px_rgba(0,0,0,0.05)] animate-[fadeIn_0.4s_ease-in-out]">
                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm text-center">
                        {error}
                    </div>
                )}

                {isAdmin && (
                    /* ADMIN */
                    <div className="animate-in fade-in duration-500">
                        <h1 className="text-[1.8rem] font-bold text-center text-[#3b759f] mb-2">Admin Access</h1>
                        <p className="text-center text-[#8899a6] text-sm mb-[30px]">
                            {pendingSession ? "Step 2: Enter Verification Code" : "Internal Management System"}
                        </p>

                        <form className="flex flex-col gap-[15px]" onSubmit={handleAdminSubmit}>
                            {!pendingSession ? (
                                <>
                                    <Input placeholder="Admin Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                                    <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                                </>
                            ) : (
                                <Input placeholder="6-digit Admin Code" type="text" value={adminCode} onChange={(e) => setAdminCode(e.target.value)} required />
                            )}
                            <Button type="submit" disabled={loading} className="custom-btn admin-btn">
                                {loading ? "Verifying..." : (pendingSession ? "Complete Login" : "Verify Identity")}
                            </Button>
                            {pendingSession && (
                                <button type="button" onClick={() => setPendingSession(null)} className="text-sm text-center text-gray-500 hover:text-gray-700 mt-2">
                                    Cancel and restart
                                </button>
                            )}
                        </form>
                    </div>
                )}

                {isController && (
                    /* CONTROLLER */
                    <div className="animate-in fade-in duration-500">
                        <h1 className="text-[1.8rem] font-bold text-center text-[#3b759f] mb-2">Controller Check-in</h1>
                        <p className="text-center text-[#8899a6] text-sm mb-[30px]">Device scanning portal</p>

                        <form className="flex flex-col gap-[15px]" onSubmit={handleControllerSubmit}>
                            <Input placeholder="Controller Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                            <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                            <Input placeholder="Controller Assignment Code" type="text" value={controllerCode} onChange={(e) => setControllerCode(e.target.value)} required />
                            
                            <Button type="submit" disabled={loading} className="custom-btn admin-btn">
                                {loading ? "Connecting..." : "Initialize Scanner"}
                            </Button>
                        </form>
                    </div>
                )}

                {!isAdmin && !isController && (
                    /* PASSENGER USER */
                    <div className="animate-in fade-in duration-500">
                        <h1 className="text-[1.8rem] font-bold text-center text-[#3b759f] mb-2">
                            {isLogin ? "Welcome Back" : "Create your Account"}  
                        </h1>
                        <p className="text-center text-[#8899a6] text-sm mb-[30px]">Join us today!</p>

                        <form className="flex flex-col gap-[15px]" onSubmit={handleUserSubmit}>
                            {!isLogin && (
                                <div className="flex gap-[15px]">
                                    <Input placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required /> 
                                    <Input placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} required />  
                                </div>
                            )}

                            <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required /> 
                            <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />

                            <Button type="submit" disabled={loading} className="custom-btn">       
                                {loading ? "Please wait..." : (isLogin ? "Sign In" : "Sign Up")}
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

                        {isLogin && (
                            <>
                                <div className="flex items-center text-center my-5 text-[#ccc] text-[12px] before:content-[''] before:flex-1 before:border-b before:border-[#eee] after:content-[''] after:flex-1 after:border-b after:border-[#eee]">  
                                    <span className="px-2.5">OR</span>
                                </div>

                                <button className="flex items-center justify-center gap-2.5 w-full p-3 bg-white border border-[#e1e8ed] rounded-lg cursor-pointer font-semibold transition-colors hover:bg-gray-50">
                                    <img src={google} alt="google" width="18" />        
                                    Continue with Google
                                </button>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Auth;
