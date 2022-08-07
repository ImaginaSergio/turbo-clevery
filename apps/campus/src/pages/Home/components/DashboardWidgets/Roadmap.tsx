import { useEffect, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Flex, Box, Text, Icon, Image, Center, Button, Spinner, Skeleton } from '@chakra-ui/react';
import { BiCheck } from 'react-icons/bi';

import { ICurso, useCursos, filterCursosByRuta, RutaItinerarioTipoEnum } from 'data';
import { fmtMnts } from 'utils';
import { LoginContext, LayoutContext } from '../../../../shared/context';

export const RoadmapWidget = () => {
  const navigate = useNavigate();

  const { user } = useContext(LoginContext);
  const { isMobile } = useContext(LayoutContext);

  const { cursos: cursos_Roadmap, isLoading: isLoading_Roadmap } = useCursos({
    userId: user?.id,
    strategy: 'invalidate-on-undefined',
    query: [
      {
        ruta: (user?.progresoGlobal?.rutaPro?.meta?.itinerario || user?.progresoGlobal?.ruta?.meta?.itinerario)
          ?.filter((i: any) => i.tipo === RutaItinerarioTipoEnum.CURSO && !isNaN(i.id))
          ?.map((i) => i.id),
      },
    ],
  });

  const [cursoSelected, setCursoSelected] = useState<ICurso>();
  const [cursoSelectedID, setCursoSelectedID] = useState<number>(0);

  const [cursosVisibles, setCursosVisibles] = useState<ICurso[]>([]);
  const [maxCursosVisibles, setMaxCursosVisibles] = useState<number>(5);

  useEffect(() => {
    if (isMobile) setMaxCursosVisibles(2);
    else setMaxCursosVisibles(5);
  }, [isMobile]);

  const prevIsCompleted = (c: ICurso) => {
    const _index = cursos_Roadmap?.findIndex((o: any) => c.id === o.id);

    if (!_index || cursos_Roadmap?.length || 0 === 0) return false;
    else if (_index !== 0) {
      let _cursoPrev = cursos_Roadmap[_index - 1];
      if (_cursoPrev && _cursoPrev.meta.isCompleted) return true;
      else return false;
    } else {
      return false;
    }
  };

  const nextIsCompleted = (c: ICurso) => {
    const _index = cursos_Roadmap?.findIndex((o: any) => c.id === o.id);

    if (!_index || cursos_Roadmap?.length || 0 === 0) return false;
    else if (_index !== cursos_Roadmap?.length - 1)
      return cursos_Roadmap[_index + 1] && cursos_Roadmap[_index + 1].meta.isCompleted;
    else return false;
  };

  const nextIsCurrent = (id: number) => {
    const _index = cursos_Roadmap?.findIndex((o: any) => id === o.id);

    if (!_index || cursos_Roadmap?.length || 0 === 0) return false;
    else return _index && cursoSelected?.id === cursos_Roadmap[_index - 1]?.id;
  };

  useEffect(() => {
    filterCursos();
  }, [cursos_Roadmap]);

  const getIndexCurso = (id: number) =>
    filterCursosByRuta(
      user?.progresoGlobal?.rutaPro?.meta?.itinerario || user?.progresoGlobal?.ruta?.meta?.itinerario,
      cursos_Roadmap
    )?.findIndex((o: any) => id === o.id) + 1;

  /**
   * Filtramos los cursos que vamos a mostrar de la ruta
   * Siempre mostramos 5 (web) o 2 (móvil) empezando por el primero que esté incompleto
   * Si después del primero no tenemos un total de cinco, incluimos cursos anteriores
   */
  const filterCursos = () => {
    if (cursos_Roadmap?.length) {
      /** Cursos de la ruta, ordenados por la hoja de ruta */
      const cursosSorted = filterCursosByRuta(
        user?.progresoGlobal?.rutaPro?.meta?.itinerario || user?.progresoGlobal?.ruta?.meta?.itinerario,
        cursos_Roadmap
      );

      /** Primer curso incompleto de la ruta */
      let indexCursoInicial = cursosSorted.findIndex((c: ICurso) => c.meta?.isCompleted === false);

      /** Rellenamos los cursos que vamos a mostrar */
      if (indexCursoInicial === 0) {
        /** Si el index es 0, empezamos desde ahí */

        // TODO Revisar que pasa si cursosSorted.length es < maxCursosVisibles
        if (cursosSorted.length < maxCursosVisibles) setCursosVisibles(cursosSorted);
        else setCursosVisibles(cursosSorted.slice(0, maxCursosVisibles));
      } else {
        /** Sino, empezamos desde el index y rellenamos */

        let aux = cursosVisibles;
        let iTemp = indexCursoInicial;

        setCursoSelectedID(cursosSorted[indexCursoInicial]?.id || 0);

        while (cursosVisibles.length < maxCursosVisibles && iTemp < cursosSorted.length) {
          aux.push(cursosSorted[iTemp++]);
        }

        if (cursosVisibles.length < maxCursosVisibles) {
          iTemp = indexCursoInicial;

          while (cursosVisibles.length < maxCursosVisibles && iTemp > 0) {
            aux.push(cursosSorted[iTemp--]);
          }
        }

        if (indexCursoInicial !== -1) {
          setCursosVisibles([...aux]);
          setCursoSelected(cursosVisibles[indexCursoInicial]);
        } else {
          setCursoSelected(cursosVisibles[0]);
          setCursosVisibles([...aux]);
        }
      }
    }
  };

  return (
    <Flex
      id="roadmapWidget"
      data-cy="home_roadmap"
      h="100%"
      gap="20px"
      direction="column"
      p={{ base: '12px', sm: 0 }}
      mt={{ base: '42px', sm: 0 }}
    >
      <Flex w="100%" gap="10px" direction="column">
        <Text variant="h2_heading" isTruncated>
          {process.env.NX_ORIGEN_CAMPUS === 'OPENBOOTCAMP' ? 'El método OpenBootcamp' : 'El método OpenMarketers'}
        </Text>

        <Text variant="p_text">
          Hemos diseñado esta hoja de ruta para que tu experiencia de aprendizaje sea la mejor y no te pierdas a lo largo de tu
          formación.
        </Text>
      </Flex>

      <Flex w="100%" p="24px" bg="white" rounded="20px" direction="column" border="1px solid var(--chakra-colors-gray_3)">
        <Flex w="100%" justify="space-between" mb="16px">
          <Text
            data-cy="roadmap_titulo_ruta"
            color="gray_4"
            lineHeight="14px"
            fontSize="14px"
            fontWeight="bold"
            textTransform="uppercase"
          >
            {user?.progresoGlobal?.rutaPro?.nombre || user?.progresoGlobal?.ruta?.nombre}
          </Text>

          <Box fontSize="12px" fontWeight="bold" lineHeight="14px">
            {user?.progresoGlobal?.meta?.progresoCampus || 0}%
          </Box>
        </Flex>

        {/* ROADMAP */}
        <Flex w="100%" wrap="wrap" direction="column">
          {isLoading_Roadmap
            ? (isMobile ? [1, 2] : [1, 2, 3]).map((i: number) => (
                <RoadmapItem isLoading key={`roadmap_widget-item_placeholder-${i}`} />
              ))
            : cursosVisibles
                ?.filter((c) => c)
                ?.map((c: ICurso, index: number) => (
                  <RoadmapItem
                    curso={c}
                    id={getIndexCurso(c?.id || 0)}
                    key={`roadmap_widget-item-${index}`}
                    nextIsCompleted={nextIsCompleted(c)}
                    prevIsCompleted={prevIsCompleted(c)}
                    nextIsCurrent={nextIsCurrent(c?.id || 0)}
                    onClick={() => navigate(`/cursos/${c?.id}`)}
                    isLastCurso={index === cursos_Roadmap?.length - 1}
                    state={c?.id === cursoSelectedID ? 'current' : c?.meta?.isCompleted ? 'completed' : 'idle'}
                  />
                ))}
          <Button bg="gray_3" w="100%" onClick={() => navigate('/roadmap')}>
            {isLoading_Roadmap ? (
              <Spinner />
            ) : cursosVisibles?.length >= cursos_Roadmap?.length ? (
              'Ver hoja de ruta'
            ) : (
              `Ver ${cursos_Roadmap?.length - cursosVisibles?.length} ${
                cursos_Roadmap?.length - cursosVisibles?.length === 1 ? 'curso restante' : 'cursos restantes'
              }`
            )}
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
};

const RoadmapItem = ({
  id = 0,
  state = 'idle',
  onClick,
  curso,
  isLastCurso,
  prevIsCompleted,
  nextIsCurrent,
  isLoading = false,
}: {
  id?: number;
  curso?: ICurso;
  isLastCurso?: boolean;
  nextIsCompleted?: any;
  prevIsCompleted?: any;
  nextIsCurrent?: boolean;
  isLoading?: boolean;
  state?: 'current' | 'completed' | 'idle';
  onClick?: () => void;
}) => {
  return (
    <Skeleton isLoaded={!isLoading}>
      <Flex w="100%" rounded="xl" align="center" justify="center" onClick={curso?.disponible ? onClick : undefined}>
        <Flex direction="column" align="center">
          <Box
            w="1px"
            h="100%"
            minH="38px"
            border={id === 1 ? '0' : '1px'}
            borderColor={prevIsCompleted && state === 'current' ? 'primary_neon' : 'gray_3'}
            borderStyle={prevIsCompleted && state === 'current' ? 'solid' : 'dashed'}
          />

          <Center
            boxSize="26px"
            minH="26px"
            rounded="full"
            bg={state === 'current' ? 'primary_light' : state === 'completed' ? 'primary_neon' : 'gray_3'}
            border={state === 'current' ? '2px solid var(--chakra-colors-primary_neon)' : 'none'}
          >
            {state !== 'completed' ? (
              <Text fontSize="14px" fontWeight="semibold" color={state === 'current' ? 'primary' : 'gray_4'}>
                {id}
              </Text>
            ) : (
              <Icon as={BiCheck} w="17px" color="white" />
            )}
          </Center>

          <Box
            w="1px"
            h="100%"
            minH="38px"
            border={isLastCurso ? '0' : '1px'}
            borderColor={state === 'completed' && nextIsCurrent ? 'primary_neon' : 'gray_3'}
            borderStyle={state === 'completed' && nextIsCurrent ? 'solid' : 'dashed'}
          />
        </Flex>

        <Box h="1px" w={{ base: '24px', md: '14px' }} bg={state === 'current' ? 'primary_neon' : 'gray_3'} />

        <Flex
          onClick={curso?.disponible ? onClick : undefined}
          w="100%"
          p="8px"
          gap="15px"
          minH="76px"
          rounded="xl"
          align="center"
          cursor={curso?.disponible ? 'pointer' : 'not-allowed'}
          opacity={state === 'completed' ? 0.6 : 1}
          bg={state === 'current' ? 'white' : 'gray_1'}
          border={state === 'current' ? '1px solid var(--chakra-colors-primary_neon)' : 'none'}
        >
          <Image boxSize="60px" rounded="15px" bg="#FFFFFF" src={`data:image/svg+xml;utf8,${curso?.icono}`} />

          <Flex direction="column" width="100%" align={{ base: 'start', md: 'unset' }}>
            <Text
              noOfLines={1}
              fontSize="16px"
              fontWeight="bold"
              textOverflow="ellipsis"
              data-cy={`roadmap_item_titulo_${curso?.id}`}
            >
              {curso?.titulo}
            </Text>

            <Flex gap={{ base: 0, sm: '4px' }} align="center" direction={{ base: 'column', sm: 'row' }}>
              {curso?.disponible ? (
                <>
                  <Text fontSize="14px" color="gray_4">
                    {curso?.modulos?.length} módulos
                  </Text>
                  <Text fontSize="14px" color="gray_4" display={{ base: 'none', sm: 'flex' }}>
                    |
                  </Text>
                  <Text fontSize="14px" color="gray_4">
                    {fmtMnts(curso?.meta?.duracionTotal)}
                  </Text>{' '}
                </>
              ) : (
                <Box>Disponible próximamente...</Box>
              )}
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Skeleton>
  );
};
