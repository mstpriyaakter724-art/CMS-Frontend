// Clinical White + Soft Sage + Navy: the final presentation layer preserves routes, session behavior, authenticated shell, and document-only print paths.
// The selected system uses #F7F9F8 canvas, #2F6B5F active/action treatment, #172B2A structural navy, and white work cards.
import { useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './routed.css';
import './phase4.css';
import './phase5.css';
import './phase6.css';
import './phase7.css';
import './final-refactor.css';
import './final-refactor-overrides.css';
import './reference-dashboard-override.css';
import './sidebar-reference-fix.css';
import './dashboard-dropdown-fix.css';
import './responsive-ui-fix.css';
import './windows-light-theme.css';
import './enterprise-healthcare.css';
import './sage-hospital-theme.css';
import AdminLayout from './components/AdminLayout.jsx';
import DashboardRoute from './pages/DashboardRoute.jsx';
import LoginPage from './pages/LoginPage.jsx';
import ForgotPasswordPage from './pages/ForgotPasswordPage.jsx';
import ResetPasswordPage from './pages/ResetPasswordPage.jsx';
import LoginDesignDemos from './pages/LoginDesignDemos.jsx';
import ModernLoginPrototype from './pages/ModernLoginPrototype.jsx';
import CardLoginDemos from './pages/CardLoginDemos.jsx';
import BlueThemeDemos from './pages/BlueThemeDemos.jsx';
import ManagementRoute from './pages/ManagementRoute.jsx';
import DoctorCreate from './pages/doctors/DoctorCreate.jsx';
import DoctorEdit from './pages/doctors/DoctorEdit.jsx';
import DoctorsIndex from './pages/doctors/DoctorsIndex.jsx';
import DoctorShow from './pages/doctors/DoctorShow.jsx';
import PatientCreate from './pages/patients/PatientCreate.jsx';
import PatientEdit from './pages/patients/PatientEdit.jsx';
import PatientsIndex from './pages/patients/PatientsIndex.jsx';
import PatientShow from './pages/patients/PatientShow.jsx';
import DoctorScheduleCreate from './pages/schedules/DoctorScheduleCreate.jsx';
import DoctorScheduleEdit from './pages/schedules/DoctorScheduleEdit.jsx';
import DoctorSchedulesIndex from './pages/schedules/DoctorSchedulesIndex.jsx';
import DoctorScheduleShow from './pages/schedules/DoctorScheduleShow.jsx';
import AllDoctorSchedulesIndex from './pages/schedules/AllDoctorSchedulesIndex.jsx';
import AppointmentsIndex from './pages/phase3/AppointmentsIndex.jsx';
import { AppointmentCreate, AppointmentEdit, AppointmentShow } from './pages/phase3/AppointmentRoutes.jsx';
import { ConsultationPage, OpdVisitCreate, OpdVisitEdit, OpdVisitShow, OpdVisitsIndex, PrescriptionCreatePage, PrescriptionEditPage, PrescriptionPage } from './pages/phase3/OpdRoutes.jsx';
import { BedCreate, BedEdit, BedsIndex, BedShow } from './pages/phase4/BedRoutes.jsx';
import { IpdAdmissionCreate, IpdAdmissionShow, IpdAdmissionsIndex, IpdDischargePage, IpdTransferPage, IpdTreatmentCreate } from './pages/phase4/IpdAdmissionRoutes.jsx';
import { WardCreate, WardEdit, WardsIndex, WardShow } from './pages/phase4/WardRoutes.jsx';
import { EmergencyConsultationPage, EmergencyDispositionPage, EmergencyTriagePage, EmergencyVisitCreate, EmergencyVisitEdit, EmergencyVisitShow, EmergencyVisitsIndex } from './pages/phase5/EmergencyRoutes.jsx';
import { InvoiceCreate, InvoiceEdit, InvoicePayment, InvoicePaymentResult, InvoicesIndex, InvoiceShow, PatientBillingHistory, SourceBillingPage } from './pages/phase6/InvoiceRoutes.jsx';
import InvoicePrintPage from './pages/phase6/InvoicePrintPage.jsx';
import PrescriptionPrintPage from './pages/phase3/PrescriptionPrintPage.jsx';
import { ReportPage, ReportsDashboard } from './pages/phase7/ReportRoutes.jsx';
import { DiagnosticDashboard, DiagnosticOrderCreate, DiagnosticOrderShow, DiagnosticOrdersIndex, DiagnosticReportPage, DiagnosticReportShow, DiagnosticResultsPage, DiagnosticSampleWorklist, DiagnosticTestsIndex } from './pages/diagnostics/DiagnosticRoutes.jsx';
import DiagnosticReportPrintPage from './pages/diagnostics/DiagnosticReportPrintPage.jsx';
import './diagnostic-center.css';
import './facility-detail-cards.css';
import './minimal-production-ui.css';
import './login-design-demos.css';
import './modern-login-prototype.css';
import './card-login-demos.css';
import './night-shift-login.css';
import './clinical-sage-production.css';
import './blue-theme-demos.css';
import BranchesIndex from './pages/branches/BranchesIndex.jsx';
import MedicinesIndex from './pages/medicines/MedicinesIndex.jsx';
import { RoleCreate, RoleEdit, RoleShow, RolesIndex } from './pages/roles/RoleRoutes.jsx';
import { RegistryForm, RegistryIndex, RegistryShow } from './pages/registries/RegistryCrudRoutes.jsx';
import apiClient, { setAuthToken, setUnauthorizedHandler } from './services/apiClient.js';

const storedSession = () => {
  try { return JSON.parse(sessionStorage.getItem('clinical-ledger-session') || 'null'); } catch { return null; }
};

export default function App() {
  const [session, setSession] = useState(storedSession);
  const [checkingSession, setCheckingSession] = useState(Boolean(session?.token));

  useEffect(() => setUnauthorizedHandler(() => {
    setAuthToken(null);
    sessionStorage.removeItem('clinical-ledger-session');
    setSession(null);
  }), []);

  useEffect(() => {
    if (!session?.token) return;
    setAuthToken(session.token);
    apiClient.get('/auth/user')
      .then((response) => setSession((current) => ({ ...current, user: response.data.data })))
      .catch(() => { sessionStorage.removeItem('clinical-ledger-session'); setSession(null); })
      .finally(() => setCheckingSession(false));
  }, []);

  const handleAuthenticated = ({ token, user }) => {
    const nextSession = { token, user };
    setAuthToken(token);
    sessionStorage.setItem('clinical-ledger-session', JSON.stringify(nextSession));
    setSession(nextSession);
  };

  const handleLogout = async () => {
    try { await apiClient.post('/auth/logout'); } catch { /* Token invalidation is best effort during sign out. */ }
    setAuthToken(null);
    sessionStorage.removeItem('clinical-ledger-session');
    setSession(null);
  };

  if (checkingSession) return <main className="boot-screen"><span>Restoring secure session…</span></main>;
  if (!session?.token) return <BrowserRouter><Routes><Route path="login-design-demos" element={<LoginDesignDemos />} /><Route path="modern-login-demo" element={<ModernLoginPrototype />} /><Route path="card-login-demos" element={<CardLoginDemos />} /><Route path="blue-theme-demos" element={<BlueThemeDemos />} /><Route path="forgot-password" element={<ForgotPasswordPage />} /><Route path="reset-password" element={<ResetPasswordPage />} /><Route path="*" element={<LoginPage onAuthenticated={handleAuthenticated} />} /></Routes></BrowserRouter>;

  return (
    <BrowserRouter basename= {import.meta.env.BASE_URL}>
      <Routes>
        <Route path="invoices/:invoiceId/print" element={<InvoicePrintPage />} />
        <Route path="opd-visits/:visitId/prescription/print" element={<PrescriptionPrintPage />} />
        <Route path="diagnostic-reports/:diagnosticReportId/print" element={<DiagnosticReportPrintPage />} />
        <Route element={<AdminLayout user={session.user} onLogout={handleLogout} />}>
          <Route index element={<DashboardRoute />} />
          <Route path="clinics" element={<RegistryIndex entity="clinics" />} />
          <Route path="clinics/new" element={<RegistryForm entity="clinics" mode="create" />} />
          <Route path="clinics/:id" element={<RegistryShow entity="clinics" />} />
          <Route path="clinics/:id/edit" element={<RegistryForm entity="clinics" mode="edit" />} />
          <Route path="clinic-branches" element={<RegistryIndex entity="clinic-branches" />} />
          <Route path="clinic-branches/new" element={<RegistryForm entity="clinic-branches" mode="create" />} />
          <Route path="clinic-branches/:id" element={<RegistryShow entity="clinic-branches" />} />
          <Route path="clinic-branches/:id/edit" element={<RegistryForm entity="clinic-branches" mode="edit" />} />
          <Route path="medicines" element={<RegistryIndex entity="medicines" />} />
          <Route path="medicines/new" element={<RegistryForm entity="medicines" mode="create" />} />
          <Route path="medicines/:id" element={<RegistryShow entity="medicines" />} />
          <Route path="medicines/:id/edit" element={<RegistryForm entity="medicines" mode="edit" />} />
          <Route path="diagnostic-tests" element={<RegistryIndex entity="diagnostic-tests" />} />
          <Route path="diagnostic-tests/new" element={<RegistryForm entity="diagnostic-tests" mode="create" />} />
          <Route path="diagnostic-tests/:id" element={<RegistryShow entity="diagnostic-tests" />} />
          <Route path="diagnostic-tests/:id/edit" element={<RegistryForm entity="diagnostic-tests" mode="edit" />} />
          <Route path="diagnostic-dashboard" element={<DiagnosticDashboard />} />
          <Route path="diagnostic-orders" element={<DiagnosticOrdersIndex />} />
          <Route path="diagnostic-orders/new" element={<DiagnosticOrderCreate />} />
          <Route path="diagnostic-orders/:diagnosticOrderId" element={<DiagnosticOrderShow />} />
          <Route path="diagnostic-orders/:diagnosticOrderId/results" element={<DiagnosticResultsPage />} />
          <Route path="diagnostic-orders/:diagnosticOrderId/report" element={<DiagnosticReportPage />} />
          <Route path="diagnostic-samples" element={<DiagnosticSampleWorklist />} />
          <Route path="diagnostic-reports/:diagnosticReportId" element={<DiagnosticReportShow />} />
          <Route path="departments" element={<RegistryIndex entity="departments" />} />
          <Route path="departments/new" element={<RegistryForm entity="departments" mode="create" />} />
          <Route path="departments/:id" element={<RegistryShow entity="departments" />} />
          <Route path="departments/:id/edit" element={<RegistryForm entity="departments" mode="edit" />} />
          <Route path="rooms" element={<RegistryIndex entity="rooms" />} />
          <Route path="rooms/new" element={<RegistryForm entity="rooms" mode="create" />} />
          <Route path="rooms/:id" element={<RegistryShow entity="rooms" />} />
          <Route path="rooms/:id/edit" element={<RegistryForm entity="rooms" mode="edit" />} />
          <Route path="wards" element={<WardsIndex />} />
          <Route path="wards/new" element={<WardCreate />} />
          <Route path="wards/:wardId" element={<WardShow />} />
          <Route path="wards/:wardId/edit" element={<WardEdit />} />
          <Route path="beds" element={<BedsIndex />} />
          <Route path="beds/new" element={<BedCreate />} />
          <Route path="beds/:bedId" element={<BedShow />} />
          <Route path="beds/:bedId/edit" element={<BedEdit />} />
          <Route path="ipd-admissions" element={<IpdAdmissionsIndex />} />
          <Route path="ipd-admissions/new" element={<IpdAdmissionCreate />} />
          <Route path="ipd-admissions/:admissionId" element={<IpdAdmissionShow />} />
          <Route path="ipd-admissions/:admissionId/treatments/new" element={<IpdTreatmentCreate />} />
          <Route path="ipd-admissions/:admissionId/transfer" element={<IpdTransferPage />} />
          <Route path="ipd-admissions/:admissionId/discharge" element={<IpdDischargePage />} />
          <Route path="emergency-visits" element={<EmergencyVisitsIndex />} />
          <Route path="emergency-visits/new" element={<EmergencyVisitCreate />} />
          <Route path="emergency-visits/:emergencyVisitId" element={<EmergencyVisitShow />} />
          <Route path="emergency-visits/:emergencyVisitId/edit" element={<EmergencyVisitEdit />} />
          <Route path="emergency-visits/:emergencyVisitId/triage" element={<EmergencyTriagePage />} />
          <Route path="emergency-visits/:emergencyVisitId/consultation" element={<EmergencyConsultationPage />} />
          <Route path="emergency-visits/:emergencyVisitId/disposition" element={<EmergencyDispositionPage />} />
          <Route path="invoices" element={<InvoicesIndex />} />
          <Route path="invoices/new" element={<InvoiceCreate />} />
          <Route path="invoices/:invoiceId" element={<InvoiceShow />} />
          <Route path="invoices/:invoiceId/payment" element={<InvoicePayment />} />
          <Route path="invoices/payment/success" element={<InvoicePaymentResult outcome="success" />} />
          <Route path="invoices/payment/fail" element={<InvoicePaymentResult outcome="fail" />} />
          <Route path="invoices/payment/cancel" element={<InvoicePaymentResult outcome="cancel" />} />
          <Route path="invoices/:invoiceId/edit" element={<InvoiceEdit />} />
          <Route path="reports" element={<ReportsDashboard />} />
          <Route path="reports/:reportType" element={<ReportPage />} />
          <Route path="billing/opd/:sourceId" element={<SourceBillingPage type="opd" />} />
          <Route path="billing/ipd/:sourceId" element={<SourceBillingPage type="ipd" />} />
          <Route path="billing/emergency/:sourceId" element={<SourceBillingPage type="emergency" />} />
          <Route path="users" element={<RegistryIndex entity="users" />} />
          <Route path="users/new" element={<RegistryForm entity="users" mode="create" />} />
          <Route path="users/:id" element={<RegistryShow entity="users" />} />
          <Route path="users/:id/edit" element={<RegistryForm entity="users" mode="edit" />} />
          <Route path="roles" element={<RolesIndex />} />
          <Route path="roles/new" element={<RoleCreate />} />
          <Route path="roles/:roleId" element={<RoleShow />} />
          <Route path="roles/:roleId/edit" element={<RoleEdit />} />
          <Route path="permissions" element={<ManagementRoute page="roles" />} />
          <Route path="patients" element={<PatientsIndex />} />
          <Route path="patients/new" element={<PatientCreate />} />
          <Route path="patients/:patientId" element={<PatientShow />} />
          <Route path="patients/:patientId/edit" element={<PatientEdit />} />
          <Route path="patients/:patientId/billing-history" element={<PatientBillingHistory />} />
          <Route path="appointments" element={<AppointmentsIndex />} />
          <Route path="appointments/new" element={<AppointmentCreate />} />
          <Route path="appointments/:appointmentId" element={<AppointmentShow />} />
          <Route path="appointments/:appointmentId/edit" element={<AppointmentEdit />} />
          <Route path="opd-visits" element={<OpdVisitsIndex />} />
          <Route path="opd-visits/new" element={<OpdVisitCreate />} />
          <Route path="opd-visits/:visitId" element={<OpdVisitShow />} />
          <Route path="opd-visits/:visitId/edit" element={<OpdVisitEdit />} />
          <Route path="opd-visits/:visitId/consultation" element={<ConsultationPage />} />
          <Route path="opd-visits/:visitId/prescription" element={<PrescriptionPage />} />
          <Route path="opd-visits/:visitId/prescription/create" element={<PrescriptionCreatePage />} />
          <Route path="opd-visits/:visitId/prescription/edit" element={<PrescriptionEditPage />} />
          <Route path="doctors" element={<DoctorsIndex />} />
          <Route path="doctors/new" element={<DoctorCreate />} />
          <Route path="doctors/:doctorId" element={<DoctorShow />} />
          <Route path="doctors/:doctorId/edit" element={<DoctorEdit />} />
          <Route path="doctors/:doctorId/schedules" element={<DoctorSchedulesIndex />} />
          <Route path="doctors/:doctorId/schedules/new" element={<DoctorScheduleCreate />} />
          <Route path="doctors/:doctorId/schedules/:scheduleId" element={<DoctorScheduleShow />} />
          <Route path="doctors/:doctorId/schedules/:scheduleId/edit" element={<DoctorScheduleEdit />} />
          <Route path="doctor-schedules" element={<AllDoctorSchedulesIndex />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
