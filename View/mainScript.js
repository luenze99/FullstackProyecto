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
                <p>Hola, <strong>${payload.username}</strong></p>
                ${adminBadge}
                <button onclick="cerrarSesion()" class="btnDropdown btnLogout">Cerrar Sesión</button>
            `;
        }catch (error){
            console.error("Error al procesar la cuenta:", error); 
            localStorage.removeItem('token'); //Limpia datos y vuelve a estado de invitado
             userContent.innerHTML = `<button onclick="window.location.href='login.html'" class="btnDropdown">Iniciar Sesión</button>`;
        }
    }
});

//CIERRE DE SESIÓN
function cerrarSesion() {
    localStorage.removeItem('token'); //Elimina el token de acceso
    window.location.reload(); //Refresca la página para volver a estado de invitado
}