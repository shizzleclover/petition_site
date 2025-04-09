document.addEventListener('DOMContentLoaded', () => {
    // Function to show messages
    const showMessage = (elementId, message, type) => {
        const messageElement = document.getElementById(elementId);
        if (messageElement) {
            messageElement.textContent = message;
            messageElement.className = `message ${type} show`;
        }
    };

    // Login Form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const matric = document.getElementById('matric').value;
            const password = document.getElementById('password').value;

            fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ matric, password })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showMessage('login-message', 'Login successful! Redirecting...', 'success');
                    setTimeout(() => {
                        window.location.href = 'petition.html';
                    }, 1500);
                } else {
                    showMessage('login-message', 'Login failed. Please check your credentials.', 'error');
                }
            })
            .catch(() => {
                showMessage('login-message', 'Error connecting to server.', 'error');
            });
        });
    }

    // Signup Form
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const matric = document.getElementById('matric').value;
            const password = document.getElementById('password').value;

            fetch('/api/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, matric, password })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showMessage('signup-message', 'Signup successful! Redirecting to login...', 'success');
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 1500);
                } else {
                    showMessage('signup-message', 'Signup failed. Matric number might already be in use.', 'error');
                }
            })
            .catch(() => {
                showMessage('signup-message', 'Error connecting to server.', 'error');
            });
        });
    }

    // Petition Form
    const petitionForm = document.getElementById('petition-form');
    const termsCheckbox = document.getElementById('terms');
    const signBtn = document.getElementById('sign-btn');

    if (petitionForm) {
        termsCheckbox.addEventListener('change', () => {
            signBtn.disabled = !termsCheckbox.checked;
        });

        petitionForm.addEventListener('submit', (e) => {
            e.preventDefault();

            fetch('/api/sign-petition', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ agreed: termsCheckbox.checked })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showMessage('petition-message', 'Petition Signed Successfully!', 'success');
                    termsCheckbox.checked = false;
                    signBtn.disabled = true;
                } else {
                    showMessage('petition-message', 'Error signing the petition.', 'error');
                }
            })
            .catch(() => {
                showMessage('petition-message', 'Error connecting to server.', 'error');
            });
        });
    }

    // Accordion Logic
    const accordionBtn = document.querySelector('.accordion-btn');
    const accordionContent = document.querySelector('.accordion-content');

    if (accordionBtn) {
        accordionBtn.addEventListener('click', () => {
            accordionContent.classList.toggle('active');
        });
    }
});

// Password Toggle Function
function togglePassword(inputId, toggleElement) {
    const input = document.getElementById(inputId);
    const icon = toggleElement.querySelector('i');
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}