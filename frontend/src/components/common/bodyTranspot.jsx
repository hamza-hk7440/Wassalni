
import React, { useEffect, useRef, useState } from 'react';
import palette from './pallette';

const DEFAULT_STATUS_LIST = ['En ligne', 'Maintenance', 'Retard'];
const DEFAULT_EMPTY_FORM = {
  id: '',
  line: '',
  driver: '',
  occupancy: '',
  status: 'En ligne',
};

const DEFAULT_FIELD_KEYS = {
  id: 'id',
  line: 'line',
  operator: 'driver',
  occupancy: 'occupancy',
  status: 'status',
};

const DEFAULT_LABELS = {
  entitySingular: 'transport',
  entityPlural: 'transports',
  id: 'Code',
  line: 'Ligne / Trajet',
  operator: 'Opérateur',
  occupancy: 'Charge',
  status: 'Statut',
};

const DEFAULT_STATUS_STYLE = {
  'En ligne': { text: '#16A34A', bg: '#DCFCE7' },
  Maintenance: { text: '#D97706', bg: '#FEF3C7' },
  Retard: { text: '#DC2626', bg: '#FEE2E2' },
}

const DEFAULT_PALETTE = palette;

function BodyTransport({
  nom = 'Gestion des bus',
  listDonner = [],
  objetAdmin = null,
  statusList = DEFAULT_STATUS_LIST,
  statusStyle = DEFAULT_STATUS_STYLE,
  palette = DEFAULT_PALETTE,
  emptyForm = DEFAULT_EMPTY_FORM,
  fieldKeys = DEFAULT_FIELD_KEYS,
  labels = DEFAULT_LABELS,
  onRowsChange,
}) {
  const { id: idKey, line: lineKey, operator: operatorKey, occupancy: occupancyKey, status: statusKey } = fieldKeys;

  const getLoadColor = (value) => {
    if (value >= 85) return '#DC2626';
    if (value >= 65) return palette.warmAccent;
    return palette.softTeal;
  };

  const readField = (item, key, fallback = '') => item?.[key] ?? fallback;
  const setFormField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));
  const toFormValues = (item) => ({
    [idKey]: readField(item, idKey),
    [lineKey]: readField(item, lineKey),
    [operatorKey]: readField(item, operatorKey),
    [occupancyKey]: String(readField(item, occupancyKey, '')),
    [statusKey]: readField(item, statusKey, statusList[0]),
  });
  const toDomainItem = (currentForm) => ({
    [idKey]: String(readField(currentForm, idKey)).trim().toUpperCase(),
    [lineKey]: String(readField(currentForm, lineKey)).trim(),
    [operatorKey]: String(readField(currentForm, operatorKey)).trim(),
    [occupancyKey]: Number(readField(currentForm, occupancyKey)),
    [statusKey]: readField(currentForm, statusKey, statusList[0]),
  });
  const withFormOpen = () => {
    setOpen(true);
    setError('');
    window.requestAnimationFrame(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      idRef.current?.focus();
    });
  };

  const validRows = Array.isArray(listDonner) ? listDonner : [];

  const [rows, setRows] = useState(validRows);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const formRef = useRef(null);
  const idRef = useRef(null);

  useEffect(() => {
    setRows(validRows);
  }, [listDonner]);

  useEffect(() => {
    if (typeof onRowsChange === 'function') {
      onRowsChange(rows);
    }
  }, [rows, onRowsChange]);

  const summary = {
    total: rows.length,
    active: rows.filter((item) => item[statusKey] === 'En ligne').length,
    maintenance: rows.filter((item) => item[statusKey] === 'Maintenance').length,
  };


  const closeForm = () => {
    setOpen(false);
    setError('');
    setEditingId(null);
    setForm(emptyForm);
  };

  const openCreateForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    withFormOpen();
  };

  const openEditForm = (item) => {
    setEditingId(item[idKey]);
    setForm(toFormValues(item));
    withFormOpen();
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError('');

    const nextItem = toDomainItem(form);
    const id = nextItem[idKey];
    const line = nextItem[lineKey];
    const operator = nextItem[operatorKey];
    const occupancy = nextItem[occupancyKey];

    if (!id || !line || !operator || Number.isNaN(occupancy)) {
      setError('Champs obligatoires.');
      return;
    }

    if (occupancy < 0 || occupancy > 100) {
      setError('Charge entre 0 et 100.');
      return;
    }

    const exists = rows.some((item) => String(readField(item, idKey)).toLowerCase() === id.toLowerCase() && item[idKey] !== editingId);
    if (exists) {
      setError('Code deja utilise.');
      return;
    }

    setRows((prev) => (editingId ? prev.map((item) => (item[idKey] === editingId ? nextItem : item)) : [...prev, nextItem]));
    closeForm();
  };

  const deleteItem = (id) => {
    setRows((prev) => prev.filter((item) => item[idKey] !== id));
    if (editingId === id) closeForm();
  };

  return (
    <section
      className="min-h-screen px-4 py-6 md:px-8 md:py-8"
      style={{ background: `linear-gradient(180deg, ${palette.iceWhite} 0%, #eff8ff 48%, #f8fcff 100%)` }}
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-5">
        <header className="rounded-2xl border bg-white p-5 shadow-sm" style={{ borderColor: palette.frostBlue }}>
          <div className="h-1.5 w-28 rounded-full mb-4" style={{ background: `linear-gradient(90deg, ${palette.deepOcean}, ${palette.softTeal})` }}></div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.22em]" style={{ color: palette.skyBlue }}>Module Transport</p>
              <h1 className="text-2xl md:text-3xl font-black" style={{ color: palette.deepOcean }}>{nom}</h1>
              <p className="text-sm mt-1" style={{ color: palette.textGray }}>Suivi des {labels.entityPlural} et opérations</p>
            </div>
            {objetAdmin ? (
              <p className="text-xs" style={{ color: palette.textGray }}>
                Admin: {objetAdmin.prenom || ''} {objetAdmin.nom || ''}
              </p>
            ) : null}
          </div>
        </header>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border bg-white p-4 shadow-sm" style={{ borderColor: palette.frostBlue }}>
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: palette.textGray }}>Total</p>
              <span className="text-lg">#</span>
            </div>
            <p className="text-3xl font-black mt-1" style={{ color: palette.deepOcean }}>{summary.total}</p>
          </div>
          <div className="rounded-2xl border p-4 shadow-sm" style={{ borderColor: '#BAEAD7', backgroundColor: '#F0FDF7' }}>
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#0D7A55' }}>Actifs</p>
              <span className="text-lg">●</span>
            </div>
            <p className="text-3xl font-black mt-1" style={{ color: '#0D7A55' }}>{summary.active}</p>
          </div>
          <div className="rounded-2xl border p-4 shadow-sm" style={{ borderColor: '#F2D8AF', backgroundColor: '#FFF8EA' }}>
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#A86910' }}>Maintenance</p>
              <span className="text-lg">●</span>
            </div>
            <p className="text-3xl font-black mt-1" style={{ color: '#A86910' }}>{summary.maintenance}</p>
          </div>
        </div>

        <div className="rounded-2xl border bg-white p-4 md:p-5 shadow-sm" style={{ borderColor: palette.frostBlue }}>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold" style={{ color: palette.deepOcean }}>Liste</h2>
            <button
              type="button"
              onClick={open ? closeForm : openCreateForm}
              className="rounded-xl px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
              style={{ background: `linear-gradient(90deg, ${palette.deepOcean}, ${palette.classicBlue})` }}
            >
              {open ? 'Fermer' : 'Ajouter'}
            </button>
          </div>

          <div className="overflow-x-auto rounded-xl border" style={{ borderColor: palette.frostBlue }}>
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs uppercase bg-slate-50" style={{ color: palette.textGray, borderColor: palette.frostBlue }}>
                  <th className="px-3 py-3">{labels.id}</th>
                  <th className="px-3 py-3">{labels.line}</th>
                  <th className="px-3 py-3">{labels.operator}</th>
                  <th className="px-3 py-3">{labels.occupancy}</th>
                  <th className="px-3 py-3">{labels.status}</th>
                  <th className="px-3 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-3 py-10 text-center text-sm font-semibold" style={{ color: palette.textGray }}>
                      Aucun élément disponible. Cliquez sur Ajouter pour commencer.
                    </td>
                  </tr>
                ) : null}
                {rows.map((item) => (
                  <tr key={item[idKey]} className="border-b last:border-b-0 hover:bg-slate-50/80 transition" style={{ borderColor: palette.frostBlue }}>
                    <td className="px-3 py-3 font-semibold" style={{ color: palette.deepOcean }}>{item[idKey]}</td>
                    <td className="px-3 py-3" style={{ color: palette.textGray }}>{item[lineKey]}</td>
                    <td className="px-3 py-3" style={{ color: palette.textGray }}>{item[operatorKey]}</td>
                    <td className="px-3 py-3">
                      <div className="w-28">
                        <div className="h-2 rounded-full bg-slate-100">
                          <div className="h-2 rounded-full" style={{ width: `${item[occupancyKey]}%`, backgroundColor: getLoadColor(item[occupancyKey]) }} />
                        </div>
                        <p className="mt-1 text-[11px] font-semibold" style={{ color: palette.textGray }}>{item[occupancyKey]}%</p>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <span className="rounded-full px-2 py-1 text-xs font-semibold" style={{ color: (statusStyle[item[statusKey]] || {}).text || '#334155', backgroundColor: (statusStyle[item[statusKey]] || {}).bg || '#E2E8F0' }}>
                        {item[statusKey]}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => openEditForm(item)}
                          className="rounded-lg px-3 py-1.5 text-xs font-semibold text-white transition hover:opacity-90"
                          style={{ backgroundColor: palette.classicBlue }}
                        >
                          Modifier
                        </button>
                        <button type="button" onClick={() => deleteItem(item[idKey])} className="rounded-lg bg-red-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-600">
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
          <div ref={formRef} className="rounded-2xl border bg-white p-4 md:p-5 shadow-sm" style={{ borderColor: palette.frostBlue }}>
            <h2 className="mb-3 text-lg font-bold" style={{ color: palette.deepOcean }}>{editingId ? `Modifier un ${labels.entitySingular}` : `Ajouter un ${labels.entitySingular}`}</h2>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <input
                ref={idRef}
                name={idKey}
                value={form[idKey] || ''}
                onChange={(e) => setFormField(idKey, e.target.value)}
                placeholder={`${labels.id} (ex: T-150)`}
                className="rounded-lg border px-3 py-2.5 text-sm outline-none focus:ring-2"
                style={{ borderColor: palette.frostBlue }}
              />
              <input
                name={lineKey}
                value={form[lineKey] || ''}
                onChange={(e) => setFormField(lineKey, e.target.value)}
                placeholder={labels.line}
                className="rounded-lg border px-3 py-2.5 text-sm outline-none focus:ring-2"
                style={{ borderColor: palette.frostBlue }}
              />
              <input
                name={operatorKey}
                value={form[operatorKey] || ''}
                onChange={(e) => setFormField(operatorKey, e.target.value)}
                placeholder={labels.operator}
                className="rounded-lg border px-3 py-2.5 text-sm outline-none focus:ring-2"
                style={{ borderColor: palette.frostBlue }}
              />
              <input
                type="number"
                name={occupancyKey}
                value={form[occupancyKey] || ''}
                onChange={(e) => setFormField(occupancyKey, e.target.value)}
                min="0"
                max="100"
                placeholder={`${labels.occupancy} (0-100)`}
                className="rounded-lg border px-3 py-2.5 text-sm outline-none focus:ring-2"
                style={{ borderColor: palette.frostBlue }}
              />

              <select
                name={statusKey}
                value={form[statusKey] || statusList[0]}
                onChange={(e) => setFormField(statusKey, e.target.value)}
                className="rounded-lg border px-3 py-2.5 text-sm md:col-span-2 outline-none focus:ring-2"
                style={{ borderColor: palette.frostBlue }}
              >
                {statusList.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>

              {error ? <p className="text-sm font-semibold text-red-600 md:col-span-2">{error}</p> : null}

              <div className="flex gap-2 md:col-span-2">
                <button
                  type="submit"
                  className="rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
                  style={{ background: `linear-gradient(90deg, ${palette.deepOcean}, ${palette.classicBlue})` }}
                >
                  {editingId ? 'Enregistrer' : 'Ajouter'}
                </button>
                <button
                  type="button"
                  onClick={closeForm}
                  className="rounded-lg border px-4 py-2.5 text-sm font-semibold transition hover:bg-slate-100"
                  style={{ borderColor: palette.frostBlue, color: palette.textGray }}
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
export default BodyTransport;