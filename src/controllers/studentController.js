import * as studentService from '../services/studentService.js';

// Registra un estudiante
export async function postRegisterStudent(req,res) {
    try{
        const student = await studentService.registrerStudent(req.body);
        return res.status(201).json({
            status:'success',
            message: 'Estudiante registrado exitosamente',
            data: student
        });
    }catch(error){
        return res.status(400).json({
            status:'error',
            message: error.message
        });
    }
}

export async function getStudentsList(req,res) {
    try{
        const students = await studentService.getAllStudents();
        return res.status(200).json({
            status: 'success',
            total: students.length,
            data: students
        });
    } catch(error){
        return res.status(500).json({
            status:'error',
            message: 'Error no se pudo listar los estudiantes'
        });
    }
}

// Consultar a un estudiante por su ID
export async function getStudentDetails(req,res) {
    try{
        const {id} = req.params;
        const student = await studentService.getStudentById(id);
        return res.status(200).json({
            status: 'success',
            data: student
        });
    }catch(error){
        const statusCode = error.message.includes('no existe') ? 404 : 400;
        return res.status(statusCode).json({
            status: 'error',
            message: error.message
        });
    }
}