// ─────────────────────────────────────────────────────────────
// components/Toast.jsx — Pop-up notification messages
//
// You don't need to edit this file.
// To show a toast anywhere in the app, use the toast() function
// passed down as a prop from App.jsx.
//
// Usage:
//   toast("Post created!")           → green success message
//   toast("Something failed", "error") → red error message
// ─────────────────────────────────────────────────────────────
import { useState, useCallback } from 'react';

// This hook manages the toast list. Used only in App.jsx.
export function useToast() {
  const [toasts, setToasts] = useState([]);

  const toast = useCallback((msg, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  }, []);

  return { toasts, toast };
}

// This component renders the toasts on screen.
export default function Toast({ toasts }) {
  if (!toasts.length) return null;
  return (
    <div className="toast-wrap">
      {toasts.map(t => (
        <div key={t.id} className={`toast ${t.type === 'error' ? 'toast-error' : ''}`}>
          {t.msg}
        </div>
      ))}
    </div>
  );
}
