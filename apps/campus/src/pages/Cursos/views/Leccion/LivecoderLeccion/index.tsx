import { useContext, useEffect, useState } from 'react';

import { ILeccion, ILivecoder, IEntregable, addEntregable, getLivecoders, getEntregables, EntregableEstadoEnum } from 'data';

import { onFailure } from 'utils';
import { Flex, useToast } from '@chakra-ui/react';

import { EntregableHeader } from './Header';
import { EstadoEntrega } from './EstadoEntrega';
import { EstadoEnunciado } from './EstadoEnunciado';
import { LoginContext } from '../../../../../shared/context';

enum EstadoEnum {
  ENUNCIADO,
  ENTREGA,
}

function LivecoderLeccion({
  leccion,
  setEstadoEntregable,
}: {
  leccion?: ILeccion;
  setEstadoEntregable: (estado: EntregableEstadoEnum) => void;
}) {
  const toast = useToast();
  const { user } = useContext(LoginContext);

  const [livecoder, setLivecoder] = useState<ILivecoder>();
  const [entregable, setEntregable] = useState<IEntregable>();
  const [estado, setEstado] = useState<EstadoEnum>(EstadoEnum.ENUNCIADO);

  useEffect(() => {
    // Actualizamos el estado del Livecoder
    refreshLivecoder();

    // Actualizamos el estado del Entregable
    refreshEntregable();
  }, [leccion?.id]);

  const refreshLivecoder = async () => {
    if (!leccion?.id) return;

    const livecoderData = await getLivecoders({
      client: 'admin',
      query: [{ leccion_id: leccion?.id }],
    });

    let _livecoder = livecoderData?.data[0];

    if (_livecoder?.id) setLivecoder(_livecoder);
    else setLivecoder(undefined);
  };

  const refreshEntregable = async () => {
    const entregableData = await getEntregables({
      client: 'campus',
      strategy: 'invalidate-on-undefined',
      query: [{ leccion_id: leccion?.id }, { user_id: user?.id }],
    });

    // Si está creado lo agregamos al estado
    // (Si no está creado, esperaremos a que el usuario quiera empezar la entrega)
    if (entregableData?.meta?.total === 1) {
      const _entregable = entregableData.data[0];

      if (_entregable?.id) {
        setEntregable(_entregable);
        setEstadoEntregable(_entregable.estado);
      }
    }
  };

  const onStartEjercicio = async () => {
    if (!leccion?.id || !user?.id) return;

    if (!entregable?.id)
      addEntregable({
        entregable: {
          userId: user?.id,
          leccionId: leccion?.id,
          correccionVista: false,
          estado: EntregableEstadoEnum.PENDIENTE_ENTREGA,
          contenido: `Ejercicio de ${leccion?.titulo} (ID: ${leccion?.id}) - ${user?.nombre} ${user?.apellidos}`,
        },
      })
        .then(async () => {
          const entregableData = await getEntregables({
            client: 'campus',
            strategy: 'invalidate-on-undefined',
            query: [{ leccion_id: leccion?.id }, { user_id: user?.id }],
          });

          const _entregable = entregableData.data[0];

          //  Si está creado, lo agregamos al estado
          if (_entregable?.id) {
            setEntregable(_entregable);
            setEstadoEntregable(_entregable.estado);

            setEstado(EstadoEnum.ENTREGA);
          } else
            onFailure(toast, 'Error inesperado', 'Algo ha fallado al crear el entregable. Por favor contacta con soporte.');
        })
        .catch(() => {
          onFailure(toast, 'Error inesperado', 'Algo ha fallado al crear el entregable. Por favor contacta con soporte.');
        });
    else {
      // Volvemos a comprobar si la entrega está bloqueda.
      // Si el temporizador justo llega a 0 con el ejercicio abierto y le dan a "comenzar",
      // podrían empezar el ejercicio si no hacemos esta comprobación

      setEstado(EstadoEnum.ENTREGA);
    }
  };

  return (
    <Flex p="40px" bg="white" minH="700px" maxW="1582px" boxSize="100%" direction="column">
      <EntregableHeader leccion={leccion} entregable={entregable} />

      {estado === EstadoEnum.ENUNCIADO ? (
        <EstadoEnunciado leccion={leccion} entregable={entregable} onStart={onStartEjercicio} />
      ) : (
        <EstadoEntrega leccion={leccion} livecoder={livecoder} entregable={entregable} onFinishSubmit={refreshEntregable} />
      )}
    </Flex>
  );
}

export default LivecoderLeccion;
