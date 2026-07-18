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
import { useEffect, useState } from 'react';
import { useToast }  from './components/Toast';
import Toast         from './components/Toast';
import Header        from './components/Header';
import LoginPage     from './pages/LoginPage';
import Home          from './pages/Home';
import {
  clearStoredToken,
  getStoredToken,
  storeToken,
} from './api';

export default function App() {
  const { toasts, toast } = useToast();
  const [authToken, setAuthToken] = useState(() => getStoredToken());

  useEffect(() => {
    if (!authToken) {
      setAuthToken(getStoredToken());
    }
  }, [authToken]);

  const handleLogin = ({ accessToken, refreshToken }) => {
    storeToken(accessToken, refreshToken);
    setAuthToken(accessToken);
  };

  const handleLogout = () => {
    clearStoredToken();
    setAuthToken(null);
    toast('Logged out.');
  };

  return (
    <>
      {/* Global toast notifications */}
      <Toast toasts={toasts} />

      <div className="page">
        {authToken ? (
          <>
            <Header onLogout={handleLogout} />
            <Home toast={toast} authToken={authToken} />
          </>
        ) : (
          <LoginPage
            onLogin={handleLogin}
            toast={toast}
          />
        )}
      </div>
    </>
  );
}
