import React, { useEffect, useRef, useState } from 'react';
import palette from "./pallette";
import { useAdminLanguage } from './language.jsx';
const DEFAULT_STATUS_LIST = ['En ligne', 'Maintenance', 'Retard'];
const DEFAULT_EMPTY_FORM = {
  id: '',
  occupancy: '',
  status: 'En ligne',
};

const DEFAULT_FIELD_KEYS = {
  id: 'id',
  occupancy: 'occupancy',
  status: 'status',
};

const DEFAULT_LABELS = {
  entitySingular: 'transport',
  entityPlural: 'transports',
  id: 'Code',
  occupancy: 'Charge',
  status: 'Statut',
};

const DEFAULT_STATUS_STYLE = {
  'En ligne': { text: palette.deepOcean, bg: palette.iceWhite },
  Maintenance: { text: palette.warmAccent, bg: '#FFF4E3' },
  Retard: { text: palette.dangerText, bg: palette.dangerSoft },
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
  onCreate,
  onUpdate,
  onDelete,
}) {
	const { t } = useAdminLanguage();
  const { id: idKey, occupancy: occupancyKey, status: statusKey } = fieldKeys;

  const normalizeStatus = (rawStatus) => {
    const value = String(rawStatus || '').trim().toLowerCase();
    if (!value) return statusList[0] || 'En ligne';

    if (value === 'en ligne' || value === 'active' || value === 'in_service' || value === 'in service' || value === 'online') {
      return 'En ligne';
    }
    if (value === 'maintenance' || value === 'maint') {
      return 'Maintenance';
    }
    if (value === 'retard' || value === 'delayed' || value === 'delay' || value === 'late') {
      return 'Retard';
    }

    const match = statusList.find((statusItem) => String(statusItem).toLowerCase() === value);
    return match || statusList[0] || 'En ligne';
  };

  const normalizeOccupancy = (rawValue) => {
    const numericValue = Number(rawValue);
    if (Number.isNaN(numericValue)) return 0;
    return Math.max(0, Math.min(100, numericValue));
  };

  const normalizeIncomingItem = (item = {}, index = 0) => {
    const fallbackId = item?.license_plate || item?.id || item?.transport_id || `ROW-${index + 1}`;
    const fallbackOccupancy = item?.capacity ?? item?.occupancy ?? item?.load ?? 0;
    const fallbackStatus = item?.status ?? item?.transport_status ?? statusList[0];

    return {
      ...item,
      [idKey]: String(item?.[idKey] ?? fallbackId).trim(),
      [occupancyKey]: normalizeOccupancy(item?.[occupancyKey] ?? fallbackOccupancy),
      [statusKey]: normalizeStatus(item?.[statusKey] ?? fallbackStatus),
    };
  };

  const getLoadColor = (value) => {
    if (value >= 85) return palette.dangerText;
    if (value >= 65) return palette.warmAccent;
    return palette.softTeal;
  };

  const readField = (item, key, fallback = '') => item?.[key] ?? fallback;
  const setFormField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));
  const toFormValues = (item) => ({
    [idKey]: readField(item, idKey),
    [occupancyKey]: String(readField(item, occupancyKey, '')),
    [statusKey]: readField(item, statusKey, statusList[0]),
  });
  const toDomainItem = (currentForm) => ({
    [idKey]: String(readField(currentForm, idKey)).trim().toUpperCase(),
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

  const validRows = Array.isArray(listDonner)
    ? listDonner.map((item, index) => normalizeIncomingItem(item, index))
    : [];

  const [rows, setRows] = useState(validRows);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const isEditing = editingId !== null;

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
    setEditingId(String(item[idKey]));
    setForm(toFormValues(item));
    withFormOpen();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    const nextItem = toDomainItem(form);
    const id = nextItem[idKey];
    const occupancy = nextItem[occupancyKey];

    if (!id || Number.isNaN(occupancy)) {
      setError(t('requiredFields', 'Required fields.'));
      return;
    }

    if (occupancy < 0 || occupancy > 100) {
      setError(t('occupancyRange', 'Load must be between 0 and 100.'));
      return;
    }

    const exists = rows.some((item) => String(readField(item, idKey)).toLowerCase() === id.toLowerCase() && String(item[idKey]) !== String(editingId));
    if (exists) {
      setError(t('codeAlreadyUsed', 'Code already used.'));
      return;
    }

    try {
      if (isEditing) {
        const oldItem = rows.find(r => String(r[idKey]) === String(editingId));
        if (onUpdate) {
          await onUpdate(nextItem, oldItem);
        } else {
          setRows((prev) => prev.map((item) => (String(item[idKey]) === String(editingId) ? nextItem : item)));
        }
      } else {
        if (onCreate) {
          await onCreate(nextItem);
        } else {
          setRows((prev) => [...prev, nextItem]);
        }
      }
      closeForm();
    } catch (err) {
      setError(err.message || t('unexpectedError', 'An unexpected error occurred.'));
    }
  };

  const deleteItem = async (id) => {
    try {
      const itemToDelete = rows.find((item) => item[idKey] === id);
      if (onDelete && itemToDelete) {
        await onDelete(itemToDelete);
      } else {
        setRows((prev) => prev.filter((item) => item[idKey] !== id));
      }
      if (editingId === id) closeForm();
    } catch (err) {
      setError(err.message || t('unexpectedError', 'An unexpected error occurred.'));
    }
  };

  return (
    <section
      className="min-h-screen px-4 pt-[88px] pb-6 md:px-8 md:pt-[92px] md:pb-8"
      style={{ background: `linear-gradient(180deg, ${palette.pureWhite} 0%, ${palette.iceWhite} 48%, ${palette.pureWhite} 100%)` }}
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-5">
        <header
          className="rounded-3xl border p-5 shadow-lg"
          style={{
            borderColor: palette.frostBlue,
            background: `linear-gradient(145deg, ${palette.pureWhite} 0%, ${palette.iceWhite} 100%)`,
          }}
        >
          <div className="h-1.5 w-28 rounded-full mb-4" style={{ background: `linear-gradient(90deg, ${palette.classicBlue}, ${palette.softTeal})` }}></div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-skyBlue">{t('transportModule', 'Transport Module')}</p>
              <h1 className="text-2xl md:text-3xl font-black text-deepOcean">{nom}</h1>
              <p className="text-sm mt-1 text-textGray">{t('transportTracking', 'Tracking {entity} and operations', { entity: labels.entityPlural })}</p>
            </div>
            {objetAdmin ? (
              <p className="rounded-full border px-3 py-1 text-xs font-semibold" style={{ color: palette.textGray, borderColor: palette.frostBlue, backgroundColor: palette.pureWhite }}>
                Admin: {objetAdmin.prenom || ''} {objetAdmin.nom || ''}
              </p>
            ) : null}
          </div>
        </header>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border p-4 shadow-sm" style={{ borderColor: palette.frostBlue, backgroundColor: palette.pureWhite }}>
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider text-textGray">{t('total', 'Total')}</p>
              <span className="text-lg">#</span>
            </div>
            <p className="text-3xl font-black mt-1 text-deepOcean">{summary.total}</p>
          </div>
          <div className="rounded-2xl border p-4 shadow-sm" style={{ borderColor: palette.softTeal, backgroundColor: palette.iceWhite }}>
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: palette.deepOcean }}>{t('activePlural', 'Active')}</p>
              <span className="text-lg"></span>
            </div>
            <p className="text-3xl font-black mt-1" style={{ color: palette.deepOcean }}>{summary.active}</p>
          </div>
          <div className="rounded-2xl border p-4 shadow-sm" style={{ borderColor: palette.warmAccent, backgroundColor: '#FFF8EA' }}>
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: palette.warmAccent }}>Maintenance</p>
              <span className="text-lg"></span>
            </div>
            <p className="text-3xl font-black mt-1" style={{ color: palette.warmAccent }}>{summary.maintenance}</p>
          </div>
        </div>

        <div className="rounded-2xl border bg-white p-4 md:p-5 shadow-sm border-frostBlue">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-deepOcean">{t('list', 'List')}</h2>
            <button
              type="button"
              onClick={open ? closeForm : openCreateForm}
              className="rounded-xl px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
              style={{ background: `linear-gradient(90deg, ${palette.classicBlue}, ${palette.softTeal})` }}
            >
              {open ? t('close', 'Close') : t('add', 'Add')}
            </button>
          </div>

          <div className="overflow-x-auto rounded-xl border border-frostBlue">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs uppercase bg-slate-50 text-textGray border-frostBlue">
                  <th className="px-3 py-3">{labels.id}</th>
                  <th className="px-3 py-3">{labels.occupancy}</th>
                  <th className="px-3 py-3">{labels.status}</th>
                  <th className="px-3 py-3">{t('actions', 'Actions')}</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-3 py-10 text-center text-sm font-semibold text-textGray">
                      {t('emptyElements', 'No items available. Click Add to get started.')}
                    </td>
                  </tr>
                ) : null}
                {rows.map((item, index) => (
                  <tr key={item?.transport_id || item[idKey] || `row-${index}`} className="border-b last:border-b-0 hover:bg-slate-50/80 transition border-frostBlue">
                    <td className="px-3 py-3 font-semibold text-deepOcean">{item[idKey]}</td>
                    <td className="px-3 py-3">
                      <div className="w-28">
                        <div className="h-2 rounded-full" style={{ backgroundColor: palette.iceWhite }}>
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${Math.min(100, Math.max(0, item[occupancyKey]))}%`,
                              backgroundColor: getLoadColor(item[occupancyKey]),
                            }}
                          ></div>
                        </div>
                        <p className="mt-1 text-[10px] font-bold text-textGray">{item[occupancyKey]} / 100</p>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <span
                        className="rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-wider"
                        style={{
                          color: statusStyle[item[statusKey]]?.text || palette.textGray,
                          backgroundColor: statusStyle[item[statusKey]]?.bg || palette.iceWhite,
                        }}
                      >
                        {item[statusKey]}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => openEditForm(item)}
                          className="rounded-lg px-3 py-1.5 text-xs font-semibold text-white transition hover:opacity-90 bg-classicBlue"
                        >
                          {t('edit', 'Edit')}
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteItem(item[idKey])}
                          className="rounded-lg px-3 py-1.5 text-xs font-semibold text-white transition hover:opacity-90"
                          style={{ backgroundColor: palette.dangerText }}
                        >
                          {t('delete', 'Delete')}
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
          <div ref={formRef} className="rounded-2xl border bg-white p-4 md:p-5 shadow-sm border-frostBlue">
            <h2 className="mb-3 text-lg font-bold text-deepOcean">{isEditing ? t('editEntity', 'Edit a {entity}', { entity: labels.entitySingular }) : t('addEntity', 'Add a {entity}', { entity: labels.entitySingular })}</h2>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <input
                ref={idRef}
                name={idKey}
                value={form[idKey] || ''}
                onChange={(e) => setFormField(idKey, e.target.value)}
                placeholder={`${labels.id} (ex: T-150)`}
                className="rounded-lg border px-3 py-2.5 text-sm outline-none focus:ring-2 border-frostBlue md:col-span-2"
              />
              
              <input
                type="number"
                min="0"
                max="100"
                value={form[occupancyKey] || ''}
                onChange={(e) => setFormField(occupancyKey, e.target.value)}
                placeholder={`${labels.occupancy} (0-100)`}
                className="rounded-lg border px-3 py-2.5 text-sm outline-none focus:ring-2 border-frostBlue"
              />

              <select
                name={statusKey}
                value={form[statusKey] || statusList[0]}
                onChange={(e) => setFormField(statusKey, e.target.value)}
                className="rounded-lg border px-3 py-2.5 text-sm outline-none focus:ring-2 border-frostBlue"
              >
                {statusList.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>

              {error ? <p className="text-sm font-semibold md:col-span-2" style={{ color: palette.dangerText }}>{error}</p> : null}

              <div className="flex gap-2 md:col-span-2">
                <button
                  type="submit"
                  className="rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
                  style={{ background: `linear-gradient(90deg, ${palette.classicBlue}, ${palette.softTeal})` }}
                >
                  {isEditing ? t('save', 'Save') : t('add', 'Add')}
                </button>
                <button
                  type="button"
                  onClick={closeForm}
                  className="rounded-lg border px-4 py-2.5 text-sm font-semibold border-frostBlue"
                  style={{ color: palette.deepOcean, backgroundColor: palette.pureWhite }}
                >
                  {t('cancel', 'Cancel')}
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
