import { useContext, useEffect, useState } from 'react';

import { BiCodeAlt, BiTimeFive } from 'react-icons/bi';
import { FaBookmark, FaRegBookmark } from 'react-icons/fa';
import { Box, Flex, Icon, Tooltip } from '@chakra-ui/react';

import { fmtHours, fmtMnts, useCountdown } from 'utils';
import { EntregableEstadoEnum, FavoritoTipoEnum, ILeccion, IEntregable } from 'data';
import { FavoritosContext, LoginContext } from '../../../../../shared/context';
import { addHours, differenceInMinutes } from 'date-fns';
import { revisarSiEntregableBloqueado } from '../../../utils';

export const EntregableHeader = ({ leccion, entregable }: { leccion?: ILeccion; entregable?: IEntregable }) => {
  const { user } = useContext(LoginContext);
  const { favoritos, addFavorito, removeFavorito } = useContext(FavoritosContext);

  const [leccionFavorito, setLeccionFavorito] = useState<boolean>(
    favoritos?.find((f) => f.tipo === FavoritoTipoEnum.LECCION && f.userId == user?.id && f.objetoId == leccion?.id) !==
      undefined
  );

  return (
    <Flex pb="40px" w="100%" align="center" height="fit-content" justify="space-between">
      <Flex direction="column" gap="10px">
        <Box fontSize="24px" fontWeight="bold" color="black">
          {leccion?.titulo}
        </Box>

        <Flex gap="40px">
          <Flex align="center" gap="12px" color="gray_5">
            <Icon as={BiCodeAlt} boxSize="21px" />
            Ejercicio Código
          </Flex>

          <Flex align="center" gap="12px" color="gray_5">
            <Icon as={BiTimeFive} boxSize="21px" />

            <Box>{fmtMnts(leccion?.duracion)} de duración aprox.</Box>
          </Flex>
        </Flex>
      </Flex>

      <Tooltip shouldWrapChildren label={leccionFavorito ? 'Borrar marcador' : 'Guardar marcador'}>
        <Icon
          boxSize="28px"
          cursor="pointer"
          color={leccionFavorito ? 'primary' : 'gray_5'}
          as={leccionFavorito ? FaBookmark : FaRegBookmark}
          onClick={
            leccionFavorito
              ? () => {
                  if (leccion?.id && user?.id) {
                    setLeccionFavorito(false);

                    let favToRemove = favoritos?.find(
                      (f) => f.tipo === FavoritoTipoEnum.LECCION && f.userId == user?.id && f.objetoId == leccion?.id
                    );

                    if (favToRemove) removeFavorito(favToRemove);
                  }
                }
              : () => {
                  if (leccion?.id && user?.id) {
                    setLeccionFavorito(true);
                    addFavorito({
                      objetoId: leccion?.id,
                      tipo: FavoritoTipoEnum.LECCION,
                      userId: user?.id,
                      objeto: leccion,
                    });
                  }
                }
          }
        />
      </Tooltip>
    </Flex>
  );
};
