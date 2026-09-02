// Clinical Ledger: quiet, truthful loading, empty, and error states for API-driven pages.
export function LoadingPanel({ label = 'Loading records…' }) {
  return <div className="state-panel state-loading"><span className="loading-rule" /><strong>{label}</strong><p>The clinic ledger is retrieving the latest authorized information.</p></div>;
}

export function EmptyPanel({ title, body, action }) {
  return <div className="state-panel state-empty"><span>NO RECORDS</span><strong>{title}</strong><p>{body}</p>{action}</div>;
}

export function ErrorPanel({ message, retry }) {
  return <div className="state-panel state-error"><span>CONNECTION NOTICE</span><strong>We could not load this record.</strong><p>{message}</p>{retry && <button className="btn-ledger-secondary" type="button" onClick={retry}>Try again</button>}</div>;
}
