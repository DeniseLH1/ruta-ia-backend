//Manejo de errores general para la aplicación
export function errorHandler(err, req, res, next) {
    // Imprime el error en consola del servidor para propósitos de depuración (debugging)
    console.error('[Error capturado]:', err.message);
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Error interno del servidor.';
    // Evita exponer detalles internos de la base de datos o fallos críticos
    if (
        message.includes('obligatorio') || 
        message.includes('inválido') || 
        message.includes('registrado') ||
        message.includes('vacía') ||
        message.includes('debe ser')
    ) {
        // Bad Request para validaciones de datos
        statusCode = 400; 
    } else if (
        message.includes('no existe') || 
        message.includes('no se pudo encontrar')
    ) {
        // Not Found cuando un recurso no se halla
        statusCode = 404; 
    }
    // Responde al cliente con un formato estructurado y predecible
    res.status(statusCode).json({
        status: 'error',
        statusCode: statusCode,
        message: message
    });
}