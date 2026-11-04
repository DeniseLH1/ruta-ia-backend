const errorSchema = {
  type: 'object',
  properties: {
    status: { type: 'string', example: 'error' },
    message: { type: 'string', example: 'El mensaje de error.' }
  }
};

const response = (description, schema) => ({
  description,
  content: {
    'application/json': {
      schema
    }
  }
});

const successEnvelope = (dataSchema, extraProperties = {}) => ({
  type: 'object',
  properties: {
    status: { type: 'string', example: 'success' },
    data: dataSchema,
    ...extraProperties
  }
});

const idParameter = {
  name: 'id',
  in: 'path',
  required: true,
  description: 'Identificador MongoDB de 24 caracteres hexadecimales.',
  schema: { type: 'string', pattern: '^[a-fA-F0-9]{24}$', example: '507f1f77bcf86cd799439011' }
};

const idSchema = { type: 'string', example: '507f1f77bcf86cd799439011' };
const studentSchema = {
  type: 'object',
  properties: {
    id: idSchema,
    _id: idSchema,
    nombreCompleto: { type: 'string', example: 'Ana Pérez' },
    email: { type: 'string', format: 'email', example: 'ana@example.com' },
    nivelExperiencia: { type: 'string', enum: ['Principiante', 'Intermedio', 'Avanzado'] },
    areaInteres: { type: 'string', example: 'Desarrollo web' },
    fechaRegistro: { type: 'string', format: 'date-time' }
  }
};

const courseSchema = {
  type: 'object',
  properties: {
    id: idSchema,
    _id: idSchema,
    nombre: { type: 'string', example: 'Desarrollo web con React' },
    descripcion: { type: 'string', example: 'Fundamentos para crear interfaces web modernas.' },
    categoria: { type: 'string', example: 'Desarrollo web' },
    nivel: { type: 'string', enum: ['Básico', 'Intermedio', 'Avanzado'] },
    duración: { type: 'number', minimum: 0, exclusiveMinimum: true, example: 40 },
    estado: { type: 'string', enum: ['activo', 'inactivo'], example: 'activo' },
    fechaCreacion: { type: 'string', format: 'date-time' }
  }
};

const sourceSchema = {
  type: 'object',
  properties: {
    id: idSchema,
    nombre: { type: 'string' },
    descripcion: { type: 'string' },
    categoria: { type: 'string' },
    nivel: { type: 'string' },
    duracion: { type: 'number' },
    similitud: { type: 'number', minimum: 0, maximum: 1, example: 0.82 }
  }
};

const consultationSchema = {
  type: 'object',
  properties: {
    id: idSchema,
    _id: idSchema,
    studentId: idSchema,
    estudianteNombre: { type: 'string' },
    mensaje: { type: 'string' },
    respuesta: { type: 'string' },
    fuentes: { type: 'array', items: sourceSchema },
    estado: { type: 'string', enum: ['Pendiente', 'Respondida', 'Sin resultados', 'Error'] },
    fecha: { type: 'string', format: 'date-time' },
    calificacion: { type: 'integer', minimum: 1, maximum: 5 },
    comentario: { type: 'string' },
    errorDetalle: { type: 'string' }
  }
};

const studentRequestSchema = {
  type: 'object',
  required: ['nombreCompleto', 'email', 'nivelExperiencia', 'areaInteres'],
  properties: {
    nombreCompleto: { type: 'string', minLength: 1, example: 'Ana Pérez' },
    email: { type: 'string', format: 'email', example: 'ana@example.com' },
    nivelExperiencia: { type: 'string', enum: ['Principiante', 'Intermedio', 'Avanzado'] },
    areaInteres: { type: 'string', minLength: 1, example: 'Desarrollo web' }
  }
};

const courseRequestSchema = {
  type: 'object',
  required: ['nombre', 'descripcion', 'categoria', 'nivel', 'duración'],
  properties: {
    nombre: { type: 'string', minLength: 1, example: 'Desarrollo web con React' },
    descripcion: { type: 'string', minLength: 1, example: 'Fundamentos para crear interfaces web modernas.' },
    categoria: { type: 'string', minLength: 1, example: 'Desarrollo web' },
    nivel: { type: 'string', enum: ['Básico', 'Intermedio', 'Avanzado'] },
    duración: { type: 'number', minimum: 0, exclusiveMinimum: true, example: 40 }
  }
};

const consultationRequestSchema = {
  type: 'object',
  required: ['studentId', 'mensaje'],
  properties: {
    studentId: idSchema,
    mensaje: { type: 'string', minLength: 1, example: 'Quiero aprender a crear páginas web.' }
  }
};

export const openapiSpecification = {
  openapi: '3.0.3',
  info: {
    title: 'RutaIA API',
    version: '1.0.0',
    description: 'API REST de RutaIA para estudiantes, catálogo de cursos, consultas RAG, historial, calificaciones y estadísticas. Express y MongoDB.'
  },
  servers: [
    { url: 'http://localhost:3000', description: 'Servidor Express local' }
  ],
  tags: [
    { name: 'Salud', description: 'Estado del servidor' },
    { name: 'Estudiantes', description: 'Registro y consulta de estudiantes' },
    { name: 'Cursos', description: 'Catálogo y administración de cursos' },
    { name: 'Consultas', description: 'Consultas RAG, historial, calificaciones y estadísticas' },
    { name: 'Chat', description: 'Asistente conectado a n8n' }
  ],
  paths: {
    '/': {
      get: {
        tags: ['Salud'],
        summary: 'Comprobar que la API está disponible',
        responses: {
          200: response('Servidor disponible.', {
            type: 'object',
            properties: {
              status: { type: 'string', example: 'success' },
              message: { type: 'string', example: 'Bienvenido a RutaIA' },
              version: { type: 'string', example: '1.0.0' }
            }
          })
        }
      }
    },
    '/api/students': {
      post: {
        tags: ['Estudiantes'],
        summary: 'Registrar un estudiante',
        description: 'Los niveles válidos son Principiante, Intermedio y Avanzado. El correo debe ser único.',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: studentRequestSchema } }
        },
        responses: {
          201: response('Estudiante registrado.', successEnvelope(studentSchema, {
            message: { type: 'string', example: 'Estudiante registrado exitosamente' }
          })),
          400: response('Datos inválidos o correo ya registrado.', errorSchema)
        }
      },
      get: {
        tags: ['Estudiantes'],
        summary: 'Listar estudiantes registrados',
        responses: {
          200: response('Lista de estudiantes.', successEnvelope({
            type: 'array',
            items: studentSchema
          }, { total: { type: 'integer', example: 1 } })),
          500: response('No fue posible consultar los estudiantes.', errorSchema)
        }
      }
    },
    '/api/students/{id}': {
      get: {
        tags: ['Estudiantes'],
        summary: 'Consultar un estudiante por ID',
        parameters: [idParameter],
        responses: {
          200: response('Estudiante encontrado.', successEnvelope(studentSchema)),
          400: response('Identificador inválido.', errorSchema),
          404: response('Estudiante inexistente.', errorSchema)
        }
      }
    },
    '/api/courses': {
      get: {
        tags: ['Cursos'],
        summary: 'Listar cursos activos',
        description: 'Permite filtrar por categoría y nivel.',
        parameters: [
          { name: 'categoria', in: 'query', schema: { type: 'string' }, example: 'Desarrollo web' },
          { name: 'nivel', in: 'query', schema: { type: 'string', enum: ['Básico', 'Intermedio', 'Avanzado'] } }
        ],
        responses: {
          200: response('Catálogo de cursos activos.', successEnvelope({
            type: 'array',
            items: courseSchema
          }, { total: { type: 'integer', example: 20 } })),
          400: response('Filtro inválido.', errorSchema)
        }
      },
      post: {
        tags: ['Cursos'],
        summary: 'Registrar un curso',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: courseRequestSchema } }
        },
        responses: {
          201: response('Curso registrado y activo.', successEnvelope(courseSchema, {
            message: { type: 'string', example: 'Curso registrado exitosamente.' }
          })),
          400: response('Datos del curso inválidos.', errorSchema)
        }
      }
    },
    '/api/courses/{id}': {
      get: {
        tags: ['Cursos'],
        summary: 'Consultar curso por ID',
        parameters: [idParameter],
        responses: {
          200: response('Curso encontrado.', successEnvelope(courseSchema)),
          404: response('Curso inexistente.', errorSchema)
        }
      },
      put: {
        tags: ['Cursos'],
        summary: 'Actualizar un curso',
        description: 'Aplica los campos enviados sobre el curso existente.',
        parameters: [idParameter],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { ...courseRequestSchema, required: undefined } } }
        },
        responses: {
          200: response('Curso actualizado.', successEnvelope(courseSchema)),
          400: response('Datos inválidos o curso no encontrado.', errorSchema)
        }
      }
    },
    '/api/courses/{id}/disable': {
      patch: {
        tags: ['Cursos'],
        summary: 'Desactivar un curso',
        description: 'Cambia el estado del curso a inactivo; dejará de aparecer en el catálogo.',
        parameters: [idParameter],
        responses: {
          200: response('Curso desactivado.', successEnvelope(courseSchema)),
          400: response('No fue posible desactivar el curso.', errorSchema)
        }
      }
    },
    '/api/consultation': {
      post: {
        tags: ['Consultas'],
        summary: 'Enviar una consulta RAG',
        description: 'Guarda primero la consulta y luego envía mensaje, identificador y perfil del estudiante al webhook de n8n.',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: consultationRequestSchema } }
        },
        responses: {
          200: response('Consulta procesada y guardada.', successEnvelope(consultationSchema)),
          400: response('Consulta vacía, estudiante inexistente o identificador inválido.', errorSchema),
          500: response('Falló n8n, Qdrant u OpenRouter; la consulta queda marcada con error.', errorSchema)
        }
      },
      get: {
        tags: ['Consultas'],
        summary: 'Consultar historial completo',
        responses: {
          200: response('Consultas ordenadas desde la más reciente.', successEnvelope({
            type: 'array',
            items: consultationSchema
          }, { total: { type: 'integer', example: 1 } })),
          500: response('No fue posible consultar el historial.', errorSchema)
        }
      }
    },
    '/api/consultation/student/{studentId}': {
      get: {
        tags: ['Consultas'],
        summary: 'Consultar historial de un estudiante',
        parameters: [{
          ...idParameter,
          name: 'studentId',
          description: 'Identificador MongoDB del estudiante.'
        }],
        responses: {
          200: response('Historial del estudiante. Una lista vacía indica que no tiene consultas.', successEnvelope({
            type: 'array',
            items: consultationSchema
          }, { total: { type: 'integer', example: 0 } })),
          400: response('Identificador inválido.', errorSchema),
          500: response('No fue posible consultar el historial.', errorSchema)
        }
      }
    },
    '/api/consultation/{id}/rate': {
      post: {
        tags: ['Consultas'],
        summary: 'Calificar una consulta respondida',
        description: 'Acepta una única calificación entera entre 1 y 5 y un comentario opcional.',
        parameters: [idParameter],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['calificacion'],
                properties: {
                  calificacion: { type: 'integer', minimum: 1, maximum: 5, example: 5 },
                  comentario: { type: 'string', example: 'La recomendación fue útil.' }
                }
              }
            }
          }
        },
        responses: {
          200: response('Calificación guardada.', successEnvelope(consultationSchema, {
            message: { type: 'string', example: 'Calificación registrada con éxito.' }
          })),
          400: response('Calificación inválida, consulta no respondida o ya calificada.', errorSchema)
        }
      }
    },
    '/api/consultation/stats': {
      get: {
        tags: ['Consultas'],
        summary: 'Obtener estadísticas básicas',
        responses: {
          200: response('Estadísticas calculadas desde MongoDB.', successEnvelope({
            type: 'object',
            properties: {
              totalConsultas: { type: 'integer', example: 25 },
              consultasRespondidas: { type: 'integer', example: 20 },
              consultasSinResultados: { type: 'integer', example: 3 },
              consultasError: { type: 'integer', example: 2 },
              promedioCalificaciones: { type: 'number', example: 4.5 },
              cursoMasRecomendado: { type: 'string', example: 'Desarrollo web con React' }
            }
          })),
          500: response('No fue posible calcular las estadísticas.', errorSchema)
        }
      }
    },
    '/api/chat/chat': {
      post: {
        tags: ['Chat'],
        summary: 'Enviar un mensaje al asistente conectado a n8n',
        description: 'Endpoint de chat sin asociación de estudiante ni registro de historial. Para recomendaciones con historial, usa POST /api/consultation.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['mensaje'],
                properties: { mensaje: { type: 'string', minLength: 1, example: '¿Qué curso recomiendan para aprender Python?' } }
              }
            }
          }
        },
        responses: {
          200: response('Respuesta del asistente.', {
            type: 'object',
            properties: { respuesta: { type: 'string' } }
          }),
          400: response('El mensaje es obligatorio.', errorSchema),
          500: response('No fue posible procesar el mensaje.', errorSchema)
        }
      }
    }
  },
  components: {
    schemas: {
      Error: errorSchema,
      Student: studentSchema,
      Course: courseSchema,
      CourseSource: sourceSchema,
      Consultation: consultationSchema
    }
  }
};
