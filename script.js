document.addEventListener('DOMContentLoaded', () => {
    // Login Form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const matric = document.getElementById('matric').value;

            fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, matric })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    window.location.href = 'petition.html';
                } else {
                    alert('Login failed. Please check your credentials.');
                }
            })
            .catch(() => alert('Error connecting to server.'));
        });
    }

    // Signup Form
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const matric = document.getElementById('matric').value;

            fetch('/api/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, matric })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    window.location.href = 'index.html';
                } else {
                    alert('Signup failed. Matric number might already be in use.');
                }
            })
            .catch(() => alert('Error connecting to server.'));
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
                    alert('Thank you for signing the petition!');
                    termsCheckbox.checked = false;
                    signBtn.disabled = true;
                } else {
                    alert('Error signing the petition.');
                }
            })
            .catch(() => alert('Error connecting to server.'));
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