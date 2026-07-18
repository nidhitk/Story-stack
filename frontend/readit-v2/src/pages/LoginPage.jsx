import { useState } from 'react';
import { loginUser, registerUser } from '../api';

const initialForm = {
  username: '',
  email: '',
  password: '',
};

export default function LoginPage({ onLogin, toast }) {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);

  const isRegister = mode === 'register';
  const canSubmit =
    form.username.trim() &&
    form.password &&
    (!isRegister || form.email.trim());

  const updateField = event => {
    const { name, value } = event.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const switchMode = nextMode => {
    setMode(nextMode);
    setForm(initialForm);
  };

  const signIn = async () => {
    const data = await loginUser(form.username.trim(), form.password);
    onLogin({
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
    });
  };

  const handleSubmit = async event => {
    event.preventDefault();
    if (!canSubmit) return;

    setLoading(true);
    try {
      if (isRegister) {
        await registerUser(
          form.username.trim(),
          form.email.trim(),
          form.password
        );
      }

      await signIn();
      setForm(initialForm);
      toast(isRegister ? 'Account created.' : 'Logged in.');
    } catch (error) {
      toast(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-shell">
      <section className="login-hero">
        <p className="login-eyebrow">StoryStack</p>
        <h1 className="login-title">Join the discussion board.</h1>
        <p className="login-copy">
          Create an account to publish posts, then come back to manage what you
          have written.
        </p>
      </section>

      <section className="card login-card">
        <div className="auth-tabs" aria-label="Account action">
          <button
            type="button"
            className={`auth-tab ${!isRegister ? 'active' : ''}`}
            onClick={() => switchMode('login')}
            disabled={loading}
          >
            Log in
          </button>
          <button
            type="button"
            className={`auth-tab ${isRegister ? 'active' : ''}`}
            onClick={() => switchMode('register')}
            disabled={loading}
          >
            Register
          </button>
        </div>

        <p className="card-label">{isRegister ? 'Create Account' : 'Welcome Back'}</p>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="auth-username">Username</label>
            <input
              id="auth-username"
              name="username"
              type="text"
              autoComplete="username"
              value={form.username}
              onChange={updateField}
              disabled={loading}
              placeholder="Your username"
            />
          </div>

          {isRegister && (
            <div className="form-group">
              <label htmlFor="auth-email">Email</label>
              <input
                id="auth-email"
                name="email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={updateField}
                disabled={loading}
                placeholder="you@example.com"
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="auth-password">Password</label>
            <input
              id="auth-password"
              name="password"
              type="password"
              autoComplete={isRegister ? 'new-password' : 'current-password'}
              value={form.password}
              onChange={updateField}
              disabled={loading}
              placeholder="Your password"
            />
          </div>

          <button
            className="btn btn-primary login-submit"
            type="submit"
            disabled={loading || !canSubmit}
          >
            {loading && <span className="spinner" />}
            {loading
              ? isRegister ? 'Creating...' : 'Signing in...'
              : isRegister ? 'Create account' : 'Log in'}
          </button>
        </form>
      </section>
    </main>
  );
}
