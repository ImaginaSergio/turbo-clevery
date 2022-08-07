import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { BiSortUp, BiSortDown, BiFilterAlt, BiChevronDown } from 'react-icons/bi';
import { Box, Button, Flex, Icon, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';

import { ICertificacion } from 'data';
import { useCertificaciones } from 'data';
import { LayoutContext, LoginContext } from '../../../shared/context';
import { GlobalCard, GlobalCardType, CardCertificacionLoader } from '../../../shared/components';

enum CertificacionFilter {
  TODAS = 'Todas',
  NIVEL_1 = 'Nivel 1',
  NIVEL_2 = 'Nivel 2',
  NIVEL_3 = 'Nivel 3',
  SUPERADAS = 'Superadas',
}

enum CertificacionSortBy {
  // RECOMENDADOS = 'Recomendadas',
  ALFABETICO = 'Alfabético',
  ACTUALIZACION = 'Actualizadas',
}

enum CertificacionOrder {
  DESC = 'desc',
  ASC = 'asc',
}

const CertificacionesList = () => {
  const navigate = useNavigate();
  const { user } = useContext(LoginContext);
  const { setShowSidebar, setShowHeader } = useContext(LayoutContext);

  const [query, setQuery] = useState<any[]>([]);
  const [order, setOrder] = useState<CertificacionOrder>(CertificacionOrder.ASC);
  const [filter, setFilter] = useState<CertificacionFilter>(CertificacionFilter.TODAS);
  const [sortBy, setSortBy] = useState<CertificacionSortBy>(CertificacionSortBy.ALFABETICO);

  const { certificaciones, isLoading } = useCertificaciones({
    query,
    certificacionesIniciadas: user?.progresoGlobal?.meta?.certificacionesIniciadas || [],
    certificacionesCompletadas: user?.progresoGlobal?.meta?.certificacionesCompletadas || [],
  });

  // TODO: Si la query esta a = [], vaciar desde front.
  const {
    certificaciones: certificaciones_Iniciadas,
    isLoading: isLoading_Iniciadas,
    isError: isError_Iniciadas,
  } = useCertificaciones({
    query: [{ lista: user?.progresoGlobal?.certificacionesIniciadas }],
    certificacionesIniciadas: user?.progresoGlobal?.meta?.certificacionesIniciadas || [],
    certificacionesCompletadas: user?.progresoGlobal?.meta?.certificacionesCompletadas || [],
  });

  useEffect(() => {
    setShowHeader(true);
    setShowSidebar(true);
  }, []);

  useEffect(() => {
    refreshState();
  }, [filter, sortBy, order]);

  const refreshState = async () => {
    let _query = '&limit=100';

    if (filter === CertificacionFilter.NIVEL_1) _query = '&nivel=1&limit=100';
    else if (filter === CertificacionFilter.NIVEL_2) _query = '&nivel=2&limit=100';
    else if (filter === CertificacionFilter.NIVEL_3) _query = '&nivel=3&limit=100';
    else if (filter === CertificacionFilter.SUPERADAS) {
      if ((user?.progresoGlobal?.meta?.certificacionesCompletadas?.length || 0) === 0) return;

      _query = `&lista=${user?.progresoGlobal?.certificacionesCompletadas}&limit=100`;
    }

    if (sortBy === CertificacionSortBy.ACTUALIZACION) _query += `&sort_by=updatedAt`;
    else if (sortBy === CertificacionSortBy.ALFABETICO) _query += `&sort_by=nombre`;

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
    <Flex w="100%" rowGap="64px" direction="column" p={{ base: '20px', sm: '34px' }}>
      {(user?.progresoGlobal?.meta?.certificacionesIniciadas?.length || 0) !== 0 && !isError_Iniciadas && (
        <Flex direction="column" gap="20px" lineHeight="22px">
          <Box fontSize="18px" fontWeight="bold" lineHeight="100%">
            En progreso
          </Box>

          <Flex
            w="100%"
            wrap={{ base: 'nowrap', md: 'wrap' }}
            columnGap="28px"
            rowGap="20px"
            overflowX="auto"
            pb={{ base: '16px', md: 'unset' }}
          >
            {isLoading_Iniciadas
              ? Array.from(Array(1).keys()).map((n) => (
                  <GlobalCard
                    maxPerRow={4}
                    gapBetween="28px"
                    props={{ isLoading: true }}
                    type={GlobalCardType.CERTIFICACION}
                    key={'certificacion-item-active-' + n}
                    minWidth="323px"
                  />
                ))
              : certificaciones_Iniciadas?.map((c: ICertificacion, index: number) => (
                  <GlobalCard
                    maxPerRow={4}
                    gapBetween="28px"
                    minWidth="323px"
                    props={{ certificacion: c }}
                    type={GlobalCardType.CERTIFICACION}
                    key={'certificacion-item-active-' + index}
                    onClick={() => navigate('/certificaciones/' + c.id)}
                  />
                ))}
          </Flex>
        </Flex>
      )}

      <Flex direction="column" gap="20px">
        <Flex gap="10px" align="center" justify="space-between">
          <Box fontSize="19px" fontWeight="bold" lineHeight="100%">
            Certificaciones
          </Box>

          <Flex align="center" gap="10px">
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
                {Object.values(CertificacionFilter).map((value, index) => (
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
                    as={order === CertificacionOrder.DESC ? BiSortDown : BiSortUp}
                    boxSize="20px"
                    onClick={(e) => {
                      e.stopPropagation();

                      setOrder(order === CertificacionOrder.DESC ? CertificacionOrder.ASC : CertificacionOrder.DESC);
                    }}
                  />
                }
              >
                <Flex align="center" justify="center" gap="4px">
                  <Flex display={{ base: 'none', sm: 'flex' }} fontSize="16px" align="center" justify="center" gap="4px">
                    {filter}
                  </Flex>{' '}
                  <Icon as={BiChevronDown} boxSize="20px" />
                </Flex>
              </MenuButton>

              <MenuList color="black" bg="white">
                {Object.values(CertificacionSortBy).map((value, index) => (
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

        <Flex w="100%" wrap="wrap" gap="28px" pb="40px" data-cy="certificaciones_listado_bloque-inicial">
          {isLoading
            ? Array.from(Array(10).keys()).map((n) => (
                <GlobalCard
                  maxPerRow={4}
                  gapBetween="28px"
                  props={{ isLoading: true }}
                  type={GlobalCardType.CERTIFICACION}
                  key={'certificacion-item-active-' + n}
                />
              ))
            : filter === CertificacionFilter.SUPERADAS &&
              (user?.progresoGlobal?.meta?.certificacionesCompletadas?.length || 0) === 0
            ? undefined // Si no hay certificaciones superadas, entonces no mostramos nada... TODO: Debería estar a nivel de back
            : (certificaciones || [])
                ?.filter((c: ICertificacion) => c?.meta?.examenesCount !== '0')
                ?.map((c: ICertificacion, index: number) => (
                  <GlobalCard
                    maxPerRow={4}
                    gapBetween="28px"
                    props={{ certificacion: c }}
                    type={GlobalCardType.CERTIFICACION}
                    key={'certificacion-item-' + index}
                    data-cy={'certificacion_' + c.nombre}
                    onClick={() => navigate('/certificaciones/' + c.id)}
                  />
                ))}
        </Flex>
      </Flex>

      {(certificaciones || [])?.filter((c: ICertificacion) => !c?.disponible)?.length > 0 ? (
        <Flex direction="column" gap="20px" pb="40px">
          <Flex align="end" justify="space-between" gap="10px">
            <Box fontSize="19px" fontWeight="bold" lineHeight="100%">
              Disponibles próximamente
            </Box>
          </Flex>

          <Flex w="100%" wrap="wrap" gap="28px">
            {isLoading
              ? Array.from(Array(10).keys()).map((n) => <CardCertificacionLoader key={'certificacion-item-placeholder-' + n} />)
              : (certificaciones || [])
                  ?.filter((c: ICertificacion) => !c?.disponible)
                  ?.map((c: ICertificacion, index: number) => (
                    <GlobalCard
                      maxPerRow={4}
                      gapBetween="28px"
                      type={GlobalCardType.CERTIFICACION}
                      key={'certificacion-item-' + index}
                      props={{ certificacion: c, isPublished: false }}
                    />
                  ))}
          </Flex>
        </Flex>
      ) : null}
    </Flex>
  );
};

export default CertificacionesList;
