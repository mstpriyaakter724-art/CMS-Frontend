// Clinical Ledger: patient index is a dedicated, server-paginated record ledger—not a modal CRUD surface.
import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useOutletContext } from 'react-router-dom';
import apiClient from '../../services/apiClient.js';
import ConfirmDialog from '../../components/ConfirmDialog.jsx';
import PageHeader from '../../components/PageHeader.jsx';
import { EmptyPanel, ErrorPanel, LoadingPanel } from '../../components/StatePanel.jsx';
import { usePermissions } from '../../hooks/usePermissions.js';
import Pagination from '../../components/Pagination.jsx';

export default function PatientsIndex() {
  const { user } = useOutletContext();
  const { can } = usePermissions(user);
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0, per_page: 10 });
  const [filters, setFilters] = useState({ search: '', status: '', gender: '', blood_group: '', page: 1 });
  const [searchDraft, setSearchDraft] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [deleting, setDeleting] = useState(null);

  const load = async (next = filters) => {
    setLoading(true); setError('');
    try {
      const params = new URLSearchParams({ page: String(next.page), per_page: '10' });
      ['search', 'status', 'gender', 'blood_group'].forEach((key) => { if (next[key]) params.set(key, next[key]); });
      const response = await apiClient.get(`/patients?${params}`);
      setRecords(response.data.data.items || []); setPagination(response.data.data.pagination || {});
    } catch (requestError) { setError(requestError?.message || 'Unable to load patient records.'); } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);
  useEffect(() => { const timer = setTimeout(() => { if (searchDraft !== filters.search) { const next = { ...filters, search: searchDraft, page: 1 }; setFilters(next); load(next); } }, 350); return () => clearTimeout(timer); }, [searchDraft]);
  const setFilter = (field, value) => { const next = { ...filters, [field]: value, page: 1 }; setFilters(next); load(next); };
  const clear = () => { const next = { search: '', status: '', gender: '', blood_group: '', page: 1 }; setSearchDraft(''); setFilters(next); load(next); };
  const remove = async () => { if (!deleting) return; try { const response = await apiClient.delete(`/patients/${deleting.id}`); setNotice(response.data.message); setDeleting(null); load(); } catch (requestError) { setError(requestError?.message || 'Unable to delete this patient record.'); setDeleting(null); } };

  return <section className="routed-page clinical-index-page">
    <PageHeader eyebrow="PATIENT MANAGEMENT" title="Patient registry" description="Search and maintain authorized patient records with clear care-relevant detail." crumbs={[{ label: 'Patients' }]} action={can('patients.create') && <Link className="btn-ledger-primary" to="/patients/new">Add patient</Link>} />
    {notice && <div className="form-notice">{notice}</div>}
    <section className="index-controls"><div className="search-control"><span aria-hidden="true">⌕</span><input className="form-control" value={searchDraft} onChange={(event) => setSearchDraft(event.target.value)} placeholder="Search patient ID, name, or phone" /><button type="button" onClick={() => setSearchDraft('')} aria-label="Clear search">×</button></div><select className="form-select" value={filters.status} onChange={(event) => setFilter('status', event.target.value)}><option value="">All statuses</option><option value="active">Active</option><option value="inactive">Inactive</option></select><select className="form-select" value={filters.gender} onChange={(event) => setFilter('gender', event.target.value)}><option value="">All genders</option><option value="female">Female</option><option value="male">Male</option><option value="other">Other</option></select><select className="form-select" value={filters.blood_group} onChange={(event) => setFilter('blood_group', event.target.value)}><option value="">All blood groups</option>{['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((group) => <option value={group} key={group}>{group}</option>)}</select><button type="button" className="filter-reset" onClick={clear}>Reset</button></section>
    {error ? <ErrorPanel message={error} retry={() => load()} /> : loading ? <LoadingPanel label="Loading patient registry…" /> : records.length === 0 ? <EmptyPanel title="No patients found" body="Try revising the search filters, or register the first patient in this clinic." action={can('patients.create') && <Link className="btn-ledger-primary" to="/patients/new">Add patient</Link>} /> : <section className="registry-panel routed-registry"><div className="registry-head"><span>PATIENT RECORDS</span><strong>{pagination.total} total</strong></div><div className="table-responsive"><table className="table ledger-table patient-table"><thead><tr><th>Patient ID</th><th>Patient</th><th>Gender / Age</th><th>Phone</th><th>Blood group</th><th>Status</th><th aria-label="Actions" /></tr></thead><tbody>{records.map((patient) => <tr key={patient.id}><td><code>{patient.patient_number}</code></td><td><Link className="record-link" to={`/patients/${patient.id}`}>{patient.name}</Link><small>{patient.email || 'No email recorded'}</small></td><td>{patient.gender}<small>{age(patient.date_of_birth)}</small></td><td>{patient.phone || '—'}</td><td>{patient.blood_group || '—'}</td><td><StatusBadge value={patient.status} /></td><td className="table-actions"><Link to={`/patients/${patient.id}`}>View</Link>{can('patients.update') && <Link to={`/patients/${patient.id}/edit`}>Edit</Link>}{can('patients.delete') && <button type="button" onClick={() => setDeleting(patient)}>Delete</button>}</td></tr>)}</tbody></table></div><Pagination pagination={pagination} onPage={(page) => { const next = { ...filters, page }; setFilters(next); load(next); }} /></section>}
    {deleting && <ConfirmDialog title="Delete patient record" description={`Delete ${deleting.name}? The patient record will be soft-deleted and removed from active registry views.`} onCancel={() => setDeleting(null)} onConfirm={remove} />}
  </section>;
}

export function StatusBadge({ value }) { return <span className={`status-badge status-${value}`}>{value || 'Unknown'}</span>; }
function age(dateOfBirth) { if (!dateOfBirth) return 'Age not recorded'; const years = Math.floor((Date.now() - new Date(dateOfBirth).getTime()) / 31557600000); return `${years} years`; }
