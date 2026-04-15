import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Navbar from '../layout/NavbarRa';
import { getAllUsers, deleteUser, createController } from '../../api/admin';

const EMPTY_FORM = {
  nom: '',
  email: '',
  password: '',
};

function EmployeeManagementPage({
  pageTitle = 'Gestion des employes',
  pageSubtitle = 'Creer et gerer les comptes.',
  role = 'employee',
}) {
  const [employees, setEmployees] = useState([]);
  const [query, setQuery] = useState('');
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  // Fetch employees from the backend filtered by role
  const fetchEmployees = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getAllUsers();
      const users = Array.isArray(data) ? data : (data.users || []);
      // Filter by role (admin or controller)
      const filtered = users.filter((u) => u.role === role);
      setEmployees(
        filtered.map((u) => ({
          id: String(u.id || u.user_id),
          nom: u.name || u.full_name || u.nom || '',
          email: u.email || '',
          role: u.role,
        }))
      );
    } catch (err) {
      console.error('Failed to load employees', err);
      setError('Impossible de charger la liste. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  }, [role]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const filteredEmployees = useMemo(() => {
    const text = query.trim().toLowerCase();
    if (!text) {
      return employees;
    }

    return employees.filter((employee) => {
      return (
        employee.id.toLowerCase().includes(text) ||
        employee.nom.toLowerCase().includes(text) ||
        employee.email.toLowerCase().includes(text)
      );
    });
  }, [employees, query]);

  const startCreate = () => {
    setForm(EMPTY_FORM);
    setError('');
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const normalized = {
      name: form.nom.trim(),
      email: form.email.trim(),
      password: form.password.trim(),
    };

    if (!normalized.name || !normalized.email || !normalized.password) {
      setError('Tous les champs sont obligatoires.');
      return;
    }

    try {
      setSaving(true);
      setError('');
      await createController({
        name: normalized.name,
        email: normalized.email,
        password: normalized.password,
        role,
      });
      setForm(EMPTY_FORM);
      // Refresh the list
      await fetchEmployees();
    } catch (err) {
      console.error('Failed to create employee', err);
      const msg = err?.response?.data?.error || err?.response?.data?.message || 'Erreur lors de la création.';
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Voulez-vous vraiment supprimer cet employé ?')) return;
    try {
      setError('');
      await deleteUser(id);
      setEmployees((prev) => prev.filter((employee) => employee.id !== id));
    } catch (err) {
      console.error('Failed to delete employee', err);
      setError('Erreur lors de la suppression.');
    }
  };

  return (
    <div>
      <Navbar />
      <section className="min-h-screen px-4 pb-10 pt-24 md:px-8 bg-gradient-to-b from-iceWhite via-frostBlue via-[35%] to-pureWhite">
        <div className="mx-auto max-w-5xl">
          <header
            className="rounded-3xl border bg-white/95 p-6 shadow-xl md:p-8 border-frostBlue"
          >
            <p
              className="text-xs font-bold uppercase tracking-[0.22em] text-skyBlue"
            >
              Module Employes
            </p>
            <h1 className="mt-2 text-2xl font-black md:text-4xl text-deepOcean">
              {pageTitle}
            </h1>
            <p className="mt-2 text-sm text-classicBlue">
              {pageSubtitle}
            </p>
          </header>

          <div
            className="mt-6 rounded-3xl border bg-white p-6 shadow-lg md:p-8 border-frostBlue"
          >
            <div className="grid gap-3 md:grid-cols-[1fr_auto]">
              <input
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Rechercher par ID, nom ou email"
                className="w-full rounded-2xl border px-4 py-3 text-sm outline-none border-frostBlue"
              />
              <button
                type="button"
                onClick={startCreate}
                className="rounded-2xl px-4 py-3 text-sm font-bold transition-all hover:opacity-90 active:scale-95 bg-deepOcean text-pureWhite"
              >
                Nouveau
              </button>
            </div>

            {error && (
              <div className="mt-3 rounded-xl bg-red-50 border border-red-200 p-3 text-sm text-red-600 font-medium">
                {error}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="mt-4 grid gap-3 rounded-2xl border p-4 md:grid-cols-3 border-frostBlue bg-iceWhite"
            >
              <input
                name="nom"
                value={form.nom}
                onChange={handleChange}
                placeholder="Nom complet"
                className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none border-frostBlue"
              />
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none border-frostBlue"
              />
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Mot de passe"
                className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none border-frostBlue"
              />

              <div className="flex gap-2 w-full md:col-span-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 rounded-xl px-4 py-2.5 text-sm font-bold transition-all hover:opacity-90 active:scale-95 bg-classicBlue text-pureWhite disabled:opacity-50"
                >
                  {saving ? 'Enregistrement...' : 'Ajouter'}
                </button>
              </div>
            </form>

            <div
              className="mt-4 rounded-2xl border px-4 py-3 text-sm font-bold border-frostBlue text-deepOcean bg-iceWhite"
            >
              {loading ? 'Chargement...' : `${filteredEmployees.length} employe(s)`}
            </div>

            <div className="mt-5 grid gap-4">
              {loading ? (
                <div className="rounded-2xl border border-dashed p-6 text-center text-sm border-frostBlue text-textGray bg-iceWhite">
                  Chargement des données...
                </div>
              ) : filteredEmployees.length === 0 ? (
                <div
                  className="rounded-2xl border border-dashed p-6 text-center text-sm border-frostBlue text-textGray bg-iceWhite"
                >
                  Aucun employe trouve.
                </div>
              ) : (
                filteredEmployees.map((employee) => (
                  <div
                    key={employee.id}
                    className="rounded-2xl border p-5 shadow-sm border-frostBlue bg-pureWhite"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-skyBlue">
                          {role}
                        </p>
                        <h2 className="mt-1 text-xl font-black text-deepOcean">
                          #{employee.id}
                        </h2>
                        <p className="mt-2 text-sm font-semibold text-classicBlue">
                          {employee.nom}
                        </p>
                        <p className="mt-1 text-xs text-textGray">
                          {employee.email}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleDelete(employee.id)}
                          className="rounded-full border px-3 py-1.5 text-xs font-bold transition-colors hover:bg-dangerSoft/20 active:scale-95 border-dangerSoft text-dangerText"
                        >
                          Supprimer
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default EmployeeManagementPage;
