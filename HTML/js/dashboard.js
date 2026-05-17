const currentUser = JSON.parse(localStorage.getItem('banca360_active_user'));

if (!currentUser) {
    window.location.href = '../index.html';
}

document.addEventListener('DOMContentLoaded', () => {
    if (!currentUser) return;

    if (typeof inicializarTransacciones === 'function') {
        inicializarTransacciones();
    }
    
    const updatedUser = JSON.parse(localStorage.getItem('banca360_active_user'));

  
    const logoutBtn = document.getElementById('nav-logout');
    if(logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('banca360_active_user');
            window.location.href = '../index.html';
        });
    }

    const navPerfilIcon = document.getElementById('nav-perfil-icon');
    if (navPerfilIcon) {
        navPerfilIcon.addEventListener('click', () => {
            window.location.href = 'perfil.html';
        });
    }

    const balanceAmountElement = document.getElementById('balance-amount');
    const toggleBalanceBtn = document.getElementById('toggle-balance');
    const recentListElement = document.getElementById('recent-transactions-list');
    const allListElement = document.getElementById('all-transactions-list');
    const modal = document.getElementById('transaction-modal');
    const modalDetails = document.getElementById('modal-details');
    const closeModalBtn = document.getElementById('close-modal');
    

    let balanceVisible = true;
    const actualBalance = `$${updatedUser.balance.toFixed(2)}`;
    if (balanceAmountElement) balanceAmountElement.textContent = actualBalance;

    if (toggleBalanceBtn) {
        toggleBalanceBtn.addEventListener('click', () => {
            balanceVisible = !balanceVisible;
            if (balanceVisible) {
                balanceAmountElement.textContent = actualBalance;
                toggleBalanceBtn.textContent = 'visibility';
            } else {
                balanceAmountElement.textContent = '***';
                toggleBalanceBtn.textContent = 'visibility_off';
            }
        });
    }

    const navResumen = document.getElementById('nav-resumen');
    const navHistorial = document.getElementById('nav-historial');
    const viewResumen = document.getElementById('view-resumen');
    const viewHistorial = document.getElementById('view-historial');

    function switchView(view) {
        navResumen.classList.remove('active');
        navHistorial.classList.remove('active');
        viewResumen.classList.remove('active');
        viewHistorial.classList.remove('active');

        if (view === 'resumen') {
            navResumen.classList.add('active');
            viewResumen.classList.add('active');
        } else if (view === 'historial') {
            navHistorial.classList.add('active');
            viewHistorial.classList.add('active');
        }
    }

    if (navResumen) navResumen.addEventListener('click', () => switchView('resumen'));
    if (navHistorial) navHistorial.addEventListener('click', () => switchView('historial'));

    // Lógica de Renderizado de Transacciones
    function crearElementoTransaccion(txn) {
        const div = document.createElement('div');
        div.className = 'transaction-item';
        div.innerHTML = `
            <div class="tx-info">
                <h4>${txn.title}</h4>
                <span class="tx-date">${txn.date}</span>
            </div>
            <div class="tx-amount ${txn.type}">
                ${txn.type === 'in' ? '+' : '-'}$${txn.amount.toFixed(2)}
            </div>
        `;
        div.addEventListener('click', () => abrirModal(txn));
        return div;
    }

    function renderizarTransacciones() {
        if (!recentListElement) return;
        recentListElement.innerHTML = '';
        if (updatedUser.transactions) {
            const txs = [...updatedUser.transactions].reverse();
            txs.slice(0, 3).forEach(txn => {
                recentListElement.appendChild(crearElementoTransaccion(txn));
            });
        }
        renderizarTransaccionesFiltradas('all');
    }

    function renderizarTransaccionesFiltradas(filtro) {
        if (!allListElement) return;
        allListElement.innerHTML = '';
        if (updatedUser.transactions) {
            const txs = [...updatedUser.transactions].reverse();
            txs.forEach(txn => {
                if (filtro === 'all' || txn.type === filtro) {
                    allListElement.appendChild(crearElementoTransaccion(txn));
                }
            });
        }
    }

    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            renderizarTransaccionesFiltradas(e.target.getAttribute('data-filter'));
        });
    });

    function abrirModal(txn) {
        if (!modalDetails || !modal) return;
        modalDetails.innerHTML = `
            <div class="detail-row"><span class="detail-label">Referencia</span><span class="detail-value">${txn.id}</span></div>
            <div class="detail-row"><span class="detail-label">Tipo</span><span class="detail-value">${txn.type === 'in' ? 'Entrada' : 'Salida'}</span></div>
            <div class="detail-row"><span class="detail-label">Monto</span><span class="detail-value ${txn.type}">${txn.type === 'in' ? '+' : '-'}$${txn.amount.toFixed(2)}</span></div>
            <div class="detail-row"><span class="detail-label">Fecha</span><span class="detail-value">${txn.date}</span></div>
            <div class="detail-row"><span class="detail-label">Detalle</span><span class="detail-value">${txn.details}</span></div>
        `;
        modal.style.display = 'flex';
    }

    if (closeModalBtn) closeModalBtn.addEventListener('click', () => modal.style.display = 'none');
    window.addEventListener('click', (e) => {
        if (e.target === modal) modal.style.display = 'none';
    });

    renderizarTransacciones();

    // =========================================================================
    // CONTROLADOR CENTRAL DE NAVEGACIÓN INTERNA (5 MÓDULOS)
    // =========================================================================
    const botonesNav = {
        resumen: document.getElementById('nav-resumen'),
        historial: document.getElementById('nav-historial'),
        transferencias: document.getElementById('nav-transferencias'),
        pagomovil: document.getElementById('nav-pagomovil'),
        deposito: document.getElementById('nav-deposito')
    };

    const vistasNav = {
        resumen: document.getElementById('view-resumen'),
        historial: document.getElementById('view-historial'),
        transferencias: document.getElementById('view-transferencias'),
        pagomovil: document.getElementById('view-pagomovil'),
        deposito: document.getElementById('view-deposito')
    };

    function activarVista(vistaClave) {
        // Ocultar todas las secciones y remover estados activos
        Object.keys(vistasNav).forEach(key => {
            if (vistasNav[key]) vistasNav[key].style.display = 'none';
            if (botonesNav[key]) botonesNav[key].classList.remove('active');
        });

        // Mostrar la sección seleccionada y activar su botón correspondiente
        if (vistasNav[vistaClave]) vistasNav[vistaClave].style.display = 'block';
        if (botonesNav[vistaClave]) botonesNav[vistaClave].classList.add('active');
    }

    // Registrar eventos de clic para la barra lateral
    Object.keys(botonesNav).forEach(key => {
        if (botonesNav[key]) {
            botonesNav[key].addEventListener('click', () => activarVista(key));
        }
    });

    // Configurar botones "Cancelar / Volver" de los formularios
    document.querySelectorAll('.btn-volver-resumen').forEach(btn => {
        btn.addEventListener('click', () => {
            document.getElementById('form-transferencias')?.reset();
            document.getElementById('form-pagomovil')?.reset();
            document.getElementById('form-deposito')?.reset();
            activarVista('resumen');
        });
    });


    // =========================================================================
    // PROCESAMIENTO: MÓDULO TRANSFERENCIAS
    // =========================================================================
    const formTx = document.getElementById('form-transferencias');
    const errTx = document.getElementById('tx-error');

    if (formTx) {
        formTx.addEventListener('submit', (e) => {
            e.preventDefault();
            const dest = document.getElementById('tx-dest').value.trim();
            const amount = parseFloat(document.getElementById('tx-amount').value);
            const concept = document.getElementById('tx-concept').value.trim();

            if (amount > currentUser.balance) {
                errTx.textContent = "Saldo disponible insuficiente.";
                errTx.style.display = 'block';
                return;
            }

            let users = JSON.parse(localStorage.getItem('banca360_users')) || [];
            const destIndex = users.findIndex(u => u.email === dest || u.telefono === dest);

            if (destIndex === -1) {
                errTx.textContent = "Destinatario no registrado en Banca 360.";
                errTx.style.display = 'block';
                return;
            }

            const userDest = users[destIndex];
            if (userDest.email === currentUser.email) {
                errTx.textContent = "No puedes transferirte a ti mismo.";
                errTx.style.display = 'block';
                return;
            }

            // Guardar transacciones cruzadas
            const txId = 'TXN' + Math.floor(Math.random() * 1000000);
            const dateStr = new Date().toISOString().slice(0, 16).replace('T', ' ');

            currentUser.balance -= amount;
            currentUser.transactions.unshift({ id: txId, type: 'out', title: `Transferencia a ${userDest.username}`, date: dateStr, amount, details: concept });

            userDest.balance = (userDest.balance || 0) + amount;
            if (!userDest.transactions) userDest.transactions = [];
            userDest.transactions.unshift({ id: txId, type: 'in', title: `Transferencia de ${currentUser.username}`, date: dateStr, amount, details: concept });

            // Sincronizar bases de datos
            const curIndex = users.findIndex(u => u.email === currentUser.email);
            if (curIndex !== -1) users[curIndex] = currentUser;
            users[destIndex] = userDest;

            localStorage.setItem('banca360_users', JSON.stringify(users));
            localStorage.setItem('banca360_active_user', JSON.stringify(currentUser));

            alert("¡Transferencia enviada con éxito!");
            window.location.reload();
        });
    }


    // =========================================================================
    // PROCESAMIENTO: MÓDULO PAGO MÓVIL
    // =========================================================================
    const formPm = document.getElementById('form-pagomovil');
    const errPm = document.getElementById('pm-error');

    if (formPm) {
        formPm.addEventListener('submit', (e) => {
            e.preventDefault();
            const phone = document.getElementById('pm-phone').value.trim();
            const cedula = document.getElementById('pm-cedula').value.trim();
            const amount = parseFloat(document.getElementById('pm-amount').value);

            if (amount > currentUser.balance) {
                errPm.textContent = "Saldo insuficiente para procesar el Pago Móvil.";
                errPm.style.display = 'block';
                return;
            }

            let users = JSON.parse(localStorage.getItem('banca360_users')) || [];
            // Validación realista: Comprueba que coincidan el teléfono y la cédula del receptor
            const destIndex = users.findIndex(u => u.telefono === phone && u.cedula === cedula);

            if (destIndex === -1) {
                errPm.textContent = "Los datos ingresados no coinciden con ningún usuario registrado.";
                errPm.style.display = 'block';
                return;
            }

            const userDest = users[destIndex];
            if (userDest.email === currentUser.email) {
                errPm.textContent = "No puedes emitir un pago móvil hacia tu propio número.";
                errPm.style.display = 'block';
                return;
            }

            const txId = 'PMV' + Math.floor(Math.random() * 1000000);
            const dateStr = new Date().toISOString().slice(0, 16).replace('T', ' ');

            currentUser.balance -= amount;
            currentUser.transactions.unshift({ id: txId, type: 'out', title: `Pago Móvil enviado a ${userDest.username}`, date: dateStr, amount, details: 'Pago Móvil inmediato' });

            userDest.balance = (userDest.balance || 0) + amount;
            if (!userDest.transactions) userDest.transactions = [];
            userDest.transactions.unshift({ id: txId, type: 'in', title: `Pago Móvil recibido de ${currentUser.username}`, date: dateStr, amount, details: 'Pago Móvil inmediato' });

            const curIndex = users.findIndex(u => u.email === currentUser.email);
            if (curIndex !== -1) users[curIndex] = currentUser;
            users[destIndex] = userDest;

            localStorage.setItem('banca360_users', JSON.stringify(users));
            localStorage.setItem('banca360_active_user', JSON.stringify(currentUser));

            alert("¡Pago Móvil procesado y enviado con éxito!");
            window.location.reload();
        });
    }



    const formDp = document.getElementById('form-deposito');

    if (formDp) {
        formDp.addEventListener('submit', (e) => {
            e.preventDefault();
            const amount = parseFloat(document.getElementById('dp-amount').value);
            const ref = document.getElementById('dp-reference').value.trim();

            const txId = 'DEP' + Math.floor(Math.random() * 1000000);
            const dateStr = new Date().toISOString().slice(0, 16).replace('T', ' ');

            // Incrementar saldo del usuario logueado directamente
            currentUser.balance += amount;
            currentUser.transactions.unshift({ id: txId, type: 'in', title: 'Depósito en Efectivo', date: dateStr, amount, details: ref });

            let users = JSON.parse(localStorage.getItem('banca360_users')) || [];
            const curIndex = users.findIndex(u => u.email === currentUser.email);
            if (curIndex !== -1) users[curIndex] = currentUser;

            localStorage.setItem('banca360_users', JSON.stringify(users));
            localStorage.setItem('banca360_active_user', JSON.stringify(currentUser));

            alert(`¡Depósito de $${amount.toFixed(2)} abonado a tu cuenta de forma exitosa!`);
            window.location.reload();
        });
    }

    // =========================================================================
    // NAVEGACIÓN ENTRE VISTAS (Menú Lateral)
    
    const botonesNavv = {
        resumen: document.getElementById('nav-resumen'),
        historial: document.getElementById('nav-historial'),
        transferencias: document.getElementById('nav-transferencias'),
        pagomovil: document.getElementById('nav-pagomovil'),
        deposito: document.getElementById('nav-deposito')
    };

    const vistasNavv = {
        resumen: document.getElementById('view-resumen'),
        historial: document.getElementById('view-historial'),
        transferencias: document.getElementById('view-transferencias'),
        pagomovil: document.getElementById('view-pagomovil'),
        deposito: document.getElementById('view-deposito')
    };

    // Función para cambiar de pantalla
    function activarVista(vistaClave) {
        // 1. Ocultar todas las pantallas y quitar el estilo 'active' de los botones
        Object.keys(vistasNavv).forEach(key => {
            if (vistasNav[key]) vistasNavv[key].style.display = 'none';
            if (botonesNavv[key]) botonesNavv[key].classList.remove('active');
        });

        // 2. Mostrar la pantalla solicitada y marcar el botón de la sidebar
        if (vistasNav[vistaClave]) vistasNavv[vistaClave].style.display = 'block';
        if (botonesNavv[vistaClave]) botonesNavv[vistaClave].classList.add('active');
    }

    // Agregar el evento de clic a todos los botones del menú lateral
    Object.keys(botonesNavv).forEach(key => {
        if (botonesNavv[key]) {
            botonesNavv[key].addEventListener('click', () => activarVista(key));
        }
    });

    // =========================================================================
    // BOTONES "CANCELAR" DE LOS FORMULARIOS
    // =========================================================================
    document.querySelectorAll('.btn-volver-resumen').forEach(btn => {
        btn.addEventListener('click', () => {
            // Limpia los formularios si te arrepientes
            document.getElementById('form-transferencias')?.reset();
            document.getElementById('form-pagomovil')?.reset();
            document.getElementById('form-deposito')?.reset();
            
            // Oculta mensajes de error si los hay
            const txErr = document.getElementById('tx-error');
            const pmErr = document.getElementById('pm-error');
            if(txErr) txErr.style.display = 'none';
            if(pmErr) pmErr.style.display = 'none';

            // Te devuelve al dashboard principal
            activarVista('resumen');
        });
    });


});