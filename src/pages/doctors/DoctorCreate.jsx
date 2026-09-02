// Clinical Ledger: dedicated doctor registration route.
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/PageHeader.jsx';
import DoctorForm from './DoctorForm.jsx';
export default function DoctorCreate() { const navigate = useNavigate(); return <section className="routed-page form-page"><PageHeader eyebrow="PHASE 2 · DOCTOR MANAGEMENT" title="Add doctor" description="Register a professional practitioner record for the authorized clinic." crumbs={[{ label: 'Doctors', to: '/doctors' }, { label: 'Add doctor' }]} /><DoctorForm onSaved={(doctor) => navigate(`/doctors/${doctor.id}`, { state: { notice: 'Doctor registered successfully.' } })} onCancel={() => navigate('/doctors')} /></section>; }
