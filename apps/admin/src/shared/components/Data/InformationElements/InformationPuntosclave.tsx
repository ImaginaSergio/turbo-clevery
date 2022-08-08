import { useEffect, useState } from 'react';

import { BiPlus, BiTrash } from 'react-icons/bi';
import { Flex, Box, Icon, IconButton } from '@chakra-ui/react';

import { InformationInput } from '.';
import { IPuntoClave } from '@clevery/data';
import {
  addPuntoClave,
  getPuntosClave,
  removePuntoClave,
  updatePuntoClave,
} from '@clevery/data';

export interface InformationPuntosclaveProps {
  leccionId?: number;
  isDisabled?: boolean;
}

export const InformationPuntosclave = ({
  leccionId,
  isDisabled,
}: InformationPuntosclaveProps) => {
  const [puntosClave, setPuntosClave] = useState<IPuntoClave[]>([]);

  useEffect(() => {
    if (leccionId) refreshState();
  }, [leccionId]);

  const refreshState = async () => {
    const _puntosClave = await getPuntosClave({
      query: [{ leccion_id: leccionId }, { limit: 100 }],
      client: 'admin',
    });

    setPuntosClave([..._puntosClave]);
  };

  const updateValue = (id?: number, value?: any) => {
    if (!id || !leccionId)
      return Promise.reject({
        title: 'Error inesperado',
        message:
          'El ID de la entidad es indefinido. Por favor, contacte con soporte.',
      });

    return updatePuntoClave({ id, puntoClave: value, client: 'admin' }).then(
      () => refreshState()
    );
  };

  const onNewPuntoclave = () => {
    if (!leccionId)
      return Promise.reject({
        title: 'Error inesperado',
        message:
          'El ID de la entidad es indefinido. Por favor, contacte con soporte.',
      });

    addPuntoClave({
      puntoClave: {
        titulo: 'Nuevo punto clave',
        segundos: 0,
        publicado: true,
        leccionId: leccionId,
      },
    })
      .then((e) => refreshState())
      .catch((error) => console.log({ error }));
  };

  const onRemovePuntoclave = (id?: number) => {
    if (!leccionId || !id)
      return Promise.reject({
        title: 'Error inesperado',
        message:
          'El ID de la entidad es indefinido. Por favor, contacte con soporte.',
      });

    removePuntoClave({ id, client: 'admin' })
      .then((e) => refreshState())
      .catch((error) => console.log({ error }));
  };

  return (
    <Flex w="100%" direction="column" gap="10px">
      <Flex w="100%" direction="column" gap="10px">
        {puntosClave?.length > 0 && (
          <Flex w="100%" gap="10px">
            <Box as="label" minW="100px" className="information-block-label">
              Minutos
            </Box>

            <Box as="label" w="100%" className="information-block-label">
              Título
            </Box>

            <Box
              as="label"
              minW="30px"
              w="fit-content"
              className="information-block-label"
            />
          </Flex>
        )}

        {puntosClave
          ?.sort((a, b) => a.segundos - b.segundos)
          ?.map((pc: IPuntoClave) => (
            <PuntoClaveItem
              pc={pc}
              key={`pc-item-${pc.id}`}
              isDisabled={isDisabled}
              onUpdate={updateValue}
              onRemove={onRemovePuntoclave}
            />
          ))}
      </Flex>

      <Flex
        align="center"
        fontSize="13px"
        fontWeight="medium"
        cursor={leccionId ? 'pointer' : 'not-allowed'}
        _hover={leccionId ? { fontWeight: 'semibold' } : undefined}
        onClick={leccionId ? onNewPuntoclave : undefined}
      >
        <Icon as={BiPlus} boxSize="21px" />
        Añadir punto clave
      </Flex>
    </Flex>
  );
};

const PuntoClaveItem = ({
  pc,
  isDisabled,
  onUpdate,
  onRemove,
}: {
  pc: IPuntoClave;
  isDisabled?: boolean;
  onUpdate: (id?: number, value?: any) => any;
  onRemove: (id?: number) => any;
}) => {
  const [isTrashDisabled, setTrashDisabled] = useState<boolean>(false);

  const handleUpdate = (value: any) => {
    onUpdate(pc.id, value);
  };

  const handleRemove = () => {
    setTrashDisabled(true);

    onRemove(pc.id).then(() => setTrashDisabled(true));
  };

  return (
    <Flex w="100%" gap="10px">
      <InformationInput
        noHead
        name="segundos"
        isDisabled={isDisabled}
        defaultValue={pc.segundos}
        updateValue={handleUpdate}
        style={{ minWidth: '100px' }}
      />

      <InformationInput
        noHead
        name="titulo"
        isDisabled={isDisabled}
        defaultValue={pc.titulo}
        updateValue={handleUpdate}
        style={{ width: '100%' }}
      />

      <IconButton
        minW="20px"
        icon={<Icon as={BiTrash} boxSize="20px" />}
        bg="transparent"
        cursor="pointer"
        isDisabled={isTrashDisabled}
        aria-label="Delete punto clave"
        onClick={handleRemove}
      />
    </Flex>
  );
};
