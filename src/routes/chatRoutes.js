import express from 'express';
import { consultarAsistente } from '../controllers/chatController.js';
import { authenticate, authorizeRoles } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/chat', authenticate, authorizeRoles('student'), consultarAsistente);

export default router;