import { verifyAccessToken } from '../services/authTokenService.js';

// Valida el JWT y adjunta su identidad antes de entrar a rutas privadas.
export function authenticate(req, res, next) {
    const authorization = req.headers.authorization || '';
    const [scheme, token] = authorization.split(' ');

    if (scheme !== 'Bearer' || !token) {
        return res.status(401).json({ status: 'error', message: 'Debes iniciar sesión para continuar.' });
    }

    try {
        req.user = verifyAccessToken(token);
        return next();
    } catch (error) {
        if (error.code === 'JWT_CONFIGURATION_ERROR') {
            console.error('JWT_SECRET no está configurado.');
            return res.status(500).json({ status: 'error', message: 'La autenticación no está configurada.' });
        }
        return res.status(401).json({ status: 'error', message: 'La sesión es inválida o ha expirado.' });
    }
}

// Limita acciones sensibles a los roles declarados por cada ruta.
export function authorizeRoles(...roles) {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ status: 'error', message: 'No tienes permiso para realizar esta acción.' });
        }
        return next();
    };
}

// Impide consultar perfiles ajenos, excepto en las rutas de administración.
export function authorizeStudentOrAdmin(req, res, next) {
    if (req.user?.role === 'admin' || (req.user?.role === 'student' && req.user.id === req.params.id)) {
        return next();
    }
    return res.status(403).json({ status: 'error', message: 'Solo puedes consultar tu propia información.' });
}
