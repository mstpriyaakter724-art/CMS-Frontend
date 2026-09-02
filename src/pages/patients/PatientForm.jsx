// Clinical Ledger: professional patient record form organized by care-relevant sections, never embedded in an index table.
import { useEffect, useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import apiClient from '../../services/apiClient.js';
import { FieldError, FormErrorSummary, clearFieldError } from '../../components/FormFeedback.jsx';
import { FormSection, SelectField, TextField } from '../phase3/ClinicalFields.jsx';

const blankPatient = (clinicId = '') => ({ clinic_id: clinicId, clinic_branch_id: '', name: '', gender: '', date_of_birth: '', blood_group: '', phone: '', email: '', address: '', emergency_contact_name: '', emergency_contact_phone: '', allergies: '', medical_history: '', status: 'active' });
const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'unknown'];

export default function PatientForm({ patient, onSaved, onCancel }) {
  const { user } = useOutletContext();
  const [form, setForm] = useState(() => patient ? normalizePatient(patient) : blankPatient(user?.clinic_id || ''));
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [loadingBranches, setLoadingBranches] = useState(true);
  const [branches, setBranches] = useState([]);
  const [branchSearch, setBranchSearch] = useState('');
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    let active = true;
    apiClient.get('/clinic-branches?status=active&per_page=100').then((response) => { if (active) setBranches(response.data.data.items || []); }).catch(() => { if (active) setErrors({ form: ['Unable to load authorized clinic branches.'] }); }).finally(() => { if (active) setLoadingBranches(false); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    const warn = (event) => { if (dirty) { event.preventDefault(); event.returnValue = ''; } };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  const update = (field, value) => { setForm((current) => ({ ...current, [field]: value })); setErrors((current) => clearFieldError(current, field)); setDirty(true); };
  const chooseBranch = (branchId) => { const branch = branches.find((item) => String(item.id) === String(branchId)); setForm((current) => ({ ...current, clinic_branch_id: branchId, clinic_id: branch ? String(branch.clinic_id) : current.clinic_id })); setErrors((current) => clearFieldError(current, 'clinic_branch_id')); setDirty(true); };
  const title = patient ? 'Update patient record' : 'Register new patient';

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setErrors({});
    try {
      const payload = { ...form, clinic_id: Number(form.clinic_id) };
      const response = patient ? await apiClient.put(`/patients/${patient.id}`, payload) : await apiClient.post('/patients', payload);
      setDirty(false);
      onSaved(response.data.data, response.data.message);
    } catch (requestError) {
      setErrors(requestError?.errors || { form: [requestError?.message || 'Unable to save this patient record.'] });
    } finally { setSaving(false); }
  };

  if (loadingBranches) return <div className="form-loading-line">Preparing the authorized patient form…</div>;

  return (
    <form className="clinical-form-shell" onSubmit={submit} noValidate>
      <div className="form-intro"><div><span>{patient?.patient_number || 'AUTO-GENERATED ON SAVE'}</span><strong>{title}</strong></div><p>Required fields are marked with an asterisk. Patient registration ID is generated securely when the record is created.</p></div>
      <FormErrorSummary errors={errors} labels={{ clinic_branch_id: 'Clinic branch', name: 'Patient name', date_of_birth: 'Date of birth', blood_group: 'Blood group', emergency_contact_name: 'Emergency contact name', emergency_contact_phone: 'Emergency contact phone' }} />
      <FormSection title="Patient information" caption="Identity and core demographic details">
        <label className={`clinical-field ${errors.clinic_branch_id?.length ? 'has-error' : ''}`}><span>Clinic branch<b>*</b></span><input className="form-control" value={branchSearch} onChange={(event) => setBranchSearch(event.target.value)} placeholder="Search branch name, code, or area" /><select className={`form-select branch-select ${errors.clinic_branch_id?.length ? 'is-invalid' : ''}`} required value={form.clinic_branch_id || ''} aria-invalid={errors.clinic_branch_id?.length || undefined} aria-describedby={errors.clinic_branch_id?.length ? 'patient-branch-error' : undefined} onChange={(event) => chooseBranch(event.target.value)}><option value="">Select clinic branch</option>{branches.filter((branch) => `${branch.branch_name} ${branch.branch_code} ${branch.address || ''}`.toLowerCase().includes(branchSearch.toLowerCase())).map((branch) => <option value={branch.id} key={branch.id}>{branch.branch_name} — {branch.branch_code}{branch.address ? ` · ${branch.address}` : ''}</option>)}</select><FieldError messages={errors.clinic_branch_id} id="patient-branch-error" />{!branches.length && <FieldError messages={['No active branch is available. Add a clinic branch before registering a patient.']} id="patient-branch-empty" />}</label>
        <TextField label="Full name" required value={form.name} onChange={(value) => update('name', value)} error={errors.name} placeholder="Enter the patient's legal name" />
        <SelectField label="Gender" required value={form.gender} options={[['female', 'Female'], ['male', 'Male'], ['other', 'Other']]} onChange={(value) => update('gender', value)} error={errors.gender} />
        <TextField label="Date of birth" type="date" value={form.date_of_birth} onChange={(value) => update('date_of_birth', value)} error={errors.date_of_birth} />
        <SelectField label="Blood group" value={form.blood_group} options={bloodGroups.map((group) => [group, group === 'unknown' ? 'Unknown' : group])} onChange={(value) => update('blood_group', value)} error={errors.blood_group} />
      </FormSection>
      <FormSection title="Contact information" caption="Primary channels for care coordination">
        <TextField label="Phone" value={form.phone} onChange={(value) => update('phone', value)} error={errors.phone} placeholder="e.g. +880 1X XXX XXXX" />
        <TextField label="Email" type="email" value={form.email} onChange={(value) => update('email', value)} error={errors.email} placeholder="name@example.com" />
        <TextField label="Address" area value={form.address} onChange={(value) => update('address', value)} error={errors.address} placeholder="House, road, area, city" />
      </FormSection>
      <FormSection title="Emergency contact" caption="For urgent communication only">
        <TextField label="Contact name" value={form.emergency_contact_name} onChange={(value) => update('emergency_contact_name', value)} error={errors.emergency_contact_name} placeholder="Emergency contact full name" />
        <TextField label="Contact phone" value={form.emergency_contact_phone} onChange={(value) => update('emergency_contact_phone', value)} error={errors.emergency_contact_phone} placeholder="e.g. +880 1X XXX XXXX" />
      </FormSection>
      <FormSection title="Medical information" caption="Visible only in the protected patient profile">
        <TextField label="Allergies" area value={form.allergies} onChange={(value) => update('allergies', value)} error={errors.allergies} placeholder="Record known allergies or enter none known" />
        <TextField label="Medical history" area value={form.medical_history} onChange={(value) => update('medical_history', value)} error={errors.medical_history} placeholder="Record relevant past medical history" />
      </FormSection>
      <FormSection title="Record status" caption="Controls whether this patient is active in the current registry">
        <SelectField label="Status" required value={form.status} options={[['active', 'Active'], ['inactive', 'Inactive']]} onChange={(value) => update('status', value)} error={errors.status} />
      </FormSection>
      <div className="clinical-form-footer"><p>{dirty ? 'You have unsaved changes.' : 'All changes are saved when you submit this form.'}</p><div><button className="btn-ledger-secondary" type="button" onClick={onCancel} disabled={saving}>Cancel</button><button className="btn-ledger-primary" type="submit" disabled={saving}>{saving ? 'Saving record…' : patient ? 'Update patient' : 'Save patient'}</button></div></div>
    </form>
  );
}

function normalizePatient(patient) { return { ...blankPatient(patient.clinic_id || ''), ...patient, clinic_id: patient.clinic_id || '', date_of_birth: patient.date_of_birth || '' }; }
