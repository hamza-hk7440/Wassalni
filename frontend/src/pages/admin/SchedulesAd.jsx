import React, { useState, useEffect } from 'react';
import Navbar from '../../components/layout/NavbarRa';
import { getAllSchedules, createSchedule, updateSchedule, deleteSchedule, getAllRoutes, getTransports } from '../../api/admin';
import palette from '../../components/common/pallette';
import { useAdminLanguage } from '../../components/common/language.jsx';

const toDateTimeLocalValue = (value) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const toIsoStringOrNull = (value) => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
};

function Schedules() {
	const { t } = useAdminLanguage();
  const [schedules, setSchedules] = useState([]);
  const [routesMenu, setRoutesMenu] = useState([]);
  const [transportsList, setTransportsList] = useState([]);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  const [routeId, setRouteId] = useState('');
  const [transportId, setTransportId] = useState('');
  const [departureTime, setDepartureTime] = useState('');
  const [arrivalTime, setArrivalTime] = useState('');
  const [currentPrice, setCurrentPrice] = useState('');
  const [scheduleStatus, setScheduleStatus] = useState('on_time');
  const [delayMinutes, setDelayMinutes] = useState('0');
  const [remark, setRemark] = useState('');
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchSchedules();
    fetchRoutesData();
    fetchTransportsData(); // we need transport api to fetch transports!
  }, []);

  const fetchSchedules = async () => {
    try {
      const data = await getAllSchedules();
      setSchedules(data);
    } catch (err) {
      console.error('Failed to fetch schedules', err);
    }
  };

  const fetchRoutesData = async () => {
    try {
      const data = await getAllRoutes();
      setRoutesMenu(data);
    } catch (err) {
      console.error('Failed to fetch routes', err);
    }
  };

  const fetchTransportsData = async () => {
    try {
      const data = await getTransports();
      setTransportsList(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch transports', err);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!routeId || !transportId || !departureTime || !arrivalTime) {
      setFormError('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    const departure = new Date(departureTime);
    const arrival = new Date(arrivalTime);

    if (Number.isNaN(departure.getTime()) || Number.isNaN(arrival.getTime())) {
      setFormError('Format de date invalide.');
      return;
    }

    if (departure >= arrival) {
      setFormError("L'heure d'arrivee doit etre apres l'heure de depart.");
      return;
    }

    if (currentPrice !== '' && (Number.isNaN(Number(currentPrice)) || Number(currentPrice) < 0)) {
      setFormError('Le prix doit etre un nombre positif ou nul.');
      return;
    }

    if (scheduleStatus === 'delayed' && (Number.isNaN(Number(delayMinutes)) || Number(delayMinutes) < 0)) {
      setFormError('Le retard (minutes) doit etre un nombre positif ou nul.');
      return;
    }

    try {
      const payload = {
        route_id: routeId,
        transport_id: transportId,
        departure_time: toIsoStringOrNull(departureTime),
        arrival_time: toIsoStringOrNull(arrivalTime),
        current_price: currentPrice === '' ? undefined : Number(currentPrice),
        schedule_status: scheduleStatus,
        delay_minutes: scheduleStatus === 'delayed' ? Number(delayMinutes || 0) : 0,
        remark: remark.trim(),
      };
      
      if (editingId) {
        await updateSchedule(editingId, payload);
        setFormSuccess('Schedule mis a jour avec succes.');
      } else {
        await createSchedule(payload);
        setFormSuccess('Schedule ajoute avec succes.');
      }
      resetForm();
      fetchSchedules();
    } catch (err) {
      setFormSuccess('');
      setFormError(err?.response?.data?.error || 'Operation echouee. Verifiez les donnees saisies.');
      console.error('Operation failed', err);
    }
  };

  const handleEdit = (schedule) => {
    setFormError('');
    setFormSuccess('');

    if (!schedule?.schedule_id) {
      setFormError('Impossible de modifier: identifiant schedule manquant.');
      return;
    }

    setEditingId(schedule.schedule_id);
    setRouteId(schedule.route_id ? String(schedule.route_id) : '');
    setTransportId(schedule.transport_id ? String(schedule.transport_id) : '');
    setDepartureTime(toDateTimeLocalValue(schedule.departure_time));
    setArrivalTime(toDateTimeLocalValue(schedule.arrival_time));
    setCurrentPrice(schedule.current_price ?? '');
    setScheduleStatus(schedule.schedule_status || 'on_time');
    setDelayMinutes(String(schedule.delay_minutes ?? 0));
    setRemark(schedule.remark || '');

    if (!schedule.route_id || !schedule.transport_id) {
      setFormError('Donnees incompletes pour edition. Recharge la page puis reessaie.');
    }
  };

  const handleDelete = async (id) => {
    setFormError('');
    setFormSuccess('');

    if (!id) {
      setFormError('Impossible de supprimer: identifiant schedule manquant.');
      return;
    }

    const confirmed = window.confirm('Confirmer la suppression de ce schedule ?');
    if (!confirmed) return;

    try {
      const response = await deleteSchedule(id);
      setFormSuccess(response?.message || 'Schedule supprime avec succes.');
      if (editingId === id) {
        resetForm();
      }
      await fetchSchedules();
    } catch (err) {
      setFormError(err?.response?.data?.error || 'Suppression echouee.');
      console.error('Failed to delete', err);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setRouteId('');
    setTransportId('');
    setDepartureTime('');
    setArrivalTime('');
    setCurrentPrice('');
    setScheduleStatus('on_time');
    setDelayMinutes('0');
    setRemark('');
  };

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{ background: `linear-gradient(140deg, ${palette.iceWhite} 0%, ${palette.pureWhite} 55%, ${palette.frostBlue} 100%)` }}
    >
      <div className="pointer-events-none absolute -top-16 -left-12 h-56 w-56 rounded-full blur-3xl opacity-30" style={{ backgroundColor: palette.softTeal }} />
      <div className="pointer-events-none absolute top-20 right-2 h-72 w-72 rounded-full blur-3xl opacity-20" style={{ backgroundColor: palette.skyBlue }} />

      <Navbar />

      <div className="relative z-10 pt-24 px-4 md:px-8 pb-8 max-w-7xl mx-auto space-y-6">
        <section className="rounded-3xl border px-6 py-5 md:px-8 md:py-6 shadow-lg" style={{ backgroundColor: 'rgba(255,255,255,0.82)', borderColor: palette.frostBlue }}>
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em]" style={{ color: palette.classicBlue }}>Transit Admin</p>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight" style={{ color: palette.deepOcean }}>{t('schedulesManagement', 'Schedules Management')}</h1>
              <p className="text-sm mt-1" style={{ color: palette.textGray }}>{t('schedulesSubtitle', 'Plan departures and arrivals on existing routes.')}</p>
            </div>
            <div className="rounded-2xl px-4 py-3 min-w-[130px]" style={{ backgroundColor: palette.deepOcean }}>
              <p className="text-xs uppercase tracking-wider font-semibold text-white/80">{t('total', 'Total')}</p>
              <p className="text-2xl font-extrabold text-white leading-none">{schedules.length}</p>
            </div>
          </div>
        </section>

        <form onSubmit={handleSubmit} className="p-6 md:p-7 rounded-3xl border shadow-lg" style={{ backgroundColor: 'rgba(255,255,255,0.92)', borderColor: palette.frostBlue }}>
          {formError && (
            <div
              className="mb-4 rounded-xl border px-4 py-3 text-sm font-semibold"
              style={{ backgroundColor: palette.dangerSoft, borderColor: palette.dangerText, color: palette.dangerText }}
            >
              {formError}
            </div>
          )}

          {formSuccess && (
            <div
              className="mb-4 rounded-xl border px-4 py-3 text-sm font-semibold"
              style={{ backgroundColor: '#e8f7ee', borderColor: '#5ab77f', color: '#1f7a44' }}
            >
              {formSuccess}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold" style={{ color: palette.deepOcean }}>{t('routeLabel', 'Route')}</label>
              <select
                value={routeId}
                onChange={(e) => setRouteId(e.target.value)}
                className="p-3 border rounded-xl focus:outline-none"
                style={{ borderColor: palette.frostBlue, color: palette.deepOcean }}
                required
              >
                <option value="">{t('selectPlaceholder', 'Select...')}</option>
                {routesMenu.map((r) => (
                  <option key={r.route_id} value={r.route_id}>{r.name}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold" style={{ color: palette.deepOcean }}>Transport</label>
              <select
                value={transportId}
                onChange={(e) => setTransportId(e.target.value)}
                className="p-3 border rounded-xl focus:outline-none"
                style={{ borderColor: palette.frostBlue, color: palette.deepOcean }}
                required
              >
                <option value="">{t('selectPlaceholder', 'Select...')}</option>
                {transportsList.map((t) => (
                  <option key={t.transport_id} value={t.transport_id}>{t.type} - {t.license_plate || t.plate_number || t.transport_id}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold" style={{ color: palette.deepOcean }}>{t('departureTime', 'Departure time')}</label>
              <input
                type="datetime-local"
                value={departureTime}
                onChange={(e) => setDepartureTime(e.target.value)}
                className="p-3 border rounded-xl focus:outline-none"
                style={{ borderColor: palette.frostBlue, color: palette.deepOcean }}
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold" style={{ color: palette.deepOcean }}>{t('arrivalTime', 'Arrival time')}</label>
              <input
                type="datetime-local"
                value={arrivalTime}
                onChange={(e) => setArrivalTime(e.target.value)}
                className="p-3 border rounded-xl focus:outline-none"
                style={{ borderColor: palette.frostBlue, color: palette.deepOcean }}
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold" style={{ color: palette.deepOcean }}>{t('priceCurrent', 'Price (current_price)')}</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={currentPrice}
                onChange={(e) => setCurrentPrice(e.target.value)}
                className="p-3 border rounded-xl focus:outline-none"
                style={{ borderColor: palette.frostBlue, color: palette.deepOcean }}
                placeholder="Ex: 2.50"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold" style={{ color: palette.deepOcean }}>{t('status', 'Status')}</label>
              <select
                value={scheduleStatus}
                onChange={(e) => setScheduleStatus(e.target.value)}
                className="p-3 border rounded-xl focus:outline-none"
                style={{ borderColor: palette.frostBlue, color: palette.deepOcean }}
              >
                <option value="on_time">{t('onTime', 'On time')}</option>
                <option value="delayed">{t('delayed', 'Delayed')}</option>
              </select>
            </div>

            {scheduleStatus === 'delayed' && (
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold" style={{ color: palette.deepOcean }}>{t('delayedMinutes', 'Delay (minutes)')}</label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={delayMinutes}
                  onChange={(e) => setDelayMinutes(e.target.value)}
                  className="p-3 border rounded-xl focus:outline-none"
                  style={{ borderColor: palette.frostBlue, color: palette.deepOcean }}
                />
              </div>
            )}

            <div className="md:col-span-2 flex flex-col gap-2">
              <label className="text-sm font-semibold" style={{ color: palette.deepOcean }}>{t('remarkClient', 'Remark (client visible)')}</label>
              <textarea
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                rows={3}
                className="p-3 border rounded-xl focus:outline-none"
                style={{ borderColor: palette.frostBlue, color: palette.deepOcean }}
                placeholder="Ex: Retard a cause de circulation dense"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="font-bold px-4 py-3 rounded-xl transition-transform hover:scale-[1.01]"
              style={{ backgroundColor: palette.classicBlue, color: palette.pureWhite }}
            >
              {editingId ? t('updateItem', 'Update') : t('addSchedule', 'Add Schedule')}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="font-semibold px-4 py-3 rounded-xl border"
                style={{ borderColor: palette.frostBlue, color: palette.deepOcean, backgroundColor: palette.pureWhite }}
              >
                {t('cancelEdit', 'Cancel Edit')}
              </button>
            )}
          </div>
        </form>

        <div className="rounded-3xl border shadow-lg overflow-hidden" style={{ borderColor: palette.frostBlue, backgroundColor: palette.pureWhite }}>
          <table className="min-w-full text-left">
            <thead style={{ backgroundColor: palette.deepOcean }}>
              <tr>
                <th className="p-4 font-semibold text-white">ID</th>
                <th className="p-4 font-semibold text-white">Route</th>
                <th className="p-4 font-semibold text-white">Transport</th>
                <th className="p-4 font-semibold text-white">Depart</th>
                <th className="p-4 font-semibold text-white">Arrivee</th>
                <th className="p-4 font-semibold text-white">Prix</th>
                <th className="p-4 font-semibold text-white">Statut</th>
                <th className="p-4 font-semibold text-white">Remarque</th>
                <th className="p-4 font-semibold text-white text-right">{t('actions', 'Actions')}</th>
              </tr>
            </thead>
            <tbody>
              {schedules.map((sch) => {
                const rt = routesMenu.find((r) => String(r.route_id) === String(sch.route_id))?.name || sch.routes?.name || sch.route_id;
                const tr = transportsList.find((t) => String(t.transport_id) === String(sch.transport_id))?.type || sch.transports?.type || sch.transport_id;
                const statusText = sch.schedule_status === 'delayed' ? `${t('delayed', 'Delayed')} (${sch.delay_minutes || 0} min)` : t('onTime', 'On time');

                return (
                  <tr key={sch.schedule_id} className="border-b last:border-0" style={{ borderColor: palette.frostBlue }}>
                    <td className="p-4 font-semibold" style={{ color: palette.classicBlue }}>#{sch.schedule_id}</td>
                    <td className="p-4" style={{ color: palette.deepOcean }}>{rt}</td>
                    <td className="p-4" style={{ color: palette.textGray }}>{tr}</td>
                    <td className="p-4" style={{ color: palette.textGray }}>{new Date(sch.departure_time).toLocaleString()}</td>
                    <td className="p-4" style={{ color: palette.textGray }}>{new Date(sch.arrival_time).toLocaleString()}</td>
                    <td className="p-4" style={{ color: palette.textGray }}>{Number(sch.current_price ?? 0).toFixed(2)}</td>
                    <td className="p-4" style={{ color: palette.textGray }}>{statusText}</td>
                    <td className="p-4" style={{ color: palette.textGray }}>{sch.remark || '-'}</td>
                    <td className="p-4 text-right flex gap-2 justify-end">
                      <button
                        type="button"
                        onClick={() => handleEdit(sch)}
                        className="px-3 py-1.5 rounded-lg text-sm font-bold"
                        style={{ backgroundColor: palette.iceWhite, color: palette.classicBlue }}
                      >
                        {t('edit', 'Edit')}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(sch.schedule_id)}
                        className="px-3 py-1.5 rounded-lg text-sm font-bold"
                        style={{ backgroundColor: palette.dangerSoft, color: palette.dangerText }}
                      >
                        {t('delete', 'Delete')}
                      </button>
                    </td>
                  </tr>
                );
              })}
              {schedules.length === 0 && (
                <tr>
                  <td colSpan="9" className="p-8 text-center font-medium" style={{ color: palette.textGray }}>
                    {t('emptySchedules', 'No schedules found.')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Schedules;