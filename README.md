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
QDRANT_URL=http://localhost:6333
QDRANT_API_KEY=
JWT_SECRET=un-secreto-aleatorio-de-al-menos-32-caracteres
ADMIN_USERNAME=admin
ADMIN_PASSWORD=una-contraseña-segura
CORS_ORIGINS=http://localhost:5173
```
`N8N_WEBHOOK_URL` debe apuntar al webhook de producción: `http://localhost:5678/webhook/chat_curso`. No uses `/webhook-test/chat_curso` para el chat normal: esa URL solo funciona mientras se ejecuta el workflow manualmente en modo de prueba. Tras cambiar el `.env`, reinicia el backend para que cargue la URL nueva. `QDRANT_URL` debe ser la URL base de Qdrant, sin `/dashboard`; el backend la usa para eliminar el vector al desactivar un curso y los workflows usan la dirección interna del servicio cuando se ejecutan en Docker.

`JWT_SECRET` debe ser aleatorio, mantenerse privado y tener al menos 32 caracteres. `ADMIN_USERNAME` y `ADMIN_PASSWORD` crean el acceso administrativo. No reutilices contraseñas de otras cuentas ni subas `.env` al repositorio. Los estudiantes nuevos crean su cuenta con correo y contraseña. Los estudiantes registrados antes de añadir autenticación necesitan que el administrador migre su cuenta de forma controlada; no pueden reclamarla solo con el correo.

