import React, { useState, useEffect } from 'react';
import Navbar from '../../components/layout/NavbarRa';
import { getAllSchedules, createSchedule, updateSchedule, deleteSchedule, getAllRoutes, getTransports } from '../../api/admin';
import palette from '../../components/common/pallette';

function Schedules() {
  const [schedules, setSchedules] = useState([]);
  const [routesMenu, setRoutesMenu] = useState([]);
  const [transportsList, setTransportsList] = useState([]);

  const [routeId, setRouteId] = useState('');
  const [transportId, setTransportId] = useState('');
  const [departureTime, setDepartureTime] = useState('');
  const [arrivalTime, setArrivalTime] = useState('');
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
    try {
      const payload = {
        route_id: routeId,
        transport_id: transportId,
        departure_time: departureTime,
        arrival_time: arrivalTime
      };
      
      if (editingId) {
        await updateSchedule(editingId, payload);
      } else {
        await createSchedule(payload);
      }
      resetForm();
      fetchSchedules();
    } catch (err) {
      console.error('Operation failed', err);
    }
  };

  const handleEdit = (schedule) => {
    setEditingId(schedule.schedule_id);
    setRouteId(schedule.route_id);
    setTransportId(schedule.transport_id);
    setDepartureTime(schedule.departure_time);
    setArrivalTime(schedule.arrival_time);
  };

  const handleDelete = async (id) => {
    try {
      await deleteSchedule(id);
      fetchSchedules();
    } catch (err) {
      console.error('Failed to delete', err);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setRouteId('');
    setTransportId('');
    setDepartureTime('');
    setArrivalTime('');
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
              <h1 className="text-3xl md:text-4xl font-black tracking-tight" style={{ color: palette.deepOcean }}>Gestion des Schedules</h1>
              <p className="text-sm mt-1" style={{ color: palette.textGray }}>Planifiez les departs et arrivees sur les routes existantes.</p>
            </div>
            <div className="rounded-2xl px-4 py-3 min-w-[130px]" style={{ backgroundColor: palette.deepOcean }}>
              <p className="text-xs uppercase tracking-wider font-semibold text-white/80">Total</p>
              <p className="text-2xl font-extrabold text-white leading-none">{schedules.length}</p>
            </div>
          </div>
        </section>

        <form onSubmit={handleSubmit} className="p-6 md:p-7 rounded-3xl border shadow-lg" style={{ backgroundColor: 'rgba(255,255,255,0.92)', borderColor: palette.frostBlue }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold" style={{ color: palette.deepOcean }}>Trajet (Route)</label>
              <select
                value={routeId}
                onChange={(e) => setRouteId(e.target.value)}
                className="p-3 border rounded-xl focus:outline-none"
                style={{ borderColor: palette.frostBlue, color: palette.deepOcean }}
                required
              >
                <option value="">Selectionner...</option>
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
                <option value="">Selectionner...</option>
                {transportsList.map((t) => (
                  <option key={t.transport_id} value={t.transport_id}>{t.type} - {t.license_plate || t.plate_number || t.transport_id}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold" style={{ color: palette.deepOcean }}>Heure de depart</label>
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
              <label className="text-sm font-semibold" style={{ color: palette.deepOcean }}>Heure d'arrivee</label>
              <input
                type="datetime-local"
                value={arrivalTime}
                onChange={(e) => setArrivalTime(e.target.value)}
                className="p-3 border rounded-xl focus:outline-none"
                style={{ borderColor: palette.frostBlue, color: palette.deepOcean }}
                required
              />
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="font-bold px-4 py-3 rounded-xl transition-transform hover:scale-[1.01]"
              style={{ backgroundColor: palette.classicBlue, color: palette.pureWhite }}
            >
              {editingId ? 'Mettre a jour' : 'Ajouter Schedule'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="font-semibold px-4 py-3 rounded-xl border"
                style={{ borderColor: palette.frostBlue, color: palette.deepOcean, backgroundColor: palette.pureWhite }}
              >
                Annuler Edition
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
                <th className="p-4 font-semibold text-white text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {schedules.map((sch) => {
                const rt = routesMenu.find((r) => String(r.route_id) === String(sch.route_id))?.name || sch.routes?.name || sch.route_id;
                const tr = transportsList.find((t) => String(t.transport_id) === String(sch.transport_id))?.type || sch.transports?.type || sch.transport_id;

                return (
                  <tr key={sch.schedule_id} className="border-b last:border-0" style={{ borderColor: palette.frostBlue }}>
                    <td className="p-4 font-semibold" style={{ color: palette.classicBlue }}>#{sch.schedule_id}</td>
                    <td className="p-4" style={{ color: palette.deepOcean }}>{rt}</td>
                    <td className="p-4" style={{ color: palette.textGray }}>{tr}</td>
                    <td className="p-4" style={{ color: palette.textGray }}>{new Date(sch.departure_time).toLocaleString()}</td>
                    <td className="p-4" style={{ color: palette.textGray }}>{new Date(sch.arrival_time).toLocaleString()}</td>
                    <td className="p-4 text-right flex gap-2 justify-end">
                      <button
                        onClick={() => handleEdit(sch)}
                        className="px-3 py-1.5 rounded-lg text-sm font-bold"
                        style={{ backgroundColor: palette.iceWhite, color: palette.classicBlue }}
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => handleDelete(sch.schedule_id)}
                        className="px-3 py-1.5 rounded-lg text-sm font-bold"
                        style={{ backgroundColor: palette.dangerSoft, color: palette.dangerText }}
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                );
              })}
              {schedules.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-8 text-center font-medium" style={{ color: palette.textGray }}>
                    Aucune planification trouvee.
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