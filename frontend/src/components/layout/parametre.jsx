import { useEffect, useRef, useState } from 'react';
import palette from '../common/pallette';

function Parametre() {
    const defaultProfile = {
        nom: 'Rayen Masmoudi',
        email: 'rayen.masmoudi@example.com',
        telephone: '12345678',
        adresse: '123 Rue Principale, Tunis'
    };

    const [nom, setNom] = useState(defaultProfile.nom);
    const [email, setEmail] = useState(defaultProfile.email);
    const [telephone, setTelephone] = useState(defaultProfile.telephone);
    const [adresse, setAdresse] = useState(defaultProfile.adresse);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [changeNom, setChangeNom] = useState(false);
    const [changeEmail, setChangeEmail] = useState(false);
    const [changeTelephone, setChangeTelephone] = useState(false);
    const [changeAdresse, setChangeAdresse] = useState(false);
    const nomRef = useRef(null);
    const emailRef = useRef(null);
    const telephoneRef = useRef(null);
    const adresseRef = useRef(null);
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
        setChangeNom(false);
        setChangeEmail(false);
        setChangeTelephone(false);
        setChangeAdresse(false);
    };

    useEffect(() => {
        if (changeNom && nomRef.current) {
            nomRef.current.focus();
        }
    }, [changeNom, nom.length]);

    useEffect(() => {
        if (changeEmail && emailRef.current) {
            emailRef.current.focus();
        }
    }, [changeEmail, email.length]);

    useEffect(() => {
        if (changeTelephone && telephoneRef.current) {
            telephoneRef.current.focus();
        }
    }, [changeTelephone, telephone.length]);

    useEffect(() => {
        if (changeAdresse && adresseRef.current) {
            adresseRef.current.focus();
            
        }
    }, [changeAdresse, adresse.length]);

    const InputField = ({ label, type, value, onChange, placeholder, isEditing, onToggle, inputRef }) => (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <label style={{ color: palette.deepOcean }} className="block text-sm font-semibold">{label}</label>
                <button
                    type="button"
                    onClick={onToggle}
                    className="text-sm font-semibold cursor-pointer transition-transform hover:scale-110"
                    style={{ color: isEditing ? palette.deepOcean : palette.classicBlue }}
                    
                >
                    {isEditing ? '❌' : '✏️'}
                </button>
            </div>
            <input
                ref={inputRef}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                readOnly={!isEditing}
                style={{
                    borderColor: isEditing ? palette.softTeal : palette.frostBlue,
                    color: palette.deepOcean,
                    backgroundColor: isEditing ? '#FFFFFF' : '#F8FAFC'
                }}
                className="w-full px-4 py-3 border rounded-md focus:outline-none bg-white"
            />
        </div>
    );

    return (
        <div style={{ background: `linear-gradient(to bottom right, ${palette.iceWhite}, white, ${palette.frostBlue})` }} className="min-h-screen py-10 px-4">
            <div className="mx-auto max-w-2xl">
                {/* Header */}
                <div className="text-center mb-8">
                    <div 
                        className="inline-flex items-center justify-center w-14 h-14 rounded-xl mb-3"
                        style={{ background: `linear-gradient(135deg, ${palette.deepOcean}, ${palette.classicBlue})` }}
                    >
                        <span className="text-2xl">⚙️</span>
                    </div>
                    <h1 
                        className="text-3xl font-bold bg-clip-text text-transparent mb-1"
                        style={{ backgroundImage: `linear-gradient(to right, ${palette.deepOcean}, ${palette.classicBlue})` }}
                    >
                        Paramètres du Compte
                    </h1>
                    <p style={{ color: palette.skyBlue }} className="text-sm">Gérez vos informations personnelles</p>
                </div>

                {/* Card */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden border" style={{ borderColor: palette.frostBlue }}>
                    <div 
                        className="h-1"
                        style={{ background: `linear-gradient(to right, ${palette.deepOcean}, ${palette.softTeal})` }}
                    ></div>

                    <div className="p-6 sm:p-8">
                        {/* Messages */}
                        {error && (
                            <div className="mb-6 p-3 rounded-md border-l-4" style={{ backgroundColor: palette.iceWhite, borderColor: palette.classicBlue }}>
                                <p className="font-medium flex items-center" style={{ color: palette.deepOcean }}>
                                    <span className="text-xl mr-2">⚠️</span>
                                    {error}
                                </p>
                            </div>
                        )}

                        {message && (
                            <div className="mb-6 p-3 rounded-md border-l-4" style={{ backgroundColor: palette.iceWhite, borderColor: palette.softTeal }}>
                                <p className="font-medium flex items-center" style={{ color: palette.deepOcean }}>
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
                                placeholder="donner votre nom complet"
                                isEditing={changeNom}
                                onToggle={() => setChangeNom(!changeNom)}
                                inputRef={nomRef}
                            />

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <InputField
                                    label="Email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="donner votre email"
                                    isEditing={changeEmail}
                                    onToggle={() => setChangeEmail(!changeEmail)}
                                    inputRef={emailRef}
                                />
                                <InputField
                                    label="Téléphone"
                                    type="tel"
                                    value={telephone}
                                    onChange={(e) => setTelephone(e.target.value)}
                                    placeholder="donner votre numéro de téléphone"
                                    isEditing={changeTelephone}
                                    onToggle={() => setChangeTelephone(!changeTelephone)}
                                    inputRef={telephoneRef}
                                />
                            </div>

                            <InputField
                                label="Adresse"
                                type="text"
                                value={adresse}
                                onChange={(e) => setAdresse(e.target.value)}
                                placeholder="donner votre adresse"
                                isEditing={changeAdresse}
                                onToggle={() => setChangeAdresse(!changeAdresse)}
                                inputRef={adresseRef}
                            />

                            {/* Buttons */}
                            <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <button
                                    type="submit"
                                    style={{ background: `linear-gradient(to right, ${palette.deepOcean}, ${palette.classicBlue})` }}
                                    className="text-white cursor-pointer hover:opacity-90 font-semibold py-3 px-6 rounded-md"
                                >
                                    Modifier les Paramètres
                                </button>
                                <button
                                    type="button"
                                    onClick={() => window.history.back()}
                                    style={{ background: 'linear-gradient(to right, #EF4444, #DC2626)' }}
                                    className="text-white cursor-pointer hover:opacity-90 font-semibold py-3 px-6 rounded-md"
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