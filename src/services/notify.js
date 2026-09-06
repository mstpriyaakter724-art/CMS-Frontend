// Final clinical workspace feedback: translate API outcomes into concise, non-technical prompts.
import Swal from 'sweetalert2';

const cleanMessage = (error, fallback) => {
  const message = error?.response?.data?.message || error?.message || fallback;
  return /sqlstate|stack trace|exception|axioserror/i.test(message) ? fallback : message;
};

export const notify = {
  success: (title, text = '') => Swal.fire({ icon: 'success', title, text, timer: 1800, showConfirmButton: false, timerProgressBar: true }),
  error: (error, fallback = 'Unable to complete this action. Please try again.') => Swal.fire({ icon: 'error', title: 'Action could not be completed', text: cleanMessage(error, fallback), confirmButtonText: 'Review and try again' }),
  warning: (title, text) => Swal.fire({ icon: 'warning', title, text, confirmButtonText: 'Understood' }),
  // Pass every SweetAlert2 option through untouched (title/text/confirmButtonText/icon
  // kept as named defaults for the common case). Callers that need a text/textarea
  // input — e.g. "Reject this sample?" asking for a rejection reason — pass `input`
  // and `inputPlaceholder`, which previously never reached Swal.fire and silently
  // rendered a plain OK/Cancel dialog with no way to type a reason.
  confirm: ({ title, text, confirmButtonText = 'Continue', icon = 'warning', input, inputValidator, inputErrorMessage = 'Please enter a rejection reason.', ...rest }) => Swal.fire({
    icon,
    title,
    text,
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText: 'Cancel',
    reverseButtons: true,
    input,
    // When an input is requested, require a non-empty value by default so an
    // empty rejection reason can never be submitted; callers can still override.
    inputValidator: inputValidator || (input ? (value) => (!value || !value.trim() ? inputErrorMessage : undefined) : undefined),
    ...rest,
  }),
};

export { cleanMessage };
