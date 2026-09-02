// Clinical Ledger: dashboard metric links use URLs rather than local view state.
import { useNavigate, useOutletContext } from 'react-router-dom';
import DashboardPage from './DashboardPage.jsx';

const paths = { clinics: '/clinics', departments: '/departments', rooms: '/rooms', users: '/users', patients: '/patients', doctors: '/doctors', appointments: '/appointments', opdVisits: '/opd-visits', reports: '/reports', 'reports/revenue': '/reports/revenue', 'reports/beds': '/reports/beds', 'reports/emergency': '/reports/emergency' };

export default function DashboardRoute() {
  const { user } = useOutletContext();
  const navigate = useNavigate();
  return <DashboardPage user={user} onNavigate={(target) => navigate(paths[target] || (target?.startsWith('/') ? target : `/${target}`))} />;
}
