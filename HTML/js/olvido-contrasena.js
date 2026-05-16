const stepUser = document.getElementById('step-user');
const stepQuestions = document.getElementById('step-questions');
const stepNewPassword = document.getElementById('step-new-password');
const form = document.getElementById('recoveryForm');
const emailInput = document.getElementById('email');
const generalError = document.getElementById('general-error');
const loadingOverlay = document.getElementById('loading');
const flowTitle = document.getElementById('flow-title');
const btnSearchUser = document.getElementById('btn-search-user');
const btnVerifyAnswers = document.getElementById('btn-verify-answers');

let foundUser = null;
let userIndexInStorage = -1;

function clearErrors() {
    generalError.style.display = 'none';
    generalError.classList.remove('success-text');
    generalError.classList.add('error-text'); 
    document.querySelectorAll('.form-control').forEach(input => input.classList.remove('input-error'));
}

window.togglePass = function(id, iconElement) {
    const input = document.getElementById(id);
    if (input.type === 'password') {
        input.type = 'text';
        iconElement.textContent = 'visibility_off';
    } else {
        input.type = 'password';
        iconElement.textContent = 'visibility';
    }
};

btnSearchUser.addEventListener('click', () => {
    clearErrors();
    const emailVal = emailInput.value.trim();

    if (!emailVal) {
        emailInput.classList.add('input-error');
        generalError.textContent = "Por favor, ingresa tu correo electrónico.";
        generalError.style.display = 'block';
        return;
    }

    const users = JSON.parse(localStorage.getItem('banca360_users')) || [];
    
    userIndexInStorage = users.findIndex(u => u.email === emailVal);

    if (userIndexInStorage === -1) {
        generalError.textContent = "El correo ingresado no se encuentra registrado.";
        generalError.style.display = 'block';
        return;
    }

    foundUser = users[userIndexInStorage];

    if (!foundUser.securityQuestions || foundUser.securityQuestions.length < 3) {
        generalError.textContent = "Este usuario no tiene configuradas preguntas de seguridad.";
        generalError.style.display = 'block';
        return;
    }

    document.getElementById('lbl-q1').textContent = foundUser.securityQuestions[0].question;
    document.getElementById('lbl-q2').textContent = foundUser.securityQuestions[1].question;
    document.getElementById('lbl-q3').textContent = foundUser.securityQuestions[2].question;

    stepUser.style.display = 'none';
    stepQuestions.style.display = 'block';
    flowTitle.textContent = "Verificación de Seguridad";
});

btnVerifyAnswers.addEventListener('click', () => {
    clearErrors();

    const ans1 = document.getElementById('ans1');
    const ans2 = document.getElementById('ans2');
    const ans3 = document.getElementById('ans3');

    const valA1 = ans1.value.trim().toLowerCase();
    const valA2 = ans2.value.trim().toLowerCase();
    const valA3 = ans3.value.trim().toLowerCase();

    if (!valA1 || !valA2 || !valA3) {
        generalError.textContent = "Por favor, responde a todas las preguntas.";
        generalError.style.display = 'block';
        if (!valA1) ans1.classList.add('input-error');
        if (!valA2) ans2.classList.add('input-error');
        if (!valA3) ans3.classList.add('input-error');
        return;
    }

    stepQuestions.style.display = 'none';
    loadingOverlay.style.display = 'block';

    setTimeout(() => {
        loadingOverlay.style.display = 'none';

        const realAns1 = foundUser.securityQuestions[0].answer;
        const realAns2 = foundUser.securityQuestions[1].answer;
        const realAns3 = foundUser.securityQuestions[2].answer;

        if (valA1 === realAns1 && valA2 === realAns2 && valA3 === realAns3) {
            stepNewPassword.style.display = 'block';
            flowTitle.textContent = "Nueva Contraseña";
        } else {
            stepQuestions.style.display = 'block';
            generalError.textContent = "Las respuestas introducidas no coinciden con nuestros registros.";
            generalError.style.display = 'block';
        }
    }, 2000);
});

form.addEventListener('submit', (e) => {
    e.preventDefault();
    clearErrors();

    const newPasswordInput = document.getElementById('new-password');
    const confirmPasswordInput = document.getElementById('confirm-password');

    const newPass = newPasswordInput.value;
    const confirmPass = confirmPasswordInput.value;

    const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>]).{6,}$/;

    if (!passwordRegex.test(newPass)) {
        newPasswordInput.classList.add('input-error');
        generalError.textContent = "La contraseña debe tener al menos 6 caracteres, una mayúscula, un número y un carácter especial.";
        generalError.style.display = 'block';
        return;
    }

    if (newPass !== confirmPass) {
        confirmPasswordInput.classList.add('input-error');
        generalError.textContent = "Las contraseñas no coinciden.";
        generalError.style.display = 'block';
        return;
    }

    const users = JSON.parse(localStorage.getItem('banca360_users')) || [];
    users[userIndexInStorage].password = newPass;
    localStorage.setItem('banca360_users', JSON.stringify(users));

    stepNewPassword.style.display = 'none';
    flowTitle.textContent = "¡Éxito!";
    generalError.classList.remove('error-text');
    generalError.classList.add('success-text'); 
    generalError.textContent = "Tu contraseña ha sido restablecida con éxito. Espere un momento...";
    generalError.style.display = 'block';

    setTimeout(() => {
        window.location.href = "../index.html";
    }, 2000);
});