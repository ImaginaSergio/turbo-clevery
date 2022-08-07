import { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { useToast } from '@chakra-ui/react';

import { PortadaBase } from './PortadaBase';
import { ExamenAprobado } from './ExamenAprobado';
import { ExamenSuspendido } from './ExamenSuspendido';

import { onFailure } from 'ui';
import { IExamen, useCertificacion } from 'data';

import { LoginContext, LayoutContext } from '../../../../shared/context';

const CertificacionesCover = () => {
  const toast = useToast();
  const props = useParams<any>();
  const location = useLocation();
  const navigate = useNavigate();

  const { user } = useContext(LoginContext);
  const { setShowSidebar } = useContext(LayoutContext);

  const { certificacion, isLoading, isError } = useCertificacion({
    id: +(props?.certificacionId || 0),
    strategy: 'invalidate-on-undefined',
    certificacionesIniciadas: user?.progresoGlobal?.meta?.certificacionesIniciadas || [],
    certificacionesCompletadas: user?.progresoGlobal?.meta?.certificacionesCompletadas || [],
  });

  const [examen, setExamen] = useState<IExamen>();
  const [estado, setEstado] = useState<'portada' | 'suspendido' | 'aprobado'>('portada');
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
    if (certificacion?.examenes?.length > 0) setExamen(certificacion?.examenes[0]);
    else setExamen(undefined);
  }, [certificacion]);

  useEffect(() => {
    if (isError) {
      navigate('/certificaciones');

      onFailure(toast, 'Error inesperado', 'La certificación no existe o no está disponible.');
    }
  }, [isError]);

  return estado === 'portada' ? (
    <PortadaBase examen={examen} certificacion={certificacion} />
  ) : estado === 'aprobado' ? (
    <ExamenAprobado examen={examen} certificacion={certificacion} resultados={resultados} />
  ) : (
    <ExamenSuspendido examen={examen} certificacion={certificacion} resultados={resultados} />
  );
};

export default CertificacionesCover;
