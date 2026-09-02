// Sage Clinical Workspace: live hospital metrics from the existing dashboard API with only real module routes exposed as navigable cards.
import { useEffect, useState } from 'react';
import { Activity, BedDouble, CalendarDays, CreditCard, FileText, FilePlus2, HeartPulse, ReceiptText, Siren, Stethoscope, UserPlus, UsersRound } from 'lucide-react';
import apiClient from '../services/apiClient.js';

const metricCards = [
  ['total_patients', 'Total patients', UsersRound, 'Registered care records', null, 'patients'],
  ['today_appointments', "Today's appointments", CalendarDays, 'Scheduled clinical arrivals', null, 'appointments'],
  ['today_opd_visits', "Today's OPD visits", Stethoscope, 'Outpatient activity', null, 'opd-visits'],
  ['current_ipd_patients', 'Current IPD patients', BedDouble, 'Active inpatient admissions', null, 'ipd-admissions'],
  ['today_emergency_visits', "Today's emergency visits", Siren, 'Emergency intake today', null, 'emergency-visits'],
  ['available_beds', 'Available beds', Activity, 'Ready for admission', null, 'beds'],
  ['occupied_beds', 'Occupied beds', HeartPulse, 'Currently assigned beds', null, 'beds'],
  ['today_revenue', "Today's revenue", ReceiptText, 'Collected payments today', 'currency', 'reports/revenue'],
  ['pending_payments', 'Pending payments', CreditCard, 'Open invoice balance', 'currency', 'invoices'],
];
const quickActions = [
  ['Register patient', 'Create a patient record', UserPlus, 'patients/new'],
  ['Add appointment', 'Schedule a clinical visit', CalendarDays, 'appointments/new'],
  ['Register OPD', 'Start an outpatient visit', Stethoscope, 'opd-visits/new'],
  ['Admit patient', 'Open an IPD admission', BedDouble, 'ipd-admissions/new'],
  ['Emergency intake', 'Register emergency care', Siren, 'emergency-visits/new'],
  ['Create invoice', 'Start billing workflow', FilePlus2, 'invoices/new'],
];

export default function DashboardPage({ user, onNavigate }) {
  const [overview, setOverview] = useState(null); const [error, setError] = useState(''); const [loading, setLoading] = useState(true);
  const load = () => { setLoading(true); apiClient.get('/dashboard/overview').then((response) => { setOverview(response.data.data); setError(''); }).catch((requestError) => setError(requestError?.response?.data?.message || 'The dashboard could not reach the Laravel API.')).finally(() => setLoading(false)); };
  useEffect(load, []);
  const metrics = overview?.metrics || {};
  return <section className="reference-dashboard phase7-dashboard enterprise-dashboard"><header className="dashboard-reference-heading"><div><span>DASHBOARD</span><h1>Hospital operations overview</h1><p>Welcome back, {user?.name || 'Administrator'}. Review live care, capacity, and revenue signals from the secured hospital system.</p></div><div><button type="button" className="reference-primary" onClick={() => onNavigate('patients/new')}><UserPlus />Register patient</button><button type="button" className="reference-secondary" onClick={() => onNavigate('reports')}><FileText />Open reports</button></div></header>{error && <div className="connection-notice"><strong>Dashboard data notice.</strong> {error} <button type="button" onClick={load}>Retry</button></div>}<div className="operations-metrics reference-metric-row">{metricCards.map(([key, label, Icon, note, format, route], index) => <button type="button" className={`operation-card operation-tone-${index % 4} is-navigable`} key={key} onClick={() => onNavigate(route)}><span className="operation-card-icon"><Icon /></span><small>{label}</small><strong>{loading ? '—' : format === 'currency' ? money(metrics[key]) : metrics[key] ?? 0}</strong><b>{note}</b><em>Open →</em></button>)}</div><section className="dashboard-reference-grid"><article className="dashboard-reference-panel dashboard-operating-panel"><header><div><span>QUICK ACTIONS</span><h2>Start a workflow</h2></div><small>{overview?.today ? `Live data · ${overview.today}` : 'Available workflow actions'}</small></header><div className="dashboard-quick-actions">{quickActions.map(([label, note, Icon, route]) => <button type="button" key={route} onClick={() => onNavigate(route)}><i><Icon /></i><span><b>{label}</b><small>{note}</small></span></button>)}</div></article><article className="dashboard-reference-panel dashboard-report-panel"><header><div><span>REPORTING</span><h2>Operational reports</h2></div><button type="button" onClick={() => onNavigate('reports')}>View all</button></header><p>Open live, filterable data views for clinical activity, revenue, occupancy, and emergency operations.</p><div className="dashboard-report-links"><button type="button" onClick={() => onNavigate('reports/revenue')}><i><ReceiptText /></i><span>Revenue & payments</span><em>→</em></button><button type="button" onClick={() => onNavigate('reports/beds')}><i><BedDouble /></i><span>Bed occupancy</span><em>→</em></button><button type="button" onClick={() => onNavigate('reports/emergency')}><i><Siren /></i><span>Emergency activity</span><em>→</em></button></div></article></section></section>;
}
function money(value) { return `৳${Number(value || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`; }
