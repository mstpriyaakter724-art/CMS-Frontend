// Clinical Ledger: structured management ledgers with direct CRUD actions, field-level feedback, and no fabricated business records.
import { useEffect, useMemo, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import apiClient from '../services/apiClient.js';
import { notify } from '../services/notify.js';
import Pagination from '../components/Pagination.jsx';

const settings = {
  clinics: {
    title: 'Clinic registry', singular: 'clinic', endpoint: '/clinics', eyebrow: 'PHASE 1 · ORGANIZATION',
    fields: ['name', 'address', 'phone', 'email', 'status'], columns: ['name', 'phone', 'email', 'status'],
    initial: { name: '', address: '', phone: '', email: '', status: 'active' },
  },
  departments: {
    title: 'Department registry', singular: 'department', endpoint: '/departments', eyebrow: 'PHASE 1 · ORGANIZATION',
    fields: ['clinic_id', 'name', 'description', 'status'], columns: ['name', 'clinic', 'status'],
    initial: { clinic_id: '', name: '', description: '', status: 'active' },
  },
  rooms: {
    title: 'Room registry', singular: 'room', endpoint: '/rooms', eyebrow: 'PHASE 1 · FACILITIES',
    fields: ['clinic_id', 'department_id', 'ward_id', 'room_number', 'name', 'room_type', 'status', 'description'], columns: ['room_number', 'name', 'clinic', 'department', 'ward', 'room_type', 'status'],
    initial: { clinic_id: '', department_id: '', ward_id: '', room_number: '', name: '', room_type: 'general', status: 'active', description: '' },
  },
  users: {
    title: 'User directory', singular: 'user', endpoint: '/users', eyebrow: 'PHASE 1 · ACCESS CONTROL',
    fields: ['clinic_id', 'role_id', 'name', 'email', 'phone', 'status', 'password', 'password_confirmation'], columns: ['name', 'email', 'clinic', 'role', 'status'],
    initial: { clinic_id: '', role_id: '', name: '', email: '', phone: '', status: 'active', password: '', password_confirmation: '' },
  },
  roles: {
    title: 'Role matrix', singular: 'role', endpoint: '/roles', eyebrow: 'PHASE 1 · ACCESS CONTROL',
    fields: ['name', 'description', 'permission_ids'], columns: ['name', 'description', 'permissions'],
    initial: { name: '', description: '', permission_ids: [] },
  },
};

const displayName = (field) => field.replaceAll('_', ' ').replace(/\b\w/g, (character) => character.toUpperCase());
const suggestedRoomNumber = (name, records) => { const stem = String(name || '').trim().toUpperCase().replace(/[^A-Z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 10) || 'ROOM'; const prefix = `RM-${stem}`; const used = new Set(records.map((item) => item.room_number)); let index = 1; while (used.has(`${prefix}-${String(index).padStart(2, '0')}`)) index += 1; return `${prefix}-${String(index).padStart(2, '0')}`; };

export default function ManagementPage({ page, user }) {
  const config = settings[page];
  const [records, setRecords] = useState([]);
  const [pagination, setPagination] = useState(null); const [pageNumber, setPageNumber] = useState(1);
  const [support, setSupport] = useState({ clinics: [], departments: [], wards: [], roles: [], permissions: [] });
  const [form, setForm] = useState(config.initial);
  const [passwordVisibility, setPasswordVisibility] = useState({ password: false, password_confirmation: false });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');

  const dependentRequests = useMemo(() => {
    const requests = [];
    if (['departments', 'rooms', 'users'].includes(page)) requests.push(['clinics', '/clinics']);
    if (page === 'rooms') requests.push(['departments', '/departments']);
    if (page === 'rooms') requests.push(['wards', '/wards']);
    if (page === 'users') requests.push(['roles', '/roles']);
    if (page === 'roles') requests.push(['permissions', '/permissions']);
    return requests;
  }, [page]);

  const load = async (requestedPage = pageNumber) => {
    setLoading(true);
    setError('');
    try {
      const responses = await Promise.all([apiClient.get(`${config.endpoint}?page=${requestedPage}&per_page=10`), ...dependentRequests.map(([, endpoint]) => apiClient.get(endpoint))]);
      const payload = responses[0].data.data || []; setRecords(payload.items || payload); setPagination(payload.pagination || null);
      setSupport(Object.fromEntries(dependentRequests.map(([key], index) => [key, responses[index + 1].data.data || []])));
    } catch (requestError) {
      setError(requestError?.message || `Unable to load the ${config.singular} registry.`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setForm(config.initial);
    setPasswordVisibility({ password: false, password_confirmation: false });
    setEditingId(null);
    setNotice('');
    setPageNumber(1); load(1);
  }, [page]);

  useEffect(() => { if (pageNumber > 1) load(pageNumber); }, [pageNumber]);

  const updateField = (field, value) => setForm((current) => ({ ...current, [field]: value, ...(page === 'rooms' && field === 'name' && !editingId && !current.room_number ? { room_number: suggestedRoomNumber(value, records) } : {}) }));

  const startEdit = (record) => {
    setEditingId(record.id);
    setPasswordVisibility({ password: false, password_confirmation: false });
    setForm({
      ...config.initial,
      ...record,
      clinic_id: record.clinic_id || '',
      department_id: record.department_id || '',
      ward_id: record.ward_id || '',
      role_id: record.role_id || '',
      permission_ids: record.permissions?.map((permission) => permission.id) || [],
      password: '',
      password_confirmation: '',
    });
    setNotice('');
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const payload = () => {
    const data = { ...form };
    ['clinic_id', 'department_id', 'ward_id', 'role_id'].forEach((field) => {
      if (field in data) data[field] = data[field] === '' ? null : Number(data[field]);
    });
    if (page === 'users' && editingId && !data.password) {
      delete data.password;
      delete data.password_confirmation;
    }
    return data;
  };

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setNotice('');
    setError('');
    try {
      const response = editingId
        ? await apiClient.put(`${config.endpoint}/${editingId}`, payload())
        : await apiClient.post(config.endpoint, payload());
      setNotice(response.data.message);
      setEditingId(null);
      setForm(config.initial);
      await load();
    } catch (requestError) {
      const fieldErrors = requestError?.errors ? Object.values(requestError.errors).flat().join(' ') : '';
      setError(fieldErrors || requestError?.message || `Unable to save the ${config.singular}.`);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (record) => {
    const confirmation = await notify.confirm({ title: `Delete ${record.name || record.room_number}?`, text: 'This action removes the record from normal use and may be restricted when dependent records exist.', confirmButtonText: 'Delete record' });
    if (!confirmation.isConfirmed) return;
    setError('');
    try {
      const response = await apiClient.delete(`${config.endpoint}/${record.id}`);
      setNotice(response.data.message);
      await load();
    } catch (requestError) {
      setError(requestError?.message || `Unable to delete this ${config.singular}.`);
      notify.error(requestError, `Unable to delete this ${config.singular}.`);
    }
  };

  const renderField = (field) => {
    if (field === 'permission_ids') {
      return (
        <fieldset className="permission-picker" key={field}>
          <legend>Permissions</legend>
          {(support.permissions || []).map((permission) => (
            <label key={permission.id} className="permission-option">
              <input
                type="checkbox"
                checked={form.permission_ids.includes(permission.id)}
                onChange={(event) => updateField('permission_ids', event.target.checked
                  ? [...form.permission_ids, permission.id]
                  : form.permission_ids.filter((id) => id !== permission.id))}
              />
              <span>{permission.name}</span>
            </label>
          ))}
        </fieldset>
      );
    }

    if (['clinic_id', 'department_id', 'ward_id', 'role_id'].includes(field)) {
      const collection = field === 'clinic_id' ? support.clinics : field === 'department_id' ? support.departments : field === 'ward_id' ? support.wards : support.roles;
      return (
        <div className="form-group-ledger" key={field}>
          <label htmlFor={field}>{displayName(field)}{['department_id', 'ward_id'].includes(field) ? ' (optional)' : ''}</label>
          <select id={field} className="form-select" value={form[field]} onChange={(event) => updateField(field, event.target.value)} required={!['department_id', 'ward_id'].includes(field)}>
            <option value="">Select {displayName(field)}</option>
            {(collection || []).filter((item) => !['department_id', 'ward_id'].includes(field) || !form.clinic_id || item.clinic_id === Number(form.clinic_id)).map((item) => (
              <option value={item.id} key={item.id}>{item.name}{item.room_number ? ` — ${item.room_number}` : ''}</option>
            ))}
          </select>
        </div>
      );
    }

    if (field === 'status') {
      return <div className="form-group-ledger" key={field}><label htmlFor={field}>Status</label><select id={field} className="form-select" value={form[field]} onChange={(event) => updateField(field, event.target.value)}><option value="active">Active</option><option value="inactive">Inactive</option>{page === 'rooms' && <option value="maintenance">Maintenance</option>}</select></div>;
    }

    if (field === 'room_type') {
      return <div className="form-group-ledger" key={field}><label htmlFor={field}>Room type</label><select id={field} className="form-select" value={form[field]} onChange={(event) => updateField(field, event.target.value)}>{['general', 'consultation', 'procedure', 'laboratory', 'pharmacy', 'administrative', 'future_ipd'].map((type) => <option value={type} key={type}>{displayName(type)}</option>)}</select></div>;
    }

    const isTextArea = ['address', 'description'].includes(field);
    const isPassword = field === 'password' || field === 'password_confirmation';
    const inputType = isPassword ? (passwordVisibility[field] ? 'text' : 'password') : field === 'email' ? 'email' : 'text';
    const togglePassword = () => setPasswordVisibility((current) => ({ ...current, [field]: !current[field] }));
    return (
      <div className={`form-group-ledger ${isTextArea ? 'is-wide' : ''}`} key={field}>
        <label htmlFor={field}>{displayName(field)}{isPassword && editingId ? ' (leave blank to retain)' : ''}</label>
        {isTextArea
          ? <textarea id={field} className="form-control" rows="3" value={form[field] || ''} onChange={(event) => updateField(field, event.target.value)} />
          : isPassword
            ? <div className="password-field-control"><input id={field} className="form-control" type={inputType} value={form[field] || ''} onChange={(event) => updateField(field, event.target.value)} autoComplete={field === 'password' ? 'new-password' : 'new-password'} required={!editingId} /><button className="password-visibility-toggle" type="button" aria-label={passwordVisibility[field] ? `Hide ${displayName(field).toLowerCase()}` : `Show ${displayName(field).toLowerCase()}`} aria-pressed={passwordVisibility[field]} onClick={togglePassword}>{passwordVisibility[field] ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}</button></div>
            : <input id={field} className="form-control" type={inputType} value={form[field] || ''} onChange={(event) => updateField(field, event.target.value)} required={field !== 'phone' && !(editingId && field.includes('password'))} />}
      </div>
    );
  };

  const cellValue = (record, column) => {
    if (column === 'clinic') return record.clinic?.name || '—';
    if (column === 'department') return record.department?.name || '—';
    if (column === 'ward') return record.ward?.name || '—';
    if (column === 'role') return record.role?.name || '—';
    if (column === 'permissions') return record.permissions?.length || 0;
    return record[column] || '—';
  };

  return (
    <section className="page-shell">
      <header className="page-header compact">
        <div><p className="eyebrow">{config.eyebrow}</p><h1>{config.title}.</h1><p className="page-subtitle">Create, revise, and retire {config.singular} records within your authorized scope.</p></div>
        <div className="header-stamp"><span>AUTHORIZATION</span><strong>{user?.role?.name || 'User'}</strong></div>
      </header>

      <div className="management-layout">
        <section className="entry-panel">
          <div className="panel-heading"><span>{editingId ? 'EDIT RECORD' : 'NEW RECORD'}</span><strong>{editingId ? `Update ${config.singular}` : `Register ${config.singular}`}</strong></div>
          <form className="management-form" onSubmit={submit}>
            {config.fields.map(renderField)}
            {error && <div className="form-notice is-error" role="alert">{error}</div>}
            {notice && <div className="form-notice">{notice}</div>}
            <div className="form-actions">
              {editingId && <button className="btn-ledger-secondary" type="button" onClick={() => { setEditingId(null); setForm(config.initial); setPasswordVisibility({ password: false, password_confirmation: false }); }}>Cancel</button>}
              <button className="btn-ledger-primary" type="submit" disabled={saving}>{saving ? 'Saving…' : editingId ? `Update ${config.singular}` : `Register ${config.singular}`}</button>
            </div>
          </form>
        </section>

        <section className="registry-panel">
          <div className="registry-head"><span>LIVE REGISTRY</span><strong>{loading ? 'Loading…' : `${records.length} record${records.length === 1 ? '' : 's'}`}</strong></div>
          <div className="table-responsive">
            <table className="table ledger-table align-middle">
              <thead><tr>{config.columns.map((column) => <th key={column}>{displayName(column)}</th>)}<th aria-label="Actions" /></tr></thead>
              <tbody>
                {!loading && records.length === 0 && <tr><td className="empty-row" colSpan={config.columns.length + 1}>No {config.singular} records are available in this authorized scope.</td></tr>}
                {records.map((record) => <tr key={record.id}>{config.columns.map((column) => <td key={column} className={column === 'status' ? `status-cell status-${record.status}` : ''}>{cellValue(record, column)}</td>)}<td className="table-actions"><button type="button" onClick={() => startEdit(record)}>Edit</button><button type="button" onClick={() => remove(record)}>Delete</button></td></tr>)}
              </tbody>
            </table>
          </div>
          <Pagination meta={pagination} page={pageNumber} onChange={setPageNumber} />
        </section>
      </div>
    </section>
  );
}
