import { connectDB } from '../config/db.js';
import { ObjectId } from 'mongodb';

const COLLECTION_NAME = 'consultas';

async function getCollection() {
    const db = await connectDB();
    return db.collection(COLLECTION_NAME);
}

// Guarda la consulta inicial con estado Pendiente
export async function createConsultation(data) {
    const collection = await getCollection();
    const result = await collection.insertOne({
        ...data,
        estado: 'Pendiente',
        fecha: new Date()
    });
    return { id: result.insertedId, ...data };
}

// Actualiza estado, respuesta y fuentes
export async function updateConsultation(id, updateData) {
    const collection = await getCollection();
    if (!ObjectId.isValid(id)) return null;
    await collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData }
    );
    return await findConsultationById(id);
}

export async function findConsultationById(id) {
    const collection = await getCollection();
    if (!ObjectId.isValid(id)) return null;
    return await collection.findOne({ _id: new ObjectId(id) });
}

export async function findAllConsultations() {
    const collection = await getCollection();
    return await collection.find({}).sort({ fecha: -1 }).toArray();
}

// Calcula estadísticas básicas
export async function getConsultationStatistics() {
    const collection = await getCollection();
    const total = await collection.countDocuments();
    const respondidas = await collection.countDocuments({ estado: 'Respondida' });
    const sinResultados = await collection.countDocuments({ estado: 'Sin resultados' });
    const errores = await collection.countDocuments({ estado: 'Error' });
    // Promedio de calificaciones
    const pipelineRating = [
        { $match: { calificacion: { $exists: true, $ne: null } } },
        {
            $group: {
                _id: null,
                promedioCalificacion: { $avg: '$calificacion' }
            }
        }
    ];
    const ratingStats = await collection.aggregate(pipelineRating).toArray();
    const promedio = ratingStats.length > 0 ? ratingStats[0].promedioCalificacion : 0;
    // Curso más recomendado
    const pipelineCourse = [
        { $unwind: "$fuentes" },
        { $group: { _id: "$fuentes.nombre", total: { $sum: 1 } } },
        { $sort: { total: -1 } },
        { $limit: 1 }
    ];
    const topCourse = await collection.aggregate(pipelineCourse).toArray();
    const cursoMasRecomendado = topCourse.length > 0 ? topCourse[0]._id : 'Ninguno';
    return {
        totalConsultas: total,
        consultasRespondidas: respondidas,
        consultasSinResultados: sinResultados,
        consultasError: errores,
        promedioCalificaciones: Number(promedio.toFixed(2)),
        cursoMasRecomendado
    };
}