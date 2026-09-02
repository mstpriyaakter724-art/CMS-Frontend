// Dedicated invoice print route: reuse the existing invoice data/document surface without AdminLayout, sidebar, header, or navigation.
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from '../../services/apiClient.js';
import { ErrorPanel, LoadingPanel } from '../../components/StatePanel.jsx';
import { InvoiceDocument } from './InvoiceRoutes.jsx';

export default function InvoicePrintPage() {
  const { invoiceId } = useParams(); const [record, setRecord] = useState(null); const [error, setError] = useState('');
  useEffect(() => { let active = true; apiClient.get(`/invoices/${invoiceId}`).then((response) => { if (!active) return; setRecord(response.data.data); window.setTimeout(() => window.print(), 120); }).catch((requestError) => active && setError(requestError?.message || 'Unable to load invoice for printing.')); return () => { active = false; }; }, [invoiceId]);
  if (error) return <main className="document-print-route print-error"><ErrorPanel message={error} retry={() => window.location.reload()} /></main>;
  if (!record) return <main className="document-print-route"><LoadingPanel label="Preparing invoice document…" /></main>;
  return <main className="document-print-route"><InvoiceDocument record={record} /></main>;
}
