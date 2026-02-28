const soloNumeros = (e)=>{ //Función Permitir solo números y teclas de control
    const permitir = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'];
    if (!permitir.includes(e.key) && !/[0-9]/.test(e.key)) {
        e.preventDefault();
    }
};

//Aplicar funcion "soloNumeros" a estos campos
document.getElementById('numTarjeta').addEventListener('keydown', soloNumeros);
document.getElementById('cvv').addEventListener('keydown', soloNumeros);
document.getElementById('expiracion').addEventListener('keydown', soloNumeros);

//Barra "/" automática para el campo de expiración
document.getElementById('expiracion').addEventListener('input', (e)=>{
    let valor = e.target.value.replace(/\D/g, '');
    if (valor.length > 2){ //Insertar barra después de los primeros dos dígitos
        e.target.value = valor.substring(0, 2) + '/' + valor.substring(2, 4);
    }else{
        e.target.value = valor;
    }
});

//Simulación de Pago
document.getElementById('formPago').addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = document.getElementById('btnConfirmar');
    const originalText = btn.innerText;
    
    //Feedback visual para el usuario del boton de pago
    btn.innerText = "PROCESANDO...";
    btn.disabled = true; //Deshabilitar botón mientras procesa
    btn.style.backgroundColor = "#7f8c8d"; //Cambiar a gris mientras procesa

    //Simulación de validación (2.5 segundos)
    setTimeout(() => {
        alert("¡Pago realizado con éxito en Vibe&Co! Gracias por tu compra");
        //Limpiar el carrito (Funcion proxima si se decide usar)
        //localStorage.removeItem('carrito'); 

        window.location.href = 'Main.html';
    }, 2500);
});
