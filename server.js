const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'View')));
app.use('/Source', express.static(path.join(__dirname, 'Source')));

//Pagina que se muestra al entrar a la raiz del servidor (Login) -------------------------------->
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'View', 'Main.html')); //Modificar despues a Main.html o lo que sea la pagina principal
});

//CONFIGURACIÓN PARA RENDER
const PORT = process.env.PORT || 3000;
const SECRET_KEY = process.env.SECRET_KEY || "Vibe&CoSecretKey123";

//CONEXIÓN URL de MongoDB Atlas (Modificar Despues) -------------------------------->
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/vibeCoDB';
mongoose.connect(MONGO_URI)
    .then(() => console.log("Base de datos conectada"))
    .catch(err => console.error("Error de conexión a la base de datos:", err));

//MODELO DE USUARIO
const Usuario = mongoose.model('Usuario', new mongoose.Schema({
    nombre: {type: String, required: true},
    correo: {type: String, unique: true, required: true},
    pass: {type: String, required: true},
    rol: {type: String, default:'cliente'}
}));

//--- RUTAS ---
//Registro (Usuario Normal)
app.post('/register', async (req, res) => {
    try {
        const {nombre, correo, pass} = req.body;
        const hash = await bcrypt.hash(pass, 10); //Encriptación de contraseña
        const nuevo = new Usuario({ nombre, correo, pass: hash, rol:'cliente' });
        await nuevo.save();
        res.json({ success: true });
    }catch(err){
        res.status(400).json({ success: false, error: "El correo ya existe" });
    }
});

//Login (Token JWT)
app.post('/login', async (req, res)=>{
    const {correo, pass} = req.body;
    try { 
        //Verificación de credenciales
        const user = await Usuario.findOne({correo});
        if (user && await bcrypt.compare(pass, user.pass)){  
            //Brazalete JWT con expiración
            const token = jwt.sign(
                {id: user._id, rol: user.rol, nombre: user.nombre}, 
                SECRET_KEY, 
                {expiresIn: '1h'}
            );
            res.json({success: true, token, rol: user.rol, nombre: user.nombre});
        }else{
            res.json({success: false, error:"Correo o contraseña incorrectos"});
        }
    }catch(e){
        res.status(500).json({ error:"Error en el servidor"});
    }
});

//Crear Admin (RUTA SECRETA POSTMAN)
app.post('/api/setup-vibe-admin', async (req, res)=>{
    try{
        const {nombre, correo, pass} = req.body;
        const hash = await bcrypt.hash(pass, 10);
        const admin = new Usuario({nombre, correo, pass: hash, rol:'admin'});
        await admin.save();
        res.json({success: true, mensaje: "Cuenta admin creada correctamente"});
    }catch (e){
        res.status(400).json({error:"Error al crear cuenta admin"});
    }
});

app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
