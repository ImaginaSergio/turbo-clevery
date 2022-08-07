import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { BiSortUp, BiSortDown, BiFilterAlt, BiChevronDown } from 'react-icons/bi';
import { Box, Flex, Icon, Menu, Button, MenuItem, MenuList, MenuButton, Text } from '@chakra-ui/react';

import { ICurso, useCursos, filterCursosByRuta, RutaItinerarioTipoEnum, RutaItinerario } from 'data';

import { LoginContext, LayoutContext } from '../../../shared/context';
import { GlobalCard, GlobalCardType } from '../../../shared/components';

enum CursoFilter {
  ROADMAP = 'Mi hoja de ruta',
  TODOS = 'Todos',
  COMPLETADOS = 'Completados',
}

enum CursoSortBy {
  ALFABETICO = 'Alfabético',
  ACTUALIZACION = 'Actualizados',
}

enum CursoOrder {
  DESC = 'desc',
  ASC = 'asc',
}

const Listado = () => {
  const navigate = useNavigate();
  const { user } = useContext(LoginContext);
  const { setShowHeader, setShowSidebar } = useContext(LayoutContext);

  const [query, setQuery] = useState<any[]>([]);
  const [order, setOrder] = useState<CursoOrder>(CursoOrder.ASC);
  const [filter, setFilter] = useState<CursoFilter>(CursoFilter.ROADMAP);
  const [sortBy, setSortBy] = useState<CursoSortBy>(CursoSortBy.ALFABETICO);

  const { cursos, isLoading } = useCursos({ query: query, userId: user?.id });
  const {
    cursos: cursosIniciados,
    isLoading: isLoading_Iniciados,
    isError: isError_Iniciados,
  } = useCursos({
    query: [{ ruta: user?.progresoGlobal?.cursosIniciados }],
    userId: user?.id,
  });

  useEffect(() => {
    setShowHeader(true);
    setShowSidebar(true);
  }, []);

  useEffect(() => {
    refreshState();
  }, [filter, sortBy, order, user?.progresoGlobal?.ruta, user?.progresoGlobal?.rutaPro]);

  const refreshState = async () => {
    let _query: string | null = '&limit=100';

    if (filter === CursoFilter.ROADMAP) {
      if (!user?.progresoGlobal?.ruta?.meta?.itinerario) return;

      let itinerarioRuta: RutaItinerario[] =
        user?.progresoGlobal?.rutaPro?.meta?.itinerario || user?.progresoGlobal?.ruta?.meta?.itinerario;

      let cursosRuta: number[] = itinerarioRuta
        ?.filter((i: any) => i.tipo === RutaItinerarioTipoEnum.CURSO && !isNaN(i.id))
        ?.map((i) => i.id);

      _query += '&ruta=' + ('[' + cursosRuta + ']') + '&extra=false';
    } else if (filter === CursoFilter.COMPLETADOS) {
      if ((user?.progresoGlobal?.meta?.cursosCompletados?.length || 0) === 0) return;

      _query += '&ruta=' + (user?.progresoGlobal?.cursosCompletados || '') + '&extra=false';
    }

    if (sortBy === CursoSortBy.ACTUALIZACION) _query += `&sort_by=updatedAt`;
    else if (sortBy === CursoSortBy.ALFABETICO) _query += `&sort_by=titulo`;

    _query += `&order=${order}`;

    const auxQuery = _query
      .split('&')
      .map((item: any) => {
        const split = item.split('=');

        if (!split[0] && !split[1]) return undefined;
        else return { [split[0]]: split[1] };
      })
      .filter((v: any) => v);

    setQuery(auxQuery);
  };

  return (
    <Flex w="100%" rowGap="68px" direction="column" p={{ base: '20px', sm: '34px' }}>
      {(user?.progresoGlobal?.meta?.cursosIniciados?.length || 0) > 0 && !isError_Iniciados && (
        <Flex direction="column">
          <Text fontSize="19px" fontWeight="bold" mb="20px" lineHeight="100%">
            Cursos en progreso
          </Text>

          <Flex
            w="100%"
            overflow="auto"
            pb={{ base: '18px', sm: '0' }}
            gap={{ base: '16px', sm: '28px' }}
            wrap={{ base: 'nowrap', sm: 'wrap' }}
          >
            {isLoading_Iniciados
              ? Array.from(Array(2).keys()).map((n) => (
                  <GlobalCard
                    maxPerRow={5}
                    gapBetween="28px"
                    minWidth="241px"
                    type={GlobalCardType.CURSO}
                    props={{ isLoading: true }}
                    key={'curso-item-h-placeholder-' + n}
                  />
                ))
              : (user?.progresoGlobal?.meta?.cursosIniciados?.length || 0) > 0
              ? filterCursosByRuta(
                  user?.progresoGlobal?.rutaPro?.meta?.itinerario || user?.progresoGlobal?.ruta?.meta?.itinerario,
                  cursosIniciados
                )?.map((curso: ICurso, index) => (
                  <GlobalCard
                    maxPerRow={5}
                    gapBetween="28px"
                    minWidth="241px"
                    type={GlobalCardType.CURSO}
                    key={'curso-iniciado-' + index}
                    onClick={() => navigate('/cursos/' + curso.id)}
                    props={{
                      curso: curso,
                      index: index + 1,
                      isBlocked: curso.meta?.isBlocked,
                      isCompleted: curso.meta?.isCompleted,
                    }}
                  />
                ))
              : undefined}
          </Flex>
        </Flex>
      )}

      <Flex direction="column" gap="20px">
        <Flex gap="10px" justify="space-between" align="center">
          <Box fontSize="19px" fontWeight="bold" lineHeight="100%">
            Cursos
          </Box>

          <Flex gap="10px" align="center">
            <Menu>
              <MenuButton
                as={Button}
                bg="gray_2"
                h={{ base: '48px', sm: '40px' }}
                w={{ base: '48px', sm: 'fit-content' }}
                p={{ base: '5px 10px', sm: '5px 10px' }}
                pl={{ base: '22px', sm: '' }}
                rounded="8px"
                _hover={{ filter: 'brightness(90%)' }}
                leftIcon={<Icon as={BiFilterAlt} boxSize="20px" />}
              >
                <Flex display={{ base: 'none', sm: 'flex' }} fontSize="16px" align="center" justify="center" gap="4px">
                  {filter}

                  <Icon as={BiChevronDown} boxSize="20px" />
                </Flex>
              </MenuButton>

              <MenuList color="black" bg="white">
                {Object.values(CursoFilter).map((value, index) => (
                  <MenuItem
                    cursor="pointer"
                    fontSize="16px"
                    fontWeight="bold"
                    _hover={{ bg: 'gray_1' }}
                    _focus={{ bg: 'gray_1' }}
                    key={'cursos-filter-' + index}
                    onClick={() => setFilter(value)}
                  >
                    {value}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>

            <Menu>
              <MenuButton
                as={Button}
                bg="gray_2"
                h={{ base: '48px', sm: '40px' }}
                w="fit-content"
                p={{ base: '5px 1px', sm: '5px 10px' }}
                pr={{ base: '16px', sm: '' }}
                rounded="8px"
                _hover={{ filter: 'brightness(90%)' }}
                leftIcon={
                  <Icon
                    as={order === CursoOrder.DESC ? BiSortDown : BiSortUp}
                    boxSize="20px"
                    onClick={(e) => {
                      e.stopPropagation();

                      setOrder(order === CursoOrder.DESC ? CursoOrder.ASC : CursoOrder.DESC);
                    }}
                  />
                }
              >
                <Flex align="center" justify="center" gap="4px">
                  <Flex gap="4px" align="center" fontSize="16px" justify="center" display={{ base: 'none', sm: 'flex' }}>
                    {sortBy}
                  </Flex>

                  <Icon as={BiChevronDown} boxSize="20px" />
                </Flex>
              </MenuButton>

              <MenuList color="black" bg="white">
                {Object.values(CursoSortBy).map((value, index) => (
                  <MenuItem
                    cursor="pointer"
                    fontSize="16px"
                    fontWeight="bold"
                    _hover={{ bg: 'gray_1' }}
                    _focus={{ bg: 'gray_1' }}
                    key={'cursos-filter-' + index}
                    onClick={() => setSortBy(value)}
                  >
                    {value}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
          </Flex>
        </Flex>

        <Flex w="100%" wrap="wrap" gap="20px 28px" data-cy="cursos_listado_bloque-inicial">
          {isLoading || !user?.progresoGlobal?.ruta?.itinerario
            ? Array.from(Array(10).keys()).map((n) => (
                <GlobalCard
                  maxPerRow={5}
                  gapBetween="28px"
                  type={GlobalCardType.CURSO}
                  key={'curso-item-h-placeholder-' + n}
                  props={{ isLoading: true }}
                />
              ))
            : filter === CursoFilter.COMPLETADOS && (user?.progresoGlobal?.meta?.cursosCompletados?.length || 0) === 0
            ? undefined // Si no hay cursos superadas, entonces no mostramos nada... TODO: Debería estar a nivel de back
            : (filter === CursoFilter.ROADMAP
                ? filterCursosByRuta(
                    user?.progresoGlobal?.rutaPro?.meta?.itinerario || user?.progresoGlobal?.ruta?.meta?.itinerario,
                    cursos
                  )
                : cursos
              )
                ?.filter((c: ICurso) => c.disponible)
                ?.map((c: ICurso) => (
                  <GlobalCard
                    maxPerRow={5}
                    gapBetween="28px"
                    type={GlobalCardType.CURSO}
                    key={'curso-item-' + c.id}
                    data-cy={'curso_' + c.titulo}
                    onClick={() => navigate('/cursos/' + c.id)}
                    props={{ curso: c }}
                  />
                ))}
        </Flex>

        {cursos?.filter((c: ICurso) => !c?.disponible)?.length > 0 ? (
          <Flex direction="column" gap="20px" pb="40px" pt="64px">
            <Flex align="end" justify="space-between" gap="10px">
              <Box fontSize="19px" fontWeight="bold" lineHeight="100%">
                Disponibles próximamente
              </Box>
            </Flex>

            <Flex w="100%" wrap="wrap" gap="28px">
              {isLoading
                ? Array.from(Array(3).keys()).map((n) => (
                    <GlobalCard
                      maxPerRow={5}
                      gapBetween="28px"
                      type={GlobalCardType.CURSO}
                      key={'curso-item-h-placeholder-' + n}
                      props={{ isLoading: true }}
                    />
                  ))
                : cursos
                    ?.filter((c: ICurso) => !c?.disponible)
                    ?.map((c: ICurso, index: number) => (
                      <GlobalCard
                        maxPerRow={5}
                        gapBetween="28px"
                        type={GlobalCardType.CURSO}
                        key={'certificacion-item-' + index}
                        props={{ curso: c, isPublished: false }}
                      />
                    ))}
            </Flex>
          </Flex>
        ) : null}
      </Flex>
    </Flex>
  );
};

export default Listado;
