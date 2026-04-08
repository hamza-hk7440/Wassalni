import { useState } from 'react';
import palette from './pallette';

function EmployeeManagementPage({ pageTitle, pageSubtitle, role, initialEmployees }) {
  const [employees, setEmployees] = useState(initialEmployees);
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const isController = role === 'controller';
  const roleLabel = isController ? 'Contrôleur' : 'Admin';
  const roleLower = isController ? 'contrôleur' : 'admin';
  const buttonColor = isController ? palette.softTeal : palette.classicBlue;

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

    const nextEmployee = {
      id: `${isController ? 'CTR' : 'ADM'}-${String(employees.length + 1).padStart(3, '0')}`,
      nom,
      email,
      role,
    };

    setEmployees((previous) => [nextEmployee, ...previous]);
    setSuccess(`✓ ${roleLabel} créé avec succès.`);
    setNom('');
    setEmail('');
  };

  const deleteEmployee = (employeeId) => {
    setEmployees((previous) => previous.filter((employee) => employee.id !== employeeId));
  };

  return (
    <div
      style={{
        background: `radial-gradient(circle at 0% 0%, ${palette.iceWhite} 0%, ${palette.pureWhite} 45%, ${palette.frostBlue} 100%)`,
      }}
      className="min-h-screen py-10 md:py-14 px-4"
    >
      <button
        type="button"
        onClick={() => window.history.back()}
        className="absolute top-4 right-4 z-10 flex items-center justify-center w-10 h-10 rounded-full transition duration-200 transform hover:scale-110"
        style={{ backgroundColor: palette.dangerText, color: palette.pureWhite }}
        title="Fermer"
      >
        <span className="text-2xl font-bold">×</span>
      </button>

      <div className="mx-auto max-w-6xl">
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
            {pageTitle}
          </h1>
          <p style={{ color: palette.skyBlue }} className="text-sm font-semibold tracking-wide">
            {pageSubtitle}
          </p>
          <p className="mt-2 text-xs font-bold uppercase tracking-[0.2em]" style={{ color: palette.classicBlue }}>
            Mode actif: {roleLabel}
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_1.2fr]">
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border" style={{ borderColor: palette.frostBlue }}>
            <div className="h-1.5" style={{ background: `linear-gradient(to right, ${palette.deepOcean}, ${buttonColor})` }}></div>

            <div className="p-8 sm:p-10">
              {error && (
                <div className="mb-6 p-4 rounded-xl border" style={{ borderColor: palette.dangerSoft, backgroundColor: palette.iceWhite }}>
                  <p className="font-medium" style={{ color: palette.dangerText }}>⚠️ {error}</p>
                </div>
              )}

              {success && (
                <div className="mb-6 p-4 rounded-xl border" style={{ borderColor: palette.frostBlue, backgroundColor: palette.iceWhite }}>
                  <p className="font-medium" style={{ color: palette.deepOcean }}>{success}</p>
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
                    placeholder={`Nom du ${roleLower}`}
                    className="w-full px-4 py-3 border rounded-xl focus:outline-none bg-white transition-all focus:ring-2"
                    style={{ borderColor: palette.frostBlue, color: palette.deepOcean }}
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
                    placeholder={`${roleLower}@transportpro.com`}
                    className="w-full px-4 py-3 border rounded-xl focus:outline-none bg-white transition-all focus:ring-2"
                    style={{ borderColor: palette.frostBlue, color: palette.deepOcean }}
                  />
                </div>

                <button
                  type="submit"
                  style={{ background: `linear-gradient(to right, ${palette.deepOcean}, ${buttonColor})` }}
                  className="w-full text-white font-bold py-3.5 px-6 rounded-xl transition duration-300 shadow-lg transform hover:scale-[1.01] active:scale-95"
                >
                  Créer le compte {roleLower}
                </button>
              </form>
            </div>
          </div>

          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border" style={{ borderColor: palette.frostBlue }}>
            <div className="p-6 sm:p-8 border-b" style={{ borderColor: palette.frostBlue }}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-black" style={{ color: palette.deepOcean }}>
                    Comptes enregistrés
                  </h2>
                  <p className="text-sm mt-1" style={{ color: palette.skyBlue }}>
                    {pageSubtitle}
                  </p>
                </div>
                <div className="rounded-full border px-3 py-1.5 text-xs font-bold" style={{ borderColor: palette.frostBlue, color: palette.deepOcean }}>
                  {employees.length} compte(s)
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-4 max-h-[720px] overflow-auto">
              {employees.length === 0 ? (
                <div className="rounded-2xl border border-dashed p-6 text-center text-sm" style={{ borderColor: palette.frostBlue, color: palette.textGray, backgroundColor: palette.iceWhite }}>
                  Aucun compte trouvé.
                </div>
              ) : (
                employees.map((employee) => (
                  <div key={employee.id} className="rounded-2xl border p-5 shadow-sm" style={{ borderColor: palette.frostBlue, backgroundColor: palette.pureWhite }}>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: palette.skyBlue }}>
                          {roleLabel}
                        </p>
                        <h3 className="mt-2 text-lg font-black" style={{ color: palette.deepOcean }}>
                          {employee.id}
                        </h3>
                      </div>
                      <div className="inline-flex rounded-full px-3 py-1 text-xs font-bold" style={{ backgroundColor: palette.deepOcean, color: palette.pureWhite }}>
                        {roleLabel}
                      </div>
                    </div>

                    <p className="mt-3 text-sm font-medium" style={{ color: palette.classicBlue }}>
                      {employee.nom}
                    </p>
                    <p className="mt-2 text-xs" style={{ color: palette.textGray }}>
                      {employee.email}
                    </p>

                    <div className="mt-4 flex gap-2">
                      <button
                        type="button"
                        onClick={() => deleteEmployee(employee.id)}
                        className="rounded-full border px-3 py-1.5 text-xs font-bold"
                        style={{ borderColor: palette.dangerSoft, color: palette.dangerText }}
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployeeManagementPage;
