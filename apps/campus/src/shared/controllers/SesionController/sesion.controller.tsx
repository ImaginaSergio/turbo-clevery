import { useEffect, useState, useContext } from 'react';

import { addSesion, getUserByID, updateSesion, getSesionActual } from 'data';
import { LoginContext } from '../../context';
import { useSessionTimeout, DEFAULT_EVENTS, useInterval } from 'utils';

import { EVENTO_VIDEO_PLAY, EVENTO_VIDEO_PAUSE, TEMPORIZADOR_INACTIVIDAD, TEMPORIZADOR_ACTUALIZAR_SESION } from './types';

export const SesionController = () => {
  const { user, setUser } = useContext(LoginContext);

  const [currentSesion, setCurrentSesion] = useState<any>();

  useEffect(() => {
    // Cuando cerramos el navegador, tenemos que guardar la sesión también
    window.onbeforeunload = (e) => onIdle();

    return () => onIdle();
  }, []);

  useEffect(() => {
    refreshSesionState();
  }, [user]);

  useEffect(() => {
    refreshProgresoContext();
  }, [currentSesion]);

  /**
   * Método para actualizar el objeto Sesion activo en el campus. (Sólo útil si no tenemos guardado en el estado una sesión.)
   *
   * Caso 1: El usuario entra por primera vez al campus -> Se crea una nueva Sesion.
   * Caso 2: El usuario entra al campus, habiendo entrado no hace más de 5 minutos -> Se recupera la sesión anterior con getSesionActual()
   * Caso 3: El usuario ya está iniciado en el campus, pero este método se ejecuta igualmente -> No hacemos nada.
   */
  const refreshSesionState = async () => {
    // Al abrir el navegador (Siempre y cuando estemos registrados), empezamos una nueva sesión.
    if (user && !currentSesion) {
      const sesion = await getSesionActual();

      if (sesion?.value?.id) setCurrentSesion(sesion?.value);
      else
        await addSesion({
          segundos: 0,
          createdAt: new Date().toISOString().substring(0, 19),
        })
          .then((response) => setCurrentSesion({ ...response?.value?.data }))
          .catch((error) => error);
    }
  };

  /**
   * Sobre cada cambio de la sesión actual,
   * actualizamos el contexto del progreso global.
   */
  const refreshProgresoContext = async () => {
    if (user?.id) {
      const _user = await getUserByID({ id: user?.id, client: 'campus' });

      if (_user?.id) setUser({ ..._user });
      else console.error({ '⚠️ Error actualizando el usuario': _user });
    }
  };

  /**
   * Método utilizado para actualizar el estado de la sesión actual, añadiendo segundos al objeto.
   * Si no existe una sesión (porque se ha ejecutado el método onIdle, que borra el estado), creamos una sesión nueva.
   */
  const updateSesionState = async (updateInterval: number) => {
    // Si se ejecuta el método onIdle, dejamos currentSesion a undefined
    // por lo que hace falta crear una nueva sesión.

    if (user && !currentSesion?.id) {
      return await addSesion({
        createdAt: new Date().toISOString().substring(0, 19),
        segundos: 60,
      })
        .then((response) => response?.value?.data)
        .catch((error) => error);
    } else if (user) {
      // Le pasamos el intervalo de segundos que ha pasado, no los segundos totales
      return await updateSesion({
        id: currentSesion.id,
        sesion: { segundos: updateInterval },
      })
        .then((response) => response?.value?.data)
        .catch((error) => error);
    }
  };

  /**
   * Ejecutaremos este método cuando el usuario deje de interactuar
   * con el campus.
   */
  const onIdle = () => {
    if (!currentSesion?.id) return undefined;

    const startTime = new Date(getLasttimeActive());
    const endTime = new Date();

    updateSesion({
      id: currentSesion.id,
      sesion: {
        segundos: Math.floor((endTime.getTime() - startTime.getTime()) / 1000),
      },
    })
      .then((response) => setCurrentSesion(undefined))
      .catch((error) => error);
  };

  /**
   * Ejecutaremos este método cuando el usuario vuelva a interactuar
   * con el campus, estando previamente en el estado 'idle'.
   *
   * TODO: El método no se ejecuta desde useSessionTimeout. Revisar si hace falta este método para algo.
   */
  const onAction = () => updateSesionState(TEMPORIZADOR_ACTUALIZAR_SESION);

  const { timer, getLasttimeActive } = useSessionTimeout({
    timeout: TEMPORIZADOR_INACTIVIDAD,
    onIdle: onIdle,
    onAction: onAction,
    events: [...DEFAULT_EVENTS, EVENTO_VIDEO_PLAY, EVENTO_VIDEO_PAUSE], // Eventos para detectar si el usuario interactua con el campus
  });

  useInterval(async () => {
    if (timer) {
      const resultado = await updateSesionState(TEMPORIZADOR_ACTUALIZAR_SESION);

      if (resultado) setCurrentSesion({ ...resultado });
      else throw new Error('Fallo al actualizar el estado de la sesión');
    }
  }, 1000 * TEMPORIZADOR_ACTUALIZAR_SESION);

  return <></>;
};
