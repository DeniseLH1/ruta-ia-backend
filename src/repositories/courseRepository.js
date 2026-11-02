import {connectDB} from '../config/db.js';
import { ObjectId} from 'mongodb';

const COLLECTION_NAME = 'cursos';

// Obtenemos la colección de cursos
async function getCollection() {
    const db = await connectDB();
    return db.collection(COLLECTION_NAME);
}

// Inserta un nuevo curso 
export async function createCourse(courseData) {
    const collection = await getCollection();
    const result = await collection.insertOne(courseData);
    return { id: result.insertedId, ...courseData};
}

// Obtenemos los cursos registrados 
export async function findAllCourses() {
    const collection = await getCollection();
    return await collection.find({}).toArray();
}

//Obtenemos los cursos que están en estado activo
export async function findActiveCourses(filter = {}){
    const collection = await getCollection();
    const query ={ ...filter,estado: 'activo'};
    return await collection.find(query).toArray();
}

//Busca un curso por su ID
export async function findCourseById(id) {
    try{
        const collection = await getCollection();
        if(!ObjectId.isValid(id)) return null;
        return await collection.findOne({_id: new ObjectId(id)});
    }catch(error){
        throw new Error('No se encuentra ese curso en la base de datos')
    }
}

// Actualiza los datos de un curso existente 
export async function updateCourse(id, updateData) {
    try{
        const collection = await getCollection();
        if(!ObjectId.isValid(id)) return null;
        const result = await collection.findOneAndUpdate(
            {_id: new ObjectId(id)},
            {$set: updateData},
            {ReturnDocument: 'after'}
        );
        return result;
    }catch(error){
        throw new Error('No se pudo actualizar el curso')
    }
}

// Cambia el estado de un curso a inactivo
export async function desactivateCourse(id) {
    return await updateCourse(id,{estado: 'inactivo'});
}