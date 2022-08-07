import { useEffect, useState, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Spinner, useToast } from '@chakra-ui/react';

import { IExamen, hacerExamen, getUserByID, getExamenByID, useCertificacion, empezarCertificacion } from 'data';
import { onFailure } from 'ui';
import { LayoutContext, LoginContext } from '../../../../shared/context';

import { PortadaExamen } from './PortadaExamen';
import { ContenidoExamen } from './ContenidoExamen';

const CertificacionesExam = () => {
  const toast = useToast();
  const navigate = useNavigate();

  const { user, setUser } = useContext(LoginContext);

  const { certificacionId, examenId } = useParams<any>();
  const { certificacion } = useCertificacion({
    id: +(certificacionId || 0),
    strategy: 'invalidate-on-undefined',
    certificacionesIniciadas: user?.progresoGlobal?.meta?.certificacionesIniciadas || [],
    certificacionesCompletadas: user?.progresoGlobal?.meta?.certificacionesCompletadas || [],
  });

  const [examen, setExamen] = useState<IExamen>();
  const [estado, setEstado] = useState<'portada' | 'iniciado'>('portada');

  const { setShowHeader, setShowSidebar } = useContext(LayoutContext);

  useEffect(() => {
    setShowHeader(estado !== 'iniciado');
    setShowSidebar(false);
  }, [estado]);

  useEffect(() => {
    refreshState();
  }, [certificacionId]);

  const refreshState = async () => {
    const examenData = await getExamenByID({ id: +(examenId || 0) });
    setExamen(examenData);
  };

  const onStart = async () => {
    if (!examen?.certificacionId) {
      onFailure(toast, 'Error inesperado', 'Se ha intentado empezar una certificación sin ID. Contacte con soporte.');
      return;
    }

    await empezarCertificacion({ id: +examen?.certificacionId })
      .then(async () => {
        setEstado('iniciado');

        if (user?.id) {
          const _user = await getUserByID({ id: user?.id });

          if (_user?.id) setUser({ ..._user });
          else console.error({ '⚠️ Error actualizando el usuario': _user });
        }
      })
      .catch((err) =>
        onFailure(toast, 'Error inesperado', 'Fallo al empezar la certificación. Por favor, contacte con soporte.')
      );
  };

  const onFinish = async (respuestas: any, tiempoUtilizado: number) => {
    if (!examen?.id) return;

    await hacerExamen({ id: examen?.id, respuestas })
      .then(async (response) => {
        if (user?.id) {
          // Actualizamos el valor de la context de nuestro usuario, para actualizar el array
          // de certificaciones con este intento, además de otros valores del progreso global.
          const _user = await getUserByID({ id: user?.id });

          if (_user?.id) setUser({ ..._user });
          else console.error({ '⚠️ Error actualizando el usuario': _user });

          // Calculamos el número de intentos restantes
          const certificacion = _user?.certificaciones?.find((c: any) => c.id === examen?.certificacionId);
          const numIntentosRestante = (examen?.numIntentos || 0) - (certificacion?.meta?.pivot_intento || 0);

          // Pasamos a la landing de certificaciones el resultado del examen.
          navigate(`/certificaciones/${certificacion?.id}`, {
            state: {
              aprobado: response.aprobada,
              preguntasTotales: response.totalPreguntas,
              preguntasCorrectas: response.totalCorrectas,
              intentosRestantes: numIntentosRestante,
              intentosTotales: examen?.numIntentos,
              tiempoUtilizado: tiempoUtilizado,
            },
          });
        }
      })
      .catch((err) => onFailure(toast, 'Error inesperado', 'Error al finalizar el examen. Por favor, contacte con soporte.'));
  };

  return !examen ? (
    <Spinner />
  ) : estado === 'portada' ? (
    <PortadaExamen examen={examen} onStart={onStart} />
  ) : (
    <ContenidoExamen examen={examen} onFinish={onFinish} nivel={certificacion?.nivel} />
  );
};

export default CertificacionesExam;
