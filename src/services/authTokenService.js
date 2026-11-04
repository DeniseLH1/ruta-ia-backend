import jwt from 'jsonwebtoken';

// Firma sesiones de corta duración con el rol y la identidad mínimos necesarios.
export function createAccessToken(user, secret = process.env.JWT_SECRET) {
    if (typeof secret !== 'string' || secret.length < 32) {
        const error = new Error('JWT_SECRET debe tener al menos 32 caracteres.');
        error.code = 'JWT_CONFIGURATION_ERROR';
        throw error;
    }

    return jwt.sign(
        { role: user.role, name: user.name, email: user.email },
        secret,
        { subject: String(user.id), expiresIn: '12h' }
    );
}

// Verifica firma, expiración e identidad antes de autorizar una petición.
export function verifyAccessToken(token, secret = process.env.JWT_SECRET) {
    if (typeof secret !== 'string' || secret.length < 32) {
        const error = new Error('JWT_SECRET debe tener al menos 32 caracteres.');
        error.code = 'JWT_CONFIGURATION_ERROR';
        throw error;
    }

    const payload = jwt.verify(token, secret);
    if (!payload.sub || !['admin', 'student'].includes(payload.role)) {
        throw new Error('El token no contiene un rol válido.');
    }

    return {
        id: payload.sub,
        role: payload.role,
        name: payload.name,
        email: payload.email
    };
}
