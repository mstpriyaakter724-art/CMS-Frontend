import axios from 'axios';

// Clinical Ledger: a JavaScript-only Axios client for the separate Laravel 12 REST API.
import { cleanMessage, notify } from './notify.js';

const configuredApiBase = String(import.meta.env.VITE_API_BASE_URL || '').trim();
const localBrowserHost = typeof window !== 'undefined' && /^(localhost|127(?:\\.\\d{1,3}){3}|::1)$/i.test(window.location.hostname);
const apiBaseUrl = configuredApiBase || '/api';

const apiClient = axios.create({
  // Windows local .env: VITE_API_BASE_URL=http://127.0.0.1:8000/api.
  // Managed preview stays same-origin so its Vite server can proxy /api to Laravel.
  baseURL: apiBaseUrl,
  headers: {
    Accept: 'application/json',
  },
  withCredentials: false,
});

export function setAuthToken(token) {
  if (token) {
    apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
    return;
  }

  delete apiClient.defaults.headers.common.Authorization;
}

let unauthorizedHandler = null;

export function setUnauthorizedHandler(handler) {
  unauthorizedHandler = handler;
  return () => { if (unauthorizedHandler === handler) unauthorizedHandler = null; };
}

apiClient.interceptors.response.use(
  (response) => {
    const method = response.config?.method?.toLowerCase();
    const path = response.config?.url || '';
    if (['post', 'put', 'patch', 'delete'].includes(method) && !path.startsWith('/auth/') && response.data?.success && response.data?.message) notify.success('Saved successfully', response.data.message);
    return response;
  },
  (error) => {
    const status = error?.response?.status;
    const rawMessage = error?.response?.data?.message || error?.message;
    const technical = /sqlstate|exception|stack trace|axioserror|internal server error/i.test(rawMessage || '');

    // Centralized error-normalization layer: every consumer (forms, pages) reads
    // error.errors for field-level messages and error.message for a human summary.
    // response.data.errors is Laravel's per-field validation payload (422) or a
    // free-form `errors` payload from ApiResponse::error() (e.g. sample workflow
    // ValidationException re-throws) — always expose it, regardless of status,
    // so callers such as `setErrors(error?.errors || ...)` keep working unchanged.
    const backendErrors = error?.response?.data?.errors || null;
    error.errors = backendErrors;

    // Prefer the doctor/patient-facing message the backend actually computed
    // (e.g. "The selected doctor is not available at this time.") over a generic
    // string — only fall back to a generic message when the backend gave us
    // nothing usable or something clearly technical.
    const firstFieldMessage = backendErrors && typeof backendErrors === 'object'
      ? Object.values(backendErrors).flat().find((message) => typeof message === 'string' && message.trim())
      : null;
    const usefulBackendMessage = !technical && typeof rawMessage === 'string' && rawMessage.trim() && rawMessage !== 'The submitted data is invalid.'
      ? rawMessage
      : null;

    if (status === 401) { unauthorizedHandler?.(); error.message = 'Your secure session has expired. Please sign in again.'; notify.warning('Session expired', error.message); }
    else if (status === 422) error.message = firstFieldMessage || usefulBackendMessage || 'Please correct the highlighted fields.';
    else if (status === 403) error.message = usefulBackendMessage || 'You do not have permission to perform this action.';
    else if (status === 404) error.message = usefulBackendMessage || 'The requested record could not be found.';
    else if (status === 409) error.message = usefulBackendMessage || firstFieldMessage || 'This action conflicts with the current state of this record. Please refresh and try again.';
    else if (!error?.response) { error.message = 'Unable to connect to the server. Please check your connection and try again.'; notify.error(error, error.message); }
    else if (status >= 500 || technical) { error.message = 'Something went wrong while processing your request. Please try again.'; notify.error(error, error.message); }
    else error.message = cleanMessage(error, 'Unable to complete this action. Please try again.');
    return Promise.reject(error);
  },
);

export default apiClient;
