// Clinical Ledger: dedicated availability creation route.
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import apiClient from '../../services/apiClient.js';
import PageHeader from '../../components/PageHeader.jsx';
import { ErrorPanel, LoadingPanel } from '../../components/StatePanel.jsx';
import DoctorScheduleForm from './DoctorScheduleForm.jsx';
export default function DoctorScheduleCreate() { const { doctorId } = useParams(); const navigate = useNavigate(); const [doctor, setDoctor] = useState(null); const [error, setError] = useState(''); const load = () => { apiClient.get(`/doctors/${doctorId}`).then((response) => setDoctor(response.data.data)).catch((requestError) => setError(requestError?.message || 'Unable to load doctor record.')); }; useEffect(load, [doctorId]); return <section className="routed-page form-page"><PageHeader eyebrow="DOCTOR AVAILABILITY" title="Add schedule" description="Create a weekly availability window for this doctor." crumbs={[{ label: 'Doctors', to: '/doctors' }, { label: doctor?.name || 'Doctor', to: `/doctors/${doctorId}` }, { label: 'Schedules', to: `/doctors/${doctorId}/schedules` }, { label: 'Add schedule' }]} />{error ? <ErrorPanel message={error} retry={load} /> : !doctor ? <LoadingPanel label="Loading doctor record…" /> : <DoctorScheduleForm doctorId={doctor.id} onSaved={(schedule) => navigate(`/doctors/${doctor.id}/schedules/${schedule.id}`, { state: { notice: 'Schedule added successfully.' } })} onCancel={() => navigate(`/doctors/${doctor.id}/schedules`)} />}</section>; }
