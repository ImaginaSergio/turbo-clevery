import { useContext, useState } from 'react';

import { Flex, Box, Button, Icon, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import { BiChevronDown, BiSortDown, BiSortUp } from 'react-icons/bi';

import { IBoost } from 'data';
import { useBoosts } from 'data';

import { LoginContext } from '../../../../shared/context';
import { GlobalCard, GlobalCardType } from '../../../../shared/components';
import { Header } from './Header';

enum BoostsSortEnum {
  ALFABETICO = 'Alfabético',
  COMPATIBILIDAD = 'Compatibilidad',
}

enum Boosts0rderEnum {
  ASC = 'asc',
  DESC = 'desc',
}

const BoostsList = () => {
  const { user } = useContext(LoginContext);

  const [order, setOrder] = useState<Boosts0rderEnum>(Boosts0rderEnum.ASC);
  const [sort, setSort] = useState<BoostsSortEnum>(BoostsSortEnum.COMPATIBILIDAD);

  const { boosts, isLoading, isError } = useBoosts({
    query: [{ limit: 100 }],
    certificacionesCompletadas: user?.progresoGlobal?.meta?.certificacionesCompletadas || [],
  });

  const sortBoosts = (listado: IBoost[] = []) => {
    return listado.sort((a: IBoost, b: IBoost) => {
      if (order === Boosts0rderEnum.ASC && sort === BoostsSortEnum.COMPATIBILIDAD)
        return (b.meta?.compatible || 0) - (a.meta?.compatible || 0);
      else if (order === Boosts0rderEnum.DESC && sort === BoostsSortEnum.COMPATIBILIDAD)
        return (a.meta?.compatible || 0) - (b.meta?.compatible || 0);
      else if (order === Boosts0rderEnum.ASC && sort === BoostsSortEnum.ALFABETICO)
        return a.titulo > b.titulo ? 1 : a.titulo < b.titulo ? -1 : 0;
      else return b.titulo > a.titulo ? 1 : b.titulo < a.titulo ? -1 : 0;
    });
  };

  return (
    <Flex w="100%" p={{ base: '34px 20px', sm: '34px' }}>
      <Flex w="100%" direction="column">
        {(user?.boosts || [])?.length > 0 && (
          <Header
            progreso={user?.progresoGlobal?.meta?.progresoCampus}
            boost={(boosts?.data || [])?.find((b: IBoost) =>
              (user?.boosts || [])?.find((bUser) => bUser.meta?.pivot_activo === true && bUser.id === b.id)
            )}
          />
        )}

        <Flex
          mb="20px"
          gap="20px"
          align="center"
          justify="space-between"
          mt={(user?.boosts || [])?.length > 0 ? '64px' : 'unset'}
        >
          <Flex>
            <Box fontSize="18px" fontWeight="bold" lineHeight="22px" minW="fit-content">
              Boosts de empresas
            </Box>

            <Box w="100%" mx="10px" color="gray_6" fontSize="18px" lineHeight="22px">
              {boosts?.data?.length || 0}
            </Box>
          </Flex>

          <Menu>
            <MenuButton
              as={Button}
              bg="gray_2"
              h={{ base: '48px', sm: '40px' }}
              w={{ base: '48px', sm: 'fit-content' }}
              p={{ base: '5px 10px', sm: '5px 10px' }}
              pl={{ base: '22px', sm: '' }}
              border="1px solid var(--chakra-colors-gray_3)"
              rounded={{ base: 'full', sm: '8px' }}
              _hover={{ filter: 'brightness(90%)' }}
              leftIcon={
                <Icon
                  as={order === Boosts0rderEnum.DESC ? BiSortDown : BiSortUp}
                  boxSize="20px"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOrder(order === Boosts0rderEnum.DESC ? Boosts0rderEnum.ASC : Boosts0rderEnum.DESC);
                  }}
                />
              }
            >
              <Flex display={{ base: 'none', sm: 'flex' }} fontSize="16px" align="center" justify="center">
                {sort || 'Ordenar por'}
                <Icon as={BiChevronDown} boxSize="20px" />
              </Flex>{' '}
            </MenuButton>
            <MenuList color="black" bg="white" zIndex="2000">
              {Object.values(BoostsSortEnum).map((value, index) => (
                <MenuItem
                  cursor="pointer"
                  fontSize="16px"
                  fontWeight="bold"
                  _hover={{ bg: 'gray_1' }}
                  _focus={{ bg: 'gray_1' }}
                  key={'cursos-filter-' + index}
                  onClick={() => setSort(value)}
                >
                  <Box textTransform="capitalize">{value}</Box>
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
        </Flex>

        <Flex w="100%" wrap="wrap" gap="20px" data-cy="boosts_list" pb="40px">
          {isLoading
            ? Array.from(Array(2).keys()).map((n) => (
                <GlobalCard
                  maxPerRow={3}
                  gapBetween="20px"
                  type={GlobalCardType.BOOST}
                  key={'boost-item-placeholder-' + n}
                  props={{ isLoading: true }}
                />
              ))
            : isError || boosts?.data?.length === 0
            ? undefined // Si no hay cursos superadas, entonces no mostramos nada... TODO: Debería estar a nivel de back
            : sortBoosts(boosts?.data)?.map((boost: IBoost, index: number) => (
                <GlobalCard
                  maxPerRow={3}
                  gapBetween="20px"
                  key={'card-boost-' + index}
                  type={GlobalCardType.BOOST}
                  props={{ boost: boost }}
                />
              ))}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default BoostsList;
