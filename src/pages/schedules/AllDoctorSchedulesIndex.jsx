// Hospital schedule directory: resolves the standalone sidebar entry using the existing paginated doctor API and doctor-scoped schedule routes.
import { useEffect, useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import apiClient from '../../services/apiClient.js';
import PageHeader from '../../components/PageHeader.jsx';
import { EmptyPanel, ErrorPanel, LoadingPanel } from '../../components/StatePanel.jsx';
import { StatusBadge } from '../patients/PatientsIndex.jsx';
import Pagination from '../../components/Pagination.jsx';

export default function AllDoctorSchedulesIndex() {
  const { user } = useOutletContext();
  const [records, setRecords] = useState([]); const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0 }); const [search, setSearch] = useState(''); const [draft, setDraft] = useState(''); const [loading, setLoading] = useState(true); const [error, setError] = useState('');
  const load = async (page = pagination.current_page || 1, term = search) => { setLoading(true); setError(''); try { const params = new URLSearchParams({ page: String(page), per_page: '10' }); if (term.trim()) params.set('search', term.trim()); const response = await apiClient.get(`/doctors?${params}`); setRecords(response.data.data?.items || []); setPagination(response.data.data?.pagination || {}); } catch (requestError) { setError(requestError?.message || 'Unable to load doctor schedules.'); } finally { setLoading(false); } };
  useEffect(() => { load(1, ''); }, []);
  useEffect(() => { const timer = setTimeout(() => { if (draft !== search) { setSearch(draft); load(1, draft); } }, 320); return () => clearTimeout(timer); }, [draft]);
  if (loading) return <section className="routed-page"><LoadingPanel label="Loading doctor schedule directory…" /></section>;
  if (error) return <section className="routed-page"><ErrorPanel message={error} retry={() => load()} /></section>;
  return <section className="routed-page schedule-index-page"><PageHeader eyebrow="CLINICAL · DOCTOR AVAILABILITY" title="Doctor schedules" description="Open a doctor’s real weekly availability windows from the authorized clinical directory." crumbs={[{ label: 'Doctor schedules' }]} /><section className="index-controls"><div className="search-control"><span aria-hidden="true">⌕</span><input className="form-control" value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Search doctor, registration, or specialty" /><button type="button" onClick={() => setDraft('')} aria-label="Clear doctor search">×</button></div></section>{records.length ? <section className="registry-panel routed-registry"><div className="registry-head"><span>DOCTOR AVAILABILITY DIRECTORY</span><strong>{pagination.total} doctors</strong></div><div className="table-responsive"><table className="table ledger-table"><thead><tr><th>Doctor</th><th>Registration</th><th>Department</th><th>Specialty</th><th>Status</th><th aria-label="Actions" /></tr></thead><tbody>{records.map((doctor) => <tr key={doctor.id}><td><Link className="record-link" to={`/doctors/${doctor.id}`}>{doctor.name}</Link></td><td><code>{doctor.registration_number}</code></td><td>{doctor.department?.name || 'Not assigned'}</td><td>{doctor.specialization || 'Not recorded'}</td><td><StatusBadge value={doctor.status} /></td><td className="table-actions"><Link to={`/doctors/${doctor.id}/schedules`}>View schedules</Link></td></tr>)}</tbody></table></div><Pagination pagination={pagination} onPage={(page) => load(page)} /></section> : <EmptyPanel title="No doctors found" body="Adjust the search or register a doctor before opening an availability schedule." />}</section>;
}
