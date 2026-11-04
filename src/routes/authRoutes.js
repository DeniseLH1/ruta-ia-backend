import { Router } from 'express';
import { getCurrentSession, postAdminLogin, postStudentLogin } from '../controllers/authController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = Router();

// Rutas de acceso y verificación de sesión para ambos roles.
router.post('/student/login', postStudentLogin);
router.post('/admin/login', postAdminLogin);
router.get('/me', authenticate, getCurrentSession);

export default router;
