import React, { useState, useEffect, useCallback } from 'react';
import BodyTransport from '../common/bodyTranspot';
import { getTransports, createTransport, updateTransport, deleteTransport } from '../../api/admin';
import { useAdminLanguage } from '../common/language.jsx';

function Metro() {
	const { t } = useAdminLanguage();
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
          nom={t('transport', 'Transport') + ' - Metro'}
          listDonner={metroData}
          onCreate={handleCreate}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          fieldKeys={{ id: 'license_plate', occupancy: 'capacity', status: 'status' }}
          emptyForm={{ license_plate: '', capacity: '', status: t('online', 'Online') }}
          labels={{ entitySingular: 'metro', entityPlural: 'metros', id: 'Metro / Rame', occupancy: 'Capacité', status: t('status', 'Status') }}
        />
      </div>
    </main>
  );
}

export default Metro;