**Ejecución de contenedores y servicios**
Levantar infraestructura (Qdrant y n8n):
```
docker-compose up -d
```
**Iniciar el servidor backend:**
```
npm run dev 
```
**Ejecutar pruebas automatizadas del backend:**
```
npm test
```
**Documentación Swagger:** con el backend activo, abre [http://localhost:3000/api-docs](http://localhost:3000/api-docs). La especificación OpenAPI en JSON está disponible en [http://localhost:3000/api-docs.json](http://localhost:3000/api-docs.json). Estas URLs sirven como evidencia consultable de los endpoints documentados.

**Importar los workflows de n8n:**
1. Abre la interfaz de n8n en http://localhost:5678.

2. Importa los archivos JSON ubicados en la carpeta n8n-workflow/ (Indexación_cursos.json y Consulta_RAG.json).

3. Verifica las credenciales de OpenRouter y activa el workflow `Consulta_RAG` una sola vez en n8n. Cuando esté activo, el nodo Webhook recibe automáticamente cada pregunta del backend; no hace falta pulsar **Execute workflow** por cada consulta. El workflow `Indexación_cursos` sí se ejecuta manualmente cuando quieras volver a indexar cursos.

## Acceso, historial y administración

- Los estudiantes crean una cuenta con contraseña y entran con su correo. El backend emite un JWT con rol `student`; el frontend envía ese token al hacer consultas.
- El administrador entra con `ADMIN_USERNAME` y `ADMIN_PASSWORD`. Puede ver las estadísticas y desactivar cursos desde el panel.
- El historial solo devuelve las consultas del estudiante autenticado. Al eliminar una consulta se oculta del historial, pero se conserva para las estadísticas. Cada estudiante puede calificar una consulta respondida una vez y luego editar su propia calificación o comentario.
- Al desactivar un curso desde el panel, el backend elimina su punto de Qdrant antes de marcarlo inactivo en MongoDB. Si Qdrant no confirma la operación, la API informa el error y no desactiva el curso.
- Las cuentas estudiantiles existentes que no tienen contraseña requieren una migración confiable antes de iniciar sesión. No es seguro permitir que una persona reclame una cuenta solo con su correo.

## Despliegue en Render

Hay un `render.yaml` por repositorio porque frontend y backend se mantienen separados. En Render crea cada servicio desde el repositorio correspondiente y revisa sus variables antes de publicar:

1. En el backend configura `MONGODB_URI`, `DB_NAME`, `QDRANT_URL`, `QDRANT_API_KEY` si tu instancia lo requiere, `N8N_WEBHOOK_URL`, `ADMIN_USERNAME` y `ADMIN_PASSWORD`. Genera un valor secreto para `JWT_SECRET` y configura `CORS_ORIGINS` con la URL HTTPS del frontend. Nunca pongas credenciales reales en `render.yaml`.
2. Usa servicios persistentes y accesibles desde Render para MongoDB, Qdrant y n8n. Docker Compose local no se despliega automáticamente desde estos archivos.
3. En el frontend configura `VITE_API_BASE_URL` con la URL HTTPS del backend y vuelve a desplegar para que Vite incorpore la dirección.
4. En los workflows de n8n cambia las URLs locales de Qdrant y backend por los endpoints accesibles desde Render y configura las credenciales necesarias. Activa `Consulta_RAG` y prueba el recorrido completo antes de entregar.

La configuración deja listos los servicios de frontend y backend; no crea ni publica los servicios externos ni ejecuta un despliegue.

El workflow `Indexación_cursos` crea `cursos_ia` si falta (1536 dimensiones, distancia Cosine) y la reutiliza si ya existe. Registra al menos 20 cursos activos y ejecuta el workflow después de importar los cambios para indexarlos con el campo `estado` y los IDs deterministas. Si la colección ya existe con otra configuración de vectores, corrige esa configuración en Qdrant antes de indexar.

El workflow `Consulta_RAG` busca hasta cinco cursos activos, aplica un umbral inicial de similitud de `0.35` y devuelve `respuesta`, `fuentes` y `estado` (`Respondida` o `Sin resultados`). El umbral es un valor inicial que debe ajustarse tras probar consultas representativas contra el catálogo institucional.

## Endpoints Principales de la API
1. Estudiantes (/api/students)
- `POST /api/students` - Registrar estudiante y crear sesión. Requiere nombre, correo, contraseña (mínimo 8 caracteres), nivel y área de interés.

- `GET /api/students` - Listar todos los estudiantes registrados (administrador).

- `GET /api/students/:id` - Consultar un estudiante por ID.

2. Cursos (/api/courses)
- `GET /api/courses` - Consultar cursos activos; permite filtrar con `categoria` y `nivel`.

- `GET /api/courses/:id` - Obtener detalles de un curso específico.

- `POST /api/courses` - Registrar un nuevo curso. Requiere `nombre`, `descripcion`, `categoria`, `nivel` y `duración`; si falta uno, la respuesta indica cuál es obligatorio. La duración debe ser un número mayor a cero y los niveles permitidos son `Básico`, `Intermedio` y `Avanzado`.

- `PUT /api/courses/:id` - Actualizar información del curso.

- `PATCH /api/courses/:id/disable` - Desactivar un curso.

3. Consultas Inteligentes y RAG 
- `POST /api/consultation` - Envía una consulta RAG autenticada. Recibe `mensaje`; el estudiante se identifica por JWT.

- `GET /api/consultation` - Mostrar el historial de consultas con fecha, estado y fuentes.

- `GET /api/consultation/student/:studentId` - Consultar el historial de un estudiante.
- `GET /api/consultation/mine` - Consultar el historial del estudiante autenticado.
- `DELETE /api/consultation/:id` - Ocultar una consulta propia del historial sin eliminarla de las estadísticas.
- `POST /api/consultation/:id/rate` - Registrar una calificación única (de 1 a 5) y un comentario opcional.
- `PUT /api/consultation/:id/rate` - Editar la calificación propia.

- `GET /api/consultation/stats` - Obtener estadísticas (total de consultas, respondidas, sin resultados, promedio de calificaciones y curso más recomendado).

4. Asistente de chat
- `POST /api/chat/chat` - Envía un mensaje al asistente conectado a n8n (estudiante autenticado). Recibe `mensaje`.

5. Autenticación
- `POST /api/auth/student/login` - Iniciar sesión de estudiante con correo y contraseña.
- `POST /api/auth/admin/login` - Iniciar sesión administrativa con credenciales configuradas en variables de entorno.
- `GET /api/auth/me` - Verificar la sesión JWT actual.

## Pruebas Obligatorias
El sistema ha sido probado con los casos de uso obligatorios definidos por la academia, incluyendo:

- Consultas sobre desarrollo web, Java/Spring Boot, análisis de datos, automatización, IA, ciberseguridad y contenedores.

- Caso de control (Cocina italiana): Valida el comportamiento del sistema cuando no existe información suficiente en el catálogo, retornando un estado de "Sin resultados".

- Validación de errores ante preguntas vacías o estudiantes inexistentes.
