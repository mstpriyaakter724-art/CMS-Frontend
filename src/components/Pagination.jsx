// Shared server-pagination control for existing Laravel paginated collections.
export default function Pagination({ meta, pagination, page, onChange, onPage }) {
  const source = meta || pagination;
  const changePage = onChange || onPage;
  if (!source || Number(source.last_page || 1) <= 1) return null;
  const current = Number(source.current_page || page || 1); const last = Number(source.last_page || 1); const total = Number(source.total || 0); const from = Number(source.from || ((current - 1) * Number(source.per_page || 10) + 1)); const to = Number(source.to || Math.min(current * Number(source.per_page || 10), total));
  const pages = Array.from(new Set([1, current - 1, current, current + 1, last].filter((item) => item >= 1 && item <= last))).sort((a, b) => a - b);
  return <nav className="app-pagination" aria-label="Collection pages"><span className="pagination-summary">Showing {from}–{to} of {total}</span><div className="pagination-controls"><button type="button" disabled={current <= 1} onClick={() => changePage(current - 1)}>← Previous</button>{pages.map((item, index) => <span className="pagination-page-group" key={item}>{index > 0 && item - pages[index - 1] > 1 && <i aria-hidden="true">…</i>}<button type="button" className={item === current ? 'is-current' : ''} aria-current={item === current ? 'page' : undefined} onClick={() => changePage(item)}>{item}</button></span>)}<button type="button" disabled={current >= last} onClick={() => changePage(current + 1)}>Next →</button></div></nav>;
}
