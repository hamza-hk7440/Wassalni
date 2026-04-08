import React from 'react';
import BodyTransport from '../common/bodyTranspot';

function Metro() {
  const metroData = [
    { id: 'M-201', line: 'Ligne A', driver: 'M. Salah', occupancy: 58, status: 'En ligne' },
    { id: 'M-114', line: 'Ligne C', driver: 'Mme Saidi', occupancy: 33, status: 'Maintenance' },
  ];

  return (
    <main>
      <div>
        <BodyTransport
          nom="Gestion du métro"
          listDonner={metroData}
          labels={{
            entitySingular: 'métro',
            entityPlural: 'métros',
            id: 'Métro',
            line: 'Ligne',
            operator: 'Conducteur',
            occupancy: 'Charge',
            status: 'Statut',
          }}
        />
      </div>
    </main>
  );
}

export default Metro;