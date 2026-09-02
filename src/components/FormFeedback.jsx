// Clinical Ledger form feedback: maps the existing Laravel 422 field payload to clear, accessible React JSX presentation.
const humanize = (value = '') => value.replace(/\.\d+\./g, ' ').replace(/\./g, ' ').replace(/_/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());

export function clearFieldError(errors, field) {
  if (!errors?.[field]) return errors || {};
  const next = { ...errors };
  delete next[field];
  return next;
}

export function FormErrorSummary({ errors = {}, labels = {} }) {
  const general = Array.isArray(errors.form) ? errors.form : [];
  const fields = Object.keys(errors).filter((key) => key !== 'form' && Array.isArray(errors[key]) && errors[key].length);
  if (!general.length && !fields.length) return null;
  return <section className="form-error-summary" role="alert" aria-live="assertive">
    <div><strong>Please correct the highlighted fields.</strong><span>Each message explains what needs attention before saving.</span></div>
    {general.map((message) => <p key={message}>{message}</p>)}
    {!!fields.length && <ul>{fields.map((field) => <li key={field}>{labels[field] || humanize(field)}</li>)}</ul>}
  </section>;
}

export function FieldError({ messages, id }) {
  if (!Array.isArray(messages) || !messages.length) return null;
  return <div className="field-error" id={id} role="alert">{messages.map((message) => <span key={message}>{message}</span>)}</div>;
}
