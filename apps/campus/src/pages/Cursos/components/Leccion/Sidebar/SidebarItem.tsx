import { useState, useEffect, useContext } from 'react';

import { BiCheck, BiLockAlt, BiBookmarks, BiChevronUp, BiCaretRight, BiChevronDown } from 'react-icons/bi';
import { FaBookmark } from 'react-icons/fa';
import { Flex, Icon, Box, Collapse, Text } from '@chakra-ui/react';

import { IModulo, ILeccion, FavoritoTipoEnum, UserRolEnum } from 'data';

import { FavoritosContext, LoginContext } from '../../../../../shared/context';

const SidebarItem = ({
  modulo,
  leccionId,
  isCompleted,
  isOpened,
  onLeccionSelect,
  onLeccionCompleted,
}: {
  modulo?: IModulo;
  leccionId?: number;
  isOpened: boolean;
  isCompleted: boolean;
  onLeccionSelect: (leccion: ILeccion) => void;
  onLeccionCompleted: (leccion: ILeccion) => void;
}) => {
  const [open, setOpen] = useState<boolean>(isOpened);

  const { user } = useContext(LoginContext);
  const { favoritos } = useContext(FavoritosContext);

  useEffect(() => {
    setOpen(isOpened);
  }, [isOpened]);

  const handleOnCompleteLeccion = (leccion: ILeccion) => {
    if (!leccion.meta?.isCompleted && user?.rol === UserRolEnum.ADMIN) onLeccionCompleted(leccion);
  };

  return (
    <Flex
      direction="column"
      transition="all ease-in-out 0.5s"
      borderBottom="1px solid var(--chakra-colors-gray_3)"
      _hover={{ bg: 'gray_2' }}
    >
      <Flex p="15px 30px" align="center" cursor="pointer" columnGap="16px" onClick={() => setOpen(!open)}>
        <Flex direction="column" w="100%" overflow="hidden">
          <Flex justify="space-between" w="100%">
            <Text isTruncated w="100%" variant="sidebar_title" title={modulo?.orden + '.' + modulo?.titulo}>
              {modulo?.orden}.{modulo?.titulo}
            </Text>
          </Flex>

          {!open && (
            <Flex fontSize="13px">
              <Flex color="gray_5" mr="18px">
                {modulo?.lecciones?.filter((l: ILeccion) => l?.meta?.isCompleted).length || 0}/{modulo?.lecciones?.length || 0}
                <Box ml="4px">lecciones</Box>
              </Flex>

              {modulo &&
                (modulo?.lecciones?.filter((l: ILeccion) =>
                  favoritos?.find((f) => f.tipo === FavoritoTipoEnum.LECCION && f.objetoId === l.id)
                ).length || 0) > 0 && (
                  <Flex align="center" color="primary">
                    <Icon as={BiBookmarks} type="solid" boxSize="14px" />

                    {
                      modulo?.lecciones?.filter((l: ILeccion) =>
                        favoritos.find((f) => f.tipo === FavoritoTipoEnum.LECCION && f.objetoId === l.id)
                      ).length
                    }
                  </Flex>
                )}
            </Flex>
          )}
        </Flex>

        <Flex w="fit-content" justify="flex-end">
          {modulo?.meta?.isBlocked && <Icon as={BiLockAlt} mr="25px" type="solid" color="gray_5" boxSize="20px" />}

          {isCompleted && !open && <Icon as={BiCheck} color="primary" boxSize="20px" mr="25px" />}

          <Icon as={open ? BiChevronUp : BiChevronDown} boxSize="20px" color="gray_4" />
        </Flex>
      </Flex>

      <Collapse in={open} animateOpacity unmountOnExit>
        <Flex direction="column" w="100%" bg="gray_2" overflow="hidden">
          {modulo?.lecciones?.map((leccion: ILeccion, index: number) => (
            <Flex
              w="100%"
              p="10px 25px"
              align="center"
              columnGap="16px"
              key={'leccion-' + leccion.id + '-item-' + index}
              color="black"
              bg={leccion.id === leccionId ? 'primary_light' : undefined}
              borderLeft={
                leccion.id === leccionId ? '4px solid var(--chakra-colors-primary)' : '4px solid var(--chakra-colors-gray_2)'
              }
              cursor={modulo.meta?.isBlocked ? 'not-allowed' : 'pointer'}
              title={modulo.meta?.isBlocked ? 'Lección bloqueada' : leccion.titulo}
              onClick={!modulo.meta?.isBlocked ? () => onLeccionSelect(leccion) : undefined}
              _hover={
                !modulo.meta?.isBlocked
                  ? {
                      bg: 'white',
                      backgroundColor: 'primary_light',
                      borderLeft: '4px solid var(--chakra-colors-primary)',
                    }
                  : undefined
              }
            >
              <Flex w="100%" justify="space-between" align="center">
                <Flex align="center" gap="12px">
                  {favoritos.find((f) => f.tipo === FavoritoTipoEnum.LECCION && f.objetoId === leccion.id) && (
                    <Icon boxSize="12px" cursor="pointer" color="primary" as={FaBookmark} />
                  )}

                  <Text variant="sidebar_text" color={leccion.meta?.isCompleted ? 'gray_5' : 'black'}>
                    {leccion.titulo}
                  </Text>
                </Flex>
              </Flex>

              {modulo.meta?.isBlocked ? (
                <Icon as={BiLockAlt} type="solid" color="gray_3" boxSize="24px" />
              ) : (
                <Icon
                  minW="24px"
                  boxSize="24px"
                  onClick={() => handleOnCompleteLeccion(leccion)}
                  as={leccion.meta?.isCompleted ? BiCheck : BiCaretRight}
                  color={leccion.meta?.isCompleted ? 'primary' : leccion.id === leccionId ? 'primary' : 'gray_4'}
                />
              )}
            </Flex>
          ))}
        </Flex>
      </Collapse>
    </Flex>
  );
};

export default SidebarItem;
