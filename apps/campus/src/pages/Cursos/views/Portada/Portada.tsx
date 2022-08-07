import { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

import { BiTimeFive, BiStar, BiBarChart, BiListOl, BiPlay } from 'react-icons/bi';
import {
  Box,
  Button,
  Flex,
  Image,
  Icon,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Skeleton,
  useToast,
  IconButton,
  Text,
} from '@chakra-ui/react';
import stc from 'string-to-color';
import { AiFillStar } from 'react-icons/ai';
import { FaRegEyeSlash } from 'react-icons/fa';

import { onFailure } from 'ui';
import { fmtMnts } from 'utils';
import { FavoritoTipoEnum, IFavorito } from 'data';
import { ICurso, ILeccion, IUser, LeccionTipoEnum, useCurso, useExamenes, useLeccion } from 'data';

import { FavoritosContext, LayoutContext, LoginContext } from '../../../../shared/context';

import { HeaderCurso } from './HeaderCurso';
import { TabPruebas } from './Tabs/TabPruebas';
import ColumnaContenido from './ColumnaContenido';
import { TabEjercicios } from './Tabs/TabEjercicios';
import { TabDescripcion } from './Tabs/TabDescripcion';

const Portada = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(LoginContext);
  const { setShowHeader, setShowSidebar } = useContext(LayoutContext);

  const [leccionId, setLeccionId] = useState<number>();

  const { cursoId } = useParams<any>();
  const {
    data: curso,
    isLoading,
    isError,
  } = useCurso({
    id: +(cursoId || 0),
    userId: user?.id,
    strategy: 'invalidate-on-undefined',
  });

  const { examenes } = useExamenes({
    strategy: 'invalidate-on-undefined',
    query: [{ cursos: `[${cursoId}]` }, { es_certificacion: false }],
  });

  const { leccion } = useLeccion({
    id: +(leccionId || 0),
    strategy: 'invalidate-on-undefined',
  });

  useEffect(() => {
    if ((curso?.modulos?.length || 0) > 0 && (curso?.modulos[0].lecciones?.length || 0) > 0) {
      let _leccionId = curso?.modulos[0].lecciones[0].id;

      curso?.modulos?.find((modulo: any) =>
        modulo.lecciones?.find((leccion: any) => {
          if (!leccion.meta?.isCompleted) {
            _leccionId = leccion.id;

            return true;
          }

          return false;
        })
      );

      setLeccionId(_leccionId);
    }
  }, [curso?.modulos]);

  useEffect(() => {
    setShowHeader(true);
    setShowSidebar(true);
  }, []);

  useEffect(() => {
    const state: any = location.state;

    if (curso?.id && state?.moduloId) {
      const modulo = curso?.modulos?.find((m: any) => m.id == state?.moduloId);

      if ((modulo?.lecciones?.length || 0) > 0) navigate(`/cursos/${cursoId}/leccion/${modulo.lecciones[0].id}`);
    }

    if (curso?.disponible === false) {
      navigate('/cursos');

      onFailure(toast, 'Curso no disponible', '¡El contenido de este curso aún no está preparado!');
    }
  }, [curso]);

  useEffect(() => {
    if (isError) {
      navigate('/cursos');

      onFailure(toast, 'Error inesperado', 'El curso no existe o no está disponible.');
    }
  }, [isError]);

  const onContinueLeccion = () => {
    let leccionId = curso?.modulos[0].lecciones[0].id;

    curso?.modulos?.find((modulo: any) =>
      modulo.lecciones?.find((leccion: any) => {
        if (!leccion.meta?.isCompleted) {
          leccionId = leccion.id;

          return true;
        }

        return false;
      })
    );

    navigate(`/cursos/${cursoId}/leccion/${leccionId}`);
  };

  const cursoTieneEjercicios = (curso: ICurso) => {
    const ejercicio = curso?.modulos?.find((modulo) =>
      modulo.lecciones?.find(
        (l: ILeccion) => l.tipo === LeccionTipoEnum.ENTREGABLE || l.tipo === LeccionTipoEnum.AUTOCORREGIBLE
      )
    );

    return ejercicio !== undefined;
  };

  return !isLoading ? (
    <Flex
      maxW="100%"
      boxSize="100%"
      position="relative"
      px={{ base: '0px', sm: '40px' }}
      pt={{ base: '0px', sm: '40px' }}
      // gap={{ base: '40px', lg: 'unset' }}
      direction={{ base: 'column', lg: 'row' }}
    >
      <Flex w="100%" flex={2} gap="28px" direction="column" mr={{ base: 'unset', lg: '546px' }} h="100%">
        {/* HEADER CURSO */}
        <HeaderPortada user={user} curso={curso} onContinueLeccion={onContinueLeccion} />

        {/* DESCRIPCION DEL CURSO */}
        <Flex
          bg={{ base: 'gray_1', sm: 'white' }}
          overflow="hidden"
          direction="column"
          roundedTop={{ base: 'unset', md: '20px' }}
          h="100%"
        >
          <HeaderCurso curso={curso} leccion={leccion} onContinueLeccion={onContinueLeccion} />

          <Tabs w="100%" flex={1} p={{ base: '24px', sm: '33px' }} h="100%">
            <TabList
              w="100%"
              gap="40px"
              display="flex"
              borderBottom="none"
              alignContent="start"
              overflowY="hidden"
              overflowX="auto"
              border="none"
              sx={{
                scrollbarWidth: 'none',
                '::-webkit-scrollbar': { opacity: '0' },
                '-webkit-overflow-scrolling': 'touch',
                border: 'none',
                paddingBottom: '8px',
              }}
            >
              <Tab
                minW="160px"
                w="fit-content"
                px="-3px"
                color="gray_4"
                fontSize={{ base: '15px', sm: '18px' }}
                fontWeight="bold"
                _selected={{
                  color: 'black',
                  borderBottom: '2px solid var(--chakra-colors-black)',
                }}
              >
                Descripción del curso
              </Tab>

              {cursoTieneEjercicios(curso) && (
                <Tab
                  w="fit-content"
                  px="-3px"
                  color="gray_4"
                  fontSize={{ base: '15px', sm: '18px' }}
                  fontWeight="bold"
                  _selected={{
                    color: 'black',
                    borderBottom: '2px solid var(--chakra-colors-black)',
                  }}
                >
                  Ejercicios
                </Tab>
              )}

              {(examenes?.length || 0) > 0 && (
                <Tab
                  minW="200px"
                  w="fit-content"
                  px="-3px"
                  color="gray_4"
                  fontSize={{ base: '15px', sm: '18px' }}
                  fontWeight="bold"
                  _selected={{
                    color: 'black',
                    borderBottom: '2px solid var(--chakra-colors-black)',
                  }}
                >
                  Pruebas de Conocimientos
                </Tab>
              )}
            </TabList>

            <TabPanels w="100%" pt={{ base: '0', sm: '40px' }}>
              <TabPanel p="0px" w="100%">
                <TabDescripcion curso={curso} />
              </TabPanel>

              {cursoTieneEjercicios(curso) && (
                <TabPanel p="0px" w="100%">
                  <TabEjercicios curso={curso} />
                </TabPanel>
              )}

              {(examenes?.length || 0) > 0 && (
                <TabPanel p="0px" w="100%">
                  <TabPruebas curso={curso} examenes={examenes} />
                </TabPanel>
              )}
            </TabPanels>
          </Tabs>
        </Flex>
        <Flex
          bg="white"
          position="fixed"
          bottom="0"
          boxShadow="0px -4px 20px 0px #0000001A"
          w="100%"
          h="89px"
          zIndex="100"
          align="center"
          justify="center"
          px="20px"
          py="18px"
          display={{ base: 'flex', sm: 'none' }}
        >
          <Button
            rightIcon={<Icon as={BiPlay} />}
            rounded="14px"
            bg="black"
            color="white"
            w="100%"
            h="100%"
            onClick={onContinueLeccion}
          >
            {curso?.meta?.progreso_count
              ? curso?.meta?.progreso_count > 0
                ? 'Continuar curso'
                : 'Empezar curso'
              : 'Empezar curso'}
          </Button>
        </Flex>
      </Flex>

      <Flex
        flex={1}
        right={{ base: 'unset', lg: 0 }}
        maxW={{ base: 'unset', lg: '556px' }}
        w={{ base: '100%', lg: 'fit-content' }}
        position={{ base: 'unset', lg: 'fixed' }}
        overflow={{ base: 'unset', lg: 'hidden' }}
      >
        <ColumnaContenido modulos={curso?.modulos} curso={curso} />
      </Flex>
    </Flex>
  ) : (
    <Flex w="100%" p="40px" gap="50px" align="center" justify="space-between">
      <Flex gap="28px" direction="column" w="100%">
        <Flex w="100%" justify="space-between">
          <Flex w="100%" gap="24px">
            <Skeleton w="85px" h="75px" rounded="20px" />
            <Flex direction="column" w="100%" gap="10px" justify="center">
              <Skeleton w="300px" h="42px" />
              <Skeleton w="400px" h="21px" />
            </Flex>
          </Flex>
          <Flex w="100%" gap="14px" justify="flex-end" align="center">
            <Skeleton w="50px" h="50px" rounded="10px" />
            <Skeleton w="177px" h="42px" rounded="10px" />
          </Flex>
        </Flex>

        <Flex mt={{ base: '0px', sm: '20px' }}>
          <Skeleton w="1002px" h="860px" rounded="20px" />
        </Flex>
      </Flex>

      <Flex w="100%" justify="flex-end">
        <Skeleton h="860px" w="510px" rounded="20px" />
      </Flex>
    </Flex>
  );
};

export default Portada;

const HeaderPortada = ({ user, curso, onContinueLeccion }: { user?: IUser | null; curso?: ICurso; onContinueLeccion: any }) => {
  const { favoritos, addFavorito, removeFavorito, controladorFav } = useContext(FavoritosContext);

  const [cursoFavorito, setCursoFavorito] = useState<IFavorito>();
  const [fav, setFav] = useState<boolean>();

  useEffect(() => {
    setCursoFavorito(
      favoritos?.find((fav) => fav?.objetoId === curso?.id && fav?.tipo === 'curso' && user?.id === fav?.userId)
    );
    if (favoritos?.find((fav) => fav?.objetoId === curso?.id && fav?.tipo === 'curso' && user?.id === fav?.userId))
      setFav(true);
    else setFav(false);
  }, [favoritos, curso?.id]);

  return (
    <Flex direction="column" gap="28px" w="100%" px={{ base: '16px', sm: '0px' }}>
      <Flex w="100%" gap="20px" justify="space-between" direction={{ base: 'column', md: 'row' }}>
        {/* INFO CURSO */}
        <Flex gap={{ base: '12px', sm: '28px' }} w="100%" align="center">
          <Image
            rounded="20px"
            boxSize="75px"
            border="1px solid var(--chakra-colors-gray_3)"
            src={`data:image/svg+xml;utf8,${curso?.icono}`}
            bg={curso?.icono ? '#fff' : stc(curso?.titulo || 'Lorem Ipsum')}
          />

          <Flex direction="column" fontWeight="bold" gap="8px">
            <Box
              data-cy="landing_titulo"
              fontWeight="bold"
              textOverflow="ellipsis"
              fontSize={{ base: '18px', sm: '24px' }}
              lineHeight={{ base: '20.16px', sm: '41.73px' }}
            >
              {curso?.titulo}
            </Box>

            <Flex w="100%" gap="12px" wrap="wrap" fontSize={{ base: '12px', sm: '14px' }} fontWeight="normal">
              <Flex align="center" color="gray_5" w="fit-content" gap={{ base: '4px', sm: '8px' }}>
                <Icon boxSize={{ base: '11px', sm: '15px' }} as={BiBarChart} color="gray_6" />
                {(curso?.nivel || '').charAt(0).toUpperCase() + curso?.nivel?.slice(1)}
              </Flex>

              <Flex align="center" color="gray_5" w="fit-content" gap={{ base: '4px', sm: '8px' }}>
                <Icon boxSize={{ base: '11px', sm: '15px' }} as={BiListOl} color="gray_6" />
                {curso?.modulos?.length} módulos
              </Flex>

              <Flex align="center" color="gray_5" w="fit-content" gap={{ base: '4px', sm: '8px' }}>
                <Icon boxSize={{ base: '11px', sm: '15px' }} as={BiTimeFive} color="gray_6" />
                <Text color="gray_5" fontSize="14px" display={{ base: 'none', sm: 'flex' }}>
                  {fmtMnts(curso?.meta?.duracionTotal)}
                </Text>
                <Text color="gray_5" fontSize="12px" display={{ base: 'flex', sm: 'none' }}>
                  {fmtMnts(curso?.meta?.duracionTotal, false)}
                </Text>
              </Flex>
            </Flex>
          </Flex>
        </Flex>

        {/* FAV & EMPEZAR/CONTINÚAR */}
        <Flex gap="14px" display={{ base: 'none', sm: 'flex' }}>
          {curso && !curso?.publicado && (
            <Flex align="center" gap="5px">
              <Icon as={FaRegEyeSlash} boxSize="20px" color="cancel" />

              <Box fontSize="14px" whiteSpace="nowrap" color="cancel" lineHeight="16px" fontWeight="semibold">
                No publicado
              </Box>
            </Flex>
          )}

          <IconButton
            data-cy="cursos_landing_favorito"
            aria-label="Añadir a favorito"
            border="none"
            rounded="10px"
            isActive={!cursoFavorito}
            bg="gray_3"
            _hover={{ bg: 'gray_2' }}
            _active={{
              color: 'primary',
              bg: 'primary_light',
            }}
            onClick={
              fav
                ? () => {
                    if (cursoFavorito) controladorFav(cursoFavorito, false);
                  }
                : () => {
                    if (curso?.id && user?.id)
                      controladorFav(
                        {
                          objetoId: curso?.id,
                          tipo: FavoritoTipoEnum.CURSO,
                          userId: user?.id,
                          objeto: curso,
                        },
                        true
                      );
                  }
            }
            icon={
              <Icon
                boxSize="20px"
                as={cursoFavorito ? AiFillStar : BiStar}
                color={cursoFavorito ? 'primary_neon' : undefined}
              />
            }
          />

          <Button
            bg="black"
            color="white"
            w="fit-content"
            fontWeight="bold"
            data-cy="cursos_landing_continuar-header"
            onClick={onContinueLeccion}
            mb={{ base: '20px', sm: 'auto' }}
            rightIcon={<Icon boxSize="20px" as={BiPlay} />}
            _hover={{ bg: 'var(--chakra-colors-primary_dark)' }}
            isDisabled={
              !curso?.modulos || (curso?.modulos?.length || 0) === 0 || (curso?.modulos[0].lecciones?.length || 0) === 0
            }
          >
            {(curso?.meta?.progreso_count || 0) > 0 ? 'Continuar curso' : 'Empezar curso'}
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
};
