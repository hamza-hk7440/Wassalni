import React, { useState, useEffect } from "react";
import Navbar from "../../components/layout/NavbarRa";
import {
  getAllSchedules,
  createSchedule,
  updateSchedule,
  deleteSchedule,
  getAllRoutes,
  getTransports,
} from "../../api/admin";
import palette from "../../components/common/pallette";
import { useAdminLanguage } from "../../components/common/language.jsx";

const toDateTimeLocalValue = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const toIsoStringOrNull = (value) => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
};

function Schedules() {
  const { language, t } = useAdminLanguage();
  const [schedules, setSchedules] = useState([]);
  const [routesMenu, setRoutesMenu] = useState([]);
  const [transportsList, setTransportsList] = useState([]);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  const [routeId, setRouteId] = useState("");
  const [transportId, setTransportId] = useState("");
  const [departureTime, setDepartureTime] = useState("");
  const [arrivalTime, setArrivalTime] = useState("");
  const [currentPrice, setCurrentPrice] = useState("");
  const [direction, setDirection] = useState("");
  const [availableSeats, setAvailableSeats] = useState("");
  const [scheduleStatus, setScheduleStatus] = useState("on_time");
  const [delayMinutes, setDelayMinutes] = useState("0");
  const [remark, setRemark] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(true);

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
      console.error("Failed to fetch schedules", err);
    }
  };

  const fetchRoutesData = async () => {
    try {
      const data = await getAllRoutes();
      setRoutesMenu(data);
    } catch (err) {
      console.error("Failed to fetch routes", err);
    }
  };

  const fetchTransportsData = async () => {
    try {
      const data = await getTransports();
      setTransportsList(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch transports", err);
    }
  };

  useEffect(() => {
    if (editingId || !transportId) return;

    const selectedTransport = transportsList.find(
      (item) => String(item.transport_id) === String(transportId),
    );

    const resolvedCapacity =
      selectedTransport?.capacity ?? selectedTransport?.available_seats;
    if (
      resolvedCapacity !== undefined &&
      resolvedCapacity !== null &&
      resolvedCapacity !== ""
    ) {
      setAvailableSeats(String(resolvedCapacity));
    }
  }, [transportId, transportsList, editingId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");

    if (!routeId || !transportId || !departureTime || !arrivalTime) {
      setFormError(t("requiredFields", "Required fields."));
      return;
    }

    const departure = new Date(departureTime);
    const arrival = new Date(arrivalTime);

    if (Number.isNaN(departure.getTime()) || Number.isNaN(arrival.getTime())) {
      setFormError(t("invalidDateFormat", "Invalid date format."));
      return;
    }

    if (departure >= arrival) {
      setFormError(
        t(
          "arrivalAfterDeparture",
          "Arrival time must be after departure time.",
        ),
      );
      return;
    }

    if (
      currentPrice !== "" &&
      (Number.isNaN(Number(currentPrice)) || Number(currentPrice) < 0)
    ) {
      setFormError(
        t("pricePositive", "Price must be a positive number or zero."),
      );
      return;
    }

    if (
      availableSeats !== "" &&
      (Number.isNaN(Number(availableSeats)) || Number(availableSeats) < 0)
    ) {
      setFormError(
        t("seatsPositive", "Seats must be a positive number or zero."),
      );
      return;
    }

    if (
      scheduleStatus === "delayed" &&
      (Number.isNaN(Number(delayMinutes)) || Number(delayMinutes) < 0)
    ) {
      setFormError(
        t(
          "delayPositive",
          "Delay (minutes) must be a positive number or zero.",
        ),
      );
      return;
    }

    try {
      const payload = {
        route_id: routeId,
        transport_id: transportId,
        departure_time: toIsoStringOrNull(departureTime),
        arrival_time: toIsoStringOrNull(arrivalTime),
        current_price: currentPrice === "" ? undefined : Number(currentPrice),
        direction: direction.trim() || undefined,
        available_seats:
          availableSeats === "" ? undefined : Number(availableSeats),
        schedule_status: scheduleStatus,
        delay_minutes:
          scheduleStatus === "delayed" ? Number(delayMinutes || 0) : 0,
        remark: remark.trim(),
      };

      if (editingId) {
        await updateSchedule(editingId, payload);
        setFormSuccess(
          t("scheduleUpdatedSuccess", "Schedule updated successfully."),
        );
      } else {
        await createSchedule(payload);
        setFormSuccess(
          t("scheduleAddedSuccess", "Schedule added successfully."),
        );
      }
      resetForm();
      fetchSchedules();
    } catch (err) {
      setFormSuccess("");
      setFormError(
        err?.response?.data?.error ||
          t(
            "operationFailedCheckData",
            "Operation failed. Please verify entered data.",
          ),
      );
      console.error("Operation failed", err);
    }
  };

  const handleEdit = (schedule) => {
    setFormError("");
    setFormSuccess("");

    if (!schedule?.schedule_id) {
      setFormError(
        t("missingScheduleIdEdit", "Cannot edit: missing schedule identifier."),
      );
      return;
    }

    setEditingId(schedule.schedule_id);
  setIsFormOpen(true);
    setRouteId(schedule.route_id ? String(schedule.route_id) : "");
    setTransportId(schedule.transport_id ? String(schedule.transport_id) : "");
    setDepartureTime(toDateTimeLocalValue(schedule.departure_time));
    setArrivalTime(toDateTimeLocalValue(schedule.arrival_time));
    setCurrentPrice(schedule.current_price ?? "");
    setDirection(schedule.direction ?? "");
    setAvailableSeats(schedule.available_seats ?? "");
    setScheduleStatus(schedule.schedule_status || "on_time");
    setDelayMinutes(String(schedule.delay_minutes ?? 0));
    setRemark(schedule.remark || "");

    if (!schedule.route_id || !schedule.transport_id) {
      setFormError(
        t(
          "incompleteEditData",
          "Incomplete data for editing. Reload the page and try again.",
        ),
      );
    }
  };

  const handleDelete = async (id) => {
    setFormError("");
    setFormSuccess("");

    if (!id) {
      setFormError(
        t(
          "missingScheduleIdDelete",
          "Cannot delete: missing schedule identifier.",
        ),
      );
      return;
    }

    const confirmed = window.confirm(
      t("confirmDeleteSchedule", "Confirm deleting this schedule?"),
    );
    if (!confirmed) return;

    try {
      const response = await deleteSchedule(id);
      setFormSuccess(
        response?.message ||
          t("scheduleDeletedSuccess", "Schedule deleted successfully."),
      );
      if (editingId === id) {
        resetForm();
      }
      await fetchSchedules();
    } catch (err) {
      setFormError(
        err?.response?.data?.error || t("deleteFailed", "Delete failed."),
      );
      console.error("Failed to delete", err);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setRouteId("");
    setTransportId("");
    setDepartureTime("");
    setArrivalTime("");
    setCurrentPrice("");
    setDirection("");
    setAvailableSeats("");
    setScheduleStatus("on_time");
    setDelayMinutes("0");
    setRemark("");
  };

  const getScheduleDisplayData = (sch) => {
    const routeData = routesMenu.find(
      (r) => String(r.route_id) === String(sch.route_id),
    );
    const transportData = transportsList.find(
      (t) => String(t.transport_id) === String(sch.transport_id),
    );

    return {
      route: routeData?.name || sch.routes?.name || sch.route_id,
      transport:
        transportData?.type || sch.transports?.type || sch.transport_id,
      direction:
        sch.direction || routeData?.direction || sch.routes?.direction || "-",
      availableSeats:
        sch.available_seats ??
        transportData?.available_seats ??
        sch.transports?.available_seats ??
        "-",
    };
  };

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
        className="pointer-events-none absolute top-20 right-2 h-72 w-72 rounded-full blur-3xl opacity-20"
        style={{ backgroundColor: palette.skyBlue }}
      />

      <Navbar />

      <div className="relative z-10 pt-20 sm:pt-24 px-3 sm:px-4 md:px-8 pb-6 sm:pb-8 max-w-7xl mx-auto space-y-4 sm:space-y-6">
        <section
          className="rounded-3xl border px-4 sm:px-6 py-4 sm:py-5 md:px-8 md:py-6 shadow-lg"
          style={{
            backgroundColor: "rgba(255,255,255,0.82)",
            borderColor: palette.frostBlue,
          }}
        >
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <p
                className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.15em] sm:tracking-[0.18em]"
                style={{ color: palette.classicBlue }}
              >
                {t("transitAdmin", "Transit Admin")}
              </p>
              <h1
                className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight"
                style={{ color: palette.deepOcean }}
              >
                {t("schedulesManagement", "Schedules Management")}
              </h1>
              <p
                className="text-xs sm:text-sm mt-1"
                style={{ color: palette.textGray }}
              >
                {t(
                  "schedulesSubtitle",
                  "Plan departures and arrivals on existing routes.",
                )}
              </p>
            </div>
            <div
              className="rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 min-w-[110px] sm:min-w-[130px]"
              style={{ backgroundColor: palette.deepOcean }}
            >
              <p className="text-[11px] sm:text-xs uppercase tracking-wider font-semibold text-white/80">
                {t("total", "Total")}
              </p>
              <p className="text-xl sm:text-2xl font-extrabold text-white leading-none">
                {schedules.length}
              </p>
            </div>
          </div>
        </section>

        <form
          onSubmit={handleSubmit}
          className="p-4 sm:p-6 md:p-7 rounded-3xl border shadow-lg"
          style={{
            backgroundColor: "rgba(255,255,255,0.92)",
            borderColor: palette.frostBlue,
          }}
        >
          {formError && (
            <div
              className="mb-4 rounded-xl border px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold"
              style={{
                backgroundColor: palette.dangerSoft,
                borderColor: palette.dangerText,
                color: palette.dangerText,
              }}
            >
              {formError}
            </div>
          )}

          {formSuccess && (
            <div
              className="mb-4 rounded-xl border px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold"
              style={{
                backgroundColor: "#e8f7ee",
                borderColor: "#5ab77f",
                color: "#1f7a44",
              }}
            >
              {formSuccess}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-4">
            <div className="flex flex-col gap-2">
              <label
                className="text-xs sm:text-sm font-semibold"
                style={{ color: palette.deepOcean }}
              >
                {t("routeLabel", "Route")}
              </label>
              <select
                value={routeId}
                onChange={(e) => setRouteId(e.target.value)}
                className="p-2.5 sm:p-3 text-sm sm:text-base border rounded-xl focus:outline-none"
                style={{
                  borderColor: palette.frostBlue,
                  color: palette.deepOcean,
                }}
                required
              >
                <option value="">{t("selectPlaceholder", "Select...")}</option>
                {routesMenu.map((r) => (
                  <option key={r.route_id} value={r.route_id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label
                className="text-xs sm:text-sm font-semibold"
                style={{ color: palette.deepOcean }}
              >
                {t("transportLabel", "Transport")}
              </label>
              <select
                value={transportId}
                onChange={(e) => setTransportId(e.target.value)}
                className="p-2.5 sm:p-3 text-sm sm:text-base border rounded-xl focus:outline-none"
                style={{
                  borderColor: palette.frostBlue,
                  color: palette.deepOcean,
                }}
                required
              >
                <option value="">{t("selectPlaceholder", "Select...")}</option>
                {transportsList.map((t) => (
                  <option key={t.transport_id} value={t.transport_id}>
                    {t.type} -{" "}
                    {t.license_plate || t.plate_number || t.transport_id}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label
                className="text-xs sm:text-sm font-semibold"
                style={{ color: palette.deepOcean }}
              >
                {t("departureTime", "Departure time")}
              </label>
              <input
                type="datetime-local"
                value={departureTime}
                onChange={(e) => setDepartureTime(e.target.value)}
                className="p-2.5 sm:p-3 text-sm sm:text-base border rounded-xl focus:outline-none"
                style={{
                  borderColor: palette.frostBlue,
                  color: palette.deepOcean,
                }}
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                className="text-xs sm:text-sm font-semibold"
                style={{ color: palette.deepOcean }}
              >
                {t("arrivalTime", "Arrival time")}
              </label>
              <input
                type="datetime-local"
                value={arrivalTime}
                onChange={(e) => setArrivalTime(e.target.value)}
                className="p-2.5 sm:p-3 text-sm sm:text-base border rounded-xl focus:outline-none"
                style={{
                  borderColor: palette.frostBlue,
                  color: palette.deepOcean,
                }}
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                className="text-xs sm:text-sm font-semibold"
                style={{ color: palette.deepOcean }}
              >
                {t("priceCurrent", "Price (current_price)")}
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={currentPrice}
                onChange={(e) => setCurrentPrice(e.target.value)}
                className="p-2.5 sm:p-3 text-sm sm:text-base border rounded-xl focus:outline-none"
                style={{
                  borderColor: palette.frostBlue,
                  color: palette.deepOcean,
                }}
                placeholder="Ex: 2.50"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                className="text-xs sm:text-sm font-semibold"
                style={{ color: palette.deepOcean }}
              >
                {t("directionLabel", "Direction")}
              </label>
              <input
                type="text"
                value={direction}
                onChange={(e) => setDirection(e.target.value)}
                className="p-2.5 sm:p-3 text-sm sm:text-base border rounded-xl focus:outline-none"
                style={{
                  borderColor: palette.frostBlue,
                  color: palette.deepOcean,
                }}
                placeholder={t("directionPlaceholder", "Ex: Outbound / Return")}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                className="text-xs sm:text-sm font-semibold"
                style={{ color: palette.deepOcean }}
              >
                {t("availableSeatsLabel", "Available seats")}
              </label>
              <input
                type="number"
                min="0"
                step="1"
                value={availableSeats}
                onChange={(e) => setAvailableSeats(e.target.value)}
                className="p-2.5 sm:p-3 text-sm sm:text-base border rounded-xl focus:outline-none"
                style={{
                  borderColor: palette.frostBlue,
                  color: palette.deepOcean,
                }}
                placeholder={t("seatsPlaceholder", "Ex: 40")}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                className="text-xs sm:text-sm font-semibold"
                style={{ color: palette.deepOcean }}
              >
                {t("status", "Status")}
              </label>
              <select
                value={scheduleStatus}
                onChange={(e) => setScheduleStatus(e.target.value)}
                className="p-2.5 sm:p-3 text-sm sm:text-base border rounded-xl focus:outline-none"
                style={{
                  borderColor: palette.frostBlue,
                  color: palette.deepOcean,
                }}
              >
                <option value="on_time">{t("onTime", "On time")}</option>
                <option value="delayed">{t("delayed", "Delayed")}</option>
                <option value="cancelled">{t("cancelled", "Cancelled")}</option>
              </select>
            </div>

            {scheduleStatus === "delayed" && (
              <div className="flex flex-col gap-2">
                <label
                  className="text-xs sm:text-sm font-semibold"
                  style={{ color: palette.deepOcean }}
                >
                  {t("delayedMinutes", "Delay (minutes)")}
                </label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={delayMinutes}
                  onChange={(e) => setDelayMinutes(e.target.value)}
                  className="p-2.5 sm:p-3 text-sm sm:text-base border rounded-xl focus:outline-none"
                  style={{
                    borderColor: palette.frostBlue,
                    color: palette.deepOcean,
                  }}
                />
              </div>
            )}

            <div className="md:col-span-2 flex flex-col gap-2">
              <label
                className="text-xs sm:text-sm font-semibold"
                style={{ color: palette.deepOcean }}
              >
                {t("remarkClient", "Remark (client visible)")}
              </label>
              <textarea
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                rows={3}
                className="p-2.5 sm:p-3 text-sm sm:text-base border rounded-xl focus:outline-none"
                style={{
                  borderColor: palette.frostBlue,
                  color: palette.deepOcean,
                }}
                placeholder={t(
                  "remarkPlaceholder",
                  "Ex: Delay due to heavy traffic",
                )}
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <button
              type="submit"
              className="font-bold text-sm sm:text-base px-4 py-2.5 sm:py-3 rounded-xl transition-transform hover:scale-[1.01] w-full sm:w-auto"
              style={{
                backgroundColor: palette.classicBlue,
                color: palette.pureWhite,
              }}
            >
              {editingId
                ? t("updateItem", "Update")
                : t("addSchedule", "Add Schedule")}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="font-semibold text-sm sm:text-base px-4 py-2.5 sm:py-3 rounded-xl border w-full sm:w-auto"
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
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full text-left">
              <thead style={{ backgroundColor: palette.deepOcean }}>
                <tr>
                  <th className="p-4 font-semibold text-white">
                    {t("scheduleId", "Schedule ID")}
                  </th>
                  <th className="p-4 font-semibold text-white">
                    {t("directionLabel", "Direction")}
                  </th>
                  <th className="p-4 font-semibold text-white">
                    {t("priceCurrent", "Price (current_price)")}
                  </th>
                  <th className="p-4 font-semibold text-white">
                    {t("availableSeatsLabel", "Available seats")}
                  </th>
                  <th className="p-4 font-semibold text-white">
                    {t("arrivalTimeLabel", "Arrival time")}
                  </th>
                  <th className="p-4 font-semibold text-white">
                    {t("departureTimeLabel", "Departure time")}
                  </th>
                  <th className="p-4 font-semibold text-white">
                    {t("transportLabel", "Transport")}
                  </th>
                  <th className="p-4 font-semibold text-white">
                    {t("routeLabel", "Route")}
                  </th>
                  <th className="p-4 font-semibold text-white text-right">
                    {t("actions", "Actions")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {schedules.map((sch) => {
                  const display = getScheduleDisplayData(sch);

                  return (
                    <tr
                      key={sch.schedule_id}
                      className="border-b last:border-0"
                      style={{ borderColor: palette.frostBlue }}
                    >
                      <td
                        className="p-4 font-semibold"
                        style={{ color: palette.classicBlue }}
                      >
                        {sch.schedule_id}
                      </td>
                      <td className="p-4" style={{ color: palette.deepOcean }}>
                        {display.direction}
                      </td>
                      <td className="p-4" style={{ color: palette.textGray }}>
                        {Number(sch.current_price ?? 0).toFixed(2)}
                      </td>
                      <td className="p-4" style={{ color: palette.textGray }}>
                        {display.availableSeats}
                      </td>
                      <td className="p-4" style={{ color: palette.textGray }}>
                        {new Date(sch.arrival_time).toLocaleString(
                          language === "en" ? "en-GB" : "fr-FR",
                        )}
                      </td>
                      <td className="p-4" style={{ color: palette.textGray }}>
                        {new Date(sch.departure_time).toLocaleString(
                          language === "en" ? "en-GB" : "fr-FR",
                        )}
                      </td>
                      <td className="p-4" style={{ color: palette.textGray }}>
                        {display.transport}
                      </td>
                      <td className="p-4" style={{ color: palette.textGray }}>
                        {display.route}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex gap-2 justify-end">
                          <button
                            type="button"
                            onClick={() => handleEdit(sch)}
                            className="px-3 py-1.5 rounded-lg text-sm font-bold"
                            style={{
                              backgroundColor: palette.iceWhite,
                              color: palette.classicBlue,
                            }}
                          >
                            {t("edit", "Edit")}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(sch.schedule_id)}
                            className="px-3 py-1.5 rounded-lg text-sm font-bold"
                            style={{
                              backgroundColor: palette.dangerSoft,
                              color: palette.dangerText,
                            }}
                          >
                            {t("delete", "Delete")}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {schedules.length === 0 && (
                  <tr>
                    <td
                      colSpan="9"
                      className="p-8 text-center font-medium"
                      style={{ color: palette.textGray }}
                    >
                      {t("emptySchedules", "No schedules found.")}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="md:hidden p-3 sm:p-4 space-y-3">
            {schedules.map((sch) => {
              const display = getScheduleDisplayData(sch);

              return (
                <div
                  key={sch.schedule_id}
                  className="rounded-2xl border p-4"
                  style={{
                    borderColor: palette.frostBlue,
                    backgroundColor: "rgba(255,255,255,0.95)",
                  }}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm">
                    <p style={{ color: palette.classicBlue }}>
                      <span className="font-semibold">
                        {t("scheduleId", "Schedule ID")}:
                      </span>{" "}
                      {sch.schedule_id}
                    </p>
                    <p style={{ color: palette.deepOcean }}>
                      <span className="font-semibold">
                        {t("directionLabel", "Direction")}:
                      </span>{" "}
                      {display.direction}
                    </p>
                    <p style={{ color: palette.textGray }}>
                      <span className="font-semibold">
                        {t("priceCurrent", "Price (current_price)")}:
                      </span>{" "}
                      {Number(sch.current_price ?? 0).toFixed(2)}
                    </p>
                    <p style={{ color: palette.textGray }}>
                      <span className="font-semibold">
                        {t("availableSeatsLabel", "Available seats")}:
                      </span>{" "}
                      {display.availableSeats}
                    </p>
                    <p style={{ color: palette.textGray }}>
                      <span className="font-semibold">
                        {t("arrivalTimeLabel", "Arrival time")}:
                      </span>{" "}
                      {new Date(sch.arrival_time).toLocaleString(
                        language === "en" ? "en-GB" : "fr-FR",
                      )}
                    </p>
                    <p style={{ color: palette.textGray }}>
                      <span className="font-semibold">
                        {t("departureTimeLabel", "Departure time")}:
                      </span>{" "}
                      {new Date(sch.departure_time).toLocaleString(
                        language === "en" ? "en-GB" : "fr-FR",
                      )}
                    </p>
                    <p style={{ color: palette.textGray }}>
                      <span className="font-semibold">
                        {t("transportLabel", "Transport")}:
                      </span>{" "}
                      {display.transport}
                    </p>
                    <p style={{ color: palette.textGray }}>
                      <span className="font-semibold">
                        {t("routeLabel", "Route")}:
                      </span>{" "}
                      {display.route}
                    </p>
                  </div>

                  <div className="mt-3 flex flex-col sm:flex-row gap-2">
                    <button
                      type="button"
                      onClick={() => handleEdit(sch)}
                      className="px-3 py-2 rounded-lg text-xs sm:text-sm font-bold w-full sm:w-auto"
                      style={{
                        backgroundColor: palette.iceWhite,
                        color: palette.classicBlue,
                      }}
                    >
                      {t("edit", "Edit")}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(sch.schedule_id)}
                      className="px-3 py-2 rounded-lg text-xs sm:text-sm font-bold w-full sm:w-auto"
                      style={{
                        backgroundColor: palette.dangerSoft,
                        color: palette.dangerText,
                      }}
                    >
                      {t("delete", "Delete")}
                    </button>
                  </div>
                </div>
              );
            })}

            {schedules.length === 0 && (
              <div
                className="p-8 text-center font-medium"
                style={{ color: palette.textGray }}
              >
                {t("emptySchedules", "No schedules found.")}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Schedules;
