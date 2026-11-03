# RutaIA - Sistema Inteligente de Orientación Académica y Recomendación de Cursos

**RutaIA** es una aplicación web desarrollada para una institución educativa que permite a los estudiantes consultar el catálogo de cursos y recibir recomendaciones académicas personalizadas mediante un sistema inteligente basado en búsqueda semántica y generación aumentada por recuperación (RAG).

---

## Integrante:
* **Jennifer Denise López Hernández** 

---

##  Descripción del Problema y Solución
### Problemática
Actualmente, los estudiantes consultan el catálogo de cursos de forma manual y no logran identificar que curso se ajusta mejor a sus intereses, conocimientos previos y objetivos profesionales.

### Solución Propuesta
Se desarrolló una plataforma que comprende la intención del estudiante, genera embeddings de la consulta, realiza una búsqueda semántica con precisión en una base de datos vectorial (Qdrant), y utiliza un Modelo de Lenguaje Grande (LLM vía OpenRouter) para generar una respuesta fundamentada en los cursos activos registrados en la institución.

---

## Tecnologías y Arquitectura

El sistema sigue una arquitectura modular en capas (rutas, controladores, servicios, repositorios) y está compuesto por:
* **Backend:** Node.js, Express, Axios, dotenv.
* **Base de Datos Principal:** MongoDB (con controlador nativo).
* **Base de Datos Vectorial:** Qdrant (almacenamiento de embeddings y payloads de cursos).
* **Automatización y Orquestación:** n8n (Flujos de indexación y consulta RAG).
* **Inteligencia Artificial:** OpenRouter.
* **Infraestructura:** Docker y Docker Compose.

---

## Estructura del Proyecto

```text
ruta-ia-backend/
│
├── n8n-workflow/
│   ├── Consulta_RAG.json
│   └── Indexación_cursos.json
│
├── src/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   (chatController, courseController, studentController, consultationController)
│   ├── repositories/
│   │   (courseRepository, studentRepository, consultationRepository)
│   ├── routes/
│   │   (chatRoutes, courseRoutes, studentRoutes, consultationRoutes)
│   └── services/
│       (courseService, studentService, consultaService)
│
├── .env.example
├── .gitignore
├── docker-compose.yml
├── package-lock.json
├── package.json
└── server.js
``` 

## Requisitos de Instalación y Configuración
**Clonar el repositorio:**
``` 
git clone https://github.com/DeniseLH1/ruta-ia-backend.git
cd ruta-ia-backend
```
**Instalar dependencias de Node.js:**
```
npm install
```
**Configurar las variables de entorno:**
Crea un archivo .env basado en .env.example:
- PORT=3000
- MONGODB_URI=mongodb://localhost:27017
- DB_NAME=ruta_ia_db
- N8N_WEBHOOK_URL=http://localhost:5678/webhook-test/chat_curso
- QDRANT_URL=http://localhost:6333/dashboard

**Ejecución de Contenedores y Servicios**
Levantar infraestructura (Qdrant y n8n):
```
docker-compose up -d
```
**Iniciar el servidor backend:**
```
npm run dev 
```
**Importar los workflows de n8n:**
1. Abre la interfaz de n8n en http://localhost:5678.

2. Importa los archivos JSON ubicados en la carpeta n8n-workflow/ (Indexación_cursos.json y Consulta_RAG.json).

3. Activa los flujos y verifica las credenciales de OpenRouter.

## Endpoints Principales de la API
1. Estudiantes (/api/students)
POST /api/students - Registrar un estudiante. Requiere `nombreCompleto`, `email`, `nivelExperiencia` y `areaInteres`; si falta uno, la respuesta indica cuál es obligatorio. Los niveles permitidos son `Principiante`, `Intermedio` y `Avanzado`.

GET /api/students - Listar todos los estudiantes registrados.

GET /api/students/:id - Consultar un estudiante por ID.

2. Cursos (/api/courses)
GET /api/courses - Consulta cursos activos (permite filtrar por categoria y nivel).

GET /api/courses/:id - Obtener detalles de un curso específico.

POST /api/courses - Registrar un nuevo curso. Requiere `nombre`, `descripcion`, `categoria`, `nivel` y `duración`; si falta uno, la respuesta indica cuál es obligatorio. La duración debe ser un número mayor a cero y los niveles permitidos son `Básico`, `Intermedio` y `Avanzado`.

PUT /api/courses/:id - Actualizar información del curso.

PATCH /api/courses/:id/disable - Desactivar un curso.

3. Consultas Inteligentes y RAG 
POST /api/consultations - Envía la pregunta de un estudiante, procesa el flujo RAG a través de n8n y almacena la recomendación con sus fuentes.

GET /api/consultations - Muestra el historial completo de consultas con fecha, estado y fuentes.

POST /api/consultations/:id/rate - Permite registrar una calificación única (1 a 5) y un comentario opcional.

GET /api/consultations/stats - Obtiene estadísticas básicas (total de consultas, respondidas, sin resultados, promedio de calificaciones y curso más recomendado).

## Pruebas Obligatorias
El sistema ha sido probado con los casos de uso obligatorios definidos por la academia, incluyendo:

- Consultas sobre desarrollo web, Java/Spring Boot, análisis de datos, automatización, IA, ciberseguridad y contenedores.

- Caso de control (Cocina italiana): Valida el comportamiento del sistema cuando no existe información suficiente en el catálogo, retornando un estado de "Sin resultados".

- Validación de errores ante preguntas vacías o estudiantes inexistentes.