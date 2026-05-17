// js/depositos.js

let currentUser = JSON.parse(localStorage.getItem('banca360_active_user'));
if (!currentUser) window.location.href = '../index.html';

document.addEventListener('DOMContentLoaded', () => {
    const formDep = document.getElementById('form-deposito');
    const msgElement = document.getElementById('dep-msg');

    if (formDep) {
        formDep.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const monto = parseFloat(document.getElementById('dep-monto').value);
            const metodoInput = document.getElementById('dep-metodo');
            const metodo = metodoInput ? metodoInput.value : "Efectivo";

            if (isNaN(monto) || monto <= 0) {
                mostrarMensaje('Monto inválido. Ingrese un valor mayor a 0.', 'red');
                return;
            }

            // 1. ACTUALIZAR SALDO DEL USUARIO ACTIVO
            let saldoActual = parseFloat(currentUser.saldo || 0);
            saldoActual += monto;
            currentUser.saldo = saldoActual;
            localStorage.setItem('banca360_active_user', JSON.stringify(currentUser));

            // 2. ACTUALIZAR SALDO EN LA BASE DE DATOS GENERAL
            let listaUsuarios = JSON.parse(localStorage.getItem('banca360_users')) || [];
            let idx = listaUsuarios.findIndex(u => u.correo === currentUser.correo);
            if (idx !== -1) {
                listaUsuarios[idx].saldo = saldoActual;
                localStorage.setItem('banca360_users', JSON.stringify(listaUsuarios));
            }

            // 3. REGISTRAR EL MOVIMIENTO EN EL HISTORIAL
            let historial = JSON.parse(localStorage.getItem('banca360_transactions')) || [];
            historial.push({
                id: "TX-" + Math.floor(100000 + Math.random() * 900000),
                correoUsuario: currentUser.correo,
                usuarioId: currentUser.id,
                concepto: `Depósito: ${metodo}`,
                fecha: new Date().toLocaleString('es-VE', { hour12: true }),
                monto: monto,
                tipo: 'in', // 'in' significa entrada de dinero
                icono: 'account_balance'
            });
            localStorage.setItem('banca360_transactions', JSON.stringify(historial));

            mostrarMensaje(`¡Depósito de $${monto.toFixed(2)} exitoso!`, 'green');
            
            // Redirigir al dashboard tras 1.5 segundos
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
        });
    }

    function mostrarMensaje(texto, color) {
        if (!msgElement) {
            alert(texto); // Respaldo por si falla el HTML
            return;
        }
        msgElement.textContent = texto;
        msgElement.style.color = color;
        msgElement.style.display = 'block';
    }
});