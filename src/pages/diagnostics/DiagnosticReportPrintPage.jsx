// Sage Clinical Workspace: document-only diagnostic report route renders real report data without the authenticated application shell before printing.
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from '../../services/apiClient.js';
import { ErrorPanel, LoadingPanel } from '../../components/StatePanel.jsx';
import { DiagnosticReportDocument } from './DiagnosticRoutes.jsx';

export default function DiagnosticReportPrintPage() {
  const { diagnosticReportId } = useParams(); const [report, setReport] = useState(null); const [error, setError] = useState('');
  useEffect(() => { apiClient.get(`/diagnostic-reports/${diagnosticReportId}`).then((response) => setReport(response.data.data)).catch((reason) => setError(reason?.response?.data?.message || 'Unable to load the diagnostic report for printing.')); }, [diagnosticReportId]);
  useEffect(() => { if (!report) return; const timer = window.setTimeout(() => window.print(), 80); return () => window.clearTimeout(timer); }, [report]);
  if (error) return <main className="document-print-route"><ErrorPanel message={error} retry={() => window.location.reload()} /></main>;
  if (!report) return <main className="document-print-route"><LoadingPanel label="Preparing diagnostic report…" /></main>;
  return <main className="document-print-route"><DiagnosticReportDocument report={report} /></main>;
}
