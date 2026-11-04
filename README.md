# RutaIA - Sistema Inteligente de Orientación Académica y Recomendación de Cursos

**RutaIA** es una aplicación web desarrollada para una institución educativa que permite a los estudiantes consultar el catálogo de cursos y recibir recomendaciones académicas personalizadas mediante un sistema inteligente basado en búsqueda semántica y generación aumentada por recuperación (RAG).

---

## Link frontend
https://github.com/DeniseLH1/ruta-ia-frontend.git

---

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
│   │   ├── chatController.js
│   │   ├── courseController.js
│   │   ├── studentController.js
│   │   └── consultationController.js
│   ├── middlewares/
│   │   └── errorMiddleware.js
│   ├── repositories/
│   │   ├── courseRepository.js
│   │   ├── studentRepository.js
│   │   └── consultationRepository.js
│   ├── routes/
│   │   ├── chatRoutes.js
│   │   ├── courseRoutes.js
│   │   ├── studentRoutes.js
│   │   └── consultationRoutes.js
│   └── services/
│       ├── courseService.js
│       ├── studentService.js
│       └── consultaService.js
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
Crea un archivo `.env` basado en `.env.example`. Para ejecutar localmente, configura:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017
DB_NAME=ruta_ia_db
N8N_WEBHOOK_URL=http://localhost:5678/webhook/chat_curso
```
`N8N_WEBHOOK_URL` debe apuntar al webhook de producción: `http://localhost:5678/webhook/chat_curso`. No uses `/webhook-test/chat_curso` para el chat normal: esa URL solo funciona mientras se ejecuta el workflow manualmente en modo de prueba. Tras cambiar el `.env`, reinicia el backend para que cargue la URL nueva. `QDRANT_URL` aparece en `.env.example`, pero el código actual no la utiliza: los workflows acceden a Qdrant usando `http://qdrant:6333` dentro de Docker.

**Ejecución de contenedores y servicios**
Levantar infraestructura (Qdrant y n8n):
```
docker-compose up -d
```
**Iniciar el servidor backend:**
```
npm run dev 
```
**Documentación Swagger:** con el backend activo, abre [http://localhost:3000/api-docs](http://localhost:3000/api-docs). La especificación OpenAPI en JSON está disponible en [http://localhost:3000/api-docs.json](http://localhost:3000/api-docs.json). Estas URLs sirven como evidencia consultable de los endpoints documentados.

**Importar los workflows de n8n:**
1. Abre la interfaz de n8n en http://localhost:5678.

2. Importa los archivos JSON ubicados en la carpeta n8n-workflow/ (Indexación_cursos.json y Consulta_RAG.json).

3. Verifica las credenciales de OpenRouter y activa el workflow `Consulta_RAG` una sola vez en n8n. Cuando esté activo, el nodo Webhook recibe automáticamente cada pregunta del backend; no hace falta pulsar **Execute workflow** por cada consulta. El workflow `Indexación_cursos` sí se ejecuta manualmente cuando quieras volver a indexar cursos.

El workflow `Indexación_cursos` crea `cursos_ia` si falta (1536 dimensiones, distancia Cosine) y la reutiliza si ya existe. Registra al menos 20 cursos activos y ejecuta el workflow después de importar los cambios para indexarlos con el campo `estado` y los IDs deterministas. Si la colección ya existe con otra configuración de vectores, corrige esa configuración en Qdrant antes de indexar.

El workflow `Consulta_RAG` busca hasta cinco cursos activos, aplica un umbral inicial de similitud de `0.35` y devuelve `respuesta`, `fuentes` y `estado` (`Respondida` o `Sin resultados`). El umbral es un valor inicial que debe ajustarse tras probar consultas representativas contra el catálogo institucional.

## Endpoints Principales de la API
1. Estudiantes (/api/students)
- `POST /api/students` - Registrar un estudiante. Requiere `nombreCompleto`, `email`, `nivelExperiencia` y `areaInteres`; si falta uno, la respuesta indica cuál es obligatorio. Los niveles permitidos son `Principiante`, `Intermedio` y `Avanzado`.

- `GET /api/students` - Listar todos los estudiantes registrados.

- `GET /api/students/:id` - Consultar un estudiante por ID.

2. Cursos (/api/courses)
- `GET /api/courses` - Consultar cursos activos; permite filtrar con `categoria` y `nivel`.

- `GET /api/courses/:id` - Obtener detalles de un curso específico.

- `POST /api/courses` - Registrar un nuevo curso. Requiere `nombre`, `descripcion`, `categoria`, `nivel` y `duración`; si falta uno, la respuesta indica cuál es obligatorio. La duración debe ser un número mayor a cero y los niveles permitidos son `Básico`, `Intermedio` y `Avanzado`.

- `PUT /api/courses/:id` - Actualizar información del curso.

- `PATCH /api/courses/:id/disable` - Desactivar un curso.

3. Consultas Inteligentes y RAG 
- `POST /api/consultation` - Envía una consulta RAG. Recibe `studentId` y `mensaje`, y almacena la recomendación y sus fuentes.

- `GET /api/consultation` - Mostrar el historial de consultas con fecha, estado y fuentes.

- `GET /api/consultation/student/:studentId` - Consultar el historial de un estudiante.

- `POST /api/consultation/:id/rate` - Registrar una calificación única (de 1 a 5) y un comentario opcional.

- `GET /api/consultation/stats` - Obtener estadísticas (total de consultas, respondidas, sin resultados, promedio de calificaciones y curso más recomendado).

4. Asistente de chat
- `POST /api/chat/chat` - Envía un mensaje al asistente conectado a n8n. Recibe `mensaje`.

## Pruebas Obligatorias
El sistema ha sido probado con los casos de uso obligatorios definidos por la academia, incluyendo:

- Consultas sobre desarrollo web, Java/Spring Boot, análisis de datos, automatización, IA, ciberseguridad y contenedores.

- Caso de control (Cocina italiana): Valida el comportamiento del sistema cuando no existe información suficiente en el catálogo, retornando un estado de "Sin resultados".

- Validación de errores ante preguntas vacías o estudiantes inexistentes.
