import axios from 'axios';

export const consultarAsistente = async (req, res) => {
  try {
    const { mensaje } = req.body;

    if (!mensaje) {
      return res.status(400).json({ error: 'El mensaje es requerido.' });
    }

    // URL de producción del webhook de n8n
    const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL || 'http://localhost:5678/webhook/chat_curso';

    const response = await axios.post(N8N_WEBHOOK_URL, { mensaje });

    return res.json({
      respuesta: response.data.respuesta
    });

  } catch (error) {
    console.error('Error al conectar con n8n RAG:', error.message);
    return res.status(500).json({ 
      error: 'Ocurrió un error al procesar tu consulta con el asistente.' 
    });
  }
};