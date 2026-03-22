// ─────────────────────────────────────────────────────────────
// App.jsx — Root of the application
//
// ✏️  EDIT THIS FILE when:
//   - You add a new page (import it and add a route here)
//   - You want to add a global layout element (e.g. sidebar, footer)
//
// Right now the app has one page (Home).
// If you add more pages later, you'd add React Router here.
// ─────────────────────────────────────────────────────────────
import './styles/app.css';
import { useToast }  from './components/Toast';
import Toast         from './components/Toast';
import Header        from './components/Header';
import Home          from './pages/Home';

export default function App() {
  const { toasts, toast } = useToast();

  return (
    <>
      {/* Global toast notifications */}
      <Toast toasts={toasts} />

      <div className="page">
        <Header />

        {/*
          Add more pages/routes here as your app grows.
          For now, we just show the Home page.
        */}
        <Home toast={toast} />
      </div>
    </>
  );
}
