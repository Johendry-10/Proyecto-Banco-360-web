const form = document.getElementById('loginForm');
const emailInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const emailError = document.getElementById('email-error');
const passwordError = document.getElementById('password-error');
const generalError = document.getElementById('general-error');
const loadingOverlay = document.getElementById('loadingOverlay');
const btnLogin = document.getElementById('btnLogin');
const rememberMeCheckbox = document.getElementById('remember_me');

document.addEventListener('DOMContentLoaded', () => {
    let users = JSON.parse(localStorage.getItem('banca360_users')) || [];
    const adminExists = users.some(u => u.email === 'admin');
    
    if (!adminExists) {
        users.push({
            id: 1,
            username: 'Administrador',
            email: 'admin',
            password: 'admin',
            balance: 5000,
            transactions: []
        });
        localStorage.setItem('banca360_users', JSON.stringify(users));
    }

    const rememberedEmail = localStorage.getItem('banca360_remembered');
    if (rememberedEmail) {
        emailInput.value = rememberedEmail;
        rememberMeCheckbox.checked = true;
    }
});

window.togglePasswordVisibility = function(inputId, iconElement) {
    const input = document.getElementById(inputId);
    if (input.type === "password") {
        input.type = "text";
        iconElement.textContent = "visibility_off"; 
    } else {
        input.type = "password";
        iconElement.textContent = "visibility";
    }
};

function clearError(inputElement, errorElement) {
    inputElement.classList.remove('input-error');
    if (errorElement) {
        errorElement.style.display = 'none';
        errorElement.textContent = '';
    }
    generalError.style.display = 'none';
}

emailInput.addEventListener('input', () => clearError(emailInput, emailError));
passwordInput.addEventListener('input', () => clearError(passwordInput, passwordError));

form.addEventListener('submit', function(e) {
    e.preventDefault();

    clearError(emailInput, emailError);
    clearError(passwordInput, passwordError);

    const email = emailInput.value.trim();
    const password = passwordInput.value;
    let hasError = false;

    if (!email) {
        emailError.textContent = "Ingresa tu correo.";
        emailError.style.display = 'block';
        emailInput.classList.add('input-error');
        hasError = true;
    }

    if (!password) {
        passwordError.textContent = "Ingresa tu contraseña.";
        passwordError.style.display = 'block';
        passwordInput.classList.add('input-error');
        hasError = true;
    }

    if (hasError) return;

    let users = JSON.parse(localStorage.getItem('banca360_users')) || [];
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
        generalError.textContent = "Credenciales incorrectas o usuario no registrado.";
        generalError.style.display = 'block';
        return;
    }

    if (rememberMeCheckbox.checked) {
        localStorage.setItem('banca360_remembered', email);
    } else {
        localStorage.removeItem('banca360_remembered');
    }

    btnLogin.style.display = 'none';
    loadingOverlay.style.display = 'block';

    setTimeout(() => {
        localStorage.setItem('banca360_active_user', JSON.stringify(user));
        window.location.href = "pages/dashboard.html";
    }, 2000);
});