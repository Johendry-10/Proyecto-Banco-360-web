const form = document.getElementById('securityForm');
const q1 = document.getElementById('q1');
const q2 = document.getElementById('q2');
const q3 = document.getElementById('q3');
const a1 = document.getElementById('a1');
const a2 = document.getElementById('a2');
const a3 = document.getElementById('a3');
const generalError = document.getElementById('general-error');

function clearError(inputElement) {
    inputElement.classList.remove('input-error');
    generalError.style.display = 'none';
}

q1.addEventListener('change', () => clearError(q1));
q2.addEventListener('change', () => clearError(q2));
q3.addEventListener('change', () => clearError(q3));
a1.addEventListener('input', () => clearError(a1));
a2.addEventListener('input', () => clearError(a2));
a3.addEventListener('input', () => clearError(a3));

form.addEventListener('submit', function(e) {
    e.preventDefault();

    clearError(q1);
    clearError(q2);
    clearError(q3);
    clearError(a1);
    clearError(a2);
    clearError(a3);

    const valQ1 = q1.value;
    const valQ2 = q2.value;
    const valQ3 = q3.value;
    const valA1 = a1.value.trim();
    const valA2 = a2.value.trim();
    const valA3 = a3.value.trim();

    if (!valQ1 || !valQ2 || !valQ3 || !valA1 || !valA2 || !valA3) {
        generalError.textContent = "Por favor, responde todas las preguntas de seguridad.";
        generalError.style.display = 'block';

        if (!valQ1) q1.classList.add('input-error');
        if (!valQ2) q2.classList.add('input-error');
        if (!valQ3) q3.classList.add('input-error');
        if (!valA1) a1.classList.add('input-error');
        if (!valA2) a2.classList.add('input-error');
        if (!valA3) a3.classList.add('input-error');

        return;
    }

    if (valQ1 === valQ2 || valQ1 === valQ3 || valQ2 === valQ3) {
        generalError.textContent = "Por favor, selecciona preguntas diferentes para cada opción.";
        generalError.style.display = 'block';
        return;
    }

    let users = JSON.parse(localStorage.getItem('banca360_users')) || [];
    if (users.length === 0) {
        generalError.textContent = "No se encontró ningún usuario en proceso de registro.";
        generalError.style.display = 'block';
        return;
    }

    let lastUser = users[users.length - 1];
    
    lastUser.securityQuestions = [
        { question: valQ1, answer: valA1.toLowerCase() },
        { question: valQ2, answer: valA2.toLowerCase() },
        { question: valQ3, answer: valA3.toLowerCase() }
    ];

    users[users.length - 1] = lastUser;
    localStorage.setItem('banca360_users', JSON.stringify(users));

    window.location.href = "../index.html";
});