import React, { useState, useEffect, useCallback } from "react";
import BodyTransport from "../common/bodyTranspot";
import {
  getTransports,
  createTransport,
  updateTransport,
  deleteTransport,
} from "../../api/admin";
import { useAdminLanguage } from "../common/language.jsx";

function Bus() {
  const { t } = useAdminLanguage();
  const [busData, setBusData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBuses = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getTransports();
      const allTransports = response.data || response;
      const mapped = allTransports.filter((t) => t.type === "Bus");
      setBusData(mapped);
    } catch (error) {
      console.error("Failed to load buses from backend", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBuses();
  }, [fetchBuses]);

  const handleCreate = async (newItem) => {
    try {
      await createTransport({
        type: "Bus",
        license_plate: newItem.license_plate || newItem.id,
        capacity: Number(newItem.capacity) || 0,
        status: newItem.status,
      });
      await fetchBuses();
    } catch (err) {
      throw new Error(
        err.response?.data?.error ||
          t("unexpectedError", "An unexpected error occurred."),
      );
    }
  };

  const handleUpdate = async (updatedItem, oldItem) => {
    try {
      if (oldItem && oldItem.transport_id) {
        await updateTransport(oldItem.transport_id, {
          license_plate: updatedItem.license_plate || updatedItem.id,
          capacity: Number(updatedItem.capacity) || 0,
          status: updatedItem.status,
        });
        await fetchBuses();
      }
    } catch (err) {
      throw new Error(
        err.response?.data?.error ||
          t("unexpectedError", "An unexpected error occurred."),
      );
    }
  };

  const handleDelete = async (itemToDelete) => {
    try {
      if (itemToDelete && itemToDelete.transport_id) {
        await deleteTransport(itemToDelete.transport_id);
        await fetchBuses();
      }
    } catch (err) {
      throw new Error(
        err.response?.data?.error ||
          t("unexpectedError", "An unexpected error occurred."),
      );
    }
  };

  return (
    <div>
      <BodyTransport
        nom={t("transport", "Transport") + " - Bus"}
        listDonner={busData}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        fieldKeys={{
          id: "license_plate",
          occupancy: "capacity",
          status: "status",
        }}
        emptyForm={{
          license_plate: "",
          capacity: "",
          status: t("online", "Online"),
        }}
        labels={{
          entitySingular: "bus",
          entityPlural: "bus",
          id: t("identifier", "Identifier"),
          occupancy: t("availableSeatsLabel", "Available seats"),
          status: t("status", "Status"),
        }}
      />
    </div>
  );
}

export default Bus;
