import * as authService from '../services/authService.js';

// Valida credenciales de estudiantes y devuelve su sesión JWT.
export async function postStudentLogin(req, res) {
    try {
        const { email, password } = req.body ?? {};
        if (typeof email !== 'string' || typeof password !== 'string' || !password) {
            return res.status(400).json({ status: 'error', message: 'Correo y contraseña son obligatorios.' });
        }
        const session = await authService.loginStudent(email, password);
        return res.status(200).json({ status: 'success', data: session });
    } catch (error) {
        const statusCode = error.statusCode || (error.message.includes('JWT_SECRET') ? 500 : 401);
        return res.status(statusCode).json({ status: 'error', message: error.message });
    }
}

// El administrador se valida contra variables de entorno, no contra datos del cliente.
export async function postAdminLogin(req, res) {
    try {
        const { username, password } = req.body ?? {};
        const session = await authService.loginAdmin(username, password);
        return res.status(200).json({ status: 'success', data: session });
    } catch (error) {
        const statusCode = error.statusCode || (error.message.includes('JWT_SECRET') ? 500 : 401);
        if (statusCode === 500) console.error('No se pudo iniciar sesión como administrador:', error.message);
        return res.status(statusCode).json({ status: 'error', message: error.message });
    }
}

// Devuelve la identidad asociada al token para restaurar la sesión del frontend.
export function getCurrentSession(req, res) {
    return res.status(200).json({
        status: 'success',
        data: {
            id: req.user.id,
            role: req.user.role,
            nombre: req.user.name,
            email: req.user.email
        }
    });
}
