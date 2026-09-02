// Clinical Ledger: confirmation is reserved for destructive record operations, not standard CRUD entry.
export default function ConfirmDialog({ title, description, confirmLabel = 'Delete record', onCancel, onConfirm, busy = false }) {
  return (
    <div className="overlay-backdrop" role="presentation">
      <section className="overlay-panel confirm-dialog" role="dialog" aria-modal="true" aria-label={title}>
        <header className="overlay-header"><div><span>CONFIRM ACTION</span><strong>{title}</strong></div></header>
        <div className="confirm-panel"><p>{description}</p><div className="form-actions"><button className="btn-ledger-secondary" type="button" onClick={onCancel} disabled={busy}>Cancel</button><button className="btn-ledger-danger" type="button" onClick={onConfirm} disabled={busy}>{busy ? 'Deleting…' : confirmLabel}</button></div></div>
      </section>
    </div>
  );
}
