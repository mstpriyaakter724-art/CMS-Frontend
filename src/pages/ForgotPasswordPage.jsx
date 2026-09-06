import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';
import apiClient from '../services/apiClient.js';
import './../LoginPage.css';

// Deliberately shows the same message whether or not the email exists — the
// backend never reveals account existence, and the frontend must not either.
export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    setSubmitting(true);
    try {
      await apiClient.post('/auth/forgot-password', { email: email.trim() });
      // Always show the generic confirmation, even on unexpected errors below,
      // so the response never signals whether the account exists.
      setSubmitted(true);
    } catch (requestError) {
      if (requestError?.response?.status === 422 && requestError?.errors?.email) {
        setError(requestError.errors.email[0]);
      } else if (!requestError?.response) {
        setError(requestError?.message || 'Unable to connect to the server. Please check your connection and try again.');
      } else {
        // Any other server-side failure: still avoid revealing anything about
        // the account, but let the user know something went wrong so they can retry.
        setError('Something went wrong. Please try again in a moment.');
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
            <div className="login-logo">
              <img src="/assets/clinic-mark.svg" alt="Hospital Management System" />
            </div>
            <h1>Reset your<span>password</span></h1>
            <p>Enter your account email and we'll send you a reset link</p>
          </header>

          {submitted ? (
            <div className="login-form">
              <div className="login-success" role="status">
                If an account exists for this email, a password reset link has been sent. Please check your inbox.
              </div>
              <Link className="login-back-link" to="/login">Back to sign in</Link>
            </div>
          ) : (
            <form className="login-form" onSubmit={handleSubmit} noValidate>
              <div className="login-field">
                <label htmlFor="forgot-email">Email address</label>
                <div className="login-input-wrapper">
                  <Mail className="login-input-icon" size={17} />
                  <input
                    id="forgot-email"
                    className="login-input"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    autoComplete="email"
                    aria-invalid={Boolean(error)}
                    placeholder="Enter your account email"
                    required
                  />
                </div>
              </div>

              {error && <div className="login-error" role="alert">{error}</div>}

              <button className="login-primary-button" type="submit" disabled={submitting}>
                {submitting ? 'Sending…' : 'Send reset link'}
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
