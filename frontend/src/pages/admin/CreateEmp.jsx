import { useState } from 'react';
import palette from '../../components/common/pallette';
function CreateEmp() {
  

  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('admin');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  

  const handleRoleChange = (event) => {
    const value = event.target.value;
    setRole(value);
    setSuccess('');
  };

  

  const handleSubmit = (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!nom || !email) {
      setError('Tous les champs sont obligatoires.');
      return;
    }

    if (!email.includes('@')) {
      setError('Email invalide.');
      return;
    }

    const roleLabel = role === 'controller' ? 'Contrôleur' : 'Nouveau Admin';
    setSuccess(`✓ ${roleLabel} créé avec succès.`);
    setNom('');
    setEmail('');
    setRole('admin');
  };

  return (
    <div
      style={{
        background: `radial-gradient(circle at 0% 0%, ${palette.iceWhite} 0%, #f7fcff 45%, #ffffff 100%)`,
      }}
      className="min-h-screen py-10 md:py-14 px-4"
    >
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
      <div className="mx-auto max-w-2xl">
        <div className="text-center mb-8 md:mb-10">
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl shadow-lg mb-4 border"
            style={{ background: `linear-gradient(135deg, ${palette.deepOcean}, ${palette.classicBlue})` }}
          >
            <span className="text-3xl">🛡️</span>
          </div>
          <h1
            className="text-3xl md:text-4xl font-black bg-clip-text text-transparent mb-2"
            style={{ backgroundImage: `linear-gradient(to right, ${palette.deepOcean}, ${palette.classicBlue})` }}
          >
            Créer un nouvel Employer
          </h1>
          <p style={{ color: palette.skyBlue }} className="text-sm font-semibold tracking-wide">
            Espace Super Admin — création de comptes administrateurs
          </p>
        </div>

        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border"
             style={{ borderColor: palette.frostBlue }}>
          <div
            className="h-1.5"
            style={{ background: `linear-gradient(to right, ${palette.deepOcean}, ${palette.softTeal})` }}
          ></div>

          <div className="p-8 sm:p-10">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-700 font-medium">⚠️ {error}</p>
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                <p className="text-green-700 font-medium">{success}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="block text-sm font-semibold mb-2" style={{ color: palette.deepOcean }}>
                  Nom complet
                </label>
                <input
                  type="text"
                  value={nom}
                  onChange={(event) => setNom(event.target.value)}
                  placeholder={`Nom du ${role === 'controller' ? 'contrôleur' : 'admin'}`}
                  className="w-full px-4 py-3 border rounded-xl focus:outline-none bg-white transition-all focus:ring-2"
                  style={{ borderColor: palette.frostBlue }}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold mb-2" style={{ color: palette.deepOcean }}>
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder={`${role === 'admin' ? 'admin' : 'contrôleur'}@transportpro.com`}
                  className="w-full px-4 py-3 border rounded-xl focus:outline-none bg-white transition-all focus:ring-2"
                  style={{ borderColor: palette.frostBlue }}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold mb-2" style={{ color: palette.deepOcean }}>
                  Rôle
                </label>
                <select
                  value={role}
                  onChange={handleRoleChange}
                  className="w-full px-4 py-3 border rounded-xl focus:outline-none bg-white transition-all focus:ring-2"
                  style={{ borderColor: palette.frostBlue }}
                >
                  <option value="admin">Nouveau Admin</option>
                  <option value="controller">Contrôleur</option>
                </select>
              </div>

              
              

              <button
                type="submit"
                style={{ background: `linear-gradient(to right, ${palette.deepOcean}, ${palette.classicBlue})` }}
                className="w-full text-white font-bold py-3.5 px-6 rounded-xl transition duration-300 shadow-lg transform hover:scale-[1.01] active:scale-95"
              >
                Créer le compte admin
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
  
}

export default CreateEmp;
