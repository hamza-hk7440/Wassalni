import EmployeeManagementPage from '../../components/common/EmployeeManagementPage';

function CreateEmp() {
  return (
    <EmployeeManagementPage
      pageTitle="Gestion des admins"
      pageSubtitle="Creer et visualiser les comptes administrateurs."
      role="admin"
    />
  );
}

export default CreateEmp;
