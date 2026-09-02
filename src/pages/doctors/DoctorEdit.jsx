// Clinical Ledger: dedicated prefilled doctor edit route.
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import apiClient from '../../services/apiClient.js';
import PageHeader from '../../components/PageHeader.jsx';
import { ErrorPanel, LoadingPanel } from '../../components/StatePanel.jsx';
import DoctorForm from './DoctorForm.jsx';
export default function DoctorEdit() { const { doctorId } = useParams(); const navigate = useNavigate(); const [doctor, setDoctor] = useState(null); const [error, setError] = useState(''); const load = () => { setDoctor(null); apiClient.get(`/doctors/${doctorId}`).then((response) => setDoctor(response.data.data)).catch((requestError) => setError(requestError?.message || 'Unable to load this doctor record.')); }; useEffect(load, [doctorId]); return <section className="routed-page form-page"><PageHeader eyebrow="PHASE 2 · DOCTOR MANAGEMENT" title="Edit doctor" description="Review and update the professional doctor record." crumbs={[{ label: 'Doctors', to: '/doctors' }, { label: doctor?.name || 'Doctor', to: `/doctors/${doctorId}` }, { label: 'Edit' }]} />{error ? <ErrorPanel message={error} retry={load} /> : !doctor ? <LoadingPanel label="Loading doctor record…" /> : <DoctorForm doctor={doctor} onSaved={(updated) => navigate(`/doctors/${updated.id}`, { state: { notice: 'Doctor record updated successfully.' } })} onCancel={() => navigate(`/doctors/${doctor.id}`)} />}</section>; }
