import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, ShieldCheck, Mail, Lock } from 'lucide-react';
import apiClient, { setAuthToken } from '../services/apiClient.js';
import '../LoginPage.css';

// Patient self-registration has been removed from this screen: CMS accounts
// (patients included) are provisioned by authorized staff/admins only. See
// P0-7 in the Phase 1 audit report. Forgot-password is a separate P1 task.
export default function LoginPage({ onAuthenticated }) {
  const [credentials, setCredentials] = useState({ email: 'admin@clinic.local', password: 'ChangeMe123!' });

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  /*
   * Google OAuth callback
   * Existing authentication flow preserved
   */
  useEffect(() => {
    const params = new URLSearchParams(
      window.location.hash.replace(/^#/, '')
    );

    const token = params.get('google_token');
    const authError = params.get('auth_error');

    if (!token && !authError) return;

    window.history.replaceState(
      null,
      '',
      `${window.location.pathname}${window.location.search}`
    );

    if (authError) {
      setError(authError);
      return;
    }

    setSubmitting(true);
    setAuthToken(token);

    apiClient
      .get('/auth/user')
      .then((response) =>
        onAuthenticated({
          token,
          user: response.data.data
        })
      )
      .catch(() => {
        setAuthToken(null);
        setError(
          'Google sign-in was not completed. Please try again or use your email and password.'
        );
      })
      .finally(() => setSubmitting(false));
  }, [onAuthenticated]);

  /*
   * Login
   */
  const handleSubmit = async (event) => {
    event.preventDefault();

    setSubmitting(true);
    setError('');

    try {
      const response = await apiClient.post('/auth/login', {
        ...credentials,
        device_name: 'clinical-ledger-web'
      });

      console.log(response.data.data);
      onAuthenticated(response.data.data);
    } catch (requestError) {
      setError(
        requestError?.message ||
          'Unable to sign in. Check your credentials and API connection.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  /*
   * Google login
   */
  const handleGoogleSignIn = () => {
    const apiBase = String(
      apiClient.defaults.baseURL || '/api'
    ).replace(/\/$/, '');

    window.location.assign(
      `${apiBase}/auth/google/redirect`
    );
  };

  return (
    <main className="login-page">

      {/* Background decoration */}
      <div className="login-bg-shape login-bg-shape-one" />
      <div className="login-bg-shape login-bg-shape-two" />

      <div className="login-container">

        {/* =================================================
            LOGIN CARD
        ================================================= */}

        <section className="login-card">

          {/* Brand */}
          <header className="login-card-header">

            <div className="login-logo">
              <img
                src="/assets/clinic-mark.svg"
                alt="Hospital Management System"
              />
            </div>

            <h1>
              Hospital
              <span>Management System</span>
            </h1>

            <p>
              Secure access to your healthcare workspace
            </p>

          </header>


          {/* =================================================
              LOGIN FORM
          ================================================= */}

          {(

            <form
              className="login-form"
              onSubmit={handleSubmit}
              noValidate
            >

              {/* Email */}
              <div className="login-field">

                <label htmlFor="email">
                  Email address
                </label>

                <div className="login-input-wrapper">

                  <Mail
                    className="login-input-icon"
                    size={17}
                  />

                  <input
                    id="email"
                    className="login-input"
                    type="email"
                    autoComplete="email"
                    placeholder="Enter your email"
                    value={credentials.email}
                    onChange={(event) =>
                      setCredentials({
                        ...credentials,
                        email: event.target.value
                      })
                    }
                    required
                  />

                </div>

              </div>


              {/* Password */}
              <div className="login-field">

                <label htmlFor="password">
                  Password
                </label>

                <div className="login-input-wrapper">

                  <Lock
                    className="login-input-icon"
                    size={17}
                  />

                  <input
                    id="password"
                    className="login-input login-password-input"
                    type={
                      passwordVisible
                        ? 'text'
                        : 'password'
                    }
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={credentials.password}
                    onChange={(event) =>
                      setCredentials({
                        ...credentials,
                        password: event.target.value
                      })
                    }
                    required
                  />

                  <button
                    className="login-password-toggle"
                    type="button"
                    aria-label={
                      passwordVisible
                        ? 'Hide password'
                        : 'Show password'
                    }
                    aria-pressed={passwordVisible}
                    onClick={() =>
                      setPasswordVisible(
                        (value) => !value
                      )
                    }
                  >
                    {passwordVisible ? (
                      <EyeOff size={17} />
                    ) : (
                      <Eye size={17} />
                    )}
                  </button>

                </div>

              </div>

              <Link className="login-forgot-link" to="/forgot-password">
                Forgot password?
              </Link>


              {error && (
                <div
                  className="login-error"
                  role="alert"
                >
                  {error}
                </div>
              )}


              {/* Submit */}
              <button
                className="login-primary-button"
                type="submit"
                disabled={submitting}
              >
                {submitting
                  ? 'Signing in…'
                  : 'Sign in to hospital system'}

                <span className="login-button-arrow">
                  →
                </span>
              </button>


              {/* Divider */}
              <div className="login-divider">
                <span>OR</span>
              </div>


              {/* Google */}
              <button
                className="login-google-button"
                type="button"
                disabled={submitting}
                onClick={handleGoogleSignIn}
              >
                <span className="google-icon">
                  G
                </span>

                Continue with Google
              </button>

            </form>

          )}


          {/* =================================================
              SECURITY
          ================================================= */}

          <div className="login-security">

            <ShieldCheck size={17} />

            <div>
              <strong>
                Secure & protected
              </strong>

              <span>
                Your healthcare access is protected.
              </span>
            </div>

          </div>


          {/* Footer */}
          <p className="login-copyright">
            © 2026 Hospital Management System.
            All rights reserved.
          </p>

        </section>

      </div>

    </main>
  );
}