// js/validaciones.js

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. VALIDACIÓN PARA TELÉFONOS, CÉDULAS Y REFERENCIAS (Solo números enteros)
    const inputsNumeros = document.querySelectorAll('.solo-numeros');
    
    inputsNumeros.forEach(input => {
        input.addEventListener('input', function() {
            // Reemplaza instantáneamente cualquier cosa que NO sea un número del 0 al 9 por "nada"
            this.value = this.value.replace(/[^0-9]/g, '');
        });
    });

    // 2. VALIDACIÓN PARA MONTOS DE DINERO (Números y un solo punto decimal)
    const inputsMontos = document.querySelectorAll('.solo-montos');
    
    inputsMontos.forEach(input => {
        input.addEventListener('input', function() {
            // Reemplaza cualquier cosa que no sea número o punto (.)
            this.value = this.value.replace(/[^0-9.]/g, '');
            
            // Lógica para evitar que el usuario escriba dos puntos (ej: 100.50.2)
            const partes = this.value.split('.');
            if (partes.length > 2) {
                // Mantiene el primer punto y borra los demás
                this.value = partes[0] + '.' + partes.slice(1).join('').replace(/\./g, '');
            }
        });
    });
});