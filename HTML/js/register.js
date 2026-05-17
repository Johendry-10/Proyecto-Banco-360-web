const form = document.getElementById('registerForm');
const usernameInput = document.getElementById('reg-username');
const emailInput = document.getElementById('reg-email');
const passwordInput = document.getElementById('reg-password');
const confirmPasswordInput = document.getElementById('reg-confirm-password');

const cedulaInput = document.getElementById('reg-cedula');
const telefonoInput = document.getElementById('reg-telefono');

const emailError = document.getElementById('email-error');
const passwordError = document.getElementById('password-error');
const confirmPasswordError = document.getElementById('confirm-password-error');
const cedulaError = document.getElementById('cedula-error');
const telefonoError = document.getElementById('telefono-error');
const generalError = document.getElementById('general-error');

const step1 = document.getElementById('step-1');
const step2 = document.getElementById('step-2');
const btnNext = document.getElementById('btnNext');
const btnBack = document.getElementById('btnBack');

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

usernameInput.addEventListener('input', () => clearError(usernameInput, null));
emailInput.addEventListener('input', () => clearError(emailInput, emailError));
passwordInput.addEventListener('input', () => clearError(passwordInput, passwordError));
confirmPasswordInput.addEventListener('input', () => clearError(confirmPasswordInput, confirmPasswordError));
cedulaInput.addEventListener('input', () => clearError(cedulaInput, cedulaError));
telefonoInput.addEventListener('input', () => clearError(telefonoInput, telefonoError));

btnNext.addEventListener('click', function() {
    clearError(usernameInput, null);
    clearError(emailInput, emailError);
    clearError(passwordInput, passwordError);
    clearError(confirmPasswordInput, confirmPasswordError);

    const username = usernameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    if (!username || !email || !password || !confirmPassword) {
        generalError.textContent = "Por favor, completa todos los campos.";
        generalError.style.display = 'block';
        
        if (!username) usernameInput.classList.add('input-error');
        if (!email) emailInput.classList.add('input-error');
        if (!password) passwordInput.classList.add('input-error');
        if (!confirmPassword) confirmPasswordInput.classList.add('input-error');
        
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        emailError.textContent = "Por favor, ingresa un correo electrónico válido.";
        emailError.style.display = 'block';
        emailInput.classList.add('input-error');
        return;
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>]).{6,}$/;
    if (!passwordRegex.test(password)) {
        passwordError.textContent = "La contraseña debe tener al menos 6 caracteres, una mayúscula, un número y un carácter especial.";
        passwordError.style.display = 'block';
        passwordInput.classList.add('input-error');
        return;
    }

    if (password !== confirmPassword) {
        confirmPasswordError.textContent = "Las contraseñas no coinciden.";
        confirmPasswordError.style.display = 'block';
        confirmPasswordInput.classList.add('input-error');
        return;
    }

    let users = JSON.parse(localStorage.getItem('banca360_users')) || [];
    const userExists = users.some(u => u.username === username || u.email === email);

    if (userExists) {
        generalError.textContent = "El usuario o correo ya está registrado.";
        generalError.style.display = 'block';
        
        if (users.some(u => u.username === username)) usernameInput.classList.add('input-error');
        if (users.some(u => u.email === email)) emailInput.classList.add('input-error');
        
        return;
    }

    step1.style.display = 'none';
    step2.style.display = 'block';
});

btnBack.addEventListener('click', function() {
    step2.style.display = 'none';
    step1.style.display = 'block';
    clearError(cedulaInput, cedulaError);
    clearError(telefonoInput, telefonoError);
});

form.addEventListener('submit', function(e) {
    e.preventDefault();

    clearError(cedulaInput, cedulaError);
    clearError(telefonoInput, telefonoError);

    const cedula = cedulaInput.value.trim();
    const telefono = telefonoInput.value.trim();
    let isValid = true;

    if (!cedula) {
        cedulaError.textContent = "Por favor, ingresa tu cédula.";
        cedulaError.style.display = 'block';
        cedulaInput.classList.add('input-error');
        isValid = false;
    } else if (!/^[VEve]-\d{7,8}$/.test(cedula)) {
        cedulaError.textContent = "Formato inválido. Usa V- o E- seguido de 7 o 8 números.";
        cedulaError.style.display = 'block';
        cedulaInput.classList.add('input-error');
        isValid = false;
    }

    if (!telefono) {
        telefonoError.textContent = "Por favor, ingresa tu teléfono.";
        telefonoError.style.display = 'block';
        telefonoInput.classList.add('input-error');
        isValid = false;
    } else if (!/^0\d{10}$/.test(telefono)) {
        telefonoError.textContent = "Debe ser un número válido de 11 dígitos (Ej: 04141234567).";
        telefonoError.style.display = 'block';
        telefonoInput.classList.add('input-error');
        isValid = false;
    }

    if (!isValid) return;

    const username = usernameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    let users = JSON.parse(localStorage.getItem('banca360_users')) || [];

    const newUser = {
        id: Date.now(),
        username: username,
        email: email,
        password: password,
        cedula: cedula.toUpperCase(),
        telefono: telefono,
        balance: 0,
        transactions: []
    };

    users.push(newUser);
    localStorage.setItem('banca360_users', JSON.stringify(users));

    window.location.href = "preguntas-seguridad.html";
});