import axios from 'axios';

// Borra por el ID de Mongo guardado en el payload antes de desactivar el curso.
export async function removeCourseVector(courseId) {
    const baseUrl = (process.env.QDRANT_URL || 'http://localhost:6333').replace(/\/+$/, '');
    try {
        const response = await axios.post(
            `${baseUrl}/collections/cursos_ia/points/delete`,
            {
                filter: {
                    must: [{ key: 'mongo_id', match: { value: String(courseId) } }]
                }
            },
            {
                timeout: 10000,
                headers: process.env.QDRANT_API_KEY
                    ? { 'api-key': process.env.QDRANT_API_KEY }
                    : undefined
            }
        );

        if (response.data?.status !== 'ok') {
            throw new Error('Qdrant no confirmó la eliminación del vector del curso.');
        }
    } catch (error) {
        console.error('No se pudo eliminar el vector del curso en Qdrant:', error.message);
        const qdrantError = new Error('No se pudo sincronizar el curso con Qdrant; no se desactivó en MongoDB.');
        qdrantError.code = 'QDRANT_ERROR';
        throw qdrantError;
    }
}
