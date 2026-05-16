/**
 * Módulo de Autenticación - Banca 360
 * Tecnologías: JavaScript Puro (Vanilla JS) 
 */

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const loadingOverlay = document.getElementById('loadingOverlay');
    const btnLogin = document.getElementById('btnLogin');

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            // Evitamos el envío real para simular validación [cite: 64]
            e.preventDefault();

            // Captura de datos
            const user = document.getElementById('username').value;
            const pass = document.getElementById('password').value;

            // Feedback visual: Mostrar spinner y bloquear botón 
            loadingOverlay.style.display = 'flex';
            btnLogin.disabled = true;

            // Simulación de "Validación Profunda" con servidores (2 segundos exactos) 
            setTimeout(() => {
                // Lógica de validación con datos estáticos [cite: 64]
                if (user === "admin" && pass === "123456") {
                    // Redirección exitosa al Dashboard 
                    window.location.href = 'pages/dashboard.html';
                } else {
                    // Manejo de error
                    alert("Credenciales inválidas. Intente con admin / 123456");
                    loadingOverlay.style.display = 'none';
                    btnLogin.disabled = false;
                }
            }, 2000);
        });
    }
});