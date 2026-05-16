document.addEventListener('DOMContentLoaded', () => {
    let users = JSON.parse(localStorage.getItem('banca360_users')) || [];
    let currentUser = JSON.parse(localStorage.getItem('banca360_active_user'));

    if (!currentUser) {
        window.location.href = '../index.html';
        return;
    }

    if (!currentUser.transactions || currentUser.transactions.length === 0) {
        currentUser.transactions = [
            { id: 'TXN001', type: 'in', title: 'Transferencia Recibida', date: '2023-10-25 14:30', amount: 500.00, details: 'Pago de honorarios' },
            { id: 'TXN002', type: 'out', title: 'Pago de Servicios', date: '2023-10-26 09:15', amount: 45.50, details: 'Factura de Electricidad' },
            { id: 'TXN003', type: 'out', title: 'Compra con Tarjeta', date: '2023-10-27 19:45', amount: 120.00, details: 'Supermercado' },
            { id: 'TXN004', type: 'in', title: 'Depósito en Efectivo', date: '2023-10-28 11:00', amount: 200.00, details: 'Cajero Principal' }
        ];
        currentUser.balance = 534.50;
        localStorage.setItem('banca360_active_user', JSON.stringify(currentUser));
        
        let userIndex = users.findIndex(u => u.email === currentUser.email);
        if (userIndex !== -1) {
            users[userIndex] = currentUser;
            localStorage.setItem('banca360_users', JSON.stringify(users));
        }
    }

    const balanceAmountElement = document.getElementById('balance-amount');
    const toggleBalanceBtn = document.getElementById('toggle-balance');
    const recentListElement = document.getElementById('recent-transactions-list');
    const allListElement = document.getElementById('all-transactions-list');
    const modal = document.getElementById('transaction-modal');
    const modalDetails = document.getElementById('modal-details');
    const closeModalBtn = document.getElementById('close-modal');
    
    let balanceVisible = true;
    const actualBalance = `$${currentUser.balance.toFixed(2)}`;

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

    document.getElementById('nav-logout').addEventListener('click', () => {
        localStorage.removeItem('banca360_active_user');
        window.location.href = '../index.html';
    });

    function createTransactionItem(txn) {
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
        div.addEventListener('click', () => openModal(txn));
        return div;
    }

    function renderTransactions() {
        const sortedTxns = [...currentUser.transactions].sort((a, b) => new Date(b.date) - new Date(a.date));
        
        recentListElement.innerHTML = '';
        sortedTxns.slice(0, 3).forEach(txn => {
            recentListElement.appendChild(createTransactionItem(txn));
        });

        renderFilteredTransactions('all');
    }

    function renderFilteredTransactions(filter) {
        allListElement.innerHTML = '';
        const sortedTxns = [...currentUser.transactions].sort((a, b) => new Date(b.date) - new Date(a.date));
        
        sortedTxns.forEach(txn => {
            if (filter === 'all' || txn.type === filter) {
                allListElement.appendChild(createTransactionItem(txn));
            }
        });
    }

    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            renderFilteredTransactions(e.target.getAttribute('data-filter'));
        });
    });

    function openModal(txn) {
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

    renderTransactions();
});