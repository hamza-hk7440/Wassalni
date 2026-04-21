import EmployeeManagementPage from '../../components/common/EmployeeManagementPage';
import { useAdminLanguage } from '../../components/common/language.jsx';

function ControllerEmp() {
	const { t } = useAdminLanguage();
  return (
    <EmployeeManagementPage
      pageTitle={t('controllerManagement', 'Controller Management')}
      pageSubtitle={t('fillFieldsToAddUser', 'Fill out the fields to add this user to the system.')}
      role="controller"
    />
  );
}

export default ControllerEmp;
