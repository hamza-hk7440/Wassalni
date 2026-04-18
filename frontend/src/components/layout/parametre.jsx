import { useEffect, useMemo, useState } from 'react';
import palette from '../common/pallette';
import { useAuth } from '../../hooks/useAuth';
import { useAdminLanguage } from '../common/language.jsx';

const hexToRgba = (hex, alpha) => {
  const cleaned = (hex || '').replace('#', '');
  if (cleaned.length !== 6) return `rgba(30, 84, 112, ${alpha})`;
  const r = parseInt(cleaned.slice(0, 2), 16);
  const g = parseInt(cleaned.slice(2, 4), 16);
  const b = parseInt(cleaned.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

function Parametre() {
  const { user, setUser } = useAuth();
  const { t } = useAdminLanguage();

  const [nomComplet, setNomComplet] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [editNom, setEditNom] = useState(false);
  const [editEmail, setEditEmail] = useState(false);

  const profile = useMemo(() => {
    const fullName = `${user?.first_name || ''} ${user?.last_name || ''}`.trim();
    return {
      nomComplet: fullName || t('user', 'User'),
      email: user?.email || '-',
      role: user?.role || user?.user_type || '-',
      identifiant: user?.id || user?.user_id || '-',
    };
  }, [user, t]);

  useEffect(() => {
    setNomComplet(profile.nomComplet === t('user', 'User') ? '' : profile.nomComplet);
    setEmail(profile.email === '-' ? '' : profile.email);
  }, [profile.nomComplet, profile.email, t]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setError('');
    setMessage('');

    const cleanName = nomComplet.trim();
    const cleanEmail = email.trim();

    if (!cleanName || !cleanEmail) {
      setError('Le nom complet et l\'email sont obligatoires.');
      return;
    }

    if (!cleanEmail.includes('@')) {
      setError('Email invalide.');
      return;
    }

    const nameParts = cleanName.split(/\s+/);
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ');

    const updatedUser = {
      ...user,
      first_name: firstName,
      last_name: lastName,
      email: cleanEmail,
    };

    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setMessage(t('saveChanges', 'Save changes'));
    setEditNom(false);
    setEditEmail(false);
  };

  const handleCancelEdit = () => {
    setNomComplet(profile.nomComplet === t('user', 'User') ? '' : profile.nomComplet);
    setEmail(profile.email === '-' ? '' : profile.email);
    setError('');
    setMessage('');
    setEditNom(false);
    setEditEmail(false);
  };

  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-10" style={{ fontFamily: "'Space Grotesk', 'Segoe UI', sans-serif" }}>
      <style>
        {`
          @keyframes cardEnter {
            from { opacity: 0; transform: translateY(14px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes floatBlob {
            0% { transform: translate3d(0,0,0) scale(1); }
            50% { transform: translate3d(0,-14px,0) scale(1.04); }
            100% { transform: translate3d(0,0,0) scale(1); }
          }
        `}
      </style>

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(circle at 10% 15%, ${hexToRgba(palette.softTeal, 0.24)} 0%, ${hexToRgba(palette.softTeal, 0)} 42%), radial-gradient(circle at 88% 18%, ${hexToRgba(palette.deepOcean, 0.2)} 0%, ${hexToRgba(palette.deepOcean, 0)} 44%), linear-gradient(135deg, ${palette.pureWhite} 0%, ${palette.iceWhite} 52%, ${palette.frostBlue} 100%)`,
        }}
      />

      <div
        className="pointer-events-none absolute -left-16 top-20 h-64 w-64 rounded-full"
        style={{ backgroundColor: hexToRgba(palette.deepOcean, 0.13), filter: 'blur(2px)', animation: 'floatBlob 8s ease-in-out infinite' }}
      />
      <div
        className="pointer-events-none absolute -right-20 bottom-16 h-72 w-72 rounded-full"
        style={{ backgroundColor: hexToRgba(palette.softTeal, 0.14), filter: 'blur(2px)', animation: 'floatBlob 10s ease-in-out infinite' }}
      />

      <div className="relative mx-auto max-w-6xl">
        <div className="grid gap-6 lg:grid-cols-[330px_1fr]">
          <aside
            className="rounded-3xl border p-6 shadow-xl"
            style={{
              borderColor: palette.frostBlue,
              backgroundColor: hexToRgba(palette.pureWhite, 0.86),
              backdropFilter: 'blur(10px)',
              animation: 'cardEnter 500ms ease-out',
            }}
          >
            <div
              className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-[26px] text-3xl font-black"
              style={{
                background: `linear-gradient(140deg, ${palette.deepOcean} 0%, ${palette.classicBlue} 60%, ${palette.softTeal} 100%)`,
                boxShadow: `0 16px 26px ${hexToRgba(palette.deepOcean, 0.3)}`,
                color: palette.pureWhite,
              }}
            >
              {(profile.nomComplet || 'U').charAt(0).toUpperCase()}
            </div>

            <p className="text-center text-xs font-black uppercase tracking-[0.25em]" style={{ color: palette.classicBlue }}>
              {t('profile', 'Profile')}
            </p>
            <h2 className="mt-1 text-center text-2xl font-black" style={{ color: palette.deepOcean }}>
              {profile.nomComplet}
            </h2>
            <p className="mt-1 text-center text-sm" style={{ color: palette.textGray }}>
              {profile.email}
            </p>

            <div
              className="mt-6 rounded-2xl border p-4"
              style={{ borderColor: palette.frostBlue, background: `linear-gradient(160deg, ${palette.pureWhite} 0%, ${palette.iceWhite} 100%)` }}
            >
              <p className="text-xs font-black uppercase tracking-wide" style={{ color: palette.classicBlue }}>
                {t('dataSource', 'Data source')}
              </p>
              <ul className="mt-2 space-y-1 text-sm" style={{ color: palette.textGray }}>
                <li>{t('dataSourceLine1', 'Fields below are now editable.')}</li>
                <li>{t('dataSourceLine2', 'Reference code is no longer displayed.')}</li>
                <li>{t('dataSourceLine3', 'Role and identifier remain read-only.')}</li>
              </ul>
            </div>
          </aside>

          <main
            className="overflow-hidden rounded-3xl border shadow-2xl"
            style={{
              borderColor: palette.frostBlue,
              backgroundColor: hexToRgba(palette.pureWhite, 0.9),
              backdropFilter: 'blur(10px)',
              animation: 'cardEnter 650ms ease-out',
            }}
          >
            <div className="h-2" style={{ background: `linear-gradient(90deg, ${palette.deepOcean}, ${palette.classicBlue}, ${palette.softTeal})` }} />

            <div className="p-6 md:p-8">
              <header className="mb-7">
                <p className="text-xs font-black uppercase tracking-[0.2em]" style={{ color: palette.classicBlue }}>
                  {t('accountSettingsArea', 'Settings Area')}
                </p>
                <h1 className="mt-1 text-3xl font-black md:text-4xl" style={{ color: palette.deepOcean }}>
                  {t('accountSettingsTitle', 'Account Settings')}
                </h1>
                <p className="mt-1 text-sm" style={{ color: palette.textGray }}>
                  {t('fieldPenHint', 'Changes are made with each field pen button.')}
                </p>
              </header>

              {error && (
                <div
                  className="mb-4 rounded-xl border px-4 py-3 text-sm font-semibold"
                  style={{ borderColor: palette.dangerText, backgroundColor: palette.dangerSoft, color: palette.dangerText }}
                >
                  {error}
                </div>
              )}

              {message && (
                <div
                  className="mb-4 rounded-xl border px-4 py-3 text-sm font-semibold"
                  style={{ borderColor: palette.softTeal, backgroundColor: palette.iceWhite, color: palette.deepOcean }}
                >
                  {message}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div
                    className="space-y-2 rounded-2xl border p-4"
                    style={{ borderColor: palette.frostBlue, backgroundColor: palette.pureWhite, boxShadow: `0 8px 20px ${hexToRgba(palette.deepOcean, 0.08)}` }}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <label className="text-xs font-black uppercase tracking-[0.2em]" style={{ color: palette.classicBlue }}>
                        {t('fullName', 'Full name')}
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setError('');
                          setMessage('');
                          setEditNom((prev) => !prev);
                        }}
                        className="inline-flex items-center rounded-lg border px-2 py-1 transition-all"
                        style={{ borderColor: palette.frostBlue, color: palette.deepOcean, backgroundColor: palette.pureWhite }}
                        aria-label={t('editFullName', 'Edit full name')}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M12 20h9" />
                          <path d="M16.5 3.5a2.12 2.12 0 113 3L7 19l-4 1 1-4 12.5-12.5z" />
                        </svg>
                      </button>
                    </div>
                    <input
                      type="text"
                      value={nomComplet}
                      onChange={(e) => setNomComplet(e.target.value)}
                      placeholder="Ex: Rayen Ben Ali"
                      readOnly={!editNom}
                      className="w-full rounded-xl border px-4 py-3 focus:outline-none"
                      style={{
                        borderColor: palette.frostBlue,
                        color: palette.deepOcean,
                        backgroundColor: editNom ? palette.pureWhite : palette.iceWhite,
                      }}
                    />
                  </div>

                  <div
                    className="space-y-2 rounded-2xl border p-4"
                    style={{ borderColor: palette.frostBlue, backgroundColor: palette.pureWhite, boxShadow: `0 8px 20px ${hexToRgba(palette.deepOcean, 0.08)}` }}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <label className="text-xs font-black uppercase tracking-[0.2em]" style={{ color: palette.classicBlue }}>
                        Email
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setError('');
                          setMessage('');
                          setEditEmail((prev) => !prev);
                        }}
                        className="inline-flex items-center rounded-lg border px-2 py-1 transition-all"
                        style={{ borderColor: palette.frostBlue, color: palette.deepOcean, backgroundColor: palette.pureWhite }}
                        aria-label={t('editEmail', 'Edit email')}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M12 20h9" />
                          <path d="M16.5 3.5a2.12 2.12 0 113 3L7 19l-4 1 1-4 12.5-12.5z" />
                        </svg>
                      </button>
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Ex: rayen@email.com"
                      readOnly={!editEmail}
                      className="w-full rounded-xl border px-4 py-3 focus:outline-none"
                      style={{
                        borderColor: palette.frostBlue,
                        color: palette.deepOcean,
                        backgroundColor: editEmail ? palette.pureWhite : palette.iceWhite,
                      }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div
                    className="space-y-2 rounded-2xl border p-4"
                    style={{ borderColor: palette.frostBlue, backgroundColor: palette.iceWhite }}
                  >
                    <p className="text-xs font-black uppercase tracking-[0.2em]" style={{ color: palette.classicBlue }}>
                      {t('role', 'Role')}
                    </p>
                    <p className="text-base font-bold" style={{ color: palette.deepOcean }}>
                      {profile.role}
                    </p>
                  </div>

                  <div
                    className="space-y-2 rounded-2xl border p-4"
                    style={{ borderColor: palette.frostBlue, backgroundColor: palette.iceWhite }}
                  >
                    <p className="text-xs font-black uppercase tracking-[0.2em]" style={{ color: palette.classicBlue }}>
                      {t('identifier', 'Identifier')}
                    </p>
                    <p className="text-base font-bold" style={{ color: palette.deepOcean }}>
                      {profile.identifiant}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-3 pt-2 md:flex-row">
                  {(editNom || editEmail) && (
                    <>
                      <button
                        type="submit"
                        className="w-full rounded-xl px-6 py-3 text-sm font-black uppercase tracking-wide transition-all hover:opacity-95 md:w-auto"
                        style={{
                          background: `linear-gradient(90deg, ${palette.deepOcean}, ${palette.classicBlue})`,
                          boxShadow: `0 14px 24px ${hexToRgba(palette.deepOcean, 0.26)}`,
                          color: palette.pureWhite,
                        }}
                      >
                        {t('save', 'Save')}
                      </button>

                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="w-full rounded-xl px-6 py-3 text-sm font-black uppercase tracking-wide transition-all hover:opacity-95 md:w-auto"
                        style={{
                          border: `1px solid ${palette.frostBlue}`,
                          color: palette.deepOcean,
                          backgroundColor: palette.pureWhite,
                        }}
                      >
                        {t('cancel', 'Cancel')}
                      </button>
                    </>
                  )}

                  <button
                    type="button"
                    onClick={() => window.history.back()}
                    className="w-full rounded-xl px-6 py-3 text-sm font-black uppercase tracking-wide transition-all hover:opacity-95 md:w-auto"
                    style={{
                      background: `linear-gradient(90deg, ${palette.dangerText}, ${palette.dangerText})`,
                      boxShadow: `0 14px 24px ${hexToRgba(palette.dangerText, 0.28)}`,
                      color: palette.pureWhite,
                    }}
                  >
                    {t('back', 'Back')}
                  </button>
                </div>
              </form>

              <p className="pt-4 text-xs font-semibold" style={{ color: palette.classicBlue }}>
                {t('applyingSession', 'Changes are applied to the active session.')}
              </p>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default Parametre;
