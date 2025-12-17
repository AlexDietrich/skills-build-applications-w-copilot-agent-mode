import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';

const formatValue = (value) => {
  if (value === null || value === undefined) return '--';
  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed.length > 60 ? `${trimmed.slice(0, 57)}...` : trimmed || '--';
  }
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  const jsonValue = JSON.stringify(value);
  return jsonValue.length > 60 ? `${jsonValue.slice(0, 57)}...` : jsonValue;
};

const defaultSummary = (item) => {
  if (!item || typeof item !== 'object') {
    return <span className="text-muted">No details available.</span>;
  }

  const entries = Object.entries(item)
    .filter(([key]) => key !== 'id')
    .slice(0, 4);

  if (entries.length === 0) {
    return <span className="text-muted">No details available.</span>;
  }

  return (
    <div className="d-flex flex-wrap gap-2">
      {entries.map(([key, value]) => (
        <span key={key} className="badge text-bg-light border border-secondary">
          <span className="text-muted text-uppercase small">{key}</span>
          <span className="ms-1">{formatValue(value)}</span>
        </span>
      ))}
    </div>
  );
};

function DataTableCard({
  title,
  entityLabel,
  data = [],
  loading = false,
  error = null,
  emptyMessage = 'No records available.',
  onRefresh = () => {},
  getPrimary,
  getSummary,
}) {
  const [query, setQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);

  const handleClose = () => setSelectedItem(null);

  const filteredData = useMemo(() => {
    if (!query.trim()) return data;
    const lower = query.toLowerCase();
    return data.filter((item) => JSON.stringify(item ?? {}).toLowerCase().includes(lower));
  }, [data, query]);

  const renderSummary = (item) => {
    const custom = getSummary ? getSummary(item) : null;
    return custom || defaultSummary(item);
  };

  useEffect(() => {
    if (!selectedItem) return undefined;

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        handleClose();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    document.body.classList.add('modal-open');

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.classList.remove('modal-open');
    };
  }, [selectedItem]);

  return (
    <section className="mb-4">
      <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
        <div className="card-header bg-white border-0 d-flex flex-wrap gap-3 align-items-center justify-content-between px-4 py-3">
          <div>
            <p className="text-uppercase text-muted small mb-1">{entityLabel || title}</p>
            <h2 className="h4 fw-bold mb-0">{title}</h2>
          </div>
          <div className="d-flex align-items-center gap-2 flex-wrap">
            <span className="badge bg-light text-primary border border-primary">
              {data.length} total
            </span>
            <button
              type="button"
              className="btn btn-outline-primary btn-sm"
              onClick={onRefresh}
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Refresh'}
            </button>
          </div>
        </div>
        <div className="card-body px-4 pb-4">
          <form className="row g-2 align-items-center mb-3" onSubmit={(event) => event.preventDefault()}>
            <div className="col-sm-8">
              <div className="input-group">
                <span className="input-group-text bg-light text-muted">Search</span>
                <input
                  type="search"
                  className="form-control"
                  placeholder={`Filter ${entityLabel || title}`}
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
              </div>
            </div>
            <div className="col-sm-4 d-flex justify-content-sm-end gap-2">
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                onClick={() => setQuery('')}
                disabled={!query}
              >
                Clear
              </button>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={onRefresh}
                disabled={loading}
              >
                {loading ? 'Refreshing...' : 'Reload'}
              </button>
            </div>
          </form>

          {error && (
            <div className="alert alert-danger mb-3" role="alert">
              {error}
            </div>
          )}

          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th scope="col" style={{ width: '60px' }} className="text-muted">
                    #
                  </th>
                  <th scope="col">Item</th>
                  <th scope="col">Details</th>
                  <th scope="col" className="text-end">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td colSpan={4} className="text-center py-4">
                      <div className="spinner-border text-primary" role="status" aria-label="Loading" />
                      <div className="small text-muted mt-2">Fetching latest data...</div>
                    </td>
                  </tr>
                )}

                {!loading && filteredData.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center py-4 text-muted">
                      {emptyMessage}
                    </td>
                  </tr>
                )}

                {!loading &&
                  filteredData.map((item, index) => (
                    <tr key={item.id ?? index}>
                      <td className="text-muted">{index + 1}</td>
                      <td>
                        <div className="fw-semibold">{(getPrimary && getPrimary(item, index)) || 'Item'}</div>
                        <div className="small text-muted">ID: {item.id ?? '--'}</div>
                      </td>
                      <td>{renderSummary(item)}</td>
                      <td className="text-end">
                        <div className="d-flex gap-2 justify-content-end flex-wrap">
                          <button
                            type="button"
                            className="btn btn-outline-primary btn-sm"
                            onClick={() => setSelectedItem(item)}
                          >
                            View details
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {selectedItem && (
        <>
          {createPortal(
            <div className="modal-backdrop fade show" onClick={handleClose} style={{ zIndex: 1040 }} />,
            document.body
          )}
          {createPortal(
            <div className="modal fade show d-block" tabIndex="-1" role="dialog" aria-modal="true" style={{ zIndex: 1060 }}>
              <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">{entityLabel || title} details</h5>
                    <button type="button" className="btn-close" onClick={handleClose} aria-label="Close" />
                  </div>
                  <div className="modal-body">
                    <pre className="mb-0 small bg-light border p-3 rounded">{JSON.stringify(selectedItem, null, 2)}</pre>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={handleClose}>
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>,
            document.body
          )}
        </>
      )}
    </section>
  );
}

export default DataTableCard;
