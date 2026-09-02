// Enterprise Healthcare UI: reusable compact page hierarchy with factual breadcrumbs, controlled titles, and context-preserving actions.
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Printer } from 'lucide-react';

export default function PageHeader({ eyebrow = 'HOSPITAL MANAGEMENT', title, description, crumbs = [], action }) {
  const { pathname } = useLocation();
  const printable = /^\/reports\/[^/]+$/.test(pathname);
  return (
    <header className="routed-page-header">
      <div className="page-header-copy">
        <nav className="breadcrumb-ledger" aria-label="Breadcrumb">
          <Link to="/">Dashboard</Link>
          {crumbs.map((crumb, index) => <span key={`${crumb.label}-${index}`}><ChevronRight aria-hidden="true" />{crumb.to ? <Link to={crumb.to}>{crumb.label}</Link> : <b>{crumb.label}</b>}</span>)}
        </nav>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        {description && <p className="page-subtitle">{description}</p>}
      </div>
      {(action || printable) && <div className="page-header-action" aria-label="Page actions">{printable && <button className="btn-ledger-secondary print-action" type="button" onClick={() => window.print()}><Printer />Print document</button>}{action}</div>}
    </header>
  );
}
