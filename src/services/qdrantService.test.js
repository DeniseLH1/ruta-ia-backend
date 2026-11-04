import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import test from 'node:test';
import { removeCourseVector } from './qdrantService.js';

// Comprueba que la desactivación borra por el ID de Mongo guardado en el payload.
test('removeCourseVector envía el filtro de mongo_id a Qdrant', async () => {
    const previousUrl = process.env.QDRANT_URL;
    let requestBody = '';
    let requestPath = '';
    const server = createServer((req, res) => {
        requestPath = req.url;
        req.on('data', (chunk) => { requestBody += chunk; });
        req.on('end', () => {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ status: 'ok' }));
        });
    });

    try {
        await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
        process.env.QDRANT_URL = `http://127.0.0.1:${server.address().port}`;
        await removeCourseVector('course-123');

        assert.equal(requestPath, '/collections/cursos_ia/points/delete');
        assert.deepEqual(JSON.parse(requestBody), {
            filter: {
                must: [{ key: 'mongo_id', match: { value: 'course-123' } }]
            }
        });
    } finally {
        if (previousUrl === undefined) delete process.env.QDRANT_URL;
        else process.env.QDRANT_URL = previousUrl;
        await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
    }
});
