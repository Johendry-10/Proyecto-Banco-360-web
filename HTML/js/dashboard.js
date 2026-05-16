const currentUser = JSON.parse(localStorage.getItem('banca360_active_user'));

if (!currentUser) {
    window.location.href = '../index.html';
}

document.addEventListener('DOMContentLoaded', () => {
    if (!currentUser) return;

    // Llamamos a la función en español
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

    const balanceAmountElement = document.getElementById('balance-amount');
    const toggleBalanceBtn = document.getElementById('toggle-balance');
    const recentListElement = document.getElementById('recent-transactions-list');
    const allListElement = document.getElementById('all-transactions-list');
    const modal = document.getElementById('transaction-modal');
    const modalDetails = document.getElementById('modal-details');
    const closeModalBtn = document.getElementById('close-modal');
    
    let balanceVisible = true;
    const actualBalance = `$${updatedUser.balance.toFixed(2)}`;
    balanceAmountElement.textContent = actualBalance;

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
        } else {
            navHistorial.classList.add('active');
            viewHistorial.classList.add('active');
        }
    }

    navResumen.addEventListener('click', () => switchView('resumen'));
    navHistorial.addEventListener('click', () => switchView('historial'));

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
        // Usamos la función en español para obtener los datos
        const transaccionesOrdenadas = obtenerTransaccionesOrdenadas(); 
        recentListElement.innerHTML = '';
        transaccionesOrdenadas.slice(0, 3).forEach(txn => {
            recentListElement.appendChild(crearElementoTransaccion(txn));
        });
        renderizarTransaccionesFiltradas('all');
    }

    function renderizarTransaccionesFiltradas(filtro) {
        allListElement.innerHTML = '';
        const transaccionesOrdenadas = obtenerTransaccionesOrdenadas();
        transaccionesOrdenadas.forEach(txn => {
            if (filtro === 'all' || txn.type === filtro) {
                allListElement.appendChild(crearElementoTransaccion(txn));
            }
        });
    }

    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            renderizarTransaccionesFiltradas(e.target.getAttribute('data-filter'));
        });
    });

    function abrirModal(txn) {
        modalDetails.innerHTML = `
            <div class="detail-row"><span class="detail-label">Referencia</span><span class="detail-value">${txn.id}</span></div>
            <div class="detail-row"><span class="detail-label">Tipo</span><span class="detail-value">${txn.type === 'in' ? 'Entrada' : 'Salida'}</span></div>
            <div class="detail-row"><span class="detail-label">Monto</span><span class="detail-value ${txn.type}">${txn.type === 'in' ? '+' : '-'}$${txn.amount.toFixed(2)}</span></div>
            <div class="detail-row"><span class="detail-label">Fecha</span><span class="detail-value">${txn.date}</span></div>
            <div class="detail-row"><span class="detail-label">Detalle</span><span class="detail-value">${txn.details}</span></div>
        `;
        modal.style.display = 'flex';
    }

    closeModalBtn.addEventListener('click', () => modal.style.display = 'none');
    window.addEventListener('click', (e) => {
        if (e.target === modal) modal.style.display = 'none';
    });

    renderizarTransacciones();
});