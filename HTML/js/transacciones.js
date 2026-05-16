function inicializarTransacciones() {
    let user = JSON.parse(localStorage.getItem('banca360_active_user'));
    
    if (user && (!user.transactions || user.transactions.length === 0)) {
        let users = JSON.parse(localStorage.getItem('banca360_users')) || [];
        
        user.transactions = [
            { id: 'TXN001', type: 'in', title: 'Transferencia Recibida', date: '2023-10-25 14:30', amount: 500.00, details: 'Pago de honorarios' },
            { id: 'TXN002', type: 'out', title: 'Pago de Servicios', date: '2023-10-26 09:15', amount: 45.50, details: 'Factura de Electricidad' },
            { id: 'TXN003', type: 'out', title: 'Compra con Tarjeta', date: '2023-10-27 19:45', amount: 120.00, details: 'Supermercado' },
            { id: 'TXN004', type: 'in', title: 'Depósito en Efectivo', date: '2023-10-28 11:00', amount: 200.00, details: 'Cajero Principal' }
        ];
        user.balance = 534.50;
        
        localStorage.setItem('banca360_active_user', JSON.stringify(user));
        
        let userIndex = users.findIndex(u => u.email === user.email);
        if (userIndex !== -1) {
            users[userIndex] = user;
            localStorage.setItem('banca360_users', JSON.stringify(users));
        }
    }
}

function obtenerTransaccionesOrdenadas() {
    let user = JSON.parse(localStorage.getItem('banca360_active_user'));
    if (!user || !user.transactions) return [];
    return [...user.transactions].sort((a, b) => new Date(b.date) - new Date(a.date));
}