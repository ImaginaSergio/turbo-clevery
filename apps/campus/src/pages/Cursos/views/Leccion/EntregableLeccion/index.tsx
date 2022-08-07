import { useContext, useState, useEffect } from 'react';

import { Flex, useToast } from '@chakra-ui/react';

import { onFailure } from 'utils';
import { addEntregable, getEntregables } from 'data';
import { FavoritosContext, LoginContext } from '../../../../../shared/context';
import { ILeccion, IFavorito, IEntregable, FavoritoTipoEnum, EntregableEstadoEnum } from 'data';
import { EntregaItem, CorregidoItem, EnunciadoItem, HeaderEntregable, AutoCorreccionItem } from './EntregablesItems';

enum ModeEnum {
  ENUNCIADO,
  ENTREGA,
  AUTOCORRECION,
  CORREGIDO,
}

export const EntregableLeccion = ({
  leccion,
  onLeccionCompleted,
  setEstadoEntregable,
}: {
  leccion: ILeccion;
  onLeccionCompleted: (leccion: ILeccion) => void;
  setEstadoEntregable: (estado: EntregableEstadoEnum) => void;
}) => {
  const toast = useToast();
  const { user } = useContext(LoginContext);

  const [entregable, setEntregable] = useState<IEntregable>();
  const [mode, setMode] = useState<ModeEnum>(ModeEnum.ENUNCIADO);
  const [leccionFavorito, setLeccionFavorito] = useState<IFavorito>();
  const [estado, setEstado] = useState<EntregableEstadoEnum>(entregable?.estado || EntregableEstadoEnum.PENDIENTE_ENTREGA);

  const { favoritos, addFavorito, removeFavorito } = useContext(FavoritosContext);

  useEffect(() => {
    setEntregable(undefined);
    setMode(ModeEnum.ENUNCIADO);
  }, [leccion?.id]);

  useEffect(() => {
    if (favoritos?.length > 0 && leccion?.id)
      setLeccionFavorito(favoritos?.find((f) => f.tipo === FavoritoTipoEnum.LECCION && f.objetoId === leccion?.id));
  }, [favoritos, leccion?.id]);

  useEffect(() => {
    (async () => {
      const entregableData = await getEntregables({
        client: 'campus',
        strategy: 'invalidate-on-undefined',
        query: [{ leccion_id: leccion?.id }, { user_id: user?.id }],
      });

      const _entregable = entregableData.data[0];

      //  Si está creado, lo agregamos al estado
      if (_entregable?.id) {
        const _estado = _entregable?.estado || EntregableEstadoEnum.PENDIENTE_ENTREGA;

        setEntregable(_entregable);
        setEstado(_estado);
        setEstadoEntregable(_estado);
      }
    })();
  }, [leccion?.id]);

  useEffect(() => {
    if (entregable?.estado === EntregableEstadoEnum.PENDIENTE_CORRECCION) setMode(ModeEnum.AUTOCORRECION);
    // Si el entregable ya está entregado, mostramos la solucion
  }, [entregable, leccion?.id]);

  useEffect(() => {
    if (entregable?.estado === EntregableEstadoEnum.CORRECTO) setMode(ModeEnum.CORREGIDO);
    if (entregable?.estado === EntregableEstadoEnum.ERROR) setMode(ModeEnum.CORREGIDO);
    // Si el entregable ya está corregido, mostramos la solución y las observaciones, y no dejamos modificarlo
  }, [entregable?.estado, leccion?.id]);

  const refreshEntregable = async () => {
    if (!leccion?.id || !user?.id) return;

    if (entregable?.id) {
      setMode(ModeEnum.ENTREGA);
    } else
      addEntregable({
        entregable: {
          contenido: `Ejercicio de ${leccion?.titulo} (ID: ${leccion?.id}) - ${user?.nombre} ${user?.apellidos}`,
          leccionId: leccion?.id,
          userId: user?.id,
          estado: EntregableEstadoEnum.PENDIENTE_ENTREGA,
          correccionVista: false,
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
            const _estado = _entregable?.estado || EntregableEstadoEnum.PENDIENTE_ENTREGA;

            setEntregable(_entregable);
            setEstado(_estado);
            setEstadoEntregable(_estado);

            setMode(ModeEnum.ENTREGA);
          } else
            onFailure(toast, 'Error inesperado', 'Algo ha fallado al crear el entregable. Por favor contacta con soporte.');
        })
        .catch(() => {
          onFailure(toast, 'Error inesperado', 'Algo ha fallado al crear el entregable. Por favor contacta con soporte.');
        });
  };

  const realizarEntrega = async () => {
    const entregableData = await getEntregables({
      client: 'campus',
      strategy: 'invalidate-on-undefined',
      query: [{ leccion_id: leccion?.id }, { user_id: user?.id }],
    });

    const _entregable = entregableData.data[0];

    //  Si está creado, lo agregamos al estado
    if (_entregable?.id) {
      setEntregable(entregableData.data[0]);
      setEstado(EntregableEstadoEnum.PENDIENTE_CORRECCION);
      setEstadoEntregable(EntregableEstadoEnum.PENDIENTE_CORRECCION);

      setMode(ModeEnum.AUTOCORRECION);

      // TODO: Por ahora, completamos la lección al entregar el ejercicio. Más adelante sería SOLO al corregirse el mismo y estar aprobado.
      onLeccionCompleted(leccion);
    } else {
      onFailure(toast, 'Error inesperado', 'Algo ha fallado al crear el entregable. Por favor contacta con soporte.');
    }
  };

  return (
    <Flex gap="40px" boxSize="100%" direction="column" px={{ base: '20px', sm: '0px' }} pt={{ base: '20px', sm: '0px' }}>
      <HeaderEntregable
        estado={estado}
        leccion={leccion}
        entregable={entregable}
        addFavorito={addFavorito}
        removeFavorito={removeFavorito}
        leccionFavorito={leccionFavorito}
      />

      {mode === ModeEnum.ENUNCIADO && <EnunciadoItem leccion={leccion} refreshEntregable={refreshEntregable} />}

      {mode === ModeEnum.ENTREGA && (
        <EntregaItem
          leccion={leccion}
          entregable={entregable}
          setEntregable={setEntregable}
          realizarEntrega={realizarEntrega}
        />
      )}

      {mode === ModeEnum.AUTOCORRECION && <AutoCorreccionItem leccion={leccion} refreshEntregable={refreshEntregable} />}

      {mode === ModeEnum.CORREGIDO && <CorregidoItem leccion={leccion} entregable={entregable} />}
    </Flex>
  );
};
