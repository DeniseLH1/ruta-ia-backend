import bcrypt from 'bcryptjs';
import { timingSafeEqual } from 'node:crypto';
import * as studentRepository from '../repositories/studentRepository.js';
import * as studentService from './studentService.js';
import { createAccessToken } from './authTokenService.js';

// Centraliza el inicio de sesión estudiantil y administrativo sin exponer hashes.
function safeStringEquals(left, right) {
    const leftBuffer = Buffer.from(left);
    const rightBuffer = Buffer.from(right);
    return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

function createSession(user) {
    return {
        token: createAccessToken(user),
        user: {
            id: String(user.id),
            role: user.role,
            nombre: user.name,
            email: user.email
        }
    };
}

export async function registerStudentAccount(data) {
    const student = await studentService.registrerStudent(data);

    return createSession({
        id: student.id,
        role: 'student',
        name: student.nombreCompleto,
        email: student.email
    });
}

export async function loginStudent(email, password) {
    const student = await studentRepository.findStudentByEmail(email.trim().toLowerCase());
    if (!student?.passwordHash || !(await bcrypt.compare(password, student.passwordHash))) {
        const error = new Error('Correo o contraseña incorrectos.');
        error.statusCode = 401;
        throw error;
    }

    return createSession({
        id: student._id,
        role: 'student',
        name: student.nombreCompleto,
        email: student.email
    });
}

export async function loginAdmin(username, password) {
    const expectedUsername = process.env.ADMIN_USERNAME;
    const expectedPassword = process.env.ADMIN_PASSWORD;
    if (!expectedUsername || !expectedPassword) {
        const error = new Error('ADMIN_USERNAME y ADMIN_PASSWORD deben estar configurados.');
        error.statusCode = 500;
        throw error;
    }

    if (
        typeof username !== 'string' ||
        typeof password !== 'string' ||
        !safeStringEquals(username, expectedUsername) ||
        !safeStringEquals(password, expectedPassword)
    ) {
        const error = new Error('Credenciales de administrador incorrectas.');
        error.statusCode = 401;
        throw error;
    }

    return createSession({
        id: 'admin',
        role: 'admin',
        name: 'Administrador',
        email: expectedUsername
    });
}
