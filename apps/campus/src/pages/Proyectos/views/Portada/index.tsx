import { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { useToast } from '@chakra-ui/react';

import { onFailure } from 'ui';
import { useProyectoBoost } from 'data';

import { PortadaBase } from './PortadaBase';
import { ExamenAprobado } from './ExamenAprobado';
import { ExamenSuspendido } from './ExamenSuspendido';
import { LayoutContext } from '../../../../shared/context';

type ProyectoEstado = 'portada' | 'suspendido' | 'aprobado';

const CertificacionesCover = () => {
  const toast = useToast();
  const props = useParams<any>();
  const location = useLocation();
  const navigate = useNavigate();

  const { setShowSidebar } = useContext(LayoutContext);

  const { data: proyecto, isError } = useProyectoBoost({
    id: +(props?.proyectoId || 0),
    strategy: 'invalidate-on-undefined',
  });

  const [estado, setEstado] = useState<ProyectoEstado>('portada');

  const [resultados, setResultados] = useState<
    | {
        intentosTotales: number;
        intentosRestantes: number;
        preguntasTotales: number;
        preguntasCorrectas: number;
        tiempoUtilizado: number;
      }
    | undefined
  >();

  useEffect(() => {
    setShowSidebar(false);
  }, []);

  useEffect(() => {
    const stateData: any = location.state;

    if (location.state === null) setEstado('portada');
    else {
      setEstado(stateData?.aprobado ? 'aprobado' : 'suspendido');
      setResultados(stateData);
    }
  }, [location.state]);

  useEffect(() => {
    if (isError) {
      navigate('/certificaciones');

      onFailure(toast, 'Error inesperado', 'La certificación no existe o no está disponible.');
    }
  }, [isError]);

  return estado === 'portada' ? (
    <PortadaBase proyecto={proyecto} />
  ) : estado === 'aprobado' ? (
    <ExamenAprobado proyecto={proyecto} resultados={resultados} />
  ) : (
    <ExamenSuspendido proyecto={proyecto} resultados={resultados} />
  );
};

export default CertificacionesCover;
