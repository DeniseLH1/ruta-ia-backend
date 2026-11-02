import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import {connectDB } from './src/config/db.js';
import studentRoutes from './src/routes/studentRoutes.js'
import courseRoutes from './src/routes/courseRoutes.js'

// Carga de las variables de entorno
dotenv.config();

// Inicialización de la aplicación con Express
const app = express();
const PORT = process.env.PORT || 3000;

// ==== Middleware Globales ===
app.use(cors());
app.use(express.json());

// Rutas de la API
app.use('/api/students',studentRoutes);
app.use('/api/courses', courseRoutes);

// ==== Rutas de Verificación ===
app.get('/',(req,res)=>{
    res.status(200).json({
        status:'success',
        message: 'Bienvenido a RutaIA ',
        version:'1.0.0'
    });
});

// == Inicialización del Servidor y Base de Datos ===
async function startServer(){
    try{
        // Conexión a la base de datos 
        await connectDB();
        // Inicio del servidor
        app.listen(PORT,()=>{
            console.log(`Servidor iniciado en el puerto http://localhost:${PORT}`);
        });
    }catch (error){
        console.error('Error al iniciar el servidor:', error);
        process.exit(1);
    }
}

startServer();