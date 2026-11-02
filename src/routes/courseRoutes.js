import { Router } from 'express';
import {
  postRegisterCourse,
  getCatalog,
  getCourseDetails,
  putUpdateCourse,
  patchDisableCourse
} from '../controllers/courseController.js';

const router = Router();

// GET /api/courses - Consultar cursos activos
router.get('/', getCatalog);

// GET /api/courses/:id - Consultar un curso por ID
router.get('/:id', getCourseDetails);

// POST /api/courses - Registrar un nuevo curso 
router.post('/', postRegisterCourse);

// PUT /api/courses/:id - Actualizar un curso 
router.put('/:id', putUpdateCourse);

// PATCH /api/courses/:id/disable - Desactivar un curso 
router.patch('/:id/disable', patchDisableCourse);

export default router;