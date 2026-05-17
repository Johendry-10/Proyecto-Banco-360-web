const currentUser = JSON.parse(localStorage.getItem('banca360_active_user'));

if (!currentUser) {
    window.location.href = '../index.html';
}

document.addEventListener('DOMContentLoaded', () => {
    if (!currentUser) return;

    // --- LÓGICA DE MODO OSCURO ---
    const currentTheme = localStorage.getItem('banca360_theme');
    const themeBtnProfile = document.getElementById('toggle-theme-profile');
    
    if (currentTheme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
        if (themeBtnProfile) {
            themeBtnProfile.innerHTML = '<span class="material-symbols-outlined">light_mode</span> Modo Claro';
        }
    }

    if (themeBtnProfile) {
        themeBtnProfile.addEventListener('click', () => {
            const isDark = document.body.getAttribute('data-theme') === 'dark';
            if (isDark) {
                document.body.removeAttribute('data-theme');
                localStorage.setItem('banca360_theme', 'light');
                themeBtnProfile.innerHTML = '<span class="material-symbols-outlined">dark_mode</span> Modo Oscuro';
            } else {
                document.body.setAttribute('data-theme', 'dark');
                localStorage.setItem('banca360_theme', 'dark');
                themeBtnProfile.innerHTML = '<span class="material-symbols-outlined">light_mode</span> Modo Claro';
            }
        });
    }
    // --- FIN LÓGICA DE MODO OSCURO ---

    const perfilNombre = document.getElementById('perfil-nombre');
    const perfilCorreo = document.getElementById('perfil-correo');
    const perfilCedula = document.getElementById('perfil-cedula');
    const perfilTelefono = document.getElementById('perfil-telefono');
    const perfilPassword = document.getElementById('perfil-password');
    const perfilSaludo = document.getElementById('perfil-saludo');

    const modalTelefono = document.getElementById('modal-edit-telefono');
    const modalPassword = document.getElementById('modal-edit-password');

    const btnEditTelefono = document.getElementById('btnEditTelefono');
    const btnEditPassword = document.getElementById('btnEditPassword');

    const btnCancelTelefono = document.getElementById('btnCancelTelefono');
    const btnConfirmTelefono = document.getElementById('btnConfirmTelefono');

    const btnCancelPassword = document.getElementById('btnCancelPassword');
    const btnConfirmPassword = document.getElementById('btnConfirmPassword');

    const inputNuevoTelefono = document.getElementById('modal-nuevo-telefono');
    const inputNuevaPassword = document.getElementById('modal-nueva-password');
    const inputConfirmarPassword = document.getElementById('modal-confirmar-password');

    const errorTelefono = document.getElementById('modal-telefono-error');
    const errorPassword = document.getElementById('modal-password-error');
    const errorConfirmPassword = document.getElementById('modal-confirm-password-error');

    if (perfilNombre) perfilNombre.value = currentUser.username || '';
    if (perfilCorreo) perfilCorreo.value = currentUser.email || '';
    if (perfilCedula) perfilCedula.value = currentUser.cedula || '';
    if (perfilTelefono) perfilTelefono.value = currentUser.telefono || '';
    if (perfilPassword) perfilPassword.value = currentUser.password || '';

    if (perfilSaludo && currentUser.username) {
        const primerNombre = currentUser.username.trim().split(' ')[0];
        perfilSaludo.textContent = `Hola, ${primerNombre}`;
    }

    function actualizarListaUsuarios(usuarioActualizado) {
        const listaUsuarios = JSON.parse(localStorage.getItem('banca360_users')) || [];
        const nuevaLista = listaUsuarios.map(u => {
            if (u.email === usuarioActualizado.email) {
                return { ...u, ...usuarioActualizado };
            }
            return u;
        });
        localStorage.setItem('banca360_users', JSON.stringify(nuevaLista));
    }

    function clearModalError(inputElement, errorElement) {
        inputElement.classList.remove('input-error');
        if (errorElement) {
            errorElement.style.display = 'none';
            errorElement.textContent = '';
        }
    }

    if (inputNuevoTelefono) {
        inputNuevoTelefono.addEventListener('input', () => clearModalError(inputNuevoTelefono, errorTelefono));
    }
    if (inputNuevaPassword) {
        inputNuevaPassword.addEventListener('input', () => clearModalError(inputNuevaPassword, errorPassword));
    }
    if (inputConfirmarPassword) {
        inputConfirmarPassword.addEventListener('input', () => clearModalError(inputConfirmarPassword, errorConfirmPassword));
    }

    if (btnEditTelefono) {
        btnEditTelefono.addEventListener('click', () => {
            inputNuevoTelefono.value = currentUser.telefono || '';
            clearModalError(inputNuevoTelefono, errorTelefono);
            modalTelefono.style.display = 'flex';
        });
    }

    if (btnCancelTelefono) {
        btnCancelTelefono.addEventListener('click', () => {
            modalTelefono.style.display = 'none';
        });
    }

    if (btnConfirmTelefono) {
        btnConfirmTelefono.addEventListener('click', () => {
            const nuevoTel = inputNuevoTelefono.value.trim();
            clearModalError(inputNuevoTelefono, errorTelefono);

            if (!nuevoTel) {
                errorTelefono.textContent = "Por favor, ingresa tu teléfono.";
                errorTelefono.style.display = 'block';
                inputNuevoTelefono.classList.add('input-error');
                return;
            } else if (!/^0\d{10}$/.test(nuevoTel)) {
                errorTelefono.textContent = "Debe ser un número válido de 11 dígitos (Ej: 04141234567).";
                errorTelefono.style.display = 'block';
                inputNuevoTelefono.classList.add('input-error');
                return;
            }

            currentUser.telefono = nuevoTel;
            localStorage.setItem('banca360_active_user', JSON.stringify(currentUser));
            actualizarListaUsuarios(currentUser);
            if (perfilTelefono) perfilTelefono.value = nuevoTel;
            modalTelefono.style.display = 'none';
        });
    }

    if (btnEditPassword) {
        btnEditPassword.addEventListener('click', () => {
            inputNuevaPassword.value = '';
            inputConfirmarPassword.value = '';
            
            inputNuevaPassword.type = 'password';
            inputConfirmarPassword.type = 'password';
            
            const icons = modalPassword.querySelectorAll('.toggle-pass-modal');
            icons.forEach(icon => icon.textContent = 'visibility');

            clearModalError(inputNuevaPassword, errorPassword);
            clearModalError(inputConfirmarPassword, errorConfirmPassword);
            
            modalPassword.style.display = 'flex';
        });
    }

    if (btnCancelPassword) {
        btnCancelPassword.addEventListener('click', () => {
            modalPassword.style.display = 'none';
        });
    }

    if (btnConfirmPassword) {
        btnConfirmPassword.addEventListener('click', () => {
            const nuevaPass = inputNuevaPassword.value;
            const confirmPass = inputConfirmarPassword.value;
            
            clearModalError(inputNuevaPassword, errorPassword);
            clearModalError(inputConfirmarPassword, errorConfirmPassword);

            if (!nuevaPass || !confirmPass) {
                if (!nuevaPass) {
                    errorPassword.textContent = "Por favor, ingresa una nueva contraseña.";
                    errorPassword.style.display = 'block';
                    inputNuevaPassword.classList.add('input-error');
                }
                if (!confirmPass) {
                    errorConfirmPassword.textContent = "Por favor, confirma tu nueva contraseña.";
                    errorConfirmPassword.style.display = 'block';
                    inputConfirmarPassword.classList.add('input-error');
                }
                return;
            }

            const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>]).{6,}$/;
            if (!passwordRegex.test(nuevaPass)) {
                errorPassword.textContent = "La contraseña debe tener al menos 6 caracteres, una mayúscula, un número y un carácter especial.";
                errorPassword.style.display = 'block';
                inputNuevaPassword.classList.add('input-error');
                return;
            }

            if (nuevaPass !== confirmPass) {
                errorConfirmPassword.textContent = "Las contraseñas no coinciden.";
                errorConfirmPassword.style.display = 'block';
                inputConfirmarPassword.classList.add('input-error');
                return;
            }

            currentUser.password = nuevaPass;
            localStorage.setItem('banca360_active_user', JSON.stringify(currentUser));
            actualizarListaUsuarios(currentUser);
            if (perfilPassword) perfilPassword.value = nuevaPass;
            modalPassword.style.display = 'none';
        });
    }

    const btnTogglePass = document.getElementById('btnTogglePassProfile');
    if (btnTogglePass && perfilPassword) {
        btnTogglePass.addEventListener('click', () => {
            if (perfilPassword.type === 'password') {
                perfilPassword.type = 'text';
                btnTogglePass.textContent = 'visibility_off';
            } else {
                perfilPassword.type = 'password';
                btnTogglePass.textContent = 'visibility';
            }
        });
    }

    const navResumen = document.getElementById('nav-resumen');
    const navHistorial = document.getElementById('nav-historial');
    const logoutBtn = document.getElementById('nav-logout');

    if (navResumen) {
        navResumen.addEventListener('click', () => {
            window.location.href = 'dashboard.html';
        });
    }

    if (navHistorial) {
        navHistorial.addEventListener('click', () => {
            window.location.href = 'dashboard.html';
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('banca360_active_user');
            window.location.href = '../index.html';
        });
    }
});

window.toggleModalPasswordVisibility = function(inputId, iconElement) {
    const input = document.getElementById(inputId);
    if (input.type === "password") {
        input.type = "text";
        iconElement.textContent = "visibility_off"; 
    } else {
        input.type = "password";
        iconElement.textContent = "visibility";
    }
};