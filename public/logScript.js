//Cambio entre login y registro
function switchLogin() {
    document.getElementById('seccionLogin').classList.toggle('hidden');
    document.getElementById('seccionRegistro').classList.toggle('hidden');
    document.getElementById('msg').innerText = "";
}

//Inicio de sesion o registro(tipo)
async function enviar(tipo){ 
    const msg = document.getElementById('msg');
    msg.innerText = "Procesando...";
    let datos = {};
    if (tipo === 'login'){ //Login
        datos = {
            correo: document.getElementById('logCorreo').value,
            pass: document.getElementById('logPass').value
        };
    }else{ //Registro
        datos = {
            nombre: document.getElementById('regNombre').value,
            correo: document.getElementById('regCorreo').value,
            pass: document.getElementById('regPass').value
        };
    }

//Solicitud al backend 
    try { 
        const res = await fetch(`/${tipo}`, { //POST a login o register
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(datos)
        });
        const data = await res.json();

        if (data.success) {
            if (tipo === 'register'){ //Registro exitoso, redirigir a login
                msg.style.color = "green";
                msg.innerText = "¡Registro completado! Ya puedes iniciar sesión";
                setTimeout(switchLogin, 2000);
            }else{ //Login exitoso, guardar token y redirigir a pagina principal
                localStorage.setItem('userToken', data.token);
                localStorage.setItem('userRol', data.rol);
                localStorage.setItem('userName', data.nombre);
                //------------------
                window.location.href = "Main.html"; //CAMBIAR A NOMBRE DE LA PAGINA PRINCIPAL --------
                //------------------
            }
        }else{
            msg.style.color = "red";
            msg.innerText = data.error;
        }
    }catch(e){
        msg.innerText = "Error de conexión con el servidor";
    }
}