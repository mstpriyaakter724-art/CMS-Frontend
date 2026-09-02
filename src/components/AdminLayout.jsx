// Sage Clinical Workspace: compact hospital header, responsive navigation controls, and a clear profile menu around unchanged routed workflows.
import { useEffect, useRef, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { ChevronDown, LogOut, Menu, PanelLeftClose, PanelLeftOpen, X } from 'lucide-react';
import Sidebar from './Sidebar.jsx';

export default function AdminLayout({ user, onLogout }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);
  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') {
        setMobileOpen(false);
        setProfileOpen(false);
      }
    };
    const closeOnOutsidePointer = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) setProfileOpen(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    document.addEventListener('pointerdown', closeOnOutsidePointer);
    return () => {
      window.removeEventListener('keydown', closeOnEscape);
      document.removeEventListener('pointerdown', closeOnOutsidePointer);
    };
  }, []);
  return (
    <main className={`admin-app-shell ${collapsed ? 'is-collapsed' : ''} ${mobileOpen ? 'is-mobile-open' : ''}`}>
      {mobileOpen && <button className="mobile-nav-overlay" type="button" aria-label="Close navigation" onClick={() => setMobileOpen(false)} />}
      <Sidebar user={user} onLogout={onLogout} collapsed={collapsed} onNavigate={() => setMobileOpen(false)} onClose={() => setMobileOpen(false)} />
      <section className="admin-workspace">
        <header className="topbar-shell">
          <div className="topbar-context">
            {/* <button type="button" className="mobile-nav-toggle" aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={mobileOpen} aria-controls="primary-sidebar" onClick={() => setMobileOpen((value) => !value)}>{mobileOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}</button> */}

            <button type="button" className="sidebar-toggle" aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'} aria-pressed={collapsed} onClick={() => setCollapsed((value) => !value)}>{collapsed ? <PanelLeftOpen /> : <PanelLeftClose />}</button>
            <span>HOSPITAL OPERATIONS</span>
            <strong>{user?.clinic?.name || 'Platform administration'}</strong>
          </div>
          <div className="topbar-actions">
            <span className="topbar-status"><i aria-hidden="true" />Secure workspace</span>
            <div className="topbar-profile" ref={profileRef}><button type="button" className="topbar-profile-trigger" onClick={() => setProfileOpen((value) => !value)} aria-expanded={profileOpen} aria-haspopup="menu"><div><strong>{user?.name || 'Authenticated user'}</strong><small>{user?.role?.name || 'Role pending'}</small></div><ChevronDown /></button>{profileOpen && <div className="header-profile-menu" role="menu"><button type="button" role="menuitem" onClick={onLogout}><LogOut />Sign out</button></div>}</div>
          </div>
        </header>
        <div className="routed-page-content"><Outlet context={{ user }} /></div>
      </section>
    </main>
  );
}
