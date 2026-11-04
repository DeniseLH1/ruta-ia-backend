import { Router } from 'express';
import {
  postRegisterCourse,
  getCatalog,
  getCourseDetails,
  putUpdateCourse,
  patchDisableCourse
} from '../controllers/courseController.js';
import { authenticate, authorizeRoles } from '../middlewares/authMiddleware.js';

const router = Router();

// GET /api/courses - Consultar cursos activos
router.get('/', getCatalog);

// Devuelve también cursos inactivos; el middleware limita el acceso a administradores.
router.get('/admin', authenticate, authorizeRoles('admin'), getCatalog);

// GET /api/courses/:id - Consultar un curso por ID
router.get('/:id', getCourseDetails);

// POST /api/courses - Registrar un nuevo curso 
router.post('/', authenticate, authorizeRoles('admin'), postRegisterCourse);

// PUT /api/courses/:id - Actualizar un curso 
router.put('/:id', authenticate, authorizeRoles('admin'), putUpdateCourse);

// PATCH /api/courses/:id/disable - Desactivar un curso 
router.patch('/:id/disable', authenticate, authorizeRoles('admin'), patchDisableCourse);

export default router;