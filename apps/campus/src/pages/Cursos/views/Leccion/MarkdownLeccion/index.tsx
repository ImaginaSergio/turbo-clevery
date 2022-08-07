import { useState, useContext, useEffect } from 'react';

import { Text, Flex, Box, Icon, Tooltip } from '@chakra-ui/react';
import { BiBookmark, BiBookmarkAlt, BiText, BiTimeFive } from 'react-icons/bi';

import { OpenParser } from 'ui';
import { fmtMnts } from 'utils';
import { FavoritoTipoEnum, IFavorito, ILeccion } from 'data';
import { FavoritosContext, LoginContext } from '../../../../../shared/context';

import './MarkdownLeccion.scss';

export const MarkdownLeccion = ({ leccion }: { leccion: ILeccion }) => {
  const [leccionFavorito, setLeccionFavorito] = useState<IFavorito>();

  const { user } = useContext(LoginContext);
  const { favoritos, addFavorito, removeFavorito } = useContext(FavoritosContext);

  useEffect(() => {
    if (favoritos?.length > 0 && leccion?.id)
      setLeccionFavorito(favoritos?.find((f) => f.tipo === FavoritoTipoEnum.LECCION && f.objetoId === leccion?.id));
  }, [addFavorito, removeFavorito]);

  return (
    <Flex direction="column" boxSize="100%" gap="40px">
      <Flex direction="column" gap="10px">
        <Flex align="center" justify="space-between" gap="40px">
          <Text variant="h1_heading">{leccion?.titulo}</Text>

          <Tooltip shouldWrapChildren label={leccionFavorito ? 'Borrar marcador' : 'Guardar marcador'}>
            <Icon
              boxSize="28px"
              cursor="pointer"
              color={leccionFavorito ? 'primary' : 'gray_5'}
              as={leccionFavorito ? BiBookmark : BiBookmarkAlt}
              onClick={
                leccionFavorito
                  ? () => {
                      removeFavorito(leccionFavorito);
                      setLeccionFavorito(undefined);
                    }
                  : () => {
                      if (leccion?.id && user?.id)
                        addFavorito({
                          objetoId: leccion?.id,
                          tipo: FavoritoTipoEnum.LECCION,
                          userId: user?.id,
                          objeto: leccion,
                        });
                    }
              }
            />
          </Tooltip>
        </Flex>

        <Flex align="center" gap="14px">
          <Flex align="center" gap="10px">
            <Icon as={BiText} color="gray_4" />

            <Box fontSize="15px" fontWeight="semibold" color="gray_5">
              Texto
            </Box>
          </Flex>

          <Box w="1px" h="100%" bg="gray_3" />

          <Flex align="center" gap="10px">
            <Icon as={BiTimeFive} color="gray_4" />

            <Box fontSize="15px" fontWeight="semibold" color="gray_5">
              {fmtMnts(leccion?.duracion)} de duración aprox.
            </Box>
          </Flex>
        </Flex>
      </Flex>

      <Flex direction="column" align="start" justify="center" overflow="hidden">
        <OpenParser value={leccion?.contenido || ''} style={{ fontSize: '15px', width: '100%', maxWidth: '100%' }} />
      </Flex>
    </Flex>
  );
};
