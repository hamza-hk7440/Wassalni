import React, { useState, useEffect } from "react";
import Navbar from "../../components/layout/NavbarRa";
import {
  getAllStations,
  createStation,
  updateStation,
  deleteStation,
} from "../../api/admin";
import palette from "../../components/common/pallette";
import { useAdminLanguage } from "../../components/common/language.jsx";

function Stations() {
  const { t } = useAdminLanguage();
  const [stations, setStations] = useState([]);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchStations();
  }, []);

  const fetchStations = async () => {
    try {
      const data = await getAllStations();
      setStations(data);
    } catch (err) {
      console.error("Failed to fetch stations", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateStation(editingId, { name, location });
      } else {
        await createStation({ name, location });
      }
      setName("");
      setLocation("");
      setEditingId(null);
      fetchStations();
    } catch (err) {
      console.error("Operation failed", err);
    }
  };

  const handleEdit = (station) => {
    setEditingId(station.station_id);
    setName(station.name);
    setLocation(station.location || "");
  };

  const handleDelete = async (id) => {
    try {
      await deleteStation(id);
      fetchStations();
    } catch (err) {
      console.error("Failed to delete", err);
    }
  };

  const isEditing = Boolean(editingId);

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        background: `linear-gradient(140deg, ${palette.iceWhite} 0%, ${palette.pureWhite} 55%, ${palette.frostBlue} 100%)`,
      }}
    >
      <div
        className="pointer-events-none absolute -top-16 -left-12 h-56 w-56 rounded-full blur-3xl opacity-30"
        style={{ backgroundColor: palette.softTeal }}
      />
      <div
        className="pointer-events-none absolute top-24 right-0 h-72 w-72 rounded-full blur-3xl opacity-25"
        style={{ backgroundColor: palette.skyBlue }}
      />

      <Navbar />
      <div className="relative z-10 pt-24 px-4 md:px-8 pb-8 max-w-7xl mx-auto space-y-6">
        <section
          className="rounded-3xl border px-6 py-5 md:px-8 md:py-6 shadow-lg"
          style={{
            backgroundColor: "rgba(255,255,255,0.78)",
            borderColor: palette.frostBlue,
          }}
        >
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <p
                className="text-xs font-bold uppercase tracking-[0.18em]"
                style={{ color: palette.classicBlue }}
              >
                {t("transitAdmin", "Transit Admin")}
              </p>
              <h1
                className="text-3xl md:text-4xl font-black tracking-tight"
                style={{ color: palette.deepOcean }}
              >
                {t("stationsManagement", "Stations Management")}
              </h1>
              <p className="text-sm mt-1" style={{ color: palette.textGray }}>
                {t(
                  "stationsSubtitle",
                  "Add, edit, and organize stations across your network.",
                )}
              </p>
            </div>
            <div
              className="rounded-2xl px-4 py-3 min-w-[130px]"
              style={{ backgroundColor: palette.deepOcean }}
            >
              <p className="text-xs uppercase tracking-wider font-semibold text-white/80">
                {t("total", "Total")}
              </p>
              <p className="text-2xl font-extrabold text-white leading-none">
                {stations.length}
              </p>
            </div>
          </div>
        </section>

        <form
          onSubmit={handleSubmit}
          className="p-6 md:p-7 rounded-3xl border shadow-lg"
          style={{
            backgroundColor: "rgba(255,255,255,0.9)",
            borderColor: palette.frostBlue,
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2
              className="text-xl font-extrabold"
              style={{ color: palette.deepOcean }}
            >
              {isEditing
                ? t("editStation", "Edit a station")
                : t("addStation", "Add a station")}
            </h2>
            {isEditing && (
              <span
                className="text-xs font-bold px-3 py-1 rounded-full"
                style={{
                  backgroundColor: palette.iceWhite,
                  color: palette.classicBlue,
                }}
              >
                {t("editMode", "Edit mode")}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-4 max-w-lg">
            <input
              type="text"
              placeholder={t("stationName", "Station name")}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="p-3 border rounded-xl focus:outline-none"
              style={{
                borderColor: palette.frostBlue,
                color: palette.deepOcean,
              }}
              required
            />
            <input
              type="text"
              placeholder={t("stationLocation", "Station location")}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="p-3 border rounded-xl focus:outline-none"
              style={{
                borderColor: palette.frostBlue,
                color: palette.deepOcean,
              }}
              required
            />
            <button
              type="submit"
              className="font-bold p-3 rounded-xl transition-transform hover:scale-[1.01]"
              style={{ backgroundColor: palette.classicBlue }}
            >
              <span className="text-white" style={{ color: palette.pureWhite }}>
                {editingId
                  ? t("updateItem", "Update")
                  : t("addStation", "Add station")}
              </span>
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setName("");
                  setLocation("");
                }}
                className="font-semibold p-3 rounded-xl border"
                style={{
                  borderColor: palette.frostBlue,
                  color: palette.deepOcean,
                  backgroundColor: palette.pureWhite,
                }}
              >
                {t("cancelEdit", "Cancel Edit")}
              </button>
            )}
          </div>
        </form>

        <div
          className="rounded-3xl border shadow-lg overflow-hidden"
          style={{
            borderColor: palette.frostBlue,
            backgroundColor: palette.pureWhite,
          }}
        >
          <table className="min-w-full text-left">
            <thead style={{ backgroundColor: palette.deepOcean }}>
              <tr>
                <th className="p-4 font-semibold text-white">station_id</th>
                <th className="p-4 font-semibold text-white">
                  {t("stationName", "Station name")}
                </th>
                <th className="p-4 font-semibold text-white">
                  {t("stationLocation", "Station location")}
                </th>
                <th className="p-4 font-semibold text-white text-right">
                  {t("actions", "Actions")}
                </th>
              </tr>
            </thead>
            <tbody>
              {stations.map((station) => (
                <tr
                  key={station.station_id}
                  className="border-b last:border-0"
                  style={{ borderColor: palette.frostBlue }}
                >
                  <td
                    className="p-4 font-semibold"
                    style={{ color: palette.classicBlue }}
                  >
                    {station.station_id}
                  </td>
                  <td
                    className="p-4 font-semibold"
                    style={{ color: palette.deepOcean }}
                  >
                    {station.name}
                  </td>
                  <td
                    className="p-4 font-semibold"
                    style={{ color: palette.textGray }}
                  >
                    {station.location || "-"}
                  </td>
                  <td className="p-4 text-right flex gap-2 justify-end">
                    <button
                      onClick={() => handleEdit(station)}
                      className="px-3 py-1.5 rounded-lg text-sm font-bold"
                      style={{
                        backgroundColor: palette.iceWhite,
                        color: palette.classicBlue,
                      }}
                    >
                      {t("edit", "Edit")}
                    </button>
                    <button
                      onClick={() => handleDelete(station.station_id)}
                      className="px-3 py-1.5 rounded-lg text-sm font-bold"
                      style={{
                        backgroundColor: palette.dangerSoft,
                        color: palette.dangerText,
                      }}
                    >
                      {t("delete", "Delete")}
                    </button>
                  </td>
                </tr>
              ))}
              {stations.length === 0 && (
                <tr>
                  <td
                    colSpan="4"
                    className="p-8 text-center font-medium"
                    style={{ color: palette.textGray }}
                  >
                    {t("emptyStations", "No stations found.")}
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

export default Stations;
