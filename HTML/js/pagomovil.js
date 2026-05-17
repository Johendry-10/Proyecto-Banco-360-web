// js/pagomovil.js

let currentUser = JSON.parse(localStorage.getItem('banca360_active_user'));
if (!currentUser) window.location.href = '../index.html';

document.addEventListener('DOMContentLoaded', () => {
    const formPM = document.getElementById('form-pagomovil');
    const msgElement = document.getElementById('pm-msg');

    if (formPM) {
        formPM.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const telefono = document.getElementById('pm-telefono').value.trim();
            const banco = document.getElementById('pm-banco').value;
            const monto = parseFloat(document.getElementById('pm-monto').value);

            let saldoActual = parseFloat(currentUser.saldo || 0);

            if (isNaN(monto) || monto <= 0) {
                mostrarMensaje('Monto inválido.', 'red');
                return;
            }

            if (monto > saldoActual) {
                mostrarMensaje(`Saldo insuficiente. Tienes $${saldoActual.toFixed(2)}`, 'red');
                return;
            }

            // 1. DESCONTAR SALDO
            saldoActual -= monto;
            currentUser.saldo = saldoActual;
            localStorage.setItem('banca360_active_user', JSON.stringify(currentUser));

            // 2. ACTUALIZAR BD
            let listaUsuarios = JSON.parse(localStorage.getItem('banca360_users')) || [];
            let idx = listaUsuarios.findIndex(u => u.correo === currentUser.correo);
            if (idx !== -1) {
                listaUsuarios[idx].saldo = saldoActual;
                localStorage.setItem('banca360_users', JSON.stringify(listaUsuarios));
            }

            // 3. REGISTRAR HISTORIAL
            let historial = JSON.parse(localStorage.getItem('banca360_transactions')) || [];
            historial.push({
                id: "TX-" + Math.floor(100000 + Math.random() * 900000),
                correoUsuario: currentUser.correo,
                usuarioId: currentUser.id,
                concepto: `Pago Móvil a: ${telefono} (${banco})`,
                fecha: new Date().toLocaleString('es-VE', { hour12: true }),
                monto: monto,
                tipo: 'out',
                icono: 'send_to_mobile'
            });
            localStorage.setItem('banca360_transactions', JSON.stringify(historial));

            mostrarMensaje('¡Pago móvil enviado con éxito!', 'green');
            
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
        });
    }

    function mostrarMensaje(texto, color) {
        if (!msgElement) {
            alert(texto);
            return;
        }
        msgElement.textContent = texto;
        msgElement.style.color = color;
        msgElement.style.display = 'block';
    }
});