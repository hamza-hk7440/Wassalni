import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { googleLoginStart, loginWebFirstStep, loginWebSecondStep, registerUser } from '../../api/auth';
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

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        const userParam = params.get('user');
        const oauthError = params.get('error');

        if (oauthError) {
            setError(oauthError);
            return;
        }

        if (token && userParam) {
            try {
                let parsedUser;
                try {
                    parsedUser = JSON.parse(userParam);
                } catch {
                    parsedUser = JSON.parse(decodeURIComponent(userParam));
                }
                loginUser(token, parsedUser);
                if (parsedUser?.role === 'admin' || parsedUser?.role === 'superAdmin') {
                    navigate('/Dashboard', { replace: true });
                } else {
                    navigate('/home', { replace: true });
                }
            } catch (err) {
                setError('Google login callback parsing failed.');
            }
        }
    }, [location.search, loginUser, navigate]);

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
                    console.log("test 1");
                    
                    const data = await loginWebFirstStep({ email, password });
                    console.log("test 2", data);
                    
                    if (data.token_temp) {
                    console.log("test 3");
                        // Backend detected an Admin and returned a session instead of a token
                        setPendingSession(data.token_temp);
                    } else if (data.token) {
                    console.log("test 4");
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

    const handleGoogleLogin = async () => {
        setError(null);
        setLoading(true);
        try {
            const data = await googleLoginStart();
            if (data?.url) {
                window.location.href = data.url;
                return;
            }
            setError('Google OAuth URL is missing.');
        } catch (err) {
            setError(err.response?.data?.error || 'Google authentication failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative flex min-h-screen w-screen items-center justify-center overflow-hidden bg-[linear-gradient(145deg,#eaf6ff_0%,#f7fcff_45%,#ffffff_100%)] p-5 font-sans">
            <div className="pointer-events-none absolute -left-20 top-10 h-72 w-72 rounded-full bg-[#6EC1D1]/20 blur-3xl" />
            <div className="pointer-events-none absolute -right-20 bottom-8 h-80 w-80 rounded-full bg-[#34729C]/20 blur-3xl" />

            <div className="relative w-full max-w-[460px] rounded-2xl border border-[#d7ecf4] bg-white p-10 shadow-[0_18px_60px_rgba(30,84,112,0.14)] animate-[fadeIn_0.4s_ease-in-out]">
                {error && (
                    <div className="mb-4 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                        <p className="text-center">Erreur: {error}</p>
                    </div>
                )}

                <div className="animate-in fade-in duration-500">
                    <h1 className="mb-2 text-center text-[1.9rem] font-extrabold tracking-tight text-[#1E5470]">
                        {isLogin 
                            ? (pendingSession ? "Verification requise" : "Connexion") 
                            : "Creation de compte"}
                    </h1>
                    <p className="mb-[28px] text-center text-sm font-medium text-[#6b8292]">
                        {isLogin 
                            ? (pendingSession ? "Entrez votre code admin a 6 chiffres" : "Connectez-vous a votre compte") 
                            : "Rejoignez-nous aujourd'hui"}
                    </p>

                    <form className="flex flex-col gap-3.5" onSubmit={handleSubmit}>
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
                            {loading ? "Patientez..." : (isLogin ? (pendingSession ? "Verifier le code" : "Se connecter") : "S'inscrire")}
                        </Button>
                        
                        {pendingSession && (
                            <button type="button" onClick={() => setPendingSession(null)} className="text-sm text-center text-gray-500 hover:text-gray-700 mt-2">
                                Annuler et recommencer
                            </button>
                        )}
                    </form>

                    {!pendingSession && (
                        <p className="mt-5 text-center text-[13px] text-[#657786]">
                            {isLogin ? "Vous n'avez pas de compte ? " : "Vous avez deja un compte ? "}
                            <span
                                className="cursor-pointer font-bold text-[#34729C] hover:text-[#1E5470] hover:underline"
                                onClick={toggleAuthMode}
                            >
                                {isLogin ? "S'inscrire" : "Se connecter"}
                            </span>
                        </p>
                    )}

                    {isLogin && !pendingSession && (
                        <>
                            <div className="my-5 flex items-center text-center text-[12px] text-[#9cb1be] before:mr-3 before:flex-1 before:border-b before:border-[#dbeaf1] after:ml-3 after:flex-1 after:border-b after:border-[#dbeaf1]">  
                                <span className="px-2.5">OU</span>
                            </div>

                            <button
                                type="button"
                                onClick={handleGoogleLogin}
                                disabled={loading}
                                className="flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-xl border border-[#d7e8ef] bg-white p-3 font-semibold text-[#1E5470] transition-all hover:-translate-y-[1px] hover:border-[#c4dfea] hover:bg-[#f7fbfe] disabled:opacity-70"
                            >
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
