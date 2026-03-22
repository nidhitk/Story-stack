// ─────────────────────────────────────────────────────────────
// components/DeleteModal.jsx — Confirm before deleting a title
//
// Your backend DELETE /deletecontent supports:
//   forced_delete=false → only deletes if no posts exist
//   forced_delete=true  → deletes title AND all posts inside
//
// ✏️  EDIT THIS FILE when:
//   - You want to change the confirmation text
// ─────────────────────────────────────────────────────────────
import { useState } from 'react';

export default function DeleteModal({ titleName, onConfirm, onCancel, loading }) {
  const [forced, setForced] = useState(false);

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2 className="modal-title">Delete Title</h2>

        <p className="modal-body">
          You are about to permanently delete <strong>"{titleName}"</strong>.
          This cannot be undone.
        </p>

        <label className="modal-checkbox">
          <input
            type="checkbox"
            checked={forced}
            onChange={e => setForced(e.target.checked)}
            disabled={loading}
          />
          Force delete — also deletes all posts inside this title
        </label>

        {!forced && (
          <p className="modal-warning">
            ⚠ Without force delete, this will fail if the title has posts.
          </p>
        )}

        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onCancel} disabled={loading}>
            Cancel
          </button>
          <button className="btn btn-danger" onClick={() => onConfirm(forced)} disabled={loading}>
            {loading && <span className="spinner" />}
            {loading ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
