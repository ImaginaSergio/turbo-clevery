import { Box, Button, Flex, Badge } from '@chakra-ui/react';

import { ILeccion, IEntregable, LeccionTipoEnum, EntregableEstadoEnum } from 'data';
import { OpenParser } from 'ui';

export const EstadoEnunciado = ({
  leccion,
  entregable,
  onStart = () => {},
}: {
  leccion?: ILeccion;
  entregable?: IEntregable;
  onStart: (e?: any) => void;
}) => {
  return (
    <Flex direction="column" gap="20px" h="100%">
      <Box bg="gray_3" h="1px" />

      <Flex gap="10px" align="center">
        <Box fontSize="14px" lineHeight="17px">
          Estado:
        </Box>

        <Badge
          p="4px 15px"
          rounded="8px"
          fontSize="15px"
          fontWeight="semibold"
          color={
            entregable?.estado === EntregableEstadoEnum.ERROR
              ? '#DB4444'
              : entregable?.estado === EntregableEstadoEnum.CORRECTO
              ? '#06a580'
              : '#CA8824'
          }
          bg={
            entregable?.estado === EntregableEstadoEnum.ERROR
              ? 'rgba(219, 68, 68, 0.15)'
              : entregable?.estado === EntregableEstadoEnum.CORRECTO
              ? 'rgba(38, 200, 171, 0.15)'
              : 'rgba(202, 136, 36, 0.15)'
          }
        >
          {entregable?.estado === EntregableEstadoEnum.ERROR
            ? 'SUSPENDIDO'
            : !entregable?.estado
            ? 'POR EMPEZAR'
            : entregable?.estado === EntregableEstadoEnum.PENDIENTE_CORRECCION
            ? LeccionTipoEnum.AUTOCORREGIBLE
              ? 'ENTREGADO'
              : (entregable?.estado || EntregableEstadoEnum.PENDIENTE_ENTREGA).replaceAll('_', ' ')
            : (entregable?.estado || EntregableEstadoEnum.PENDIENTE_ENTREGA).replaceAll('_', ' ')}
        </Badge>
      </Flex>

      <Box bg="gray_3" h="1px" />

      <Flex boxSize="100%" direction="column" justify="space-between">
        <Flex
          p="12px"
          bg="gray_1"
          rounded="12px"
          direction="column"
          border="1px solid"
          borderColor="gray_3"
          justify="space-between"
        >
          <OpenParser value={leccion?.contenido || ''} style={{ minWidth: '100%' }} />
        </Flex>

        <Button
          h="55px"
          minH="55px"
          p="5px 20px"
          bg="primary"
          color="white"
          rounded="8px"
          w="fit-content"
          fontSize="18px"
          lineHeight="21px"
          fontWeight="bold"
          onClick={onStart}
          isDisabled={entregable?.estado === EntregableEstadoEnum.CORRECTO}
        >
          {entregable?.estado === EntregableEstadoEnum.CORRECTO
            ? '¡Ejercicio entregado!'
            : entregable?.estado === EntregableEstadoEnum.ERROR
            ? 'Reintentar ejercicio'
            : 'Comenzar ejercicio'}
        </Button>
      </Flex>
    </Flex>
  );
};
