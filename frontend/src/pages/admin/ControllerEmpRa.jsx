import EmployeeManagementPage from '../../components/common/EmployeeManagementPageRa';

const initialEmployees = [
  { id: 'CTR-001', nom: 'Karim Jebali', email: 'karim@transportpro.com', role: 'controller' },
  { id: 'CTR-002', nom: 'Sami Jebali', email: 'sami@transportpro.com', role: 'controller' },
];

function ControllerEmp() {
  return (
    <EmployeeManagementPage
      pageTitle="Gestion des contrôleurs"
      pageSubtitle="Créer et visualiser les comptes contrôleurs."
      role="controller"
      initialEmployees={initialEmployees}
    />
  );
}

export default ControllerEmp;
