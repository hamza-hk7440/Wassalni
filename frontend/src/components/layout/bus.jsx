import React, { useState, useEffect } from 'react';
import BodyTransport from '../common/bodyTranspot';
import { getTransports } from '../../api/admin';

function Bus() {
  const [busData, setBusData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBuses = async () => {
      try {
        const response = await getTransports();
        // Unwrap standard { success: true, data: [...] } structure or plain array
        const allTransports = response.data || response;
        const mapped = allTransports
          .filter(t => t.type === 'Bus')
          .map(t => ({
            id: t.license_plate || t.transport_id,
            line: 'Non assigné', // Not tracked at vehicle level in DB currently
            driver: 'Enregistré', // Not tracked at vehicle level in DB currently
            occupancy: t.capacity || 0,
            status: t.status || 'En ligne'
          }));
        setBusData(mapped);
      } catch (error) {
        console.error("Failed to load buses from backend", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBuses();
  }, []);

  return (
    <div>
      {loading ? (
        <div className="p-10 text-center">Chargement des bus en direct...</div>
      ) : (
        <BodyTransport
          nom="Gestion des bus"
          listDonner={busData}
          labels={{
            entitySingular: 'bus',
            entityPlural: 'bus',
            id: 'Bus',
            line: 'Ligne',
            operator: 'Chauffeur',
            occupancy: 'Capacité',
            status: 'Statut',
          }}
        />
      )}
    </div>
  );
}

export default Bus;