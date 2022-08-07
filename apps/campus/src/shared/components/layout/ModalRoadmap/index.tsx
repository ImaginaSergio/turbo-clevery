import { useContext, useEffect, useState } from 'react';

import {
  Flex,
  Box,
  Icon,
  toast,
  Image,
  Modal,
  Button,
  Center,
  Progress,
  ModalHeader,
  ModalFooter,
  ModalOverlay,
  ModalContent,
  useMediaQuery,
  Skeleton,
  CloseButton,
} from '@chakra-ui/react';
import { FiServer } from 'react-icons/fi';
import { CgScreen } from 'react-icons/cg';
import { AiOutlineBook } from 'react-icons/ai';
import { IoIosArrowDroprightCircle } from 'react-icons/io';
import { BiBookBookmark, BiLayer, BiCodeBlock, BiBox } from 'react-icons/bi';

import {
  IRuta,
  useCursos,
  getUserByID,
  sortByRoadmap,
  useProyectosBoosts,
  updateProgresoGlobal,
  RutaItinerarioTipoEnum,
} from 'data';
import { OpenParser, onFailure } from 'ui';

import { LoginContext } from '../../../context';
import { RoadmapItem } from './RoadmapItem';
import { ModalInfoResponsive } from './modalInfoResponsive';

enum FilterValueOB {
  APRENDE = 'aprendeProgramar',
  FRONTEND = 'frontend',
  BACKEND = 'backend',
  FULLSTACK = 'fullstack',
}

enum FilterValueOM {
  TODOS = 'todos',
}

let filtrosOB = [
  {
    title: 'Aprende a programar',
    icon: BiCodeBlock,
    filterValue: FilterValueOB.APRENDE,
  },
  { title: 'Front-End', icon: CgScreen, filterValue: FilterValueOB.FRONTEND },
  { title: 'Back-End', icon: FiServer, filterValue: FilterValueOB.BACKEND },
  { title: 'FullStack', icon: BiLayer, filterValue: FilterValueOB.FULLSTACK },
];

let filtrosOM = [{ title: 'Todos', icon: AiOutlineBook, filterValue: FilterValueOM.TODOS }];

let filterContentsOB = {
  [FilterValueOB.APRENDE]: ['De 0 a Dev', 'Front-End', 'Back-End', 'FullStack'],
  [FilterValueOB.FRONTEND]: ['Front-End', 'Front-End Angular', 'Front-End ReactJS'],
  [FilterValueOB.BACKEND]: ['Back-End', 'Back-End Java', 'Back-End Python', 'Back-End PHP', 'Back-End C#', 'Back-End Node'],
  [FilterValueOB.FULLSTACK]: ['De 0 a Dev', 'FullStack'],
};

let filterContentsOM = {
  [FilterValueOM.TODOS]: [
    'Introducción al Marketing',
    'Programación para principiantes',
    'Estrategia y Organización de Marketing',
    'Comunicación y branding (Community Manager)',
    'Performance',
    'SEO, Contenidos y CRO (Growth Marketing)',
    'Analista web',
  ],
};

type FilterSelectedType = FilterValueOB | FilterValueOM;

export const ModalRoadmap = ({ state, rutas = [] }: { state: { isOpen: boolean; onClose: () => void }; rutas: IRuta[] }) => {
  const { user, setUser } = useContext(LoginContext);

  const [rutaSelected, setRutaSelected] = useState<IRuta | undefined>();
  const [firstSelected, setFirstSelected] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [filterSelected, setFilterSelected] = useState<FilterSelectedType>();

  const [isLargerThan1030] = useMediaQuery('(min-width: 1030px)');
  const [cursosQuery, setCursosQuery] = useState<any[]>([
    { limit: 100 },
    {
      ruta: user?.progresoGlobal?.ruta?.meta?.itinerario
        ?.filter((i: any) => i.tipo === RutaItinerarioTipoEnum.CURSO && !isNaN(i.id))
        ?.map((i) => i.id),
    },
  ]);

  const [proyectosQuery, setProyectosQuery] = useState<any[]>([
    { limit: 100 },
    {
      ruta: user?.progresoGlobal?.ruta?.meta?.itinerario
        ?.filter((i: any) => i.tipo === RutaItinerarioTipoEnum.PROYECTO && !isNaN(i.id))
        ?.map((i) => i.id),
    },
  ]);

  const { cursos, isLoading } = useCursos({
    userId: user?.id,
    query: cursosQuery,
    strategy: 'invalidate-on-undefined',
  });

  const { proyectos, isLoading: isLoading_Proyectos } = useProyectosBoosts({
    query: proyectosQuery,
    strategy: 'invalidate-on-undefined',
  });

  useEffect(() => {
    if ((rutaSelected?.meta?.itinerario?.length || 0) > 0) {
      setCursosQuery([
        { limit: 100 },
        {
          ruta: rutaSelected?.meta?.itinerario
            ?.filter((i: any) => i.tipo === RutaItinerarioTipoEnum.CURSO && !isNaN(i.id))
            ?.map((i) => i.id),
        },
      ]);

      setProyectosQuery([
        { limit: 100 },
        {
          ruta: rutaSelected?.meta?.itinerario
            ?.filter((i: any) => i.tipo === RutaItinerarioTipoEnum.PROYECTO && !isNaN(i.id))
            ?.map((i) => i.id),
        },
      ]);
    }
  }, [rutaSelected?.meta?.itinerario]);

  useEffect(() => {
    if (user?.progresoGlobal?.rutaId) setRutaSelected(user?.progresoGlobal?.ruta);
  }, [user?.progresoGlobal?.ruta]);

  useEffect(() => {
    if (user?.progresoGlobal?.ruta?.id) setRutaSelected(user?.progresoGlobal?.ruta);

    setFirstSelected(false);
    setFilterSelected(undefined);
  }, [state.onClose]);

  const handleOnRoadmapChange = (rutaId: number) => {
    if (!user?.progresoGlobal?.id) {
      onFailure(toast, 'Error inesperado', 'Por favor, actualize la página y contacte con soporte si el error persiste.');

      return Promise.reject();
    }

    return updateProgresoGlobal({
      id: user?.progresoGlobal?.id,
      progresoGlobal: { rutaId: rutaId },
    })
      .then(async () => {
        const _user = await getUserByID({ id: user?.id || 0 });

        if (_user?.id) setUser({ ..._user });
        else console.error({ '⚠️ Error actualizando el usuario': _user });
      })
      .catch((err) => console.error({ err }));
  };

  return (
    <>
      {!isLargerThan1030 && (
        <ModalInfoResponsive
          isOpen={modalOpen}
          ruta={rutaSelected}
          cursos={cursos}
          proyectos={proyectos}
          onClose={() => setModalOpen(false)}
        />
      )}
      <Modal onClose={state.onClose} isOpen={state.isOpen}>
        <ModalOverlay bg="rgba(16, 23, 46, 0.75)" />

        <ModalContent
          overflow="hidden"
          m={{ base: '0px', md: '60px' }}
          rounded={{ base: '0', md: '2xl' }}
          h={{ base: '100vh', md: 'calc(100vh - 120px)' }}
          w={{ base: '100vw', md: 'calc(100vw - 120px)' }}
          maxW={{ base: '100vw', md: 'calc(100vw - 120px)' }}
          minW={{ base: '100vw', md: 'calc(100vw - 120px)' }}
          maxH={{ base: '100vh', md: 'calc(100vh - 120px)' }}
          minH={{ base: '100vh', md: 'calc(100vh - 120px)' }}
        >
          <ModalHeader
            py="28px"
            bg="white"
            fontSize={isLargerThan1030 ? '24px' : '18px'}
            borderBottom="1px solid var(--chakra-colors-gray_3)"
          >
            <Flex width="100%" align="center">
              <Box w="100%" fontSize="24px" textAlign="center" lineHeight="29.05px">
                Selecciona una hoja de ruta
              </Box>

              <CloseButton cursor="pointer" onClick={state.onClose} color="black" />
            </Flex>
          </ModalHeader>

          <Flex boxSize="100%" justify="space-between" overflow="hidden">
            <Flex
              bg="gray_1"
              boxSize="100%"
              overflow="auto"
              direction="column"
              p={isLargerThan1030 ? '32px' : '21px'}
              borderRight="1px solid var(--chakra-colors-gray_3)"
            >
              <Flex direction="column" gap="10px">
                <Box fontSize="16px" fontWeight="bold">
                  Categorías
                </Box>

                <Flex gap="10px" mb="20px" overflow="auto" pb="10px">
                  {(process.env.REACT_APP_ORIGEN_CAMPUS === 'OPENBOOTCAMP'
                    ? filtrosOB
                    : process.env.REACT_APP_ORIGEN_CAMPUS === 'OPENMARKETERS'
                    ? filtrosOM
                    : []
                  ).map((filtro: any, i: number) => (
                    <Flex
                      key={'filtro-' + i}
                      gap="5px"
                      p="10px"
                      rounded="10px"
                      align="center"
                      cursor="pointer"
                      transition="all 0.3 ease"
                      bg={filterSelected === filtro?.filterValue ? 'white' : 'gray_3'}
                      border={
                        filterSelected === filtro?.filterValue
                          ? '1px solid var(--chakra-colors-primary)'
                          : '1px solid var(--chakra-colors-gray_3)'
                      }
                      onClick={() => setFilterSelected(filtro?.filterValue)}
                    >
                      <Icon as={filtro?.icon} w="20px" h="18px" />

                      <Flex whiteSpace="nowrap">{filtro?.title}</Flex>
                    </Flex>
                  ))}
                </Flex>
              </Flex>

              <Flex pr="10px" gap="10px" boxSize="100%" overflow="auto" direction="column">
                {rutas
                  ?.filter((ruta: IRuta) => {
                    if (!filterSelected) return true;
                    else
                      switch (filterSelected) {
                        case FilterValueOB.APRENDE:
                          return filterContentsOB[FilterValueOB.APRENDE]?.includes(ruta.nombre);
                        case FilterValueOB.FRONTEND:
                          return filterContentsOB[FilterValueOB.FRONTEND]?.includes(ruta.nombre);
                        case FilterValueOB.BACKEND:
                          return filterContentsOB[FilterValueOB.BACKEND]?.includes(ruta.nombre);
                        case FilterValueOB.FULLSTACK:
                          return filterContentsOB[FilterValueOB.FULLSTACK]?.includes(ruta.nombre);
                        case FilterValueOM.TODOS:
                          return filterContentsOM[FilterValueOM.TODOS]?.includes(ruta.nombre);
                      }
                  })
                  ?.reverse()
                  ?.map((ruta: IRuta, index: number) => (
                    <Flex
                      key={index}
                      data-cy={`${ruta?.nombre}_ruta_item`}
                      bg="white"
                      width="100%"
                      border={
                        ruta?.nombre === rutaSelected?.nombre
                          ? '0.5px solid rgba(50, 212, 164, 1)'
                          : '0.5px solid var(--chakra-colors-gray_3)'
                      }
                      gap="20px"
                      rounded="10px"
                      cursor="pointer"
                      height="fit-content"
                      transition="all 0.5s ease"
                      p={isLargerThan1030 ? '25.5px' : '16px'}
                      align={isLargerThan1030 ? 'center' : 'unset'}
                      onClick={() => {
                        setRutaSelected(ruta);
                        setFirstSelected(true);
                        if (!isLargerThan1030) setModalOpen(true);
                      }}
                    >
                      <Image
                        rounded="10px"
                        boxSize={isLargerThan1030 ? '52px' : '42px'}
                        src={`data:image/svg+xml;utf8,${ruta.icono}`}
                      />

                      <Flex align="center" width="100%" justify="space-between">
                        <Flex direction="column">
                          <Box fontWeight="bold" fontSize={isLargerThan1030 ? '18px' : '16px'}>
                            {ruta?.nombre}
                          </Box>

                          <OpenParser maxChars={100} value={ruta?.descripcion} style={{ fontSize: '15px' }} />
                        </Flex>

                        <Flex
                          justify="center"
                          transition="all 0.3s ease"
                          color="rgba(50, 212, 164, 1)"
                          opacity={ruta?.nombre === rutaSelected?.nombre ? '1' : '0'}
                        >
                          <Icon boxSize="35px" as={IoIosArrowDroprightCircle} />
                        </Flex>
                      </Flex>
                    </Flex>
                  ))}
              </Flex>
            </Flex>

            {isLargerThan1030 ? (
              <Flex p="42px" bg="white" gap="10px" maxW="640px" boxSize="100%" overflow="auto" direction="column">
                <Flex align="center" gap="24px">
                  {rutaSelected?.icono && (
                    <Image boxSize="72px" rounded="10px" src={`data:image/svg+xml;utf8,${rutaSelected?.icono}`} />
                  )}

                  <Flex direction="column">
                    <Box fontSize="24px" fontWeight="bold">
                      {rutaSelected?.nombre}
                    </Box>

                    <Flex direction="column">
                      <Flex gap="10px" align="center">
                        <Flex align="center" justify="center" gap="5px">
                          <Icon as={BiBookBookmark} />
                          {sortByRoadmap(cursos, [], rutaSelected?.meta?.itinerario).length} cursos
                        </Flex>

                        <Flex align="center" justify="center" gap="5px">
                          <Icon as={BiBox} />
                          {sortByRoadmap([], proyectos, rutaSelected?.meta?.itinerario).length} proyectos
                        </Flex>
                      </Flex>
                    </Flex>
                  </Flex>
                </Flex>

                {rutaSelected?.id === user?.progresoGlobal?.ruta?.id && (
                  <Flex direction="column" gap="10px">
                    <Flex align="end">
                      <Box fontSize="21px" fontWeight="bold" color="black">
                        {user?.progresoGlobal?.meta?.progresoCampus}%{'  '}
                      </Box>

                      <Box fontSize="15px" color="gray_5" pl="10px">
                        DE HOJA DE RUTA COMPLETADA
                      </Box>
                    </Flex>

                    <Center>
                      <Progress
                        w="100%"
                        size="sm"
                        rounded="20px"
                        value={100}
                        sx={{
                          '& > div': {
                            background: !+`${user?.progresoGlobal?.meta?.progresoCampus || 0}%`.replace('%', '')
                              ? 'white'
                              : `linear-gradient(90deg, var(--chakra-colors-primary) 0%, var(--chakra-colors-primary_dark) ${`${
                                  user?.progresoGlobal?.meta?.progresoCampus || 0
                                }%`}, var(--chakra-colors-gray_3) ${`${
                                  user?.progresoGlobal?.meta?.progresoCampus || 0
                                }%`}, var(--chakra-colors-gray_3) 100%)`,
                          },
                        }}
                      />
                    </Center>
                  </Flex>
                )}

                {rutaSelected?.descripcion && (
                  <>
                    <Box pt="10px" fontSize="18px" lineHeight="22px" fontWeight="bold">
                      Descripción
                    </Box>

                    <OpenParser value={rutaSelected?.descripcion} style={{ fontSize: '16px' }} />
                  </>
                )}

                <Box pt="10px" fontSize="18px" fontWeight="bold" lineHeight="22px">
                  Cursos
                </Box>

                <Flex p="7px" h="auto" gap="10px" bg="gray_3" rounded="12px" direction="column">
                  {isLoading
                    ? [1, 2, 3, 4, 5].map((index: number) => <Skeleton key={index} w="100%" h="68px" rounded="12px" />)
                    : sortByRoadmap(cursos, proyectos, rutaSelected?.meta?.itinerario).map((item, index) => (
                        <RoadmapItem item={item} index={index} />
                      ))}
                </Flex>
              </Flex>
            ) : null}
          </Flex>

          <ModalFooter
            p="16px"
            bg="var(--chakra-colors-gray_3)"
            w={isLargerThan1030 ? 'unset' : '100%'}
            borderTop="1px solid var(--chakra-colors-gray_3)"
          >
            <Flex
              gap={isLargerThan1030 ? '15px' : '10px'}
              minW={isLargerThan1030 ? 'unset' : '100%'}
              align={isLargerThan1030 ? 'unset' : 'center'}
              direction={isLargerThan1030 ? 'row' : 'column-reverse'}
            >
              <Button
                onClick={state.onClose}
                w={isLargerThan1030 ? 'unset' : '100%'}
                fontSize={isLargerThan1030 ? '18px' : '13px'}
              >
                Cancelar
              </Button>

              <Button
                color="white"
                w={isLargerThan1030 ? 'unset' : '100%'}
                p={isLargerThan1030 ? '15px' : '10px'}
                fontSize={isLargerThan1030 ? '18px' : '13px'}
                bg={user?.progresoGlobal?.ruta?.id === rutaSelected?.id ? 'gray_4' : 'black'}
                _hover={user?.progresoGlobal?.ruta?.id === rutaSelected?.id ? {} : { backgroundColor: 'gray_4' }}
                disabled={!firstSelected || user?.progresoGlobal?.ruta?.id === rutaSelected?.id}
                onClick={() => {
                  if (rutaSelected?.id) handleOnRoadmapChange(rutaSelected?.id).then(state.onClose);
                }}
                data-cy="seguir_hoja_ruta"
              >
                Seguir hoja de ruta seleccionada
              </Button>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
