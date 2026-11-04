import * as consultationService from '../services/consultaService.js';

// Procesa la consulta enviada y devuelve el resultado.
export async function postConsultation(req, res) {
    try {
        const { mensaje } = req.body ?? {};
        const result = await consultationService.processConsultation(req.user.id, mensaje);
        return res.status(200).json({ status: 'success', data: result });
    } catch (error) {
        const statusCode = error.message.includes('no existe') || error.message.includes('vacía') ? 400 : 500;
        return res.status(statusCode).json({ status: 'error', message: error.message });
    }
}

// La identidad viene del token; no acepta un ID de estudiante enviado por el navegador.
export async function getMyHistory(req, res) {
    try {
        const history = await consultationService.getStudentHistory(req.user.id);
        return res.status(200).json({ status: 'success', total: history.length, data: history });
    } catch (error) {
        return res.status(500).json({ status: 'error', message: error.message });
    }
}

// La ruta solo archiva consultas cuyo propietario coincide con el token autenticado.
export async function deleteOwnConsultation(req, res) {
    try {
        await consultationService.archiveStudentConsultation(req.params.id, req.user.id);
        return res.status(200).json({ status: 'success', message: 'Consulta eliminada de tu historial.' });
    } catch (error) {
        const statusCode = error.message.includes('No se pudo eliminar') ? 404 : 500;
        return res.status(statusCode).json({ status: 'error', message: error.message });
    }
}

// Registra la calificación y el comentario de una consulta.
export async function postRate(req, res) {
    try {
        const { id } = req.params;
        const { calificacion, comentario } = req.body;
        const result = await consultationService.rateConsultation(id, req.user.id, calificacion, comentario);
        return res.status(200).json({ status: 'success', message: 'Calificación registrada con éxito.', data: result });
    } catch (error) {
        const statusCode = error.message.includes('No tienes permiso')
            ? 403
            : error.message.includes('no existe') ? 404 : 400;
        return res.status(statusCode).json({ status: 'error', message: error.message });
    }
}

// Permite cambiar la puntuación y el comentario ya guardados para una consulta propia.
export async function putRate(req, res) {
    try {
        const { calificacion, comentario } = req.body ?? {};
        const result = await consultationService.updateConsultationRating(
            req.params.id,
            req.user.id,
            calificacion,
            comentario
        );
        return res.status(200).json({ status: 'success', message: 'Calificación actualizada.', data: result });
    } catch (error) {
        const statusCode = error.message.includes('No se pudo editar') ? 404 : 400;
        return res.status(statusCode).json({ status: 'error', message: error.message });
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

export async function getHistorialEstudiante(req, res) {
    try {
        if (req.user.role !== 'admin' && req.user.id !== req.params.studentId) {
            return res.status(403).json({ status: 'error', message: 'Solo puedes consultar tu propio historial.' });
        }
        const history = await consultationService.getStudentHistory(req.params.studentId);
        return res.status(200).json({ status: 'success', total: history.length, data: history });
    } catch (error) {
        const statusCode = error.message.includes('no es válido') ? 400 : 500;
        return res.status(statusCode).json({ status: 'error', message: error.message });
    }
}