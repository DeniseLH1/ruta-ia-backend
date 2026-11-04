import { Router } from 'express';
import { postConsultation, postRate, getStats, getHistorialConsultas, getHistorialEstudiante } from '../controllers/consultationController.js';

const router = Router();

// POST /api/consultations - Realizar consulta 
router.post('/', postConsultation);

// GET /api/consultation/student/:studentId - Historial de un estudiante
router.get('/student/:studentId', getHistorialEstudiante);

// GET /api/consultation - Ver historial completo
router.get('/', getHistorialConsultas);

// POST /api/consultations/:id/rate - Calificar una recomendación 
router.post('/:id/rate', postRate);

// GET /api/consultation/stats - Estadísticas básicas
router.get('/stats', getStats);

export default router;