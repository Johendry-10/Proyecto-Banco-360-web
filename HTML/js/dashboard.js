// js/dashboard.js

let currentUser = JSON.parse(localStorage.getItem('banca360_active_user'));

if (!currentUser) {
    window.location.href = '../index.html';
}

document.addEventListener('DOMContentLoaded', () => {
    if (!currentUser) return;
    
    // 0. APLICAR MODO OSCURO (Evita parpadeos)
    const currentTheme = localStorage.getItem('banca360_theme') || 'light';
    if (currentTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        document.body.setAttribute('data-theme', 'dark');
    } else {
        document.documentElement.removeAttribute('data-theme');
        document.body.removeAttribute('data-theme');
    }

    // 1. CÁLCULO REAL DEL SALDO BASADO EN EL HISTORIAL
    let historialGlobal = JSON.parse(localStorage.getItem('banca360_transactions')) || [];
    
    let misTransacciones = historialGlobal.filter(tx => 
        tx.usuarioId === currentUser.id || tx.correoUsuario === currentUser.correo
    );

    let saldoCalculado = 0;
    misTransacciones.forEach(tx => {
        if (tx.tipo === 'in') saldoCalculado += parseFloat(tx.monto);
        if (tx.tipo === 'out') saldoCalculado -= parseFloat(tx.monto);
    });

    if (saldoCalculado < 0) saldoCalculado = 0;

    currentUser.saldo = saldoCalculado;
    localStorage.setItem('banca360_active_user', JSON.stringify(currentUser));

    let listaUsuarios = JSON.parse(localStorage.getItem('banca360_users')) || [];
    let userIndex = listaUsuarios.findIndex(u => u.correo === currentUser.correo || u.id === currentUser.id);
    if (userIndex !== -1) {
        listaUsuarios[userIndex].saldo = saldoCalculado;
        localStorage.setItem('banca360_users', JSON.stringify(listaUsuarios));
    }

    // 2. SISTEMA DE PESTAÑAS: RESUMEN VS HISTORIAL
    const vistasNav = {
        resumen: document.getElementById('view-resumen'),
        historial: document.getElementById('view-historial')
    };

    const botonesNav = {
        resumen: document.getElementById('nav-resumen'),
        historial: document.getElementById('nav-historial')
    };

    function activarVista(vistaClave) {
        Object.keys(vistasNav).forEach(key => {
            if (vistasNav[key]) vistasNav[key].classList.remove('active');
            if (botonesNav[key]) botonesNav[key].classList.remove('active');
        });

        if (vistasNav[vistaClave]) vistasNav[vistaClave].classList.add('active');
        if (botonesNav[vistaClave]) botonesNav[vistaClave].classList.add('active');
    }

    if (botonesNav.resumen) botonesNav.resumen.addEventListener('click', () => activarVista('resumen'));
    if (botonesNav.historial) botonesNav.historial.addEventListener('click', () => activarVista('historial'));

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('view') === 'historial') {
        activarVista('historial');
    } else {
        activarVista('resumen');
    }

    // 3. MOSTRAR/OCULTAR SALDO
    const balanceAmountElement = document.getElementById('balance-amount');
    const toggleBalanceBtn = document.getElementById('toggle-balance');

    if (toggleBalanceBtn && balanceAmountElement) {
        let saldoVisible = false;
        toggleBalanceBtn.addEventListener('click', () => {
            saldoVisible = !saldoVisible;
            if (saldoVisible) {
                balanceAmountElement.textContent = `$${saldoCalculado.toFixed(2)}`;
                toggleBalanceBtn.textContent = 'visibility';
            } else {
                balanceAmountElement.textContent = '***';
                toggleBalanceBtn.textContent = 'visibility_off';
            }
        });
    }

    // 4. RENDERIZAR HISTORIAL
    const recentList = document.getElementById('recent-transactions-list');
    const allList = document.getElementById('all-transactions-list');

    function generarHTMLTransaccion(tx) {
        const claseTipo = tx.tipo === 'in' ? 'in' : 'out';
        const signo = tx.tipo === 'in' ? '+' : '-';
        const iconoMat = tx.icono || (tx.tipo === 'in' ? 'arrow_downward' : 'arrow_upward');
        
        return `
            <div class="transaction-item" data-id="${tx.id}" style="cursor: pointer;">
                <div class="tx-info-left">
                    <div class="tx-icon-frame ${claseTipo}">
                        <span class="material-symbols-outlined">${iconoMat}</span>
                    </div>
                    <div class="tx-details">
                        <p>${tx.concepto}</p>
                        <span>${tx.fecha}</span>
                    </div>
                </div>
                <div class="tx-amount-right ${claseTipo}">${signo}$${parseFloat(tx.monto).toFixed(2)}</div>
            </div>
        `;
    }

    function pintarTransacciones(filtro = 'all') {
        let txFiltradas = [...misTransacciones].reverse();

        if (recentList) recentList.innerHTML = '';
        if (allList) allList.innerHTML = '';

        if (txFiltradas.length === 0) {
            const msgVacio = '<p style="padding: 20px; text-align: center; color: var(--text-muted);">No hay transacciones registradas.</p>';
            if (recentList) recentList.innerHTML = msgVacio;
            if (allList) allList.innerHTML = msgVacio;
            return;
        }

        txFiltradas.slice(0, 3).forEach(tx => {
            if (recentList) recentList.innerHTML += generarHTMLTransaccion(tx);
        });

        txFiltradas.forEach(tx => {
            if (filtro === 'all' || tx.tipo === filtro) {
                if (allList) allList.innerHTML += generarHTMLTransaccion(tx);
            }
        });

        document.querySelectorAll('.transaction-item').forEach(item => {
            item.addEventListener('click', () => {
                const txId = item.getAttribute('data-id');
                const encontrada = misTransacciones.find(t => t.id == txId);
                if (encontrada) abrirModalDetalles(encontrada);
            });
        });
    }

    pintarTransacciones();

    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            pintarTransacciones(e.target.getAttribute('data-filter'));
        });
    });

    // 5. VENTANA MODAL DE DETALLES
    const modal = document.getElementById('transaction-modal');
    const modalDetails = document.getElementById('modal-details');
    const closeModalBtn = document.getElementById('close-modal');

    function abrirModalDetalles(tx) {
        if (!modal || !modalDetails) return;
        const tipoTxt = tx.tipo === 'in' ? 'Crédito / Entrada' : 'Débito / Salida';
        const colorTxt = tx.tipo === 'in' ? 'var(--success-color)' : 'var(--error-color)';

        modalDetails.innerHTML = `
            <div class="modal-detail-item"><strong>Concepto:</strong> <div>${tx.concepto}</div></div>
            <div class="modal-detail-item"><strong>Fecha y Hora:</strong> <div>${tx.fecha}</div></div>
            <div class="modal-detail-item"><strong>Monto:</strong> <div style="color: ${colorTxt}; font-weight:600;">$${parseFloat(tx.monto).toFixed(2)}</div></div>
            <div class="modal-detail-item"><strong>Operación:</strong> <div>${tipoTxt}</div></div>
            <div class="modal-detail-item"><strong>Referencia:</strong> <div>#${tx.id || 'N/A'}</div></div>
        `;
        modal.style.display = 'flex';
    }

    if (closeModalBtn && modal) {
        closeModalBtn.addEventListener('click', () => modal.style.display = 'none');
    }
    window.addEventListener('click', (e) => {
        if (e.target === modal) modal.style.display = 'none';
    });

    // 6. NAVEGACIÓN Y CERRAR SESIÓN
    document.getElementById('nav-logout')?.addEventListener('click', () => {
        localStorage.removeItem('banca360_active_user');
        window.location.href = '../index.html';
    });
    
    document.getElementById('nav-perfil-icon')?.addEventListener('click', () => window.location.href = 'perfil.html');
    document.getElementById('nav-pagomovil')?.addEventListener('click', () => window.location.href = 'pagomovil.html');
    document.getElementById('nav-transferencia')?.addEventListener('click', () => window.location.href = 'transferencias.html');
    document.getElementById('nav-deposito')?.addEventListener('click', () => window.location.href = 'depositos.html');

    // ==========================================================================
    // 7. LÓGICA DEL MENÚ HAMBURGUESA (RESPONSIVE)
    // ==========================================================================
    const menuToggleBtn = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebar-overlay');

    if (menuToggleBtn && sidebar && sidebarOverlay) {
        function toggleMenu() {
            sidebar.classList.toggle('active-mobile');
            sidebarOverlay.classList.toggle('active');
        }

        // Abrir/Cerrar al tocar la hamburguesa
        menuToggleBtn.addEventListener('click', toggleMenu);
        
        // Cerrar al tocar el fondo oscuro
        sidebarOverlay.addEventListener('click', toggleMenu);

        // Cerrar el menú automáticamente al hacer clic en un botón de navegación
        const navButtons = document.querySelectorAll('.nav-btn');
        navButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                if (window.innerWidth <= 992) { // Cambiado a 992px para asegurar cobertura en tablets y móviles
                    sidebar.classList.remove('active-mobile');
                    sidebarOverlay.classList.remove('active');
                }
            });
        });
    }
});