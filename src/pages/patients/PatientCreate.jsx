// Clinical Ledger: dedicated route for patient creation with a complete clinical form.
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/PageHeader.jsx';
import PatientForm from './PatientForm.jsx';

export default function PatientCreate() { const navigate = useNavigate(); return <section className="routed-page form-page"><PageHeader eyebrow="PATIENT MANAGEMENT" title="Add patient" description="Create a protected patient record with the information needed for safe clinic administration." crumbs={[{ label: 'Patients', to: '/patients' }, { label: 'Add patient' }]} /><PatientForm onSaved={(patient) => navigate(`/patients/${patient.id}`, { state: { notice: 'Patient registered successfully.' } })} onCancel={() => navigate('/patients')} /></section>; }
