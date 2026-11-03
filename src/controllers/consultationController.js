import * as consultationService from '../services/consultaService.js';

// Procesa la consulta enviada y devuelve el resultado.
export async function postConsultation(req, res) {
    try {
        const { studentId, mensaje } = req.body;
        if (!studentId) {
            return res.status(400).json({ status: 'error', message: 'El ID del estudiante es obligatorio.' });
        }
        const result = await consultationService.processConsultation(studentId, mensaje);
        return res.status(200).json({ status: 'success', data: result });
    } catch (error) {
        const statusCode = error.message.includes('no existe') || error.message.includes('vacía') ? 400 : 500;
        return res.status(statusCode).json({ status: 'error', message: error.message });
    }
}

// Registra la calificación y el comentario de una consulta.
export async function postRate(req, res) {
    try {
        const { id } = req.params;
        const { calificacion, comentario } = req.body;
        const result = await consultationService.rateConsultation(id, calificacion, comentario);
        return res.status(200).json({ status: 'success', message: 'Calificación registrada con éxito.', data: result });
    } catch (error) {
        return res.status(400).json({ status: 'error', message: error.message });
    }
}

// Obtiene las estadísticas de las consultas.
export async function getStats(req, res) {
    try {
        const stats = await consultationService.getStatistics();
        return res.status(200).json({ status: 'success', data: stats });
    } catch (error) {
        return res.status(500).json({ status: 'error', message: error.message });
    }
}

// Devuelve el historial completo de consultas y su cantidad total.
export async function getHistorialConsultas(req, res) {
    try {
        const history = await consultationService.getHistory();
        return res.status(200).json({ status: 'success', total: history.length, data: history });
    } catch (error) {
        return res.status(500).json({ status: 'error', message: error.message });
    }
}