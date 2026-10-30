import{connectDB} from '../config/db.js';
import {ObjectId} from 'mongodb';

const COLLECTION_NAME = 'estudiantes';

//Obtenemos la colección de estudiantes desde la base de datos.
async function getCollection(){
    const db = await connectDB();
    return db.collection(COLLECTION_NAME);
}

// Busca a un estudiante por su correo electrónico 
export async function findStudentByEmail(email){
    const collection = await getCollection();
    return await collection.findOne({email});
}

//Inserta un nuevo esudiante a la base de datos 
export async function createStudent(studentData) {
    const collection = await getCollection();
    const result = await collection.insertOne(studentData);
    return{ id: result.insertedId, ...studentData};
}

//Obtiene la lista de los estudiantes registrados 
export async function findAllStudents() {
    const collection = await  getCollection();
    return await collection.find({}).toArray();
}

//Busqurda de un estudiante por su ID
export async function findStudentById(id){
    try{
        const collection = await getCollection();
        if(!ObjectId.isValid(id)) return null;
        return await collection.findOne({_id: new ObjectId(id)});
    } catch(error){
        throw new Error('Error al buscar el estudiante')
    }
}