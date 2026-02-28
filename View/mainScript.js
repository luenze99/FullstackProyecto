let carrito = JSON.parse(localStorage.getItem('vibeCart')) || []; //Cargar carrito del o iniciar vacío

document.addEventListener('DOMContentLoaded', ()=>{ //Esperar a que todo el HTML esté cargado (para evitar buscar botones que aun no existen)
    const userContent = document.getElementById('userContent');
    const token = localStorage.getItem('token'); //Recuperar JWT guardado

    //GESTIÓN DE INTERFAZ DE USUARIO (LOGUEADO o INVITADO)
    if (token){
        try{
            const payload = JSON.parse(atob(token.split('.')[1])); //leer token para mostrar nombre y rol (en caso de ser admin)
            
            //Si el usuario es admin muestra la etiqueta
            const adminBadge = payload.rol === 'admin' ? '<span class="rolAdmin">ADMIN</span>' : '';

            //Actualizar contenido del dropdown con nombre de usuario, rol (si es admin) y botón de cerrar sesión
            userContent.innerHTML = `
                <p>Hola, <strong>${payload.nombre}</strong></p>
                ${adminBadge}
                <button onclick="cerrarSesion()" class="btnDropdown btnLogout">Cerrar Sesión</button>
            `;
        }catch (error){
            console.error("Error al procesar la cuenta:", error); 
            localStorage.removeItem('token'); //Limpia datos y vuelve a estado de invitado
             userContent.innerHTML = `<button onclick="window.location.href='login.html'" class="btnDropdown">Iniciar Sesión</button>`;
        }
    }
    actualizarVista(); //Actualizar vista del carrito al cargar la página
});

//---FUNCIONES DEL CARRITO---
//Agregar al Carrito
function agregarCarrito(nombre, precio, imagen){ 
    const itemExistente = carrito.find(item => item.nombre === nombre);
    if (itemExistente){ //Si ya esta en el carrito solo se suma la cantidad
        itemExistente.cantidad += 1;
    }else{
        carrito.push({ nombre, precio, imagen, cantidad: 1 });
    }
    //Guardar y refrescar
    guardarCarrito();
    actualizarVista();
}

//Vista de los productos en el carrito
function actualizarVista(){ 
    const itemsContainer = document.getElementById('cartItemsContainer');
    const totalAmount = document.getElementById('cartTotalAmount');
    const cartCount = document.getElementById('cartCount');

    if (carrito.length === 0){
        itemsContainer.innerHTML = '<p class="emptyMsg">Carrito vacío</p>';
        cartCount.innerText = "0";
        totalAmount.innerText = "$0.00";
        return;
    }

    itemsContainer.innerHTML = ""; //Limpiar mensaje de Carrito Vacío
    let total = 0;

    carrito.forEach((item)=>{ //Dibuja cada producto en el carrito
        total += item.precio * item.cantidad;
        itemsContainer.innerHTML += `
            <div class="cartItem">
                <img src="${item.imagen}" alt="${item.nombre}">
                <div class="itemInfo">
                    <p class="itemName">${item.nombre}</p>
                    <p>${item.cantidad} x $${item.precio.toFixed(2)}</p>
                </div>
            </div>
        `;
    });
    //Actualizar numero de la burbuja roja del carrito y monto total
    cartCount.innerText = carrito.reduce((acc, item) => acc + item.cantidad, 0);
    totalAmount.innerText = `$${total.toFixed(2)}`;
}

//Guardar carrito en LocalStorage si no tiene cuenta, pero si hay sesión envíar al Backend
async function guardarCarrito(){
    localStorage.setItem('vibeCart', JSON.stringify(carrito));
    const token = localStorage.getItem('token'); //Verificar sesion
    if (token){
        try{ //Post a base de datos
            await fetch('/api/carrito/sincronizar',{
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, carrito })
            });
        }catch (e){
            console.warn("Error sincronizando con servidor (el carrito se guardó localmente):", e);
        }
    }
}

//Control para la página de pago
function Pagar(){
    const token = localStorage.getItem('token');
    if (!token){ //Si no ha iniciado sesión, redirige a login para poder realizar el pago
        alert("Por favor inicia sesión para finalizar tu compra.");
        window.location.href = "login.html"; 
    }else{
        window.location.href = "pago.html";
    }
}

//CIERRE DE SESIÓN
function cerrarSesion() {
    localStorage.removeItem('token'); //Elimina el token de acceso
    window.location.reload(); //Refresca la página para volver a estado de invitado
}