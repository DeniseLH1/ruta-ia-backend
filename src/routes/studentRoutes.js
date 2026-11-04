import { Router } from 'express';
import { postRegisterStudent, getStudentsList, getStudentDetails} from '../controllers/studentController.js';
import { authenticate, authorizeRoles, authorizeStudentOrAdmin } from '../middlewares/authMiddleware.js';

const router = Router();

// POST /api/students - Registrar un estudiante 
router.post('/', postRegisterStudent);

// GET /api/students - Listar todos los estudiantes
router.get('/', authenticate, authorizeRoles('admin'), getStudentsList);

// GET /api/students/:id - Consultar estudiante por ID 
router.get('/:id', authenticate, authorizeStudentOrAdmin, getStudentDetails);

export default router;