// Week 4: JavaScript validates the fields of the student registration page.

const form = document.getElementById('registerForm');

function showError(fieldId, message) {
  const errorElement = document.getElementById(fieldId + '_error');
  if (errorElement) errorElement.textContent = message;
}

function clearErrors() {
  document.querySelectorAll('.error').forEach((error) => {
    error.textContent = '';
  });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  clearErrors();

  const fName = document.getElementById('f_name').value.trim();
  const lName = document.getElementById('l_name').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const location = document.getElementById('location').value.trim();
  const terms = document.getElementById('terms').checked;

  let valid = true;

  if (!fName) { showError('f_name', 'First name is required.'); valid = false; }
  if (!lName) { showError('l_name', 'Last name is required.'); valid = false; }

  if (!email) {
    showError('email', 'Email is required.');
    valid = false;
  } else if (!isValidEmail(email)) {
    showError('email', 'Enter a valid email.');
    valid = false;
  }

  if (password.length < 6) {
    showError('password', 'Password must be at least 6 characters.');
    valid = false;
  }

  if (!location) {
    showError('location', 'Location is required.');
    valid = false;
  }

  if (!terms) {
    showError('terms', 'Please accept the terms.');
    valid = false;
  }

  if (valid) {
    document.getElementById('register-message').textContent =
      'Registration details are valid. Form is ready to submit.';
    form.reset();
  }
});