document.addEventListener('DOMContentLoaded', () => {
    // Check authentication for petition page
    if (window.location.pathname.includes('petition.html')) {
        const token = localStorage.getItem('authToken');
        if (!token) {
            window.location.href = 'index.html';
            return;
        }
    }
    const BASE_URL = 'https://victor-petition.onrender.com';
    
    // Token management
    const setToken = (token) => {
        localStorage.setItem('authToken', token);
    };

    const getToken = () => {
        return localStorage.getItem('authToken');
    };

    const clearToken = () => {
        localStorage.removeItem('authToken');
    };

    const showMessage = (elementId, message, type) => {
        const messageElement = document.getElementById(elementId);
        if (messageElement) {
            messageElement.textContent = message;
            messageElement.className = `message ${type} show`;
        }
    };

    const hideMessage = (elementId) => {
        const messageElement = document.getElementById(elementId);
        if (messageElement) {
            messageElement.className = 'message';
        }
    };

    const toggleSpinner = (buttonId, show) => {
        const button = document.getElementById(buttonId);
        const spinner = button.querySelector('.spinner');
        const btnText = button.querySelector('.btn-text');
        if (show) {
            spinner.classList.remove('hidden');
            btnText.classList.add('hidden');
            button.disabled = true;
        } else {
            spinner.classList.add('hidden');
            btnText.classList.remove('hidden');
            button.disabled = false;
        }
    };

    // Login Form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            toggleSpinner('login-btn', true);

            const matricNo = document.getElementById('matric').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch(`${BASE_URL}/api/auth/login `, {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({ matricNo, password })
                });

                const data = await response.json();
                if (response.ok && data.success) {
                    if (data.token) {
                        setToken(data.token);
                    }
                    showMessage('login-message', 'Login successful! Redirecting...', 'success');
                    setTimeout(() => {
                        window.location.href = 'petition.html';
                    }, 1500);
                } else {
                    showMessage('login-message', data.message || 'Login failed. Please check your credentials.', 'error');
                }
            } catch (error) {
                console.error('Login error:', error);
                showMessage('login-message', 'Error connecting to server. Please try again later.', 'error');
            } finally {
                toggleSpinner('login-btn', false);
            }
        });
    }

    // Signup Form
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            toggleSpinner('signup-btn', true);

            const name = document.getElementById('name').value;
            const matricNo = document.getElementById('matric').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch(`${BASE_URL} /api/auth/signup`, {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({ name, matricNo, password })
                });

                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.message || 'Signup failed');
                }
                if (data.success) {
                    if (data.token) {
                        setToken(data.token);
                        showMessage('signup-message', 'Signup successful! Redirecting to petition page...', 'success');
                        setTimeout(() => {
                            window.location.href = 'petition.html';
                        }, 1500);
                    } else {
                        showMessage('signup-message', 'Signup successful! Please login.', 'success');
                        setTimeout(() => {
                            window.location.href = 'index.html';
                        }, 1500);
                    }
                } else {
                    toggleSpinner('signup-btn', false);
                    showMessage('signup-message', data.message || 'Signup failed. Matric number might already be in use.', 'error');
                }
            } catch (error) {
                console.error('Signup error:', error);
                showMessage('signup-message', 'Error connecting to server. Please try again later.', 'error');
            } finally {
                toggleSpinner('signup-btn', false);
            }
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

        petitionForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            toggleSpinner('sign-btn', true);

            try {
                const token = getToken();
                if (!token) {
                    showMessage('petition-message', 'Please login to sign the petition.', 'error');
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 1500);
                    return;
                }

                const response = await fetch(`${BASE_URL}/sign`, {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({ agreed: termsCheckbox.checked })
                });

                const data = await response.json();
                if (response.ok && data.success) {
                    showMessage('petition-message', 'Petition Signed Successfully!', 'success');
                    termsCheckbox.checked = false;
                    signBtn.disabled = true;
                } else {
                    showMessage('petition-message', data.message || 'Error signing the petition.', 'error');
                }
            } catch (error) {
                console.error('Petition sign error:', error);
                showMessage('petition-message', 'Error connecting to server. Please try again later.', 'error');
            } finally {
                toggleSpinner('sign-btn', false);
            }
        });
    }

    // Accordion Logic
    const accordionBtn = document.querySelector('.accordion-btn');
    const accordionContent = document.querySelector('.accordion-content');

    if (accordionBtn && accordionContent) {
        accordionBtn.addEventListener('click', () => {
            accordionContent.classList.toggle('active');
        });
    }

});


function togglePassword(inputId, toggleElement) {
    const input = document.getElementById(inputId);
    const icon = toggleElement.querySelector('i');
    if (input && icon) {
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
}