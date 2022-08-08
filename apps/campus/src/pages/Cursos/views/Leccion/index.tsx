import { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { BiCheck, BiExit, BiSkipNext, BiSkipPrevious, BiLeftArrowAlt, BiRightArrowAlt } from 'react-icons/bi';
import { isMobile as isMobileBrowser } from 'react-device-detect';

import {
  Box,
  Flex,
  Icon,
  Button,
  Tooltip,
  Spinner,
  useToast,
  IconButton,
  useMediaQuery,
  useDisclosure,
} from '@chakra-ui/react';

import {
  ICurso,
  IExamen,
  ILeccion,
  getCurso,
  addProgreso,
  getUserByID,
  getProgresos,
  getLeccionByID,
  LeccionTipoEnum,
  ProgresoTipoEnum,
  EntregableEstadoEnum,
} from 'data';
import { onFailure, onSuccess } from 'ui';

import { SesionController } from '../../../../shared/controllers';
import { LayoutContext, LoginContext } from '../../../../shared/context';

import { ZoomLeccion } from './ZoomLeccion';
import { VideoLeccion } from './VideoLeccion';
import { SlidesLeccion } from './SlidesLeccion';
import { RecursoLeccion } from './RecursoLeccion';
import LivecoderLeccion from './LivecoderLeccion';
import { MarkdownLeccion } from './MarkdownLeccion';
import { EntregableLeccion } from './EntregableLeccion';
import { NotasDnd } from '../../components/Leccion/NotasDnd';
import SidebarLeccion from '../../components/Leccion/Sidebar';
import { LeccionHeader } from '../../components/Leccion/Header';
import { CodeMirrorDnd } from '../../components/Leccion/CodeMirrorDnd';
import ResponsiveSidebarLeccion from '../../components/Leccion/Sidebar/ResponsiveSidebar';

enum ModeEnum {
  BLOQUEADA = 'blocked',
  DESBLOQUEADA = 'unblocked',
  CARGANDO = 'loading',
  SIGUIENTE = 'next',
}

const Leccion = () => {
  const toast = useToast();
  const navigate = useNavigate();

  const stateNotas = useDisclosure();
  const stateSidebar = useDisclosure();
  const stateCodeMirror = useDisclosure();

  const [isMobile] = useMediaQuery('(max-width: 768px)');

  const { cursoId, leccionId } = useParams<any>();

  const { user, setUser } = useContext(LoginContext);
  const { setShowHeader, setShowSidebar } = useContext(LayoutContext);

  const [curso, setCurso] = useState<ICurso>();
  const [leccion, setLeccion] = useState<ILeccion>();
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [mode, setMode] = useState<ModeEnum>(ModeEnum.BLOQUEADA);
  const [nextIsBlocked, setNextIsBlocked] = useState<boolean>(false);
  const [prevIsBlocked, setPrevIsBlocked] = useState<boolean>(false);
  const [estadoEntregable, setEstadoEntregable] = useState<EntregableEstadoEnum | undefined>();

  useEffect(() => {
    setShowHeader(false);
    setShowSidebar(false);
  }, []);

  useEffect(() => {
    refreshState();
  }, [cursoId, leccionId]);

  useEffect(() => {
    // Cada vez que cambie el estado del entregable desde una lección entregable,
    // re-ejecutaremos este controlador para bloquear o no el botón de "Completar lección".
    checkBlockedByEstadoEntregable();
  }, [estadoEntregable]);

  const refreshState = async (updateProgresoGlobal?: boolean) => {
    const cursoData = await getCurso({
      id: +(cursoId || 0),
      userId: user?.id,
      strategy: 'invalidate-on-undefined',
    });

    if (cursoData?.error === 404) navigate('/');
    if (!leccionId) return;

    setCurso(cursoData);

    const leccionData = await getLeccionByID({ id: +(leccionId || 0) });

    // Primero reseteamos el estado del entregable a undefined
    setEstadoEntregable(undefined);

    // Después seteamos la leccion nueva, lo que hará en componentes hijos
    // que se resetee el estado del entregable, si fuera necesario.
    setLeccion(leccionData);

    if (updateProgresoGlobal) {
      const lastModulo = cursoData?.modulos?.length > 0 ? cursoData.modulos[cursoData.modulos.length - 1] : undefined;

      const firstLeccion = cursoData?.modulos?.length > 0 ? cursoData.modulos[0].lecciones[0] : undefined;

      const lastLeccion =
        lastModulo?.lecciones?.length > 0 ? lastModulo?.lecciones[lastModulo?.lecciones?.length - 1] : undefined;

      // Si acabamos de empezar un curso, o lo hemos terminado, actualizamos el progresoGlobal de la context.
      if (user?.id && (firstLeccion?.id === +leccionId || lastLeccion?.id === +leccionId)) {
        const _user = await getUserByID({ id: user?.id });

        if (_user?.id) setUser({ ..._user });
        else console.error({ '⚠️ Error actualizando el usuario': _user });
      }
    }
  };

  useEffect(() => {
    if (!leccion || !curso) return;

    const _mod = curso?.modulos?.find((m: any) => leccion?.moduloId === m.id);
    const _lec = _mod?.lecciones?.find((l: any) => leccion?.id === l.id);

    if (_lec?.meta?.isBlocked) {
      onFailure(toast, 'Redirigiendo a la portada del curso', 'Has intentado entrar en una lección bloqueada');

      navigate(`/cursos/${curso?.id}`);
    }
  }, [leccion, curso]);

  /** Detectamos si la lección está completada */
  useEffect(() => {
    if (!curso || !leccion) return;

    setIsCompleted(getLeccionCompleted());
  }, [leccion, curso]);

  const getLeccionCompleted = (): boolean => {
    const _mod = curso?.modulos?.find((m: any) => leccion?.moduloId === m.id);
    const _lec = _mod?.lecciones?.find((l: any) => leccion?.id === l.id);

    return _lec?.meta?.isCompleted || false;
  };

  /** Si la lección está completada, cambiamos el mode a Siguiente */
  useEffect(() => {
    setMode(isCompleted ? ModeEnum.SIGUIENTE : ModeEnum.BLOQUEADA);
  }, [leccionId, isCompleted]);

  /**
   * Cuando empezamos una nueva lección, creamos un nuevo progreso del tipo "visto".
   *
   * @param leccion Lección sobre la que crear el progreso.
   */
  const onLeccionStarted = async (leccion: ILeccion) => {
    if (user?.id && leccion?.modulo?.cursoId && leccion.id && leccion.moduloId) {
      const progresoExists = await checkIfProgresoDuplicado(user.id, leccion.id, ProgresoTipoEnum.VISTO);

      if (!progresoExists)
        await addProgreso({
          progreso: {
            userId: user?.id,
            leccionId: leccion.id,
            moduloId: leccion.moduloId,
            cursoId: leccion?.modulo?.cursoId,
            tipo: ProgresoTipoEnum.VISTO,
          },
        }).catch((error) => {
          console.log('Error al crear el progreso', { error });
        });
    }
  };

  /**
   * Cuando hemos terminado la lección, creamos un nuevo progreso del tipo "completado".
   *
   * @param leccion Lección sobre la que crear el progreso.
   */
  const onLeccionCompleted = async (leccion: ILeccion) => {
    if (user?.id && leccion?.modulo?.cursoId && leccion?.id && leccion?.moduloId) {
      const progresoExists = await checkIfProgresoDuplicado(user.id, leccion.id, ProgresoTipoEnum.COMPLETADO);

      if (!progresoExists)
        await addProgreso({
          progreso: {
            userId: user?.id,
            leccionId: leccion.id,
            moduloId: leccion.moduloId,
            cursoId: leccion?.modulo?.cursoId,
            tipo: ProgresoTipoEnum.COMPLETADO,
          },
        })
          .then((message: any) => refreshState(true))
          .catch((error) => {
            console.log('Error al crear el progreso', { error });
          });
    }
  };

  const checkIfProgresoDuplicado = async (userId: any, leccionId: any, tipo: ProgresoTipoEnum = ProgresoTipoEnum.VISTO) => {
    // Comprobamos que no exista un progreso ya creado para esta lección y este usuario.
    const progresoDuplicado = await getProgresos({
      query: [{ user_id: userId }, { leccion_id: leccionId }, { tipo }],
    });

    // Si hay progresos en la lista entonces no creamos uno nuevo para evitar el 400.
    return (progresoDuplicado?.data?.length || 0) > 0;
  };

  const onPrevLeccion = () => {
    if (!leccion) return;

    let prevLeccion: any;

    // Usamos .find para parar el bucle al encontrar la lección.
    curso?.modulos?.find((modulo: any, index: number) => {
      // Buscamos el módulo de la lección seleccionada
      if (leccion?.moduloId === modulo.id) {
        // Si es la primera lección de módulo, seleccionamos el modulo anterior.
        if (leccion?.id === modulo.lecciones[0].id) {
          const prevModulo = curso?.modulos ? curso?.modulos[index - 1] : undefined;

          if (prevModulo)
            prevLeccion = prevModulo?.lecciones ? prevModulo?.lecciones[prevModulo.lecciones.length - 1] : undefined;
        } else {
          // Si aún quedan lecciones en el módulo, escogemos la anterior.
          const index = modulo.lecciones?.findIndex((l: any) => l.id === leccion.id);

          if (index > -1) prevLeccion = modulo.lecciones[index - 1];
        }
      }

      // Si la lección anterior está bloqueada (O no existe), bloqueamos el botón.
      setPrevIsBlocked(!prevLeccion || prevLeccion?.meta?.isBlocked === true);

      // Si la lección siguiente estaba bloquedada y hemos podido pasar de lección,
      // desbloqueamos el botón de la lección anterior
      if (nextIsBlocked && prevLeccion) setNextIsBlocked(false);

      // Si la hemos encontrado, devolvemos 'true' para terminar con el find
      return prevLeccion !== undefined;
    });

    if (prevLeccion) navigate(`/cursos/${curso?.id}/leccion/${prevLeccion.id}`);
  };

  /** Devolvemos TRUE si bloqueamos la siguiente lección hasta completar ejercicio. */
  const checkBlockedByEstadoEntregable = () => {
    // Si la lección es del tipo Livecoder y no la ha completado, no pasamos a la siguiente.
    let testLivecoder = leccion?.tipo === LeccionTipoEnum.LIVECODER && estadoEntregable !== EntregableEstadoEnum.CORRECTO;

    // Lo mismo con la lección del tipo Entregable
    let testEntregable =
      leccion?.tipo === LeccionTipoEnum.ENTREGABLE && estadoEntregable === EntregableEstadoEnum.PENDIENTE_ENTREGA;

    // Si es del tipo "Autocorregible", con entregar la solución es suficiente.
    let testAutocorregible =
      leccion?.tipo === LeccionTipoEnum.AUTOCORREGIBLE && estadoEntregable === EntregableEstadoEnum.PENDIENTE_ENTREGA;

    if (testLivecoder || testEntregable || testAutocorregible) {
      // Bloqueamos el botón para que no puedan seguir.
      setNextIsBlocked(true);

      return true;
    } else {
      // Desbloqueamos el botón
      setNextIsBlocked(false);

      return false;
    }
  };

  /** Método para obtener la siguiente lección a ver por el alumno.
   * Además, actualiza el estado de los botones de siguiente y lección previa. */
  const getNextLeccion = (): ILeccion | undefined | 'end' => {
    if (!leccion) return undefined;

    let nextLeccion: ILeccion | undefined | 'end';

    // 1. Si la lección es del tipo Entregable o Livecoder y **no** la ha completado, no pasamos a la siguiente
    if (checkBlockedByEstadoEntregable()) return undefined;

    // Usamos .find para parar el bucle al encontrar la lección.
    curso?.modulos?.find((modulo: any, index: number) => {
      // Buscamos el módulo de la lección seleccionada
      if (leccion?.moduloId === modulo.id) {
        // Si es la última lección de módulo, seleccionamos el modulo siguiente
        if (leccion?.id === modulo.lecciones[modulo.lecciones?.length - 1].id) {
          const nextModulo = curso?.modulos && index + 1 < curso?.modulos?.length ? curso?.modulos[index + 1] : undefined;

          if (nextModulo) nextLeccion = nextModulo?.lecciones ? nextModulo?.lecciones[0] : undefined;
          // Si no hay próximo módulo, ¡es que ha terminado el curso!
          else nextLeccion = 'end';
        } else {
          // Si aún quedan lecciones en el módulo, escogemos la siguiente.
          const index = modulo.lecciones?.findIndex((l: any) => l.id === leccion?.id);

          if (index > -1) nextLeccion = modulo.lecciones[index + 1];
        }
      }

      if (nextLeccion === 'end') return true;

      // Si la siguiente lección está bloqueada (O no existe), bloqueamos el botón
      setNextIsBlocked(nextLeccion === undefined || nextLeccion?.meta?.isBlocked === true);

      // Si la lección anterior estaba bloquedada, y hemos podido pasar de lección,
      // desbloqueamos el botón de la lección anterior
      if (prevIsBlocked && nextLeccion) setPrevIsBlocked(false);

      // Si la hemos encontrado, devolvemos 'true' para terminar con el find
      return nextLeccion !== undefined;
    });

    return nextLeccion;
  };

  const delay = (delayInms: number) => new Promise((resolve) => setTimeout(() => resolve(2), delayInms));

  /* Método para navegar a la siguiente lección */
  const onNextLeccion = async () => {
    setMode(ModeEnum.CARGANDO);

    const nextLeccion: ILeccion | undefined | 'end' = getNextLeccion();

    if (nextLeccion === 'end') {
      if (leccion?.id) {
        onSuccess(toast, '¡Enhorabuena 🥳!', 'Has terminado el curso. ¿Por qué no pruebas ahora con la certificación?');

        onLeccionCompleted(leccion);
        setMode(ModeEnum.SIGUIENTE);

        navigate(`/cursos/${curso?.id}`);
      }
    } else if (isCompleted && nextLeccion?.meta?.isBlocked === false) {
      setMode(ModeEnum.SIGUIENTE);

      navigate(`/cursos/${curso?.id}/leccion/${nextLeccion.id}`);
    } else if (!isCompleted && !!nextLeccion) {
      nextLeccion.meta = { ...nextLeccion.meta, isBlocked: false };

      if (leccion?.id) {
        onLeccionCompleted(leccion);
        setMode(ModeEnum.DESBLOQUEADA);

        // Actualizamos el estado del botón de siguiente lección
        getNextLeccion();

        await delay(1000);
        setMode(ModeEnum.SIGUIENTE);
      }
    }
  };

  return (
    <>
      <Flex minW="100vw" maxH="100vh" h="100%" overflow="hidden">
        {isMobileBrowser || isMobile ? (
          <ResponsiveSidebarLeccion
            curso={curso}
            leccion={leccion}
            state={stateSidebar}
            onLeccionCompleted={onLeccionCompleted}
            onExamenSelect={(examen: IExamen) => navigate(`/cursos/${cursoId}/test/${examen.id}`)}
            onLeccionSelect={(leccion: ILeccion) => navigate(`/cursos/${cursoId}/leccion/${leccion.id}`)}
          />
        ) : (
          <Flex
            bg="white"
            h="100%"
            maxH="100%"
            overflow="auto"
            overflowX="hidden"
            w={stateSidebar.isOpen ? '400px' : '0px'}
            minW={stateSidebar.isOpen ? '400px' : '0px'}
            style={{ transition: 'all 0.6s ease-in-out' }}
            borderRight="1px solid var(--chakra-colors-gray_3)"
          >
            <SidebarLeccion
              curso={curso}
              leccion={leccion}
              state={stateSidebar}
              onLeccionCompleted={onLeccionCompleted}
              onExamenSelect={(examen: IExamen) => navigate(`/cursos/${cursoId}/test/${examen.id}`)}
              onLeccionSelect={(leccion: ILeccion) => navigate(`/cursos/${cursoId}/leccion/${leccion.id}`)}
            />
          </Flex>
        )}

        <Flex
          gap="20px"
          boxSize="100%"
          align="center"
          direction="column"
          overflowY="scroll"
          overflowX="hidden"
          px={{ base: '0px', md: '12px' }}
        >
          <LeccionHeader
            showSearchbar
            curso={curso}
            stateNotas={stateNotas}
            stateSidebar={stateSidebar}
            stateCodeMirror={stateCodeMirror}
            showCodeMirror={!!curso?.habilitarCodemirror}
          />

          <Flex
            w="100%"
            bg="white"
            maxW="1320px"
            p={{ base: '0px', sm: '40px' }}
            pb={{ base: '80px', sm: '40px' }}
            rounded={{ base: 'unset', md: '20px' }}
            // m={{ base: '0px', sm: '24px 40px 20px' }}
          >
            {leccion?.tipo === LeccionTipoEnum.ENTREGABLE || leccion?.tipo === LeccionTipoEnum.AUTOCORREGIBLE ? (
              <EntregableLeccion
                leccion={leccion}
                onLeccionCompleted={onLeccionCompleted}
                setEstadoEntregable={setEstadoEntregable}
              />
            ) : leccion?.tipo === LeccionTipoEnum.ZOOM ? (
              <ZoomLeccion leccion={leccion} onLeccionCompleted={onLeccionCompleted} />
            ) : leccion?.tipo === LeccionTipoEnum.MARKDOWN ? (
              <MarkdownLeccion leccion={leccion} />
            ) : leccion?.tipo === LeccionTipoEnum.DIAPOSITIVA ? (
              <SlidesLeccion leccion={leccion} />
            ) : leccion?.tipo === LeccionTipoEnum.VIDEO ? (
              <VideoLeccion
                leccion={leccion}
                onLeccionStarted={onLeccionStarted}
                onLeccionCompleted={onLeccionCompleted}
                enableKeyboard={!stateNotas.isOpen && !stateCodeMirror.isOpen}
              />
            ) : leccion?.tipo === LeccionTipoEnum.RECURSO ? (
              <RecursoLeccion leccion={leccion} />
            ) : leccion?.tipo === LeccionTipoEnum.LIVECODER ? (
              <LivecoderLeccion leccion={leccion} setEstadoEntregable={setEstadoEntregable} />
            ) : (
              <Flex h="500px" />
            )}
          </Flex>

          <Flex
            w="100%"
            px="10px"
            gap="20px"
            maxW="1320px"
            align="center"
            justify="space-between"
            display={{ base: 'none', md: 'flex' }}
            pb="40px"
          >
            <Tooltip shouldWrapChildren label={prevIsBlocked ? '¡No hay más lecciones antes que esta!' : undefined}>
              <Button
                data-cy="on_prev_leccion"
                h="52px"
                bg="gray_3"
                rounded="14px"
                w="fit-content"
                onClick={onPrevLeccion}
                isDisabled={prevIsBlocked}
                children={'Lección anterior'}
                leftIcon={<Icon as={BiLeftArrowAlt} boxSize="24px" />}
              />
            </Tooltip>

            <Tooltip
              shouldWrapChildren
              label={nextIsBlocked ? '¡Completa el módulo actual para seguir con la siguiente lección!' : undefined}
            >
              <Button
                data-cy="on_next_leccion"
                h="52px"
                rounded="14px"
                w="fit-content"
                onClick={onNextLeccion}
                isDisabled={nextIsBlocked}
                _hover={{ opacity: '0.8' }}
                loadingText="Calculando..."
                isLoading={mode === ModeEnum.CARGANDO}
                bg={mode === ModeEnum.DESBLOQUEADA ? 'primary' : 'gray_3'}
              >
                {mode === ModeEnum.BLOQUEADA ? (
                  <Flex align="center" gap="13px">
                    Completar Lección
                    <Icon as={BiCheck} boxSize="24px" />
                  </Flex>
                ) : mode === ModeEnum.DESBLOQUEADA ? (
                  <Icon as={BiCheck} bg="#FFF" rounded="full" color="primary" mx={{ base: '3px', md: '70px' }} />
                ) : (
                  <Flex align="center" gap="13px">
                    Siguiente Lección
                    <Icon as={BiRightArrowAlt} boxSize="24px" />
                  </Flex>
                )}
              </Button>
            </Tooltip>
          </Flex>

          {/* MENU STICKY PARA MOVILES */}
          <Flex
            h="80px"
            w="100%"
            px="25.5px"
            py="19px"
            gap="30px"
            bg="white"
            bottom={0}
            zIndex={2000}
            align="center"
            justify="center"
            position="fixed"
            display={{ base: 'flex', md: 'none' }}
            boxShadow="0px -4px 20px 0px rgba(0, 0, 0, 0.1)"
          >
            <IconButton
              icon={<Icon as={BiExit} boxSize="18px" />}
              onClick={() => navigate(`/cursos/${curso?.id}`)}
              _hover={{
                backgroundColor: 'gray_4',
                opacity: 0.8,
              }}
              bg="gray_5"
              color="white"
              data-cy="exit_leccion_button"
              aria-label="Salir de la lección"
              size="md"
              boxSize="42px"
            />
            <Flex align="center" gap="20px">
              <Tooltip label={prevIsBlocked ? '¡No hay más lecciones antes que esta!' : ''}>
                <IconButton
                  bg="gray_1"
                  rounded="8px"
                  size="md"
                  data-cy="on_prev_leccion_responsive"
                  onClick={onPrevLeccion}
                  isDisabled={prevIsBlocked}
                  aria-label={'Lección anterior'}
                  icon={<Icon as={BiSkipPrevious} boxSize="24px" />}
                  boxSize="42px"
                />
              </Tooltip>

              <Box fontSize="18px" fontWeight="bold">
                Lección {leccion?.modulo?.orden}.{leccion?.orden}
              </Box>

              <Tooltip label={nextIsBlocked ? '¡Completa el módulo actual para seguir con la siguiente lección!' : ''}>
                <IconButton
                  size="md"
                  boxSize="42px"
                  rounded="8px"
                  onClick={onNextLeccion}
                  data-cy="on_next_leccion_responsive"
                  isDisabled={prevIsBlocked}
                  aria-label={'Lección_siguiente'}
                  isLoading={mode === ModeEnum.CARGANDO}
                  bg={mode === ModeEnum.DESBLOQUEADA ? 'primary' : 'gray_1'}
                  _hover={{ opacity: 0.8 }}
                  icon={
                    mode === ModeEnum.BLOQUEADA ? (
                      <Icon as={BiCheck} boxSize="24px" />
                    ) : mode === ModeEnum.CARGANDO ? (
                      <Spinner />
                    ) : mode === ModeEnum.DESBLOQUEADA ? (
                      <Icon as={BiCheck} bg="#FFF" rounded="full" color="primary" mx={{ base: '3px', md: '70px' }} />
                    ) : (
                      <Icon as={BiSkipNext} boxSize="24px" />
                    )
                  }
                />
              </Tooltip>
            </Flex>
          </Flex>
        </Flex>

        <NotasDnd leccion={leccion} state={stateNotas} />

        {curso?.habilitarCodemirror && <CodeMirrorDnd state={stateCodeMirror} />}
      </Flex>

      {/** Control del tiempo invertido durante las Lecciones */}
      <SesionController />
    </>
  );
};

export default Leccion;
