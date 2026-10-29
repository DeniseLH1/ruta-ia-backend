import {MongoClient} from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

// Lee la URI y el nombre de la base de datos desde las variables de entorno
const uri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME || 'ruta_ia_db';

if (!uri){
    console.error('La URI de MongoDB no está definida. Configura MONGODB_URI en tu archivo .env.');
    process.exit(1);
}

// Crea una instancia del cliente de MongoDB
const client = new MongoClient(uri);
let dbConnection = null;

export async function connectDB(){
    if(dbConnection){
        return dbConnection;
    }

    try {
        await client.connect();
        dbConnection = client.db(dbName);
        console.log('Conexión exitosa a (DB: ${dbName})');
        return dbConnection;
    } catch(error){
        console.error('No se pudo establecer la conexión con MongoDB:', error);
        process.exit(1);
    }
}

export async function closeDB(){
    if(client){
        await client.close();
        dbConnection= null;
        console.log('Conexión a MongoDB cerrada exitosamente')
    }
}
