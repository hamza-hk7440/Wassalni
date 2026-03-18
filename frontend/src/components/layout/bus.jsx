import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';

const STATUS_LIST = ['En ligne', 'Maintenance', 'Retard'];
const EMPTY_FORM = {
  id: '',
  line: '',
  driver: '',
  occupancy: '',
  status: 'En ligne',
};

const INITIAL_BUSES = [
  { id: 'B-102', line: 'Ligne 1', driver: 'M. Ben Ali', occupancy: 72, status: 'En ligne' },
  { id: 'B-114', line: 'Ligne 3', driver: 'M. Trabelsi', occupancy: 54, status: 'En ligne' },
  { id: 'B-089', line: 'Ligne 5', driver: 'Mme Jlassi', occupancy: 31, status: 'Maintenance' },
  { id: 'B-141', line: 'Ligne 7', driver: 'M. Bouaziz', occupancy: 90, status: 'Retard' },
  { id: 'B-123', line: 'Ligne 9', driver: 'M. Mansouri', occupancy: 63, status: 'En ligne' },
];

const STATUS_STYLE = {
  'En ligne': { text: '#16A34A', bg: '#DCFCE7' },
  Maintenance: { text: '#D97706', bg: '#FEF3C7' },
  Retard: { text: '#DC2626', bg: '#FEE2E2' },
};

const coolPalette = {
  deepOcean: '#1E5470',
  classicBlue: '#34729C',
  skyBlue: '#6CB1DA',
  softTeal: '#6EC1D1',
  frostBlue: '#C8EAEC',
  iceWhite: '#D1ECFF',
  textGray: '#5B7181',
  warmAccent: '#F0B35D',
};

function getLoadColor(value) {
  if (value >= 85) return '#DC2626';
  if (value >= 65) return coolPalette.warmAccent;
  return coolPalette.softTeal;
}

function Bus() {
  const [rows, setRows] = useState(INITIAL_BUSES);
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const formRef = useRef(null);
  const idRef = useRef(null);

  const summary = {
    total: rows.length,
    active: rows.filter((b) => b.status === 'En ligne').length,
    maintenance: rows.filter((b) => b.status === 'Maintenance').length,
  };

  const admin = {
    nom: 'rayen',
    prenom: 'raddaoui',
    email: 'raddaoui.rayen@gmail.com',
    role: 'Admin',
  };

  const closeForm = () => {
    setOpen(false);
    setError('');
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  const openCreateForm = () => {
    setOpen(true);
    setError('');
    setEditingId(null);
    setForm(EMPTY_FORM);
    window.requestAnimationFrame(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      idRef.current?.focus();
    });
  };

  const openEditForm = (bus) => {
    setOpen(true);
    setError('');
    setEditingId(bus.id);
    setForm({
      id: bus.id,
      line: bus.line,
      driver: bus.driver,
      occupancy: String(bus.occupancy),
      status: bus.status,
    });
    window.requestAnimationFrame(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      idRef.current?.focus();
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError('');

    const id = form.id.trim().toUpperCase();
    const line = form.line.trim();
    const driver = form.driver.trim();
    const occupancy = Number(form.occupancy);

    if (!id || !line || !driver || Number.isNaN(occupancy)) {
      setError('Champs obligatoires.');
      return;
    }

    if (occupancy < 0 || occupancy > 100) {
      setError('Charge entre 0 et 100.');
      return;
    }

    const exists = rows.some((b) => b.id.toLowerCase() === id.toLowerCase() && b.id !== editingId);
    if (exists) {
      setError('Code deja utilise.');
      return;
    }

    const nextBus = { id, line, driver, occupancy, status: form.status };
    setRows((prev) => (editingId ? prev.map((b) => (b.id === editingId ? nextBus : b)) : [...prev, nextBus]));
    closeForm();
  };

  const deleteBus = (id) => {
    setRows((prev) => prev.filter((b) => b.id !== id));
    if (editingId === id) closeForm();
  };

  return (
    <section className="min-h-screen px-4 py-8 md:px-8" style={{ backgroundColor: coolPalette.iceWhite }}>
      <div className="mx-auto w-full max-w-5xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-white p-4" style={{ borderColor: coolPalette.frostBlue }}>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold text-white" style={{ backgroundColor: coolPalette.deepOcean }}>
              {admin.prenom.charAt(0).toUpperCase()}
              {admin.nom.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-bold" style={{ color: coolPalette.deepOcean }}>
                {admin.prenom} {admin.nom}
              </p>
              <p className="text-xs" style={{ color: coolPalette.textGray }}>
                {admin.role} - {admin.email}
              </p>
            </div>
          </div>
         <Link
  to="/Dashboard"
  className="group inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white border border-blue transition-all duration-200 hover:shadow-lg active:scale-95"
>
  <span className="transition-transform group-hover:-translate-x-1">
    ←
  </span>
  
  <span className="uppercase tracking-wide">
    Retour au Dashboard
  </span>
</Link>
        </div>

        <header className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-white p-4" style={{ borderColor: coolPalette.frostBlue }}>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: coolPalette.deepOcean }}>Gestion des bus</h1>
            <p className="text-sm" style={{ color: coolPalette.textGray }}>Suivi des bus et operations</p>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-xl border bg-white p-4" style={{ borderColor: coolPalette.frostBlue }}>
            <p className="text-xs" style={{ color: coolPalette.textGray }}>Total</p>
            <p className="text-2xl font-bold" style={{ color: coolPalette.deepOcean }}>{summary.total}</p>
          </div>
          <div className="rounded-xl border bg-white p-4" style={{ borderColor: coolPalette.frostBlue }}>
            <p className="text-xs" style={{ color: coolPalette.textGray }}>Actifs</p>
            <p className="text-2xl font-bold" style={{ color: coolPalette.classicBlue }}>{summary.active}</p>
          </div>
          <div className="rounded-xl border bg-white p-4" style={{ borderColor: coolPalette.frostBlue }}>
            <p className="text-xs" style={{ color: coolPalette.textGray }}>Maintenance</p>
            <p className="text-2xl font-bold" style={{ color: coolPalette.warmAccent }}>{summary.maintenance}</p>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-4" style={{ borderColor: coolPalette.frostBlue }}>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold" style={{ color: coolPalette.deepOcean }}>Liste</h2>
            <button
              type="button"
              onClick={open ? closeForm : openCreateForm}
              className="rounded-md px-3 py-2 text-sm font-semibold text-white transition hover:opacity-90"
              style={{ backgroundColor: coolPalette.classicBlue }}
            >
              {open ? 'Fermer' : 'Ajouter'}
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs uppercase" style={{ color: coolPalette.textGray, borderColor: coolPalette.frostBlue }}>
                  <th className="px-2 py-2">Bus</th>
                  <th className="px-2 py-2">Ligne</th>
                  <th className="px-2 py-2">Chauffeur</th>
                  <th className="px-2 py-2">Charge</th>
                  <th className="px-2 py-2">Statut</th>
                  <th className="px-2 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((bus) => (
                  <tr key={bus.id} className="border-b last:border-b-0" style={{ borderColor: coolPalette.frostBlue }}>
                    <td className="px-2 py-3 font-semibold" style={{ color: coolPalette.deepOcean }}>{bus.id}</td>
                    <td className="px-2 py-3" style={{ color: coolPalette.textGray }}>{bus.line}</td>
                    <td className="px-2 py-3" style={{ color: coolPalette.textGray }}>{bus.driver}</td>
                    <td className="px-2 py-3">
                      <div className="w-24">
                        <div className="h-2 rounded-full bg-slate-100">
                          <div className="h-2 rounded-full" style={{ width: `${bus.occupancy}%`, backgroundColor: getLoadColor(bus.occupancy) }} />
                        </div>
                      </div>
                    </td>
                    <td className="px-2 py-3">
                      <span className="rounded-full px-2 py-1 text-xs font-semibold" style={{ color: STATUS_STYLE[bus.status].text, backgroundColor: STATUS_STYLE[bus.status].bg }}>
                        {bus.status}
                      </span>
                    </td>
                    <td className="px-2 py-3">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => openEditForm(bus)}
                          className="rounded-md px-3 py-1 text-xs font-semibold text-white transition hover:opacity-90"
                          style={{ backgroundColor: coolPalette.softTeal }}
                        >
                          Modifier
                        </button>
                        <button type="button" onClick={() => deleteBus(bus.id)} className="rounded-md bg-red-500 px-3 py-1 text-xs font-semibold text-white hover:bg-red-600">
                          Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {open ? (
          <div ref={formRef} className="rounded-xl border bg-white p-4" style={{ borderColor: coolPalette.frostBlue }}>
            <h2 className="mb-3 text-lg font-semibold" style={{ color: coolPalette.deepOcean }}>{editingId ? 'Modifier un bus' : 'Ajouter un bus'}</h2>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <input
                ref={idRef}
                name="id"
                value={form.id}
                onChange={(e) => setForm((prev) => ({ ...prev, id: e.target.value }))}
                placeholder="Code bus (ex: B-150)"
                className="rounded-md border px-3 py-2 text-sm"
                style={{ borderColor: coolPalette.frostBlue }}
              />
              <input
                name="line"
                value={form.line}
                onChange={(e) => setForm((prev) => ({ ...prev, line: e.target.value }))}
                placeholder="Ligne"
                className="rounded-md border px-3 py-2 text-sm"
                style={{ borderColor: coolPalette.frostBlue }}
              />
              <input
                name="driver"
                value={form.driver}
                onChange={(e) => setForm((prev) => ({ ...prev, driver: e.target.value }))}
                placeholder="Chauffeur"
                className="rounded-md border px-3 py-2 text-sm"
                style={{ borderColor: coolPalette.frostBlue }}
              />
              <input
                type="number"
                name="occupancy"
                value={form.occupancy}
                onChange={(e) => setForm((prev) => ({ ...prev, occupancy: e.target.value }))}
                min="0"
                max="100"
                placeholder="Charge (0-100)"
                className="rounded-md border px-3 py-2 text-sm"
                style={{ borderColor: coolPalette.frostBlue }}
              />

              <select
                name="status"
                value={form.status}
                onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))}
                className="rounded-md border px-3 py-2 text-sm md:col-span-2"
                style={{ borderColor: coolPalette.frostBlue }}
              >
                {STATUS_LIST.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>

              {error ? <p className="text-sm font-semibold text-red-600 md:col-span-2">{error}</p> : null}

              <div className="flex gap-2 md:col-span-2">
                <button
                  type="submit"
                  className="rounded-md px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
                  style={{ backgroundColor: coolPalette.classicBlue }}
                >
                  {editingId ? 'Enregistrer' : 'Ajouter'}
                </button>
                <button
                  type="button"
                  onClick={closeForm}
                  className="rounded-md border px-4 py-2 text-sm font-semibold transition hover:bg-slate-100"
                  style={{ borderColor: coolPalette.frostBlue, color: coolPalette.textGray }}
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        ) : null}
      </div>
    </section>
  );
}

export default Bus;