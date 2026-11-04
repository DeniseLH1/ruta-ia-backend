import { MongoClient } from 'mongodb';

// Conserva el cliente y la base de datos para reutilizar la conexión.
let client = null;
let dbInstance = null;

// Conecta con MongoDB y devuelve la instancia de la base de datos.
export async function connectDB() {
    try {
        // Evita abrir una nueva conexión si ya se inicializó la base de datos.
        if (dbInstance) {
            return dbInstance;
        }
        // Lee la dirección de MongoDB y el nombre de la base desde el entorno.
        const uri = process.env.MONGODB_URI;
        const dbName = process.env.DB_NAME;
        // Detiene la conexión si falta alguna configuración.
        if (!uri || !dbName) {
            throw new Error('Faltan variables de entorno para la conexión a MongoDB (MONGODB_URI o DB_NAME).');
        }
        // Crea el cliente e inicia la conexión con el servidor de MongoDB.
        client = new MongoClient(uri);
        await client.connect();
        dbInstance = client.db(dbName);
        // Impide correos duplicados y acelera filtros frecuentes del catálogo e historial.
        await dbInstance.collection('estudiantes').createIndex(
            { email: 1 },
            { unique: true, collation: { locale: 'en', strength: 2 } }
        );
        await dbInstance.collection('consultas').createIndex({ studentId: 1, fecha: -1 });
        await dbInstance.collection('cursos').createIndex({ estado: 1, categoria: 1, nivel: 1 });
        console.log(' Conectado exitosamente a MongoDB');
        return dbInstance;
    } catch (error) {
        console.error('Error crítico al conectar con MongoDB:', error.message);
        throw error;
    }
}