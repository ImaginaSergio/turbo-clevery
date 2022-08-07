/** Cerraremos la sesión actual, haciendo el último post,
 *  cada X segundos, siendo X el valor de esta constante. */
const TEMPORIZADOR_INACTIVIDAD = 60;

/** Actualizaremos el valor de la sesión actual cada
 *  X segundos, siendo X el valor de esta constante. */
const TEMPORIZADOR_ACTUALIZAR_SESION = 60;

/** Cada X segundos, siendo X el valor de esta constante,
 * enviaremos un evento de actividad de video en ejecución. */
const TEMPORIZADOR_ACTIVIDAD_VIDEOS = 30;

/** Evento a ejecutar cuando el usuario empieza un video */
const EVENTO_VIDEO_PLAY = 'leccion_on_play';

/** Evento a ejecutar cuando el usuario pausa un video */
const EVENTO_VIDEO_PAUSE = 'leccion_on_pause';

export {
  TEMPORIZADOR_ACTUALIZAR_SESION,
  TEMPORIZADOR_INACTIVIDAD,
  TEMPORIZADOR_ACTIVIDAD_VIDEOS,
  EVENTO_VIDEO_PLAY,
  EVENTO_VIDEO_PAUSE,
};
