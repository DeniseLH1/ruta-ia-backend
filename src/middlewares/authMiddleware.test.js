import assert from 'node:assert/strict';
import test from 'node:test';
import { authorizeRoles } from './authMiddleware.js';

// Verifica que la autorización de rol rechace acceso antes de ejecutar la ruta.
test('authorizeRoles rechaza roles no permitidos', () => {
    let responseStatus;
    let nextCalled = false;
    const res = {
        status(status) {
            responseStatus = status;
            return this;
        },
        json() {
            return this;
        }
    };

    authorizeRoles('admin')({ user: { role: 'student' } }, res, () => {
        nextCalled = true;
    });

    assert.equal(responseStatus, 403);
    assert.equal(nextCalled, false);
});
