import * as consultationRepository from '../repositories/consultationRepository.js';
import * as studentRepository from '../repositories/studentRepository.js';
import axios from 'axios';

export async function processConsultation(studentId, mensaje) {
    if (!mensaje || mensaje.trim() === '') {
        throw new Error('La pregunta no puede estar vacía.');
    }
    const student = await studentRepository.findStudentById(studentId);
    if (!student) {
        throw new Error('El estudiante no existe en el sistema.');
    }
    // Registrar consulta con estado inicial "Pendiente"
    const initialData = {
        studentId: student._id,
        estudianteNombre: student.nombreCompleto,
        mensaje,
        estado: 'Pendiente',
        fecha: new Date()
    };
    const savedConsultation = await consultationRepository.createConsultation(initialData);
    const consultationId = savedConsultation.id;
   try {
        const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL || 'http://localhost:5678/webhook/chat_curso';
        // Enviar a n8n 
        const response = await axios.post(N8N_WEBHOOK_URL, {
            consultationId: consultationId.toString(),
            mensaje,
            nivelExperiencia: student.nivelExperiencia,
            areaInteres: student.areaInteres
        });
        const n8nData = response.data;
        // Detecta si n8n devolvió texto plano o un objeto JSON
        let respuestaIA = 'No se generó respuesta.';
        if (typeof n8nData === 'string') {
            respuestaIA = n8nData;
        } else if (n8nData && typeof n8nData === 'object') {
            respuestaIA = n8nData.respuesta || n8nData.content || n8nData.message || 'No se generó respuesta.';
        }
        const fuentes = (n8nData && typeof n8nData === 'object' && n8nData.fuentes) ? n8nData.fuentes : [];
        const estadoFinal = (respuestaIA !== 'No se generó respuesta.' && respuestaIA.trim() !== '') ? 'Respondida' : 'Sin resultados';
        // Actualizar la consulta con la respuesta y fuentes definitivas
        const updated = await consultationRepository.updateConsultation(consultationId, {
            estado: estadoFinal,
            respuesta: respuestaIA,
            fuentes
        });
        return updated;
    } catch (error) {
        console.error('Error al procesar la consulta con n8n:', error.message);
        await consultationRepository.updateConsultation(consultationId, {
            estado: 'Error',
            errorDetalle: error.message
        });
        throw new Error('¡Error! :( Ocurrió un error al procesar tu consulta.');
    }
}

// Calificación (1 a 5) y comentario opcional
export async function rateConsultation(consultationId, calificacion, comentario) {
    if (calificacion < 1 || calificacion > 5) {
        throw new Error('La calificación debe ser un valor entre 1 y 5.');
    }
    const consultation = await consultationRepository.findConsultationById(consultationId);
    if (!consultation) {
        throw new Error('La recomendación no existe.');
    }
    if (consultation.calificacion) {
        throw new Error('Esta recomendación ya ha sido calificada anteriormente.');
    }
    return await consultationRepository.updateConsultation(consultationId, {
        calificacion,
        comentario: comentario || '',
        fechaCalificacion: new Date()
    });
}

// Estadísticas
export async function getStatistics() {
    return await consultationRepository.getConsultationStatistics();
}

// Historial 
export async function getHistory() {
    return await consultationRepository.findAllConsultations();
}