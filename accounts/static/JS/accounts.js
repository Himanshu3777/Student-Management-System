/* ============================================================
   ACCOUNTS.JS — Login, Register, Profile (Simple)
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  // ───────── HELPER ─────────
  function showAlert(message, type = 'error') {
    const alertBox = document.getElementById('alert');
    if (!alertBox) return;
    alertBox.className = 'alert alert-' + type + ' show';
    alertBox.textContent = message;
    alertBox.style.display = 'flex';
  }


  /* ═══════════════════════════════════════════════════════════
     LOGIN
     ═══════════════════════════════════════════════════════════ */
  const loginForm = document.getElementById('loginForm');

  if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;

      if (!email || !password) {
        return showAlert('Please fill in all fields.');
      }
      if (!email.includes('@') || !email.includes('.')) {
        return showAlert('Please enter a valid email address.');
      }
      if (password.length < 6) {
        return showAlert('Password must be at least 6 characters.');
      }

      const formData = new FormData(loginForm);

      fetch("/accounts/login/", {
        method: "POST",
        headers: {
          "X-CSRFToken": document.querySelector('[name=csrfmiddlewaretoken]').value
        },
        body: formData
      })
      .then(res => res.json())
      .then(data => {
        if (data.success === true) {
          window.location.href = data.redirect;
        } else {
          showAlert(data.message || 'Login failed.');
        }
      })
      .catch(error => {
        console.log('Error:', error);
        showAlert('Something went wrong.');
      });
    });
  }


  /* ═══════════════════════════════════════════════════════════
     REGISTER
     ═══════════════════════════════════════════════════════════ */
  const registerForm = document.getElementById('registerForm');

  if (registerForm) {
    registerForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const fn = document.getElementById('firstName').value.trim();
      const ln = document.getElementById('lastName').value.trim();
      const email = document.getElementById('email').value.trim();
      const pwd = document.getElementById('password').value;
      const cpwd = document.getElementById('confirmPassword').value;

      if (!fn || !ln || !email || !pwd || !cpwd) {
        return showAlert('Please fill in all required fields.');
      }
      if (!email.includes('@') || !email.includes('.')) {
        return showAlert('Please enter a valid email address.');
      }
      if (pwd.length < 6) {
        return showAlert('Password must be at least 6 characters.');
      }
      if (pwd !== cpwd) {
        return showAlert('Passwords do not match.');
      }

      const formData = new FormData(registerForm);

      fetch("/accounts/register/", {
        method: "POST",
        headers: {
          "X-CSRFToken": document.querySelector('[name=csrfmiddlewaretoken]').value
        },
        body: formData
      })
      .then(res => res.json())
      .then(data => {
        if (data.success === true) {
          showAlert(data.message, 'success');
          registerForm.reset();
          setTimeout(() => {
            window.location.href = data.redirect;
          }, 1000);
        } else {
          showAlert(data.message || 'Registration failed.');
        }
      })
      .catch(error => {
        console.log('Error:', error);
        showAlert('Something went wrong.');
      });
    });
  }

});