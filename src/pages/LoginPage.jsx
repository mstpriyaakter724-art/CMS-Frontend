import { useEffect, useState } from 'react';
import { Eye, EyeOff, ShieldCheck, Mail, Lock } from 'lucide-react';
import {
  FieldError,
  FormErrorSummary,
  clearFieldError
} from '../components/FormFeedback.jsx';
import apiClient, { setAuthToken } from '../services/apiClient.js';
import '../LoginPage.css';

export default function LoginPage({ onAuthenticated }) {
  const [mode, setMode] = useState('login');

  const [credentials, setCredentials] = useState({
  email: 'admin@clinic.local',
  password: 'ChangeMe123!',
});


  const [registration, setRegistration] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    password_confirmation: ''
  });

  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
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
   * Registration field update
   */
  const updateRegistration = (field, value) => {
    setRegistration((current) => ({
      ...current,
      [field]: value
    }));

    setFieldErrors((current) =>
      clearFieldError(current, field)
    );
  };

  /*
   * Login
   */
  const handleSubmit = async (event) => {
    event.preventDefault();

    setSubmitting(true);
    setError('');
    setFieldErrors({});

    try {
      const response = await apiClient.post('/auth/login', {
        ...credentials,
        device_name: 'clinical-ledger-web'
      });

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
   * Patient registration
   */
  const handleRegistration = async (event) => {
    event.preventDefault();

    setSubmitting(true);
    setError('');
    setFieldErrors({});

    try {
      const response = await apiClient.post('/auth/register', {
        ...registration,
        device_name: 'clinical-ledger-web'
      });

      onAuthenticated(response.data.data);
    } catch (requestError) {
      const errors = requestError?.response?.data?.errors;

      if (errors) {
        setFieldErrors(errors);
      } else {
        setError(
          requestError?.message ||
            'Your account could not be created. Please try again.'
        );
      }
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

  /*
   * Switch login / registration
   */
  const switchMode = (newMode) => {
    setMode(newMode);
    setError('');
    setFieldErrors({});
    setPasswordVisible(false);
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
              MODE SWITCH
          ================================================= */}

          <div
            className="login-tabs"
            role="tablist"
            aria-label="Account access type"
          >

            <button
              type="button"
              role="tab"
              aria-selected={mode === 'login'}
              className={mode === 'login' ? 'active' : ''}
              onClick={() => switchMode('login')}
            >
              Sign in
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={mode === 'register'}
              className={mode === 'register' ? 'active' : ''}
              onClick={() => switchMode('register')}
            >
              Patient registration
            </button>

          </div>


          {/* =================================================
              LOGIN FORM
          ================================================= */}

          {mode === 'login' ? (

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


              {/* Error */}
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

          ) : (

            /* =================================================
               REGISTRATION FORM
            ================================================= */

            <form
              className="login-form registration-form"
              onSubmit={handleRegistration}
              noValidate
            >

              <FormErrorSummary
                errors={fieldErrors}
                labels={{
                  name: 'Full name',
                  email: 'Email address',
                  phone: 'Phone number',
                  password: 'Password'
                }}
              />


              {/* Name */}
              <div className="login-field">

                <label htmlFor="registration-name">
                  Full name
                </label>

                <input
                  id="registration-name"
                  className="login-input standalone-input"
                  value={registration.name}
                  onChange={(event) =>
                    updateRegistration(
                      'name',
                      event.target.value
                    )
                  }
                  autoComplete="name"
                  aria-invalid={Boolean(
                    fieldErrors.name
                  )}
                  placeholder="Enter your full name"
                  required
                />

                <FieldError
                  messages={fieldErrors.name}
                />

              </div>


              {/* Email */}
              <div className="login-field">

                <label htmlFor="registration-email">
                  Email address
                </label>

                <input
                  id="registration-email"
                  className="login-input standalone-input"
                  type="email"
                  value={registration.email}
                  onChange={(event) =>
                    updateRegistration(
                      'email',
                      event.target.value
                    )
                  }
                  autoComplete="email"
                  aria-invalid={Boolean(
                    fieldErrors.email
                  )}
                  placeholder="Enter your email"
                  required
                />

                <FieldError
                  messages={fieldErrors.email}
                />

              </div>


              {/* Phone */}
              <div className="login-field">

                <label htmlFor="registration-phone">
                  Phone number
                  <span className="optional">
                    Optional
                  </span>
                </label>

                <input
                  id="registration-phone"
                  className="login-input standalone-input"
                  value={registration.phone}
                  onChange={(event) =>
                    updateRegistration(
                      'phone',
                      event.target.value
                    )
                  }
                  autoComplete="tel"
                  aria-invalid={Boolean(
                    fieldErrors.phone
                  )}
                  placeholder="Enter your phone number"
                />

                <FieldError
                  messages={fieldErrors.phone}
                />

              </div>


              {/* Password */}
              <div className="login-field">

                <label htmlFor="registration-password">
                  Password
                </label>

                <div className="login-input-wrapper">

                  <Lock
                    className="login-input-icon"
                    size={17}
                  />

                  <input
                    id="registration-password"
                    className="login-input login-password-input"
                    type={
                      passwordVisible
                        ? 'text'
                        : 'password'
                    }
                    value={registration.password}
                    onChange={(event) =>
                      updateRegistration(
                        'password',
                        event.target.value
                      )
                    }
                    autoComplete="new-password"
                    aria-invalid={Boolean(
                      fieldErrors.password
                    )}
                    placeholder="Create a password"
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

                <FieldError
                  messages={fieldErrors.password}
                />

              </div>


              {/* Confirm password */}
              <div className="login-field">

                <label htmlFor="registration-password-confirmation">
                  Confirm password
                </label>

                <input
                  id="registration-password-confirmation"
                  className="login-input standalone-input"
                  type={
                    passwordVisible
                      ? 'text'
                      : 'password'
                  }
                  value={
                    registration.password_confirmation
                  }
                  onChange={(event) =>
                    updateRegistration(
                      'password_confirmation',
                      event.target.value
                    )
                  }
                  autoComplete="new-password"
                  aria-invalid={Boolean(
                    fieldErrors.password_confirmation
                  )}
                  placeholder="Confirm your password"
                  required
                />

                <FieldError
                  messages={
                    fieldErrors.password_confirmation
                  }
                />

              </div>


              {/* Error */}
              {error && (
                <div
                  className="login-error"
                  role="alert"
                >
                  {error}
                </div>
              )}


              {/* Register */}
              <button
                className="login-primary-button"
                type="submit"
                disabled={submitting}
              >
                {submitting
                  ? 'Creating account…'
                  : 'Create patient account'}

                <span className="login-button-arrow">
                  →
                </span>
              </button>


              <div className="login-divider">
                <span>OR</span>
              </div>


              <button
                className="login-google-button"
                type="button"
                disabled={submitting}
                onClick={handleGoogleSignIn}
              >
                <span className="google-icon">
                  G
                </span>

                Register with Google
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