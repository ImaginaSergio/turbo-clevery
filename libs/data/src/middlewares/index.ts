// Métodos internos
export * from './_middleware';

// Endpoints sobre Rutas
export * from './rutas/ruta.middleware';

// Endpoints sobre Foros
export * from './foros/foro.middleware';

// Endpoints sobre Configuracion
export * from './config/config.middleware';

// Endpoints sobre Noticias
export * from './noticias/noticia.middleware';

// Endpoints sobre Notificaciones
export * from './notificaciones/notificaciones.middleware';

// Endpoints sobre Cursos
export * from './cursos/nota.middleware';
export * from './cursos/curso.middleware';
export * from './cursos/modulo.middleware';
export * from './cursos/leccion.middleware';
export * from './cursos/progreso.middleware';
export * from './cursos/solucion.middleware';
export * from './cursos/entregable.middleware';
export * from './cursos/puntoclave.middleware';

// Endpoints sobre Boosts
export * from './boosts/boost.middleware';
export * from './boosts/proyectoboost.middleware';

// Endpoints sobre Usuarios
export * from './usuarios/auth.middleware';
export * from './usuarios/user.middleware';
export * from './usuarios/stats.middleware';
export * from './usuarios/grupo.middleware';
export * from './usuarios/sesion.middleware';
export * from './usuarios/progresoGlobal.middleware';

// Endpoints sobre Clientes
export * from './clientes/proceso.middleware';
export * from './clientes/empresa.middleware';

// Endpoints sobre Livecoder
export * from './livecoder/tests.middleware';
export * from './livecoder/lenguaje.middleware';
export * from './livecoder/livecoder.middleware';
export * from './livecoder/codemirror.middleware';

// Endpoints sobre Certificaciones
export * from './certificaciones/examen.middleware';
export * from './certificaciones/pregunta.middleware';
export * from './certificaciones/respuesta.middleware';
export * from './certificaciones/certificacion.middleware';

// Endpoints extra
export * from './extra/pais.middleware';
export * from './extra/estado.middleware';
export * from './extra/proyecto.middleware';
export * from './extra/favorito.middleware';
export * from './extra/habilidad.middleware';
export * from './extra/plantilla.middleware';
