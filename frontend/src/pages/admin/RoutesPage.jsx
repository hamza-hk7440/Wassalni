import React, { useState, useEffect } from 'react';
import Navbar from '../../components/layout/NavbarRa';
import { getAllRoutes, createRoute, updateRoute, deleteRoute, getAllStations } from '../../api/admin';
import palette from '../../components/common/pallette';

function RoutesPage() {
  const [routesData, setRoutesData] = useState([]);
  const [stations, setStations] = useState([]);
  
  const [name, setName] = useState('');
  const [startStationId, setStartStationId] = useState('');
  const [endStationId, setEndStationId] = useState('');
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchRoutes();
    fetchStations();
  }, []);

  const fetchRoutes = async () => {
    try {
      const data = await getAllRoutes();
      setRoutesData(data);
    } catch (err) {
      console.error('Failed to fetch routes', err);
    }
  };

  const fetchStations = async () => {
    try {
      const data = await getAllStations();
      setStations(data);
    } catch (err) {
      console.error('Failed to fetch stations', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name,
        start_station_id: startStationId,
        end_station_id: endStationId
      };
      
      if (editingId) {
        await updateRoute(editingId, payload);
      } else {
        await createRoute(payload);
      }
      resetForm();
      fetchRoutes();
    } catch (err) {
      console.error('Operation failed', err);
    }
  };

  const handleEdit = (route) => {
    setEditingId(route.route_id);
    setName(route.name);
    setStartStationId(route.start_station_id);
    setEndStationId(route.end_station_id);
  };

  const handleDelete = async (id) => {
    try {
      await deleteRoute(id);
      fetchRoutes();
    } catch (err) {
      console.error('Failed to delete', err);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setName('');
    setStartStationId('');
    setEndStationId('');
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
              <h1 className="text-3xl md:text-4xl font-black tracking-tight" style={{ color: palette.deepOcean }}>Gestion des Routes</h1>
              <p className="text-sm mt-1" style={{ color: palette.textGray }}>Configurez les trajets entre stations avec une interface claire.</p>
            </div>
            <div className="rounded-2xl px-4 py-3 min-w-[130px]" style={{ backgroundColor: palette.deepOcean }}>
              <p className="text-xs uppercase tracking-wider font-semibold text-white/80">Total</p>
              <p className="text-2xl font-extrabold text-white leading-none">{routesData.length}</p>
            </div>
          </div>
        </section>

        <form onSubmit={handleSubmit} className="p-6 md:p-7 rounded-3xl border shadow-lg" style={{ backgroundColor: 'rgba(255,255,255,0.92)', borderColor: palette.frostBlue }}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold" style={{ color: palette.deepOcean }}>Nom du trajet</label>
              <input
                type="text"
                placeholder="Ex: Ligne 1"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="p-3 border rounded-xl focus:outline-none"
                style={{ borderColor: palette.frostBlue, color: palette.deepOcean }}
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold" style={{ color: palette.deepOcean }}>Station depart</label>
              <select
                value={startStationId}
                onChange={(e) => setStartStationId(e.target.value)}
                className="p-3 border rounded-xl focus:outline-none"
                style={{ borderColor: palette.frostBlue, color: palette.deepOcean }}
                required
              >
                <option value="">Selectionner...</option>
                {stations.map((st) => (
                  <option key={st.station_id} value={st.station_id}>{st.name}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold" style={{ color: palette.deepOcean }}>Station arrivee</label>
              <select
                value={endStationId}
                onChange={(e) => setEndStationId(e.target.value)}
                className="p-3 border rounded-xl focus:outline-none"
                style={{ borderColor: palette.frostBlue, color: palette.deepOcean }}
                required
              >
                <option value="">Selectionner...</option>
                {stations.map((st) => (
                  <option key={st.station_id} value={st.station_id}>{st.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="font-bold px-4 py-3 rounded-xl transition-transform hover:scale-[1.01]"
              style={{ backgroundColor: palette.classicBlue, color: palette.pureWhite }}
            >
              {editingId ? 'Mettre a jour' : 'Ajouter Trajet'}
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
                <th className="p-4 font-semibold text-white">Nom</th>
                <th className="p-4 font-semibold text-white">Depart</th>
                <th className="p-4 font-semibold text-white">Arrivee</th>
                <th className="p-4 font-semibold text-white text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {routesData.map((route) => {
                const startSt = stations.find((s) => String(s.station_id) === String(route.start_station_id))?.name || route.start_station?.name || route.start_station_id;
                const endSt = stations.find((s) => String(s.station_id) === String(route.end_station_id))?.name || route.end_station?.name || route.end_station_id;

                return (
                  <tr key={route.route_id} className="border-b last:border-0" style={{ borderColor: palette.frostBlue }}>
                    <td className="p-4 font-semibold" style={{ color: palette.classicBlue }}>#{route.route_id}</td>
                    <td className="p-4 font-semibold" style={{ color: palette.deepOcean }}>{route.name}</td>
                    <td className="p-4" style={{ color: palette.textGray }}>{startSt}</td>
                    <td className="p-4" style={{ color: palette.textGray }}>{endSt}</td>
                    <td className="p-4 text-right flex gap-2 justify-end">
                      <button
                        onClick={() => handleEdit(route)}
                        className="px-3 py-1.5 rounded-lg text-sm font-bold"
                        style={{ backgroundColor: palette.iceWhite, color: palette.classicBlue }}
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => handleDelete(route.route_id)}
                        className="px-3 py-1.5 rounded-lg text-sm font-bold"
                        style={{ backgroundColor: palette.dangerSoft, color: palette.dangerText }}
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                );
              })}
              {routesData.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-8 text-center font-medium" style={{ color: palette.textGray }}>
                    Aucun trajet trouve.
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

export default RoutesPage;