import { Router } from 'express';
import { postRegisterStudent, getStudentsList, getStudentDetails} from '../controllers/studentController.js';

const router = Router();

// POST /api/students - Registrar un estudiante 
router.post('/', postRegisterStudent);

// GET /api/students - Listar todos los estudiantes
router.get('/', getStudentsList);

// GET /api/students/:id - Consultar estudiante por ID 
router.get('/:id', getStudentDetails);

export default router;