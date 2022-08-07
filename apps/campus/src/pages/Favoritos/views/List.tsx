import { useState, useContext, useEffect } from 'react';

import {
  Flex,
  Box,
  Button,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from '@chakra-ui/react';
import { BiSearch, BiChevronDown, BiSortDown, BiSortUp, BiFilterAlt } from 'react-icons/bi';

import { FavoritosContext, LayoutContext } from '../../../shared/context';
import { FavoritoTipoEnum, IFavorito } from 'data';
import { GlobalCard, GlobalCardType } from '../../../shared/components';

enum FavoritosSortEnum {
  RECIENTES = 'Recientes',
  ALFABETICO = 'Alfabético',
}

enum Favoritos0rderEnum {
  ASC = 'asc',
  DESC = 'desc',
}

const FavoritosList = () => {
  const [search, setSearch] = useState<string>();
  const [order, setOrder] = useState<string>('asc');
  const [sort, setSort] = useState<FavoritosSortEnum | undefined>();
  const [filter, setFilter] = useState<FavoritoTipoEnum | undefined>();

  const { favoritos, removeFavorito } = useContext(FavoritosContext);

  const [favoritosList, setFavoritosList] = useState<any>();

  const { isMobile } = useContext(LayoutContext);

  useEffect(() => {
    setFavoritosList(favoritos);
  }, [favoritos]);

  useEffect(() => {
    sort === FavoritosSortEnum.ALFABETICO &&
      setFavoritosList(
        favoritosList?.sort((a: any, b: any) =>
          order === 'desc'
            ? a.objeto?.titulo?.localeCompare(b.objeto?.titulo)
            : b.objeto?.titulo?.localeCompare(a.objeto?.titulo)
        )
      );

    sort === FavoritosSortEnum.RECIENTES &&
      setFavoritosList(
        favoritosList?.sort((a: any, b: any) => (order === 'desc' ? b.updatedAt - a.updatedAt : a.updatedAt - b.updatedAt))
      );
  }, [favoritosList, sort]);

  return (
    <Flex gap="20px" boxSize="100%" direction="column" p={{ base: '20px', sm: '34px' }}>
      <Box fontSize="18px" fontWeight="bold">
        Librería de favoritos
      </Box>

      <Flex gap="10px" align="center" justify="space-between">
        <Flex w="100%" gap="14px" direction={{ base: 'column', sm: 'row' }}>
          <InputGroup minW="150px" w="100%" bg="gray_2" rounded="8px" border="none">
            <InputLeftElement pointerEvents="none" children={<BiSearch color="gray_6" />} />

            <Input
              border="none"
              value={search}
              placeholder="Buscar favoritos"
              _placeholder={{ color: 'gray_4' }}
              onChange={(e: any) =>
                setFavoritosList(
                  favoritos.filter((f: any) =>
                    f?.objeto?.titulo
                      .toLowerCase()
                      .normalize('NFD')
                      .replace(/[\u0300-\u036f]/g, '')
                      .includes(
                        e.target.value
                          .toLowerCase()
                          .normalize('NFD')
                          .replace(/[\u0300-\u036f]/g, '')
                      )
                  )
                )
              }
            />
          </InputGroup>
        </Flex>
        <Flex gap="10px" align="center">
          <Menu>
            <MenuButton
              as={Button}
              bg="gray_2"
              h={{ base: '40px', sm: '40px' }}
              w={{ base: '40px', sm: 'fit-content' }}
              p={{ base: '5px 10px', sm: '5px 10px' }}
              pl={{ base: '22px', sm: '' }}
              rounded="8px"
              _hover={{ filter: 'brightness(90%)' }}
              leftIcon={<Icon as={BiFilterAlt} boxSize="20px" />}
            >
              <Flex display={{ base: 'none', sm: 'flex' }} fontSize="16px" align="center" justify="center" gap="4px">
                <Text textTransform="capitalize"> {filter || 'Filtrar por'}</Text>
                <Icon as={BiChevronDown} boxSize="20px" />
              </Flex>
            </MenuButton>

            <MenuList color="black" bg="white">
              {Object.values(FavoritoTipoEnum).map((value, index) => (
                <MenuItem
                  cursor="pointer"
                  fontSize="16px"
                  fontWeight="bold"
                  _hover={{ bg: 'gray_1' }}
                  _focus={{ bg: 'gray_1' }}
                  key={'cursos-filter-' + index}
                  onClick={() => setFilter(value)}
                >
                  <Text textTransform="capitalize">{value}</Text>
                </MenuItem>
              ))}
            </MenuList>
          </Menu>

          <Menu>
            <MenuButton
              as={Button}
              bg="gray_2"
              h={{ base: '40px', sm: '40px' }}
              w="fit-content"
              p={{ base: '5px 1px', sm: '5px 10px' }}
              pr={{ base: '16px', sm: '' }}
              rounded="8px"
              _hover={{ filter: 'brightness(90%)' }}
              leftIcon={
                <Icon
                  as={order === Favoritos0rderEnum.DESC ? BiSortDown : BiSortUp}
                  boxSize="20px"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOrder(order === Favoritos0rderEnum.DESC ? Favoritos0rderEnum.ASC : Favoritos0rderEnum.DESC);
                  }}
                />
              }
            >
              <Flex align="center" justify="center" gap="4px">
                <Flex gap="4px" display={{ base: 'none', sm: 'flex' }} fontSize="16px" align="center" justify="center">
                  {sort || 'Ordenar por'}
                </Flex>
                <Icon as={BiChevronDown} boxSize="20px" />{' '}
              </Flex>
            </MenuButton>

            <MenuList color="black" bg="white">
              {Object.values(FavoritosSortEnum).map((value, index) => (
                <MenuItem
                  cursor="pointer"
                  fontSize="16px"
                  fontWeight="bold"
                  _hover={{ bg: 'gray_1' }}
                  _focus={{ bg: 'gray_1' }}
                  key={'cursos-filter-' + index}
                  onClick={() => setSort(value)}
                >
                  <Text textTransform="capitalize">{value}</Text>
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
        </Flex>
      </Flex>

      <Flex w="100%" gap="20px" h="fit-content" wrap="wrap" pb="40px">
        {filter
          ? favoritosList
              .filter((f: any) => f.tipo === filter)
              .map((favorito: IFavorito, index: number) => (
                <GlobalCard
                  maxPerRow={3}
                  gapBetween="20px"
                  style={{ padding: '24px' }}
                  type={GlobalCardType.FAVORITO}
                  key={'favorito-' + index}
                  props={{
                    tipo: favorito.tipo,
                    contenido: favorito.objeto,
                    onDelete: () => removeFavorito(favorito),
                  }}
                />
              ))
          : favoritosList?.map((favorito: IFavorito, index: number) => (
              <GlobalCard
                maxPerRow={3}
                gapBetween="20px"
                style={{ padding: '24px' }}
                type={GlobalCardType.FAVORITO}
                key={'favorito-2-' + index}
                props={{
                  tipo: favorito.tipo,
                  contenido: favorito.objeto,
                  onDelete: () => removeFavorito(favorito),
                }}
              />
            ))}
      </Flex>
    </Flex>
  );
};

export default FavoritosList;
