import { Router } from 'express';
import { deleteOwnConsultation, getMyHistory, postConsultation, postRate, putRate, getStats, getHistorialConsultas, getHistorialEstudiante } from '../controllers/consultationController.js';
import { authenticate, authorizeRoles } from '../middlewares/authMiddleware.js';

const router = Router();

// POST /api/consultations - Realizar consulta 
router.post('/', authenticate, authorizeRoles('student'), postConsultation);

router.get('/mine', authenticate, authorizeRoles('student'), getMyHistory);

// GET /api/consultation/student/:studentId - Historial de un estudiante
router.get('/student/:studentId', authenticate, getHistorialEstudiante);

// GET /api/consultation - Ver historial completo
router.get('/', authenticate, authorizeRoles('admin'), getHistorialConsultas);

router.delete('/:id', authenticate, authorizeRoles('student'), deleteOwnConsultation);

// POST /api/consultations/:id/rate - Calificar una recomendación 
router.post('/:id/rate', authenticate, authorizeRoles('student'), postRate);
router.put('/:id/rate', authenticate, authorizeRoles('student'), putRate);

// GET /api/consultation/stats - Estadísticas básicas
router.get('/stats', authenticate, authorizeRoles('admin'), getStats);

export default router;