// Sage Clinical Workspace: a light, permission-aware hospital navigation tree that exposes only authorized diagnostic, clinical, facility, finance, and administration routes.
// Clinical White + Soft Sage + Navy: navigation groups remain explicit operational landmarks while the existing permission-filtered routes stay unchanged.
import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { BedDouble, Building2, CalendarClock, CalendarDays, DoorOpen, FileBarChart2, FileText, FlaskConical, GitBranch, LayoutDashboard, LogOut, Pill, ReceiptText, ShieldCheck, Siren, Stethoscope, UserRoundCog, UsersRound } from 'lucide-react';

const groups = [
  { label: 'OVERVIEW', items: [{ to: '/', label: 'Dashboard', icon: LayoutDashboard }] },
  { label: 'PATIENT MANAGEMENT', items: [{ to: '/patients', label: 'Patients', icon: UsersRound, permission: 'patients.view' }, { to: '/appointments', label: 'Appointments', icon: CalendarDays, permission: 'appointments.view' }, { to: '/doctors', label: 'Doctors', icon: UserRoundCog, permission: 'doctors.view' }] },
  { label: 'CLINICAL', items: [{ to: '/departments', label: 'Departments', icon: Building2, permission: 'departments.view' }, { to: '/opd-visits', label: 'OPD visits', icon: Stethoscope, permission: 'opd-visits.view' }, { to: '/ipd-admissions', label: 'IPD admissions', icon: BedDouble, permission: 'ipd-admissions.view' }, { to: '/emergency-visits', label: 'Emergency register', icon: Siren, permission: 'emergency-visits.view' }, { to: '/doctor-schedules', label: 'Doctor schedules', icon: CalendarClock, permission: 'doctor-schedules.view' }] },
  { label: 'FACILITY', items: [{ to: '/wards', label: 'Wards', icon: Building2, permission: 'wards.view' }, { to: '/beds', label: 'Beds & availability', icon: BedDouble, permission: 'beds.view' }, { to: '/rooms', label: 'Rooms', icon: DoorOpen, permission: 'rooms.view' }, { to: '/clinic-branches', label: 'Branches', icon: GitBranch, permission: 'branches.view' }] },
  { label: 'PHARMACY', items: [{ to: '/medicines', label: 'Medicine master', icon: Pill, permission: 'medicines.view' }] },
  { label: 'DIAGNOSTIC CENTER', items: [{ to: '/diagnostic-dashboard', label: 'Diagnostic dashboard', icon: FileText, permission: 'diagnostic-orders.view' }, { to: '/diagnostic-orders', label: 'Diagnostic orders', icon: FileText, permission: 'diagnostic-orders.view' }, { to: '/diagnostic-samples', label: 'Sample worklist', icon: FlaskConical, permission: 'diagnostic-samples.view' }, { to: '/diagnostic-tests', label: 'Diagnostic tests', icon: FlaskConical, permission: 'diagnostic-tests.view' }] },
  { label: 'BILLING & FINANCE', items: [{ to: '/invoices', label: 'Invoices & payments', icon: ReceiptText, permission: 'invoices.view' }, { to: '/reports', label: 'Reports', icon: FileBarChart2, permission: 'reports.view' }] },
  { label: 'ADMINISTRATION', items: [{ to: '/users', label: 'Users', icon: UsersRound, permission: 'users.view' }, { to: '/roles', label: 'Roles & permissions', icon: ShieldCheck, permission: 'roles.manage' }, { to: '/clinics', label: 'Hospital settings', icon: Building2, permission: 'clinics.view' }] },
];

export default function Sidebar({ user, onLogout, collapsed, onNavigate, onClose }) {
  const location = useLocation();
  const permissionSlugs = user?.permissions?.map((permission) => permission.slug) || [];
  const allowedGroups = groups.map((group) => ({ ...group, items: group.items.filter((item) => user?.role?.slug === 'super-admin' || !item.permission || permissionSlugs.includes(item.permission)) })).filter((group) => group.items.length);
  const [closedGroups, setClosedGroups] = useState(() => Object.fromEntries(groups.map((group) => [group.label, true])));

  const toggleGroup = (label) => setClosedGroups((current) => ({ ...current, [label]: !current[label] }));

  return (
    <aside className="sidebar-shell" id="primary-sidebar">
      <header className="sidebar-brand">
        <img src="/assets/clinic-mark.svg" alt="Hospital Management System" />
        <div>
          <span>HOSPITAL</span>
          <strong>MANAGEMENT SYSTEM</strong>
        </div>
        <button className="mobile-sidebar-close" type="button" aria-label="Close navigation" onClick={onClose}>×</button>
      </header>

      <nav className="sidebar-nav grouped-sidebar-nav" aria-label="Primary navigation">
        {allowedGroups.map((group) => {
          const groupActive = group.items.some((item) => location.pathname === item.to || (item.to !== '/' && location.pathname.startsWith(`${item.to}/`)));
          const closed = !collapsed && closedGroups[group.label] && !groupActive;
          return <div className={`sidebar-nav-group ${closed ? 'is-closed' : ''} ${groupActive ? 'has-active-child' : ''}`} key={group.label}><button className={`sidebar-group-toggle ${groupActive ? 'is-active-parent' : ''}`} type="button" onClick={() => toggleGroup(group.label)} aria-expanded={!closed} aria-label={`${group.label} navigation section`}><span><i className="sidebar-group-marker" aria-hidden="true" />{group.label}</span><b aria-hidden="true">⌄</b></button><div className="sidebar-group-items">{group.items.map((item) => { const Icon = item.icon; return <NavLink data-label={item.label} title={collapsed ? item.label : undefined} onClick={onNavigate} className={({ isActive }) => `sidebar-link ${isActive ? 'is-active' : ''}`} key={item.to} to={item.to} end={item.to === '/'}><span className="sidebar-icon" aria-hidden="true"><Icon /></span><span className="sidebar-link-label">{item.label}</span></NavLink>; })}</div></div>;
        })}
      </nav>

      <footer className="sidebar-user">
        <div className="sidebar-user-summary">
          <div className="user-monogram">{user?.name?.slice(0, 1) || 'A'}</div>
          <div className="sidebar-user-copy">
            <strong>{user?.name || 'Authenticated user'}</strong>
            <span>{user?.role?.name || 'Role pending'}</span>
          </div>
          <button type="button" className="logout-button" onClick={onLogout} aria-label="Sign out" title="Sign out"><LogOut aria-hidden="true" /></button>
        </div>
      </footer>
    </aside>
  );
}
