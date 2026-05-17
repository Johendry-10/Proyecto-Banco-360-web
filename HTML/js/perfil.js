// js/perfil.js

const currentUser = JSON.parse(localStorage.getItem('banca360_active_user'));

if (!currentUser) {
    window.location.href = '../index.html';
}

document.addEventListener('DOMContentLoaded', () => {
    if (!currentUser) return;

    // 1. MODO OSCURO
    const themeBtnProfile = document.getElementById('toggle-theme-profile');
    
    function aplicarTema(tema) {
        if (tema === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            document.body.setAttribute('data-theme', 'dark');
            if (themeBtnProfile) {
                themeBtnProfile.innerHTML = '<span class="material-symbols-outlined">light_mode</span> Modo Claro';
            }
        } else {
            document.documentElement.removeAttribute('data-theme');
            document.body.removeAttribute('data-theme');
            if (themeBtnProfile) {
                themeBtnProfile.innerHTML = '<span class="material-symbols-outlined">dark_mode</span> Modo Oscuro';
            }
        }
    }

    const currentTheme = localStorage.getItem('banca360_theme') || 'light';
    aplicarTema(currentTheme);

    if (themeBtnProfile) {
        themeBtnProfile.addEventListener('click', () => {
            const nuevoTema = localStorage.getItem('banca360_theme') === 'dark' ? 'light' : 'dark';
            localStorage.setItem('banca360_theme', nuevoTema);
            aplicarTema(nuevoTema);
        });
    }

    // 2. CARGA DE DATOS AL PERFIL
    const perfilNombre = document.getElementById('perfil-nombre');
    const perfilCorreo = document.getElementById('perfil-correo');
    const perfilCedula = document.getElementById('perfil-cedula');
    const perfilTelefono = document.getElementById('perfil-telefono');
    const perfilPassword = document.getElementById('perfil-password');
    const perfilSaludo = document.getElementById('perfil-saludo');

    const nombreUsuario = currentUser.nombre || currentUser.username || currentUser.nombreCompleto || 'No definido';
    const correoUsuario = currentUser.correo || currentUser.email || 'No definido';
    const cedulaUsuario = currentUser.cedula || currentUser.id || 'No definido';
    const telefonoUsuario = currentUser.telefono || currentUser.phone || 'No definido';
    const passwordUsuario = currentUser.password || currentUser.contrasena || '';

    function asignarValor(elemento, valor) {
        if (!elemento) return;
        if (elemento.tagName === 'INPUT' || elemento.tagName === 'TEXTAREA') {
            elemento.value = valor;
        } else {
            elemento.textContent = valor;
        }
    }

    asignarValor(perfilNombre, nombreUsuario);
    asignarValor(perfilCorreo, correoUsuario);
    asignarValor(perfilCedula, cedulaUsuario);
    asignarValor(perfilTelefono, telefonoUsuario);
    asignarValor(perfilPassword, passwordUsuario);
    
    if (perfilSaludo) {
        perfilSaludo.textContent = `¡Hola, ${nombreUsuario.split(' ')[0]}!`;
    }

    // 3. MODALES DE EDICIÓN
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

    if (btnEditTelefono && modalTelefono) {
        btnEditTelefono.addEventListener('click', () => {
            if (inputNuevoTelefono) inputNuevoTelefono.value = telefonoUsuario !== 'No definido' ? telefonoUsuario : '';
            modalTelefono.style.display = 'flex';
        });
    }
    if (btnCancelTelefono && modalTelefono) {
        btnCancelTelefono.addEventListener('click', () => modalTelefono.style.display = 'none');
    }

    if (btnEditPassword && modalPassword) {
        btnEditPassword.addEventListener('click', () => {
            if (inputNuevaPassword) inputNuevaPassword.value = '';
            if (inputConfirmarPassword) inputConfirmarPassword.value = '';
            modalPassword.style.display = 'flex';
        });
    }
    if (btnCancelPassword && modalPassword) {
        btnCancelPassword.addEventListener('click', () => modalPassword.style.display = 'none');
    }

    if (btnConfirmTelefono) {
        btnConfirmTelefono.addEventListener('click', () => {
            const nuevoTel = inputNuevoTelefono ? inputNuevoTelefono.value.trim() : '';
            if (!nuevoTel) return;

            currentUser.telefono = nuevoTel;
            localStorage.setItem('banca360_active_user', JSON.stringify(currentUser));

            const usersList = JSON.parse(localStorage.getItem('banca360_users')) || [];
            const index = usersList.findIndex(u => (u.correo === correoUsuario || u.email === correoUsuario));
            if (index !== -1) {
                usersList[index].telefono = nuevoTel;
                localStorage.setItem('banca360_users', JSON.stringify(usersList));
            }

            asignarValor(perfilTelefono, nuevoTel);
            if (modalTelefono) modalTelefono.style.display = 'none';
        });
    }

    if (btnConfirmPassword) {
        btnConfirmPassword.addEventListener('click', () => {
            const nuevaPass = inputNuevaPassword ? inputNuevaPassword.value : '';
            const confirmaPass = inputConfirmarPassword ? inputConfirmarPassword.value : '';
            const errNueva = document.getElementById('modal-password-error');
            const errConfirma = document.getElementById('modal-confirm-password-error');

            if (errNueva) errNueva.style.display = 'none';
            if (errConfirma) errConfirma.style.display = 'none';

            if (!nuevaPass) {
                if (errNueva) { errNueva.textContent = 'La contraseña no puede estar vacía'; errNueva.style.display = 'block'; }
                return;
            }
            if (nuevaPass !== confirmaPass) {
                if (errConfirma) { errConfirma.textContent = 'Las contraseñas no coinciden'; errConfirma.style.display = 'block'; }
                return;
            }

            currentUser.password = nuevaPass;
            localStorage.setItem('banca360_active_user', JSON.stringify(currentUser));

            const usersList = JSON.parse(localStorage.getItem('banca360_users')) || [];
            const index = usersList.findIndex(u => (u.correo === correoUsuario || u.email === correoUsuario));
            if (index !== -1) {
                usersList[index].password = nuevaPass;
                localStorage.setItem('banca360_users', JSON.stringify(usersList));
            }

            asignarValor(perfilPassword, nuevaPass);
            if (modalPassword) modalPassword.style.display = 'none';
        });
    }

    const btnTogglePass = document.getElementById('toggle-password');
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

    // 4. RUTAS DEL MENÚ
    document.getElementById('nav-resumen')?.addEventListener('click', () => window.location.href = 'dashboard.html');
    document.getElementById('nav-historial')?.addEventListener('click', () => window.location.href = 'dashboard.html?view=historial');
    document.getElementById('nav-pagomovil')?.addEventListener('click', () => window.location.href = 'pagomovil.html');
    document.getElementById('nav-transferencia')?.addEventListener('click', () => window.location.href = 'transferencias.html');
    document.getElementById('nav-deposito')?.addEventListener('click', () => window.location.href = 'depositos.html');

    const logoutBtn = document.getElementById('nav-logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('banca360_active_user');
            window.location.href = '../index.html';
        });
    }

    // ==========================================================================
    // 5. EVENTOS DEL MENÚ HAMBURGUESA
    // ==========================================================================
    const menuToggleBtn = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebar-overlay');

    if (menuToggleBtn && sidebar && sidebarOverlay) {
        function toggleMenu() {
            sidebar.classList.toggle('active-mobile');
            sidebarOverlay.classList.toggle('active');
        }

        // Al tocar las tres rayas
        menuToggleBtn.addEventListener('click', toggleMenu);
        
        // Al tocar el fondo oscuro exterior
        sidebarOverlay.addEventListener('click', toggleMenu);

        // Si se elige una opción, cerrar menú automáticamente
        const navButtons = document.querySelectorAll('.nav-btn, .profile-btn');
        navButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                if (window.innerWidth <= 992) {
                    sidebar.classList.remove('active-mobile');
                    sidebarOverlay.classList.remove('active');
                }
            });
        });
    }
});

// Función global de modales
window.toggleModalPasswordVisibility = function(inputId, iconElement) {
    const input = document.getElementById(inputId);
    if (input) {
        if (input.type === "password") {
            input.type = "text";
            iconElement.textContent = "visibility_off";
        } else {
            input.type = "password";
            iconElement.textContent = "visibility";
        }
    }
};