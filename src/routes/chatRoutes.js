import express from 'express';
import { consultarAsistente } from '../controllers/chatController.js';

const router = express.Router();

router.post('/chat', consultarAsistente);

export default router;