import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import palette from '../common/pallette';
import { useAdminLanguage } from '../common/language.jsx';

function Superlog() {
	const { t } = useAdminLanguage();
    const navigate = useNavigate();
    const target = new URLSearchParams(window.location.search).get('target') || 'admin';
    const isController = target === 'controller';
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const ADMIN_PASSWORD = 'admin123';

    
    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!password) {
            setError(t('requiredPassword', 'Password is required'));
            return;
        }

        if (password !== ADMIN_PASSWORD) {
            setError(t('incorrectPassword', 'Incorrect password'));
            setPassword('');
            return;
        }

        setSuccess(`✓ ${t('accessGranted', 'Access granted! Welcome super admin')}`);
        setPassword('');
        setTimeout(() => {
            navigate(target === 'controller' ? '/controller' : '/admin');
        }, 700);
    };

    return (
        <div style={{ background: `linear-gradient(to bottom right, ${palette.iceWhite}, white, ${palette.frostBlue})` }} className="min-h-screen py-12 px-4">
            <div className="mx-auto max-w-md">
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
                        {t('superAdminAccess', 'Super Admin Access')}
                    </h1>
                    <p className="text-skyBlue text-sm font-semibold">{t('restrictedZone', 'Administrators only area')}</p>
                    <p className="mt-1 text-xs font-bold uppercase tracking-wider text-classicBlue">
                        {t('destination', 'Destination')}: {isController ? t('controllers', 'Controllers') : t('admins', 'Admins')}
                    </p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 relative">
                    <button
                        type="button"
                        onClick={() => window.history.back()}
                        className="absolute top-4 right-4 z-10 flex items-center justify-center w-10 h-10 rounded-full transition duration-200 transform hover:scale-110 bg-dangerText text-pureWhite"
                        title="Fermer"
                    >
                        <span className="text-2xl font-bold">×</span>
                    </button>

                    <div 
                        className="h-1"
                        style={{ background: `linear-gradient(to right, ${palette.deepOcean}, ${palette.softTeal})` }}
                    ></div>

                    <div className="p-8">
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

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-deepOcean block text-sm font-semibold">
                                    {t('superAdminPassword', 'Super admin password')}
                                </label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder={t('enterPassword', 'Enter password')}
                                    className="border-frostBlue text-deepOcean w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition duration-200 bg-white shadow-sm"
                                />
                            </div>

                            <button
                                type="submit"
                                style={{ background: `linear-gradient(to right, ${palette.deepOcean}, ${palette.classicBlue})` }}
                                className="w-full text-white font-bold py-3 px-6 rounded-lg transition duration-300 shadow-lg transform hover:scale-105 active:scale-95"
                            >
                                {isController ? t('accessControllerManagement', 'Access controller management') : t('accessAdminManagement', 'Access admin management')}
                            </button>
                        </form>

                        <p 
                            className="text-center text-xs pt-4 border-t-2 mt-6 font-semibold border-frostBlue text-classicBlue"
                        >
                            ⚠️ {t('unauthorizedAttempts', 'Unauthorized access attempts are logged')}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Superlog;