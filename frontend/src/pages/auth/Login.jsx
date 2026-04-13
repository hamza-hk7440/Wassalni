import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { loginWebFirstStep, loginWebSecondStep, registerUser } from '../../api/auth';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import google from '../../assets/google.jpg';

const Auth = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { loginUser } = useContext(AuthContext);

    const [isLogin, setIsLogin] = useState(location.pathname !== '/Register');
    
    // Form States
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    
    // Admin Extra Fields
    const [adminCode, setAdminCode] = useState('');
    
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
    }, [isLogin]);

    const toggleAuthMode = () => {
        const newPath = isLogin ? '/Register' : '/login';
        navigate(newPath);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            if (isLogin) {
                if (!pendingSession) {
                    // Step 1: Same login endpoint handles both Passengers and Admins
                    const data = await loginWebFirstStep({ email, password });
                    
                    if (data.session) {
                        // Backend detected an Admin and returned a session instead of a token
                        setPendingSession(data.session);
                    } else if (data.token) {
                        // Backend detected a Passenger and returned the token directly
                        loginUser(data.token, data.user || { role: 'passenger' });
                        navigate('/home');
                    }
                } else {
                    // Step 2: Validate admin code for Admins
                    const data = await loginWebSecondStep({ 
                        session: pendingSession, 
                        admin_code: adminCode 
                    });
                    loginUser(data.token, data.user);
                    navigate('/Dashboard');
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
                
                setIsLogin(true);
                navigate('/login');
            }
        } catch (err) {
            setError(err.response?.data?.error || "Authentication failed.");
            if (isLogin && err.response?.status === 401 && pendingSession) {
                // Keep pending session so they can re-type the code
            } else {
                setPendingSession(null);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen w-screen bg-[#f1f8fb] font-sans p-5">
            <div className="w-full max-w-[450px] bg-white p-10 rounded-[15px] shadow-[0_10px_40px_rgba(0,0,0,0.05)] animate-[fadeIn_0.4s_ease-in-out]">
                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm text-center">
                        {error}
                    </div>
                )}

                <div className="animate-in fade-in duration-500">
                    <h1 className="text-[1.8rem] font-bold text-center text-[#3b759f] mb-2">
                        {isLogin 
                            ? (pendingSession ? "Verification Requise" : "Welcome Back") 
                            : "Create your Account"}  
                    </h1>
                    <p className="text-center text-[#8899a6] text-sm mb-[30px]">
                        {isLogin 
                            ? (pendingSession ? "Entrez votre code admin à 6 chiffres" : "Connectez-vous à votre compte") 
                            : "Rejoignez-nous aujourd'hui !"}
                    </p>

                    <form className="flex flex-col gap-[15px]" onSubmit={handleSubmit}>
                        {!isLogin && (
                            <div className="flex gap-[15px]">
                                <Input placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required /> 
                                <Input placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} required />  
                            </div>
                        )}

                        {(!isLogin || !pendingSession) && (
                            <>
                                <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required /> 
                                <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                            </>
                        )}

                        {isLogin && pendingSession && (
                            <Input placeholder="Code Admin" type="text" value={adminCode} onChange={(e) => setAdminCode(e.target.value)} required />
                        )}

                        <Button type="submit" disabled={loading} className="custom-btn">       
                            {loading ? "Patientez..." : (isLogin ? (pendingSession ? "Vérifier le code" : "Se connecter") : "S'inscrire")}
                        </Button>
                        
                        {pendingSession && (
                            <button type="button" onClick={() => setPendingSession(null)} className="text-sm text-center text-gray-500 hover:text-gray-700 mt-2">
                                Annuler et recommencer
                            </button>
                        )}
                    </form>

                    {!pendingSession && (
                        <p className="text-center text-[13px] text-[#657786] mt-5">
                            {isLogin ? "Vous n'avez pas de compte ? " : "Vous avez déjà un compte ? "}
                            <span
                                className="text-[#3b759f] font-bold cursor-pointer hover:underline"
                                onClick={toggleAuthMode}
                            >
                                {isLogin ? "S'inscrire" : "Se connecter"}
                            </span>
                        </p>
                    )}

                    {isLogin && !pendingSession && (
                        <>
                            <div className="flex items-center text-center my-5 text-[#ccc] text-[12px] before:content-[''] before:flex-1 before:border-b before:border-[#eee] after:content-[''] after:flex-1 after:border-b after:border-[#eee]">  
                                <span className="px-2.5">OÙ</span>
                            </div>

                            <button type="button" className="flex items-center justify-center gap-2.5 w-full p-3 bg-white border border-[#e1e8ed] rounded-lg cursor-pointer font-semibold transition-colors hover:bg-gray-50">
                                <img src={google} alt="google" width="18" />        
                                Continuer avec Google
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Auth;
