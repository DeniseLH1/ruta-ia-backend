import assert from 'node:assert/strict';
import test from 'node:test';
import { createAccessToken, verifyAccessToken } from './authTokenService.js';

// Confirma que el token preserva el rol y que no se acepta una firma alterada.
test('JWT conserva identidad y rechaza tokens manipulados', () => {
    const secret = 'test-secret-with-more-than-32-characters';
    const token = createAccessToken({
        id: 'student-123',
        role: 'student',
        name: 'Estudiante',
        email: 'student@example.com'
    }, secret);

    assert.deepEqual(verifyAccessToken(token, secret), {
        id: 'student-123',
        role: 'student',
        name: 'Estudiante',
        email: 'student@example.com'
    });
    assert.throws(() => verifyAccessToken(`${token}x`, secret));
});

test('JWT no se firma sin secreto configurado', () => {
    assert.throws(
        () => createAccessToken({ id: 'admin', role: 'admin' }, ''),
        { code: 'JWT_CONFIGURATION_ERROR' }
    );
    assert.throws(
        () => createAccessToken({ id: 'admin', role: 'admin' }, 'short'),
        { code: 'JWT_CONFIGURATION_ERROR' }
    );
});
