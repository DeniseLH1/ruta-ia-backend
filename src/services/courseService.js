import * as courseRepository from '../repositories/courseRepository.js'

//Niveles permitidos para cursos
const ALLOWED_COURSE_LEVELS=['Básico','Intermedio','Avanzado'];

//Registra un nuevo curso
export async function registerCourse(data) {
    const{nombre,descripcion,categoria,nivel,duración} = data;
    // Campos obligatorios 
    if(!nombre || !descripcion || !categoria || !nivel || duración === undefined){
        throw new Error('Estos campos son obligatorios')
    }
    // La duración debe ser mayor a cero
    if(typeof duración !== 'number' || duración <= 0){
        throw new Error('La duración debe ser un numero mayor a cero');
    }
    //Validación de nivel de dificultad
    if(!ALLOWED_COURSE_LEVELS.includes(nivel)){
        throw new Error(`El nivel del curso es inválido. Recuerda los niveles permitidos son: ${ALLOWED_COURSE_LEVELS}`);
    } 
    //Estructura de cursos con estado activo
    const newCourseData = {
        nombre,
        descripcion,
        categoria,
        nivel,
        duración,
        estado: 'activo',
        fechaCreacion: new Date()
    };
    return await courseRepository.createCourse(newCourseData);
}

// Obtenemos lista de cursoso activos, para filtarra por categoríay nivel
export async function getActiveCatalog(queryParams) {
    const filter = {};
    // Filtra por categoría 
    if(queryParams.categoria){
        filter.categoria = queryParams.categoria;
    }
    // Filtra por nivel
    if(queryParams.nivel){
        if(!ALLOWED_COURSE_LEVELS.includes(queryParams.nivel)){
            throw new Error(`El nivel ${queryParams.nivel} es inválido`)
        }
        filter.nivel = queryParams.nivel;
    }
    return await courseRepository.findActiveCourses(filter);
}

// Obtenemos un curso por su id
export async function getCourseById(id) {
  const course = await courseRepository.findCourseById(id);
  if (!course) {
    throw new Error('El curso no existe.');
  }
  return course;
}

//Actualiza un curso
export async function updateExistingCourse(id, data) {
  // Validar que la duración sea mayor a cero
  if (data.duración !== undefined && (typeof data.duración !== 'number' || data.duración <= 0)) {
    throw new Error('La duración debe ser mayor que cero.');
  }

  const updatedCourse = await courseRepository.updateCourse(id, data);
  if (!updatedCourse) {
    throw new Error('No se pudo actualizar el curso. Verifica el ID.');
  }
  return updatedCourse;
}

// Desactivar un curso
export async function disableCourse(id) {
  const disabledCourse = await courseRepository.deactivateCourse(id);
  if (!disabledCourse) {
    throw new Error('No se pudo desactivar el curso. Verifica el ID.');
  }
  return disabledCourse;
}