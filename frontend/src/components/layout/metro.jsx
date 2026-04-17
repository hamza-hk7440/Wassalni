import React, { useState, useEffect, useCallback } from 'react';
import BodyTransport from '../common/bodyTranspot';
import { getTransports, createTransport, updateTransport, deleteTransport } from '../../api/admin';

function Metro() {
  const [metroData, setMetroData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMetros = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getTransports();
      const allTransports = response.data || response;
      const mapped = allTransports.filter(t => t.type === 'Metro');
      setMetroData(mapped);
    } catch (error) {
      console.error("Failed to load metros from backend", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMetros();
  }, [fetchMetros]);

  const handleCreate = async (newItem) => {
    try {
      await createTransport({
        type: 'Metro',
        license_plate: newItem.license_plate || newItem.id,
        capacity: Number(newItem.capacity) || 0,
        status: newItem.status
      });
      await fetchMetros();
    } catch (err) {
      throw new Error(err.response?.data?.error || "Erreur de cr�ation");
    }
  };

  const handleUpdate = async (updatedItem, oldItem) => {
    try {
      if (oldItem && oldItem.transport_id) {
        await updateTransport(oldItem.transport_id, {
          license_plate: updatedItem.license_plate || updatedItem.id,
          capacity: Number(updatedItem.capacity) || 0,
          status: updatedItem.status
        });
        await fetchMetros();
      }
    } catch (err) {
      throw new Error(err.response?.data?.error || "Erreur de modification");
    }
  };

  const handleDelete = async (itemToDelete) => {
    try {
      if (itemToDelete && itemToDelete.transport_id) {
        await deleteTransport(itemToDelete.transport_id);
        await fetchMetros();
      }
    } catch (err) {
      throw new Error(err.response?.data?.error || "Erreur de suppression");
    }
  };

  return (
    <main>
      <div>
        <BodyTransport
          nom="Gestion du métro"
          listDonner={metroData}
          onCreate={handleCreate}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          fieldKeys={{ id: 'license_plate', occupancy: 'capacity', status: 'status' }}
          emptyForm={{ license_plate: '', capacity: '', status: 'En ligne' }}
          labels={{ entitySingular: 'métro', entityPlural: 'métros', id: 'Métro / Rame', occupancy: 'Capacité', status: 'Statut' }}
        />
      </div>
    </main>
  );
}

export default Metro;
