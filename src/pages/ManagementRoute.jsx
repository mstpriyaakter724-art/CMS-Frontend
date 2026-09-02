// Clinical Ledger: preserves the existing Phase 1 administration tables under explicit routes while clinical routing is upgraded.
import { useOutletContext } from 'react-router-dom';
import ManagementPage from './ManagementPage.jsx';

export default function ManagementRoute({ page }) {
  const { user } = useOutletContext();
  return <ManagementPage page={page} user={user} />;
}
