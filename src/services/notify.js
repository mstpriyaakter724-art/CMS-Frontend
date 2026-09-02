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
  confirm: ({ title, text, confirmButtonText = 'Continue', icon = 'warning' }) => Swal.fire({ icon, title, text, showCancelButton: true, confirmButtonText, cancelButtonText: 'Cancel', reverseButtons: true }),
};

export { cleanMessage };
