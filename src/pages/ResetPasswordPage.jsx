import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, Lock } from 'lucide-react';
import apiClient from '../services/apiClient.js';
import '../LoginPage.css';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const email = searchParams.get('email') || '';

  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // A link opened without both a token and an email can never be valid — show
  // the same friendly, non-technical message the backend would eventually
  // give anyway, without making a request.
  if (!token || !email) {
    return (
      <main className="login-page">
        <div className="login-bg-shape login-bg-shape-one" />
        <div className="login-bg-shape login-bg-shape-two" />
        <div className="login-container">
          <section className="login-card">
            <header className="login-card-header">
              <div className="login-logo"><img src="/assets/clinic-mark.svg" alt="Hospital Management System" /></div>
              <h1>Reset your<span>password</span></h1>
            </header>
            <div className="login-form">
              <div className="login-error" role="alert">This password reset link is invalid or has expired. Please request a new one.</div>
              <Link className="login-back-link" to="/forgot-password">Request a new reset link</Link>
            </div>
          </section>
        </div>
      </main>
    );
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    if (password !== passwordConfirmation) {
      setError('Passwords do not match.');
      return;
    }

    setSubmitting(true);
    try {
      await apiClient.post('/auth/reset-password', {
        token,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });
      setSuccess(true);
    } catch (requestError) {
      if (requestError?.errors?.password) {
        setError(requestError.errors.password[0]);
      } else if (!requestError?.response) {
        setError(requestError?.message || 'Unable to connect to the server. Please check your connection and try again.');
      } else {
        // Covers invalid/expired token and any other server-side rejection —
        // the backend intentionally returns one generic message for all of these.
        setError(requestError?.message || 'This password reset link is invalid or has expired. Please request a new one.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="login-page">
      <div className="login-bg-shape login-bg-shape-one" />
      <div className="login-bg-shape login-bg-shape-two" />

      <div className="login-container">
        <section className="login-card">
          <header className="login-card-header">
            <div className="login-logo"><img src="/assets/clinic-mark.svg" alt="Hospital Management System" /></div>
            <h1>Reset your<span>password</span></h1>
            <p>Choose a new password for {email}</p>
          </header>

          {success ? (
            <div className="login-form">
              <div className="login-success" role="status">Your password has been reset. You can now sign in with your new password.</div>
              <Link className="login-primary-button" to="/login" style={{ textDecoration: 'none', textAlign: 'center' }}>
                Back to sign in
                <span className="login-button-arrow">→</span>
              </Link>
            </div>
          ) : (
            <form className="login-form" onSubmit={handleSubmit} noValidate>
              <div className="login-field">
                <label htmlFor="reset-password">New password</label>
                <div className="login-input-wrapper">
                  <Lock className="login-input-icon" size={17} />
                  <input
                    id="reset-password"
                    className="login-input login-password-input"
                    type={passwordVisible ? 'text' : 'password'}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    autoComplete="new-password"
                    aria-invalid={Boolean(error)}
                    placeholder="At least 8 characters"
                    required
                  />
                  <button
                    className="login-password-toggle"
                    type="button"
                    aria-label={passwordVisible ? 'Hide password' : 'Show password'}
                    aria-pressed={passwordVisible}
                    onClick={() => setPasswordVisible((value) => !value)}
                  >
                    {passwordVisible ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>

              <div className="login-field">
                <label htmlFor="reset-password-confirmation">Confirm new password</label>
                <input
                  id="reset-password-confirmation"
                  className="login-input standalone-input"
                  type={passwordVisible ? 'text' : 'password'}
                  value={passwordConfirmation}
                  onChange={(event) => setPasswordConfirmation(event.target.value)}
                  autoComplete="new-password"
                  aria-invalid={Boolean(error)}
                  placeholder="Re-enter your new password"
                  required
                />
              </div>

              {error && <div className="login-error" role="alert">{error}</div>}

              <button className="login-primary-button" type="submit" disabled={submitting}>
                {submitting ? 'Resetting…' : 'Reset password'}
                <span className="login-button-arrow">→</span>
              </button>

              <Link className="login-back-link" to="/login">Back to sign in</Link>
            </form>
          )}
        </section>
      </div>
    </main>
  );
}
