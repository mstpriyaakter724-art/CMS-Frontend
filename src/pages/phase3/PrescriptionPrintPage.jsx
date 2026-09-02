// Document-only prescription print route: waits for existing OPD and prescription APIs before browser print.
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from '../../services/apiClient.js';
import { ErrorPanel, LoadingPanel } from '../../components/StatePanel.jsx';
import { PrescriptionDocument } from './PrescriptionWorkspace.jsx';

export default function PrescriptionPrintPage() {
  const { visitId } = useParams();
  const [record, setRecord] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    Promise.all([apiClient.get(`/opd-visits/${visitId}`), apiClient.get(`/opd-visits/${visitId}/prescription`)])
      .then(([visitResponse, prescriptionResponse]) => {
        if (!active) return;
        const visit = visitResponse.data.data;
        const prescription = prescriptionResponse.data.data;
        if (!prescription) throw new Error('This OPD visit does not yet have a saved prescription to print.');
        setRecord({ visit, prescription });
      })
      .catch((requestError) => active && setError(requestError?.response?.data?.message || requestError?.message || 'Unable to prepare the prescription document.'));
    return () => { active = false; };
  }, [visitId]);

  useEffect(() => {
    if (!record) return undefined;
    const timer = window.setTimeout(() => window.print(), 140);
    return () => window.clearTimeout(timer);
  }, [record]);

  if (error) return <main className="document-print-route print-error"><ErrorPanel message={error} retry={() => window.location.reload()} /></main>;
  if (!record) return <main className="document-print-route"><LoadingPanel label="Preparing prescription document…" /></main>;
  const clinicName = record.visit.clinic?.name || record.visit.patient?.clinic?.name || 'Clinic name not recorded';
  return <main className="document-print-route prescription-print-route"><PrescriptionDocument visit={record.visit} prescription={record.prescription} clinicName={clinicName} branch={record.visit.patient?.clinic_branch} /></main>;
}
