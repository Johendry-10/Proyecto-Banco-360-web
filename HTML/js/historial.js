// js/historial.js

const currentUser = JSON.parse(localStorage.getItem('banca360_active_user'));

if (!currentUser) {
    window.location.href = '../index.html';
}

document.addEventListener('DOMContentLoaded', () => {
    if (!currentUser) return;

    // --- APLICAR MODO OSCURO AUTOMÁTICO ---
    const currentTheme = localStorage.getItem('banca360_theme') || 'light';
    if (currentTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        document.body.setAttribute('data-theme', 'dark');
    }

    // --- CARGAR HISTORIAL COMPLETO ---
    const allListElement = document.getElementById('all-transactions-list');

    // Intenta ejecutar tu función global de transacciones.js si existe
    if (typeof inicializarTransacciones === 'function') {
        inicializarTransacciones();
    } else {
        // Respaldo visual en caso de que no haya transacciones registradas aún
        if (allListElement) {
            allListElement.innerHTML = `
                <div class="transaction-item">
                    <div class="tx-info-left">
                        <div class="tx-icon-frame in"><span class="material-symbols-outlined">payments</span></div>
                        <div class="tx-details"><p>Transferencia Recibida (Ejemplo)</p><span>Ayer, 03:15 PM</span></div>
                    </div>
                    <div class="tx-amount-right in">+$150.00</div>
                </div>
                <div class="transaction-item">
                    <div class="tx-info-left">
                        <div class="tx-icon-frame out"><span class="material-symbols-outlined">shopping_cart</span></div>
                        <div class="tx-details"><p>Pago de Servicio (Ejemplo)</p><span>Hace 2 días</span></div>
                    </div>
                    <div class="tx-amount-right out">-$45.00</div>
                </div>
            `;
        }
    }

    // --- LÓGICA DE FILTRADO (Todos / Entradas / Salidas) ---
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Cambiar clase activa en los botones
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');
            const items = document.querySelectorAll('.transaction-item');

            items.forEach(item => {
                const amountElement = item.querySelector('.tx-amount-right');
                if (!amountElement) return;

                const isIncome = amountElement.classList.contains('in') || amountElement.textContent.includes('+');

                if (filter === 'all') {
                    item.style.display = 'flex';
                } else if (filter === 'in' && isIncome) {
                    item.style.display = 'flex';
                } else if (filter === 'out' && !isIncome) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    // --- NAVEGACIÓN ENTRE INTERFACES ---
    document.getElementById('nav-resumen')?.addEventListener('click', () => window.location.href = 'dashboard.html');
    document.getElementById('nav-historial')?.addEventListener('click', () => window.location.href = 'historial.html');
    document.getElementById('nav-pagomovil')?.addEventListener('click', () => window.location.href = 'pagomovil.html');
    document.getElementById('nav-transferencia')?.addEventListener('click', () => window.location.href = 'transferencias.html');
    document.getElementById('nav-deposito')?.addEventListener('click', () => window.location.href = 'depositos.html');
    document.getElementById('nav-perfil-icon')?.addEventListener('click', () => window.location.href = 'perfil.html');

    // Botón Salir
    document.getElementById('nav-logout')?.addEventListener('click', () => {
        localStorage.removeItem('banca360_active_user');
        window.location.href = '../index.html';
    });
});