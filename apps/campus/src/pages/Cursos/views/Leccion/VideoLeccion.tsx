import { useContext, useEffect, useRef, useState } from 'react';

import { BiTimeFive, BiPlayCircle } from 'react-icons/bi';
import { FaBookmark, FaRegBookmark } from 'react-icons/fa';
import { Text, Flex, Box, Icon, Tooltip, useToast } from '@chakra-ui/react';

import { LoginContext, LayoutContext, FavoritosContext } from '../../../../shared/context';
import { ILeccion, IFavorito, IPuntoClave, getUserByID, FavoritoTipoEnum, updateProgresoGlobal } from 'data';
import { OpenParser, OpenPlayer, onFailure } from 'ui';
import { fmtMnts, fmtSnds } from 'utils';

import { MODALS_EVENT, EVENTO_VIDEO_PLAY, EVENTO_VIDEO_PAUSE } from '../../../../shared/controllers';

export const VideoLeccion = ({
  leccion,
  enableKeyboard,
  onLeccionStarted,
  onLeccionCompleted,
}: {
  leccion?: ILeccion;
  enableKeyboard?: boolean;
  onLeccionStarted: (e?: any) => any;
  onLeccionCompleted: (e?: any) => any;
}) => {
  const toast = useToast();
  const playerRef = useRef<any>();
  const [playedSeconds, setPlayedSeconds] = useState<number>(0);
  const [leccionFavorito, setLeccionFavorito] = useState<IFavorito>();
  const [testABTimeout, setTestABTimeout] = useState<NodeJS.Timeout>();

  const { user, setUser } = useContext(LoginContext);

  const { isMobile } = useContext(LayoutContext);
  const { favoritos, addFavorito, removeFavorito } = useContext(FavoritosContext);

  useEffect(() => {
    return () => {
      if (testABTimeout) clearTimeout(testABTimeout);
    };
  }, []);

  useEffect(() => {
    if (favoritos?.length > 0 && leccion?.id)
      setLeccionFavorito(favoritos?.find((f) => f.tipo === FavoritoTipoEnum.LECCION && f.objetoId === leccion?.id));
  }, [addFavorito, removeFavorito]);

  const onNavigateSeconds = async (seconds: number) => {
    playerRef?.current?.seekTo(seconds);
  };

  function updateProgresoVideo() {
    if (leccion?.id && user?.progresoGlobal?.progresoLecciones) {
      const _progresoLecciones = user?.progresoGlobal?.progresoLecciones;

      _progresoLecciones[leccion?.id] = playedSeconds;
      _progresoLecciones.lastPlayed = leccion?.id;

      updateProgresoGlobal({
        client: 'campus',
        id: user?.progresoGlobal?.id || 0,
        progresoGlobal: { progresoLecciones: _progresoLecciones },
      });
    }
  }

  function handleOnEnded() {
    if (leccion?.id) {
      onLeccionCompleted(leccion);
      updateProgresoVideo();

      // Abrimos modal de obtención de info del usuario
      const tmout = setTimeout(() => {
        throwTestAB_PopUp();
      }, 3000);

      setTestABTimeout(tmout);
    } else {
      onFailure(
        toast,
        'Error al guardar el progreso',
        'La lección es indefinida. Actualice la página y contacte con soporte si el error persiste.'
      );
    }
  }

  const handleOnStart = async () => {
    if (leccion?.id) {
      onLeccionStarted(leccion);

      if (!user?.progresoGlobal?.progresoLecciones[leccion.id || 0]) {
        await updateProgresoGlobal({
          id: user?.progresoGlobal.id || 0,
          progresoGlobal: JSON.parse(`{"progresosLecciones": {"${leccion?.id || 0}": ${playedSeconds}}}`),
        })
          .then(async (res) => {
            if (user?.id) {
              const _user = await getUserByID({ id: user?.id });
              if (_user?.id) setUser({ ..._user });
              else console.error({ '⚠️ Error actualizando el usuario': _user });
            }
          })
          .catch((error) => console.error(error));
      }
    } else {
      onFailure(
        toast,
        'Error al guardar el progreso',
        'La lección es indefinida. Actualice la página y contacte con soporte si el error persiste..'
      );
    }
  };

  function onPlay() {
    const onPlayEvent = new Event(EVENTO_VIDEO_PLAY);

    window.dispatchEvent(onPlayEvent);
  }

  function onPause() {
    const onPlayEvent = new Event(EVENTO_VIDEO_PAUSE);

    window.dispatchEvent(onPlayEvent);
  }

  function throwTestAB_PopUp() {
    const onTestABPopUpEvent = new Event(MODALS_EVENT);

    window.dispatchEvent(onTestABPopUpEvent);
  }

  console.log({ leccion: leccion?.descripcion });

  return !isMobile ? (
    <Flex direction="column" boxSize="100%" gap="40px">
      <Flex direction="column" gap="10px">
        <Flex align="center" justify="space-between" gap="40px">
          <Text variant="h1_heading" data-cy="cursos_leccion_titulo" fontSize={{ base: '18px', sm: '24px' }}>
            {leccion?.titulo}
          </Text>

          <Tooltip shouldWrapChildren label={leccionFavorito ? 'Borrar marcador' : 'Guardar marcador'}>
            <Icon
              cursor="pointer"
              boxSize={{ base: '18px', sm: '28px' }}
              color={leccionFavorito ? 'primary' : 'gray_5'}
              as={leccionFavorito ? FaBookmark : FaRegBookmark}
              onClick={
                leccionFavorito
                  ? () => {
                      removeFavorito(leccionFavorito);
                      setLeccionFavorito(undefined);
                    }
                  : () => {
                      if (leccion?.id && user?.id)
                        addFavorito({
                          objetoId: leccion?.id,
                          tipo: FavoritoTipoEnum.LECCION,
                          userId: user?.id,
                          objeto: leccion,
                        });
                    }
              }
            />
          </Tooltip>
        </Flex>

        <Flex
          justify="flex-start"
          gap={{ base: '6px', sm: '14px' }}
          align={{ base: 'start', sm: 'center' }}
          direction={{ base: 'column', sm: 'row' }}
        >
          <Flex align="center" gap={{ base: '6px', sm: '10px' }}>
            <Icon as={BiPlayCircle} color="gray_4" />

            <Box fontSize="15px" fontWeight="semibold" color="gray_5">
              Vídeo
            </Box>
          </Flex>

          <Box bg="gray_3" w={{ base: '100%', sm: '1px' }} h={{ base: '1px', sm: '100%' }} />

          <Flex align="center" gap={{ base: '6px', sm: '10px' }}>
            <Icon as={BiTimeFive} color="gray_4" />

            <Box fontSize="15px" fontWeight="semibold" color="gray_5">
              {fmtMnts(leccion?.duracion)} de duración aprox.
            </Box>
          </Flex>
        </Flex>
      </Flex>

      <OpenPlayer
        player={playerRef}
        maxSpeed={2}
        minSpeed={0.25}
        leccion={leccion}
        playedSeconds={playedSeconds}
        enableKeyboard={enableKeyboard}
        onPlay={onPlay}
        onPause={onPause}
        onStart={handleOnStart}
        onEnded={handleOnEnded}
        onUpdate={updateProgresoVideo}
        setPlayedSeconds={setPlayedSeconds}
        src={leccion?.contenido || undefined}
        _progresoLecciones={user?.progresoGlobal?.progresoLecciones}
      />

      <Flex pb="40px" bg="white" gap="40px" justify="space-between" direction={{ base: 'column', md: 'row' }}>
        {((leccion?.puntosClave?.length || 0) > 0 || leccion?.descripcion !== '<p></p>') &&
          (leccion?.descripcion !== ' ' ? (
            <>
              <Flex w="100%" direction="column" rowGap="20px">
                <Box fontWeight="semibold" fontSize="16px">
                  Descripción
                </Box>

                {leccion?.descripcion !== '<p></p>' ? (
                  leccion?.descripcion !== ' ' ? (
                    <OpenParser value={leccion?.descripcion} style={{ fontSize: '15px', lineHeight: '22px' }} />
                  ) : (
                    <Box color="gray_4" fontSize="16px" fontWeight="bold" lineHeight="100%">
                      No hay descripción disponible
                    </Box>
                  )
                ) : (
                  <Box color="gray_4" fontSize="16px" fontWeight="bold" lineHeight="100%">
                    No hay descripción disponible
                  </Box>
                )}
              </Flex>

              <Flex w="fit-content" minW="350px" direction="column" rowGap="20px">
                <Box fontWeight="semibold" fontSize="16px">
                  Puntos clave
                </Box>

                <Flex fontSize="16px" lineHeight="175%" direction="column" fontWeight="normal">
                  {(leccion?.puntosClave?.length || 0) > 0 ? (
                    leccion?.puntosClave
                      ?.sort((a: any, b: any) => a.segundos - b.segundos)
                      ?.map((pC: IPuntoClave, index: number) => (
                        <Flex columnGap="5px" key={`puntoclave-${index}`}>
                          <Box
                            color="#1444EF"
                            fontWeight="medium"
                            cursor="pointer"
                            onClick={() => onNavigateSeconds(pC.segundos)}
                          >
                            {fmtSnds(pC.segundos || 0)}
                          </Box>

                          <Box>{` - ${pC.titulo}`}</Box>
                        </Flex>
                      ))
                  ) : (
                    <Box color="gray_4" fontWeight="bold" fontSize="16px" lineHeight="100%">
                      No hay puntos clave disponibles
                    </Box>
                  )}
                </Flex>
              </Flex>
            </>
          ) : null)}
      </Flex>
    </Flex>
  ) : (
    <Flex gap="32px" direction="column" boxSize="100%">
      <OpenPlayer
        player={playerRef}
        leccion={leccion}
        maxSpeed={2}
        minSpeed={0.25}
        onPlay={onPlay}
        onPause={onPause}
        onStart={handleOnStart}
        onEnded={handleOnEnded}
        onUpdate={updateProgresoVideo}
        setPlayedSeconds={setPlayedSeconds}
        playedSeconds={playedSeconds}
        enableKeyboard={enableKeyboard}
        src={leccion?.contenido || undefined}
        _progresoLecciones={user?.progresoGlobal?.progresoLecciones}
      />

      <Flex direction="column" gap="10px" mx="20px">
        <Flex align="center" justify="space-between" gap="40px">
          <Text variant="h1_heading" data-cy="cursos_leccion_titulo" fontSize={{ base: '18px', sm: '24px' }}>
            {leccion?.titulo}
          </Text>

          <Tooltip shouldWrapChildren label={leccionFavorito ? 'Borrar marcador' : 'Guardar marcador'}>
            <Icon
              boxSize={{ base: '18px', sm: '28px' }}
              cursor="pointer"
              color={leccionFavorito ? 'primary' : 'gray_5'}
              as={leccionFavorito ? FaBookmark : FaRegBookmark}
              onClick={
                leccionFavorito
                  ? () => removeFavorito(leccionFavorito)
                  : () => {
                      if (leccion?.id && user?.id)
                        addFavorito({
                          objetoId: leccion?.id,
                          tipo: FavoritoTipoEnum.LECCION,
                          userId: user?.id,
                          objeto: leccion,
                        });
                    }
              }
            />
          </Tooltip>
        </Flex>

        <Flex gap="14px" justify="flex-start" align={{ base: 'start', sm: 'center' }}>
          <Flex align="center" gap="9px">
            <Icon as={BiPlayCircle} color="gray_4" />

            <Box fontSize="15px" fontWeight="semibold" color="gray_5">
              Vídeo
            </Box>
          </Flex>

          <Flex align="center" gap="9px">
            <Icon as={BiTimeFive} color="gray_4" />

            <Box fontSize="15px" fontWeight="semibold" color="gray_5">
              {fmtMnts(leccion?.duracion)} de duración aprox.
            </Box>
          </Flex>
        </Flex>
      </Flex>

      <Flex mx="20px" bg="white" gap="40px" justify="space-between" direction={{ base: 'column', md: 'row' }}>
        <Flex w="100%" direction="column" rowGap="20px">
          <Box fontWeight="semibold" fontSize="16px">
            Descripción
          </Box>

          {leccion?.descripcion ? (
            <OpenParser value={leccion?.descripcion} style={{ fontSize: '15px', lineHeight: '22px' }} />
          ) : (
            <Box color="gray_4" fontSize="16px" fontWeight="bold" lineHeight="100%">
              No hay descripción disponible
            </Box>
          )}
        </Flex>

        <Flex w="fit-content" minW="350px" direction="column" rowGap="20px">
          <Box fontWeight="semibold" fontSize="16px">
            Puntos clave
          </Box>

          <Flex maxW="100%" fontSize="16px" lineHeight="175%" direction="column" fontWeight="normal" whiteSpace="pre-wrap">
            {leccion?.puntosClave && leccion?.puntosClave?.length > 0 ? (
              leccion.puntosClave
                ?.sort((a: any, b: any) => a.segundos - b.segundos)
                ?.map((pC: IPuntoClave, index: number) => (
                  <Flex maxW="100%" columnGap="5px" whiteSpace="pre-wrap" key={`puntoclave-${index}`}>
                    <Box color="#1444EF" cursor="pointer" fontWeight="medium" onClick={() => onNavigateSeconds(pC.segundos)}>
                      {fmtSnds(pC.segundos || 0)}
                    </Box>

                    <Box w="100%" whiteSpace="pre-wrap">{` - ${pC.titulo}`}</Box>
                  </Flex>
                ))
            ) : (
              <Box color="gray_4" fontSize="16px" fontWeight="bold" lineHeight="100%">
                No hay puntos clave disponibles
              </Box>
            )}
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};
