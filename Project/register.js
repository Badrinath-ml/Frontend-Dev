const form = document.getElementById('registerForm');

async function validateForm(e) {
  e.preventDefault();
  clearErrors();
  
  const fName = document.getElementById('f_name').value.trim();
  const lName = document.getElementById('l_name').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const location = document.getElementById('location').value.trim();
  
  let isValid = true;

  // Validate first name
  if (!fName) {
    showError('f_name', 'First name is required');
    isValid = false;
  }

  // Validate last name
  if (!lName) {
    showError('l_name', 'Last name is required');
    isValid = false;
  }

  // Validate email
  if (!email) {
    showError('email', 'Email is required');
    isValid = false;
  } else if (!isValidEmail(email)) {
    showError('email', 'Enter a valid email');
    isValid = false;
  }

  // Validate password
  if (!password) {
    showError('password', 'Password is required');
    isValid = false;
  } else if (password.length < 6) {
    showError('password', 'Password must be at least 6 characters');
    isValid = false;
  }

  // Validate location
  if (!location) {
    showError('location', 'Location is required');
    isValid = false;
  }

  if (isValid) {
    const payload = {
      firstName: fName,
      lastName: lName,
      email: email,
      password: password,
      location: location
    };

    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Server returned status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Server Response:', data);

      alert('Registration successful!');
      form.reset();
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('An error occurred during submission. Please try again.');
    }
  }
}

function showError(fieldId, message) {
  const errorElement = document.getElementById(fieldId + '_error');
  if (errorElement) {
    errorElement.textContent = message;
    errorElement.style.color = 'red';
    errorElement.style.fontSize = '12px';
    errorElement.style.marginTop = '5px';
    errorElement.style.display = 'block';
  }
}

function clearErrors() {
  const errors = document.querySelectorAll('.error');
  errors.forEach(error => {
    error.textContent = '';
  });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

form.addEventListener('submit', validateForm);