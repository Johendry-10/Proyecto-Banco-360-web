// js/transferencias.js

let currentUser = JSON.parse(localStorage.getItem('banca360_active_user'));
if (!currentUser) window.location.href = '../index.html';

document.addEventListener('DOMContentLoaded', () => {
    const formTX = document.getElementById('form-transferencias');
    const msgElement = document.getElementById('tx-msg');

    if (formTX) {
        formTX.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const monto = parseFloat(document.getElementById('tx-monto').value);
            const cuenta = document.getElementById('tx-cuenta').value.trim();
            const conceptoInput = document.getElementById('tx-concepto').value.trim();
            const conceptoFinal = conceptoInput ? conceptoInput : `Transferencia a cuenta: ${cuenta.slice(-4)}`;

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
                concepto: conceptoFinal,
                fecha: new Date().toLocaleString('es-VE', { hour12: true }),
                monto: monto,
                tipo: 'out', // 'out' significa salida de dinero
                icono: 'sync_alt'
            });
            localStorage.setItem('banca360_transactions', JSON.stringify(historial));

            mostrarMensaje('¡Transferencia procesada con éxito!', 'green');
            
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