import EmployeeManagementPage from '../../components/common/EmployeeManagementPage';
import { useAdminLanguage } from '../../components/common/language.jsx';

function CreateEmp() {
	const { t } = useAdminLanguage();
  return (
    <EmployeeManagementPage
      pageTitle={t('adminManagement', 'Admin Management')}
      pageSubtitle={t('fillFieldsToAddUser', 'Fill out the fields to add this user to the system.')}
      role="admin"
    />
  );
}

export default CreateEmp;
