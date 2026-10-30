import * as studentRepository from '../repositories/studentRepository.js';

//Definimos los niveles de experiencia qu son permitidos 
const ALLOWED_LEVELS = ['Principiante', 'Intermedio', 'Avanzado'];

// Reglas del negocio para registrar un nuevo estudiante
export async function registrerStudent(data) {
    const {nombreCompleto, email, nivelExperiencia, areaInteres }=data;
    // Validación de campos obligatorios
    if(!nombreCompleto || !email || !nivelExperiencia || !areaInteres){
        throw new Error('Este campo es obligatorio');
    }
    // Validación de nivel de experiencia que son permitidos 
    if(!ALLOWED_LEVELS.includes(nivelExperiencia)){
        throw new Error('Nivel de experiencia inválido')
    }
    // Verifica si el correo ya está registrado 
    const existingStudent = await studentRepository.findStudentByEmail(email);
    if (existingStudent){
        throw new Error('Este correo ya se encuentra registrado por favor ingresa otro');
    }

    //Creación de la estructura del estudiante 
    const newStudentData = {
        nombreCompleto,
        email,
        nivelExperiencia,
        areaInteres,
        fechaRegistro: new Date()
    };

    const savedStudent = await studentRepository.createStudent(newStudentData);
    return savedStudent;
}

// Obtiene la lista de todos los estudiantes
export async function getAllStudents() {
    return await studentRepository.findAllStudents();
}

// Obtener un estudiante por su ID
export async function getStudentById(id) {
    const student = await studentRepository.findStudentById(id);
    if(!student){
        throw new Error('El estudiante no existe en el sistema');
    }
    return student;
}