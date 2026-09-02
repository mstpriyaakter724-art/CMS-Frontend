// Clinical Ledger: dedicated route for editing an existing patient record with prefilled protected data.
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import apiClient from '../../services/apiClient.js';
import PageHeader from '../../components/PageHeader.jsx';
import { ErrorPanel, LoadingPanel } from '../../components/StatePanel.jsx';
import PatientForm from './PatientForm.jsx';

export default function PatientEdit() { const { patientId } = useParams(); const navigate = useNavigate(); const [patient, setPatient] = useState(null); const [error, setError] = useState(''); const load = () => { setPatient(null); apiClient.get(`/patients/${patientId}`).then((response) => setPatient(response.data.data)).catch((requestError) => setError(requestError?.message || 'Unable to load this patient record.')); }; useEffect(load, [patientId]); return <section className="routed-page form-page"><PageHeader eyebrow="PHASE 2 · PATIENT MANAGEMENT" title="Edit patient" description="Review and update the protected patient record." crumbs={[{ label: 'Patients', to: '/patients' }, { label: patient?.name || 'Patient', to: `/patients/${patientId}` }, { label: 'Edit' }]} />{error ? <ErrorPanel message={error} retry={load} /> : !patient ? <LoadingPanel label="Loading patient record…" /> : <PatientForm patient={patient} onSaved={(updated) => navigate(`/patients/${updated.id}`, { state: { notice: 'Patient record updated successfully.' } })} onCancel={() => navigate(`/patients/${patient.id}`)} />}</section>; }
