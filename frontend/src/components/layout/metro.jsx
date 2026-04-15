import React, { useState, useEffect } from 'react';
import BodyTransport from '../common/bodyTranspot';
import { getTransports } from '../../api/admin';

function Metro() {
  const [metroData, setMetroData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetros = async () => {
      try {
        const response = await getTransports();
        // Unwrap standard { success: true, data: [...] } structure or plain array
        const allTransports = response.data || response;
        const mapped = allTransports
          .filter(t => t.type === 'Metro')
          .map(t => ({
            id: t.license_plate || t.transport_id,
            line: 'Non assigné', // Not tracked at vehicle level in DB currently
            driver: 'Enregistré', // Not tracked at vehicle level in DB currently
            occupancy: t.capacity || 0,
            status: t.status || 'En ligne'
          }));
        setMetroData(mapped);
      } catch (error) {
        console.error("Failed to load metros from backend", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMetros();
  }, []);

  return (
    <main>
      <div>
        {loading ? (
          <div className="p-10 text-center">Chargement des métros en direct...</div>
        ) : (
          <BodyTransport
            nom="Gestion du métro"
            listDonner={metroData}
            labels={{
              entitySingular: 'métro',
              entityPlural: 'métros',
              id: 'Métro',
              line: 'Ligne',
              operator: 'Conducteur',
              occupancy: 'Capacité',
              status: 'Statut',
            }}
          />
        )}
      </div>
    </main>
  );
}

export default Metro;