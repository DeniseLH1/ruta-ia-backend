import * as courseService from '../services/courseService.js';

// Registra un nuevo curso
export async function postRegisterCourse(req, res) {
  try {
    const course = await courseService.registerCourse(req.body);
    return res.status(201).json({
      status: 'success',
      message: 'Curso registrado exitosamente.',
      data: course
    });
  } catch (error) {
    return res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
}

// Consulta y filtra cursos activos
export async function getCatalog(req, res) {
  try {
    const filters = req.query; 
    const courses = req.path === '/admin'
      ? await courseService.getAllCourses()
      : await courseService.getActiveCatalog(filters);
    return res.status(200).json({
      status: 'success',
      total: courses.length,
      data: courses
    });
  } catch (error) {
    return res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
}

// Consulta un curso por su ID
export async function getCourseDetails(req, res) {
  try {
    const { id } = req.params;
    const course = await courseService.getCourseById(id);
    return res.status(200).json({
      status: 'success',
      data: course
    });
  } catch (error) {
    return res.status(404).json({
      status: 'error',
      message: error.message
    });
  }
}

// Actualiza un curso
export async function putUpdateCourse(req, res) {
  try {
    const { id } = req.params;
    const updatedCourse = await courseService.updateExistingCourse(id, req.body);
    return res.status(200).json({
      status: 'success',
      message: 'Curso actualizado exitosamente.',
      data: updatedCourse
    });
  } catch (error) {
    return res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
}

// Desactiva un curso 
export async function patchDisableCourse(req, res) {
  try {
    const { id } = req.params;
    const disabledCourse = await courseService.disableCourse(id);
    return res.status(200).json({
      status: 'success',
      message: 'Curso desactivado correctamente.',
      data: disabledCourse
    });
  } catch (error) {
    const statusCode = error.code === 'QDRANT_ERROR' ? 503 : 400;
    return res.status(statusCode).json({
      status: 'error',
      message: error.message
    });
  }
}

// Reactiva un curso previamente desactivado
export async function patchEnableCourse(req, res) {
  try {
    const enabledCourse = await courseService.enableCourse(req.params.id);
    return res.status(200).json({
      status: 'success',
      message: 'Curso reactivado correctamente.',
      data: enabledCourse
    });
  } catch (error) {
    return res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
}