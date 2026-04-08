import React, { useMemo, useState } from 'react';
import Navbar from '../layout/NavbarRa';
import palette from './pallette';

const EMPTY_FORM = {
  id: '',
  nom: '',
  email: '',
};

function EmployeeManagementPage({
  pageTitle = 'Gestion des employes',
  pageSubtitle = 'Creer et gerer les comptes.',
  role = 'employee',
  initialEmployees = [],
}) {
  const [employees, setEmployees] = useState(initialEmployees);
  const [query, setQuery] = useState('');
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState('');

  const isEditing = Boolean(editingId);

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
    setEditingId('');
    setForm(EMPTY_FORM);
  };

  const startEdit = (employee) => {
    setEditingId(employee.id);
    setForm({
      id: employee.id,
      nom: employee.nom,
      email: employee.email,
    });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const normalized = {
      id: form.id.trim(),
      nom: form.nom.trim(),
      email: form.email.trim(),
      role,
    };

    if (!normalized.id || !normalized.nom || !normalized.email) {
      return;
    }

    if (isEditing) {
      setEmployees((prev) =>
        prev.map((employee) =>
          employee.id === editingId ? normalized : employee
        )
      );
    } else {
      const exists = employees.some((employee) => employee.id === normalized.id);
      if (exists) {
        return;
      }
      setEmployees((prev) => [normalized, ...prev]);
    }

    setEditingId('');
    setForm(EMPTY_FORM);
  };

  const handleDelete = (id) => {
    setEmployees((prev) => prev.filter((employee) => employee.id !== id));
    if (editingId === id) {
      setEditingId('');
      setForm(EMPTY_FORM);
    }
  };

  return (
    <div>
      <Navbar />
      <section
        className="min-h-screen px-4 pb-10 pt-24 md:px-8"
        style={{
          background: `linear-gradient(180deg, ${palette.iceWhite} 0%, ${palette.frostBlue} 35%, ${palette.pureWhite} 100%)`,
        }}
      >
        <div className="mx-auto max-w-5xl">
          <header
            className="rounded-3xl border bg-white/95 p-6 shadow-xl md:p-8"
            style={{ borderColor: palette.frostBlue }}
          >
            <p
              className="text-xs font-bold uppercase tracking-[0.22em]"
              style={{ color: palette.skyBlue }}
            >
              Module Employes
            </p>
            <h1 className="mt-2 text-2xl font-black md:text-4xl" style={{ color: palette.deepOcean }}>
              {pageTitle}
            </h1>
            <p className="mt-2 text-sm" style={{ color: palette.classicBlue }}>
              {pageSubtitle}
            </p>
          </header>

          <div
            className="mt-6 rounded-3xl border bg-white p-6 shadow-lg md:p-8"
            style={{ borderColor: palette.frostBlue }}
          >
            <div className="grid gap-3 md:grid-cols-[1fr_auto]">
              <input
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Rechercher par ID, nom ou email"
                className="w-full rounded-2xl border px-4 py-3 text-sm outline-none"
                style={{ borderColor: palette.frostBlue }}
              />
              <button
                type="button"
                onClick={startCreate}
                className="rounded-2xl px-4 py-3 text-sm font-bold"
                style={{ backgroundColor: palette.deepOcean, color: palette.pureWhite }}
              >
                Nouveau
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="mt-4 grid gap-3 rounded-2xl border p-4 md:grid-cols-3"
              style={{ borderColor: palette.frostBlue, backgroundColor: palette.iceWhite }}
            >
              <input
                name="id"
                value={form.id}
                onChange={handleChange}
                placeholder="ID"
                className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none"
                style={{ borderColor: palette.frostBlue }}
              />
              <input
                name="nom"
                value={form.nom}
                onChange={handleChange}
                placeholder="Nom"
                className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none"
                style={{ borderColor: palette.frostBlue }}
              />
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none"
                style={{ borderColor: palette.frostBlue }}
              />

              <button
                type="submit"
                className="rounded-xl px-4 py-2.5 text-sm font-bold md:col-span-3"
                style={{ backgroundColor: palette.classicBlue, color: palette.pureWhite }}
              >
                {isEditing ? 'Mettre a jour' : 'Ajouter'}
              </button>
            </form>

            <div
              className="mt-4 rounded-2xl border px-4 py-3 text-sm font-bold"
              style={{ borderColor: palette.frostBlue, color: palette.deepOcean, backgroundColor: palette.iceWhite }}
            >
              {filteredEmployees.length} employe(s)
            </div>

            <div className="mt-5 grid gap-4">
              {filteredEmployees.length === 0 ? (
                <div
                  className="rounded-2xl border border-dashed p-6 text-center text-sm"
                  style={{ borderColor: palette.frostBlue, color: palette.textGray, backgroundColor: palette.iceWhite }}
                >
                  Aucun employe trouve.
                </div>
              ) : (
                filteredEmployees.map((employee) => (
                  <div
                    key={employee.id}
                    className="rounded-2xl border p-5 shadow-sm"
                    style={{ borderColor: palette.frostBlue, backgroundColor: palette.pureWhite }}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.18em]" style={{ color: palette.skyBlue }}>
                          {role}
                        </p>
                        <h2 className="mt-1 text-xl font-black" style={{ color: palette.deepOcean }}>
                          {employee.id}
                        </h2>
                        <p className="mt-2 text-sm font-semibold" style={{ color: palette.classicBlue }}>
                          {employee.nom}
                        </p>
                        <p className="mt-1 text-xs" style={{ color: palette.textGray }}>
                          {employee.email}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => startEdit(employee)}
                          className="rounded-full border px-3 py-1.5 text-xs font-bold"
                          style={{ borderColor: palette.frostBlue, color: palette.deepOcean }}
                        >
                          Modifier
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(employee.id)}
                          className="rounded-full border px-3 py-1.5 text-xs font-bold"
                          style={{ borderColor: palette.dangerSoft, color: palette.dangerText }}
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
