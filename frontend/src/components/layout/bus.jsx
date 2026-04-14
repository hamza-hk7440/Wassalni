import BodyTransport from '../common/bodyTranspot';

function Bus() {
  

  const busData = [
    { id: 'B-102', line: 'Ligne 1', driver: 'M. Ben Ali', occupancy: 72, status: 'En ligne' },
    { id: 'B-114', line: 'Ligne 3', driver: 'M. Trabelsi', occupancy: 54, status: 'En ligne' },
    { id: 'B-089', line: 'Ligne 5', driver: 'Mme Jlassi', occupancy: 31, status: 'Maintenance' },
    { id: 'B-141', line: 'Ligne 7', driver: 'M. Bouaziz', occupancy: 90, status: 'Retard' },
  ];

  return (
    <div>
      <BodyTransport
        nom="Gestion des bus"
        listDonner={busData}
        labels={{
          entitySingular: 'bus',
          entityPlural: 'bus',
          id: 'Bus',
          line: 'Ligne',
          operator: 'Chauffeur',
          occupancy: 'Charge',
          status: 'Statut',
        }}
      />
    </div>
  );
}

export default Bus;