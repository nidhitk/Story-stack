// ─────────────────────────────────────────────────────────────
// components/Header.jsx — Top navigation bar
//
// ✏️  EDIT THIS FILE when:
//   - You want to change the app name or logo
//   - You want to add navigation links
// ─────────────────────────────────────────────────────────────

export default function Header() {
  return (
    <header className="header">
      <div className="header-logo">R</div>
      <div>
        <h1 className="header-title">Story<span>Stack</span></h1>
        <p className="header-subtitle">Community discussion board</p>
      </div>
    </header>
  );
}
