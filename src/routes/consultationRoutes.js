import { Router } from 'express';
import { postConsultation, postRate, getStats, getHistorialConsultas } from '../controllers/consultationController.js';

const router = Router();

// POST /api/consultations - Realizar consulta 
router.post('/', postConsultation);

// GET /api/consultations - Ver historial completo
router.get('/', getHistorialConsultas);

// POST /api/consultations/:id/rate - Calificar una recomendación 
router.post('/:id/rate', postRate);

// GET /api/consultations/stats - Estadísticas básicas 
router.get('/stats', getStats);

export default router;