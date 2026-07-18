// ─────────────────────────────────────────────────────────────
// components/Header.jsx — Top navigation bar
//
// ✏️  EDIT THIS FILE when:
//   - You want to change the app name or logo
//   - You want to add navigation links
// ─────────────────────────────────────────────────────────────

export default function Header({ onLogout }) {
  return (
    <header className="header">
      <div className="header-logo">$</div>
      <div className="header-copy">
        <h1 className="header-title">Story<span>Stack</span></h1>
        <p className="header-subtitle">Community discussion board</p>
      </div>
      {onLogout && (
        <button className="btn btn-ghost btn-sm header-action" onClick={onLogout}>
          Log out
        </button>
      )}
    </header>
  );
}
