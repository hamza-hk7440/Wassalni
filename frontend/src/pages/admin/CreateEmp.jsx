import EmployeeManagementPage from '../../components/common/EmployeeManagementPage';

const initialEmployees = [
  { id: 'ADM-001', nom: 'Rayen Raddaoui', email: 'rayen@transportpro.com', role: 'admin' },
  { id: 'ADM-002', nom: 'Nour Trabelsi', email: 'nour@transportpro.com', role: 'admin' },
];

function CreateEmp() {
  return (
    <EmployeeManagementPage
      pageTitle="Gestion des admins"
      pageSubtitle="Creer et visualiser les comptes administrateurs."
      role="admin"
      initialEmployees={initialEmployees}
    />
  );
}

export default CreateEmp;
