import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import palette from '../common/pallette';

function Superlog() {
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const ADMIN_PASSWORD = 'admin123';

    
    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!password) {
            setError('Le mot de passe est obligatoire');
            return;
        }

        if (password !== ADMIN_PASSWORD) {
            setError('Mot de passe incorrect');
            setPassword('');
            return;
        }

        setSuccess('✓ Accès autorisé! Bienvenue super admin');
        setPassword('');
        setTimeout(() => {
            navigate('/admin');
        }, 700);
    };

    return (
        <div style={{ background: `linear-gradient(to bottom right, ${palette.iceWhite}, white, ${palette.frostBlue})` }} className="min-h-screen py-12 px-4">
            <div className="mx-auto max-w-md">
                {/* Header */}
                <div className="text-center mb-10">
                    <div 
                        className="inline-flex items-center justify-center w-16 h-16 rounded-2xl shadow-lg mb-4"
                        style={{ background: `linear-gradient(135deg, ${palette.deepOcean}, ${palette.classicBlue})` }}
                    >
                        <span className="text-3xl">🔐</span>
                    </div>
                    <h1 
                        className="text-3xl font-bold bg-clip-text text-transparent mb-2"
                        style={{ backgroundImage: `linear-gradient(to right, ${palette.deepOcean}, ${palette.classicBlue})` }}
                    >
                        Accès Super Admin
                    </h1>
                    <p style={{ color: palette.skyBlue }} className="text-sm font-semibold">Zone réservée aux administrateurs</p>
                </div>

                {/* Card */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 relative">
                    {/* Close Button */}
                    <button
                        type="button"
                        onClick={() => window.history.back()}
                        className="absolute top-4 right-4 z-10 flex items-center justify-center w-10 h-10 rounded-full transition duration-200 transform hover:scale-110"
                        style={{ background: '#EF4444', color: 'white' }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#DC2626'}
                        onMouseLeave={(e) => e.currentTarget.style.background = '#EF4444'}
                        title="Fermer"
                    >
                        <span className="text-2xl font-bold">×</span>
                    </button>

                    <div 
                        className="h-1"
                        style={{ background: `linear-gradient(to right, ${palette.deepOcean}, ${palette.softTeal})` }}
                    ></div>

                    <div className="p-8">
                        {/* Messages */}
                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                                <p className="text-red-700 font-medium flex items-center">
                                    <span className="text-xl mr-2">⚠️</span>
                                    {error}
                                </p>
                            </div>
                        )}

                        {success && (
                            <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg">
                                <p className="text-green-700 font-medium flex items-center">
                                    <span className="text-xl mr-2">✓</span>
                                    {success}
                                </p>
                            </div>
                        )}

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Password Field */}
                            <div className="space-y-2">
                                <label style={{ color: palette.deepOcean }} className="block text-sm font-semibold">
                                    Mot de passe super admin
                                </label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Entrez le mot de passe"
                                    style={{ borderColor: palette.frostBlue, color: palette.deepOcean }}
                                    className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition duration-200 bg-white shadow-sm"
                                    onFocus={(e) => e.target.style.borderColor = palette.softTeal}
                                    onBlur={(e) => e.target.style.borderColor = palette.frostBlue}
                                />
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                style={{ background: `linear-gradient(to right, ${palette.deepOcean}, ${palette.classicBlue})` }}
                                className="w-full text-white font-bold py-3 px-6 rounded-lg transition duration-300 shadow-lg transform hover:scale-105 active:scale-95"
                                onMouseEnter={(e) => e.target.style.background = `linear-gradient(to right, ${palette.classicBlue}, #1e4959)`}
                                onMouseLeave={(e) => e.target.style.background = `linear-gradient(to right, ${palette.deepOcean}, ${palette.classicBlue})`}
                            >
                                Accéder à la Zone Admin
                            </button>
                        </form>

                        {/* Warning */}
                        <p 
                            className="text-center text-xs pt-4 border-t-2 mt-6 font-semibold"
                            style={{ borderColor: palette.frostBlue, color: palette.classicBlue }}
                        >
                            ⚠️ Tentatives d'accès non autorisées sont enregistrées
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Superlog;