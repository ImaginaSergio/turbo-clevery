import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { addMinutes, isBefore } from 'date-fns';
import { Text, Flex, Box } from '@chakra-ui/react';

import { IUser, ICurso, useCurso, useCursos, useLeccion, UserRolEnum, filterCursosByRuta, RutaItinerarioTipoEnum } from 'data';

import { LoginContext } from '../../../shared/context';
import { GlobalCard, GlobalCardType } from '../../../shared/components';

import { AdminWidget } from '../components/DashboardWidgets/Admin';
import { PhaseUser } from '../components/DashboardWidgets/PhaseUser';
import { DiscordWidget } from '../components/DashboardWidgets/Discord';
import { RoadmapWidget } from '../components/DashboardWidgets/Roadmap';
import { WidgetPerfil } from '../components/DashboardWidgets/WidgetPerfil';
import { DestacadoWidget } from '../components/DashboardWidgets/Destacado';

import gradientStyle from './Dashboard.module.scss';
import { YoutubeWidget } from '../components/DashboardWidgets/Youtube';

export const HomeDashboard = () => {
  const navigate = useNavigate();
  const { user, totalPerfil } = useContext(LoginContext);

  const [cursoInicialId, setCursoInicialId] = useState(1);

  useEffect(() => {
    let itinerario = user?.progresoGlobal?.rutaPro?.meta?.itinerario || user?.progresoGlobal?.ruta?.meta?.itinerario;

    if (itinerario && itinerario?.length >= 1) setCursoInicialId(itinerario[0].id || 1);
  }, [user?.progresoGlobal?.rutaPro?.meta?.itinerario, user?.progresoGlobal?.ruta?.meta?.itinerario]);

  const { data: cursoInicial, isLoading: isLoading_Inicial } = useCurso({
    id: cursoInicialId,
    userId: user?.id,
    strategy: 'invalidate-on-undefined',
  });

  const { cursos: cursoActivo, isLoading: isLoading_Activo } = useCursos({
    userId: user?.id,
    strategy: 'invalidate-on-undefined',
    query: [{ leccion_id: user?.progresoGlobal?.progresoLecciones?.lastPlayed }],
  });

  const { cursos, isLoading } = useCursos({
    userId: user?.id,
    strategy: 'invalidate-on-undefined',
    query: [{ limit: 4 }],
  });

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

  const [leccionActivaId, setLeccionActivaId] = useState(user?.progresoGlobal?.progresoLecciones?.lastPlayed);

  const { leccion: leccionActiva } = useLeccion({
    id: leccionActivaId,
    strategy: 'invalidate-on-undefined',
  });

  const [siguienteCurso, setSiguienteCurso] = useState<ICurso[]>();

  useEffect(() => {
    let aux = filterCursosByRuta(
      user?.progresoGlobal?.rutaPro?.meta?.itinerario || user?.progresoGlobal?.ruta?.meta?.itinerario,
      cursos_Roadmap
    )?.filter((c: ICurso) => c.meta?.isCompleted === false);

    setSiguienteCurso([...aux]);
  }, [cursos_Roadmap]);

  useEffect(() => {
    // Si ya ha cargado el curso inicial, y no hemos visto aún ninguna lección,
    // cargamos como leccionActivaId la primera lección de cursoInicial
    if (cursoInicial && !user?.progresoGlobal?.progresoLecciones?.lastPlayed) {
      let newLeccionId = ((cursoInicial?.modulos || [])[0]?.lecciones || [])[0]?.id;

      setLeccionActivaId(newLeccionId);
    }
  }, [cursoInicial]);

  return (
    <Flex
      boxSize="100%"
      align="flex-start"
      p={{ base: '0px', sm: '34px' }}
      gap={{ base: '30px', xl: '80px' }}
      direction={{ base: 'column', md: 'row' }}
    >
      {/* LEFT WIDE COLUMN */}
      <Flex flex={2} gap="62px" direction="column" w={{ base: '100%', md: '65%' }}>
        {/* BIENVENIDO AL CAMPUS */}
        {!isLoading_Inicial
          ? cursoInicial &&
            !cursoActivo && (
              <Flex direction="column" gap="20px" order={0}>
                <GreetingsTitle nombre={user?.nombre} type="greetings" />

                <GlobalCard
                  maxPerRow={1}
                  gapBetween="28px"
                  type={GlobalCardType.CURSO_ACTIVO}
                  rounded={{ base: 'none', sm: '2xl' }}
                  props={{
                    curso: cursoInicial,
                    leccion: leccionActiva,
                    isFirstCurso: true,
                  }}
                />
              </Flex>
            )
          : cursoInicial &&
            !cursoActivo && (
              <Flex direction="column" gap="20px" order={0}>
                <GreetingsTitle nombre={user?.nombre} type="greetings" />

                <GlobalCard
                  maxPerRow={1}
                  gapBetween="28px"
                  type={GlobalCardType.CURSO_ACTIVO}
                  rounded={{ base: 'none', sm: '2xl' }}
                  props={{ isLoading: true }}
                />
              </Flex>
            )}

        {/* CONTINÚA POR DONDE LO DEJASTE */}
        {!isLoading_Activo
          ? cursoActivo?.length === 1 &&
            cursoActivo[0] &&
            !cursoActivo[0]?.meta?.isCompleted && (
              <Flex direction="column" gap="20px" order={0}>
                <GreetingsTitle nombre={user?.nombre} type="continue" />

                <GlobalCard
                  maxPerRow={1}
                  gapBetween="28px"
                  type={GlobalCardType.CURSO_ACTIVO}
                  rounded={{ base: 'none', sm: '2xl' }}
                  props={{ curso: cursoActivo[0], leccion: leccionActiva }}
                />
              </Flex>
            )
          : cursoActivo?.length === 1 &&
            cursoActivo[0] &&
            !cursoActivo[0]?.meta?.isCompleted && (
              <Flex direction="column" gap="20px" order={0}>
                <GreetingsTitle nombre={user?.nombre} type="continue" />

                <GlobalCard
                  maxPerRow={1}
                  gapBetween="28px"
                  type={GlobalCardType.CURSO_ACTIVO}
                  rounded={{ base: 'none', sm: '2xl' }}
                  props={{ isLoading: true }}
                />
              </Flex>
            )}

        {/* SIGUE TU HOJA DE RUTA */}
        {!isLoading_Roadmap
          ? siguienteCurso?.length === 1 &&
            ((cursoActivo && cursoActivo[0]?.meta?.isCompleted) || !cursoActivo) &&
            (cursoInicial?.meta?.isCompleted || !cursoInicial) && (
              <Flex direction="column" gap="20px" order={0}>
                <GreetingsTitle nombre={user?.nombre} type="next_route" />

                <GlobalCard
                  maxPerRow={1}
                  gapBetween="28px"
                  type={GlobalCardType.CURSO_ACTIVO}
                  rounded={{ base: 'none', sm: '2xl' }}
                  props={{
                    curso: siguienteCurso[0],
                    leccion: leccionActiva,
                    isFirstCurso: true,
                  }}
                />
              </Flex>
            )
          : siguienteCurso &&
            !cursoActivo &&
            !cursoInicial && (
              <Flex direction="column" gap="20px" order={0}>
                <GreetingsTitle nombre={user?.nombre} type="next_route" />

                <GlobalCard
                  maxPerRow={1}
                  gapBetween="28px"
                  type={GlobalCardType.CURSO_ACTIVO}
                  rounded={{ base: 'none', sm: '2xl' }}
                  props={{ isLoading: true }}
                />
              </Flex>
            )}

        <RightColumn user={user} totalPerfil={totalPerfil} display={{ base: 'flex', md: 'none' }} />

        {/* QUÉ MÁS PUEDES APRENDER */}
        <Flex
          gap="20px"
          align="start"
          direction="column"
          order={{ base: 2, md: 0 }}
          justify-content="space-between"
          px={{ base: '12px', sm: '0px' }}
        >
          <Flex w="100%" justify="space-between">
            <Flex align="center" gap="6px">
              <Text fontWeight="bold" fontSize={{ base: '16px', sm: '18px' }}>
                Cursos mejor valorados
              </Text>

              <Text fontWeight="bold" display={{ base: 'none', sm: 'flex' }} fontSize={{ base: '16px', sm: '18px' }}>
                {process.env.REACT_APP_ORIGEN_CAMPUS === 'OPENBOOTCAMP' && ' de OpenBootcamp'}
                {process.env.REACT_APP_ORIGEN_CAMPUS === 'OPENMARKETERS' && ' de OpenMarketers'}
              </Text>
            </Flex>

            <Box
              fontSize="15px"
              color="#8B8FA1"
              cursor="pointer"
              lineHeight="18px"
              whiteSpace="nowrap"
              fontWeight="semibold"
              textDecoration="underline"
              onClick={() => navigate('/cursos')}
            >
              Ver todos
            </Box>
          </Flex>

          <Flex
            data-cy="home_cursos_recomendados"
            w="100%"
            gap="18px"
            overflow="auto"
            pb={{ base: '12px', md: '0' }}
            wrap={{ base: 'nowrap', md: 'wrap' }}
          >
            {isLoading
              ? [0, 1, 2, 3].map((c, i) => (
                  <GlobalCard
                    key={i}
                    maxPerRow={4}
                    minWidth="242px"
                    gapBetween="18px"
                    type={GlobalCardType.CURSO}
                    props={{ isLoading: true }}
                  />
                ))
              : cursos
                  ?.filter((c: ICurso) => c.disponible)
                  ?.map((c: ICurso, i: number) => (
                    <GlobalCard
                      key={i}
                      maxPerRow={4}
                      minWidth="242px"
                      gapBetween="18px"
                      type={GlobalCardType.CURSO}
                      data-cy={`curso_recomendado_${i}`}
                      props={{ curso: c, showProgress: false }}
                      onClick={() => navigate(`/cursos/${c?.id}`)}
                    />
                  ))}
          </Flex>
        </Flex>

        {/* CÓMO FUNCIONA OB */}
        {process.env.REACT_APP_ORIGEN_CAMPUS === 'OPENBOOTCAMP' && (
          <Flex h="100%" gap="20px" direction="column" order={{ base: 1, md: 0 }} px={{ base: '12px', sm: '0px' }}>
            <Flex direction="column" gap="10px">
              <Text fontWeight="bold" fontSize={{ base: '16px', sm: '18px' }}>
                ¿En qué fase de OpenBootcamp estás?
              </Text>

              <Text fontSize="15px">
                {`Open Bootcamp ha nacido para reinventar la formación
                especializada.\n\nNuestra misión es que puedas tener acceso a la
                formación tecnológica de máxima calidad sin coste alguno. Con
                nuestra formación, podrás acceder a empleos que se ajusten a tus
                necesidades.\n\nDependiendo del momento en el que te encuentres,
                podrás elegir entre nuestras dos fases:`}
              </Text>
            </Flex>

            <PhaseUser user={user} totalPerfil={totalPerfil} />
          </Flex>
        )}
      </Flex>

      <RightColumn user={user} totalPerfil={totalPerfil} display={{ base: 'none', md: 'flex' }} />
    </Flex>
  );
};

const RightColumn = ({ user, display, totalPerfil = 0 }: { display: any; user?: IUser | null; totalPerfil: number }) => {
  /** Si el usuario tiene progresos y han pasado 30mins desde que
   *  se creó su cuenta, mostramos el widget para rellenar el progreso */
  const userIsNew = (user?.progresos?.length || 0) === 0 || isBefore(new Date(), addMinutes(new Date(user?.createdAt), 30));

  return (
    <Flex flex={1} h="100%" minW="30%" boxSize="100%" display={display} direction="column" gap={{ base: 0, sm: '32px' }}>
      {user?.rol && user?.rol !== UserRolEnum.ESTUDIANTE && (
        <Flex px={{ base: '34px', sm: '0px' }} pb={{ base: '26px', sm: 0 }}>
          <AdminWidget />
        </Flex>
      )}

      {!userIsNew && totalPerfil < 100 && <WidgetPerfil totalPerfil={totalPerfil} />}

      <YoutubeWidget />

      <DiscordWidget />

      {/* {user?.preferencias?.cursoDestacado && <DestacadoWidget />} */}

      <RoadmapWidget />
    </Flex>
  );
};

const GreetingsTitle = ({
  nombre = 'Anónimo',
  type = 'greetings',
}: {
  nombre?: string;
  type: 'greetings' | 'continue' | 'next_route';
}) => (
  <Flex w="100%" pb="0px" gap="4px" wrap="wrap" align="center" p={{ base: '24px', sm: '0px' }}>
    <Flex align="center" wrap="wrap" fontWeight="bold" fontSize={{ base: '21px', sm: '28px' }} lineHeight="33.89px">
      <span role="img" aria-label="Hola">
        👋 ¡Hola {<span className={gradientStyle.nameGradient}>{nombre}</span>},{' '}
        {type === 'greetings'
          ? `empieza a aprender con ${
              process.env.REACT_APP_ORIGEN_CAMPUS === 'OPENBOOTCAMP' ? 'OpenBootcamp' : 'OpenMarketers'
            }!`
          : type === 'continue'
          ? 'continúa por donde lo habías dejado!'
          : 'continúa tu hoja de ruta!'}
      </span>
    </Flex>
  </Flex>
);
