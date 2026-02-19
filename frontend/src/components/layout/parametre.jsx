import { useState } from 'react';

function Parametre() {
    const [nom, setNom] = useState('');
    const [email, setEmail] = useState('');
    const [telephone, setTelephone] = useState('');
    const [adresse, setAdresse] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    // Palette du navbar
    const palette = {
        deepOcean: "#1E5470", 
        classicBlue: "#34729C",
        skyBlue: "#6CB1DA",
        softTeal: "#6EC1D1",   
        frostBlue: "#C8EAEC",
        iceWhite: "#D1ECFF"    
    };

    const states = {
        nom:"Rayen",
        prenom:"Masmoudi",
        email:"rayen.masmoudi@example.com",
        telephone:"12345678",
        adresse:"123 Rue Principale, Tunis"
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (!nom || !email || !telephone || !adresse) {
            setError('Tous les champs sont obligatoires');
            return;
        }

        if (!email.includes('@')) {
            setError('Email invalide');
            return;
        }

        setMessage('✓ Paramètres mis à jour avec succès');
        setNom('');
        setEmail('');
        setTelephone('');
        setAdresse('');
    };

    const InputField = ({ label, type, value, onChange, placeholder }) => (
        <div className="space-y-2">
            <label style={{ color: palette.deepOcean }} className="block text-sm font-semibold">{label}</label>
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                style={{ borderColor: palette.frostBlue, color: palette.deepOcean }}
                className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition duration-200 bg-white shadow-sm"
                onFocus={(e) => e.target.style.borderColor = palette.softTeal}
                onBlur={(e) => e.target.style.borderColor = palette.frostBlue}
            />
        </div>
    );

    return (
        <div style={{ background: `linear-gradient(to bottom right, ${palette.iceWhite}, white, ${palette.frostBlue})` }} className="min-h-screen py-12 px-4">
            <div className="mx-auto max-w-2xl">
                {/* Header */}
                <div className="text-center mb-10">
                    <div 
                        className="inline-flex items-center justify-center w-16 h-16 rounded-2xl shadow-lg mb-4"
                        style={{ background: `linear-gradient(135deg, ${palette.deepOcean}, ${palette.classicBlue})` }}
                    >
                        <span className="text-3xl">⚙️</span>
                    </div>
                    <h1 
                        className="text-4xl font-bold bg-clip-text text-transparent mb-2"
                        style={{ backgroundImage: `linear-gradient(to right, ${palette.deepOcean}, ${palette.classicBlue})` }}
                    >
                        Paramètres du Compte
                    </h1>
                    <p style={{ color: palette.skyBlue }} className="text-sm font-semibold">Gérez vos informations personnelles</p>
                </div>

                {/* Card */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                    <div 
                        className="h-1"
                        style={{ background: `linear-gradient(to right, ${palette.deepOcean}, ${palette.softTeal})` }}
                    ></div>

                    <div className="p-8 sm:p-10">
                        {/* Messages */}
                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                                <p className="text-red-700 font-medium flex items-center">
                                    <span className="text-xl mr-2">⚠️</span>
                                    {error}
                                </p>
                            </div>
                        )}

                        {message && (
                            <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg">
                                <p className="text-green-700 font-medium flex items-center">
                                    <span className="text-xl mr-2">✓</span>
                                    {message}
                                </p>
                            </div>
                        )}

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <InputField
                                label="Nom Complet"
                                type="text"
                                value={nom}
                                onChange={(e) => setNom(e.target.value)}
                                placeholder={`${states.nom} ${states.prenom}`}
                            />

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <InputField
                                    label="Email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder={states.email}
                                />
                                <InputField
                                    label="Téléphone"
                                    type="tel"
                                    value={telephone}
                                    onChange={(e) => setTelephone(e.target.value)}
                                    placeholder={states.telephone }
                                />
                            </div>

                            <InputField
                                label="Adresse"
                                type="text"
                                value={adresse}
                                onChange={(e) => setAdresse(e.target.value)}
                                placeholder={states.adresse}
                            />

                            {/* Buttons */}
                            <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <button
                                    type="submit"
                                    style={{ background: `linear-gradient(to right, ${palette.deepOcean}, ${palette.classicBlue})` }}
                                    className="text-white font-bold py-3 px-6 rounded-lg transition duration-300 shadow-lg transform hover:scale-105 active:scale-95"
                                    onMouseEnter={(e) => e.target.style.background = `linear-gradient(to right, ${palette.classicBlue}, #1e4959)`}
                                    onMouseLeave={(e) => e.target.style.background = `linear-gradient(to right, ${palette.deepOcean}, ${palette.classicBlue})`}
                                >
                                    Modifier les Paramètres
                                </button>
                                <button
                                    type="button"
                                    onClick={() => window.history.back()}
                                    style={{ background: 'linear-gradient(to right, #EF4444, #DC2626)' }}
                                    className="text-white font-bold py-3 px-6 rounded-lg transition duration-300 shadow-lg transform hover:scale-105 active:scale-95"
                                    onMouseEnter={(e) => e.target.style.background = 'linear-gradient(to right, #DC2626, #991B1B)'}
                                    onMouseLeave={(e) => e.target.style.background = 'linear-gradient(to right, #EF4444, #DC2626)'}
                                >
                                    Quitter sans changer
                                </button>
                            </div>

                            {/* Info */}
                            <p style={{ color: palette.classicBlue }} className="text-center text-sm pt-2 font-semibold">
                                ✓ Vos informations restent confidentielles et sécurisées
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Parametre;