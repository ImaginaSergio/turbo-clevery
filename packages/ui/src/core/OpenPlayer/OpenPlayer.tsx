import { useCallback, useEffect, useRef, useState } from 'react';

import {
  BiCog,
  BiError,
  BiPlay,
  BiPause,
  BiFullscreen,
  BiRotateLeft,
  BiRotateRight,
  BiVolumeFull,
  BiVolumeMute,
  BiExitFullscreen,
} from 'react-icons/bi';
import {
  Button,
  Center,
  Flex,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Popover,
  Tooltip,
  PopoverBody,
  useMediaQuery,
  PopoverContent,
  PopoverTrigger,
  Spinner,
  Slider,
  SliderThumb,
  SliderTrack,
  SliderFilledTrack,
} from '@chakra-ui/react';
import ReactPlayer from 'react-player';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';

import { ILeccion } from 'data';
import { capitalizeFirst, fmtSnds } from 'utils';
import { ThumbnailLeccion, ThumbnailSizeEnum } from '../../lib/Thumbnails';

import './OpenPlayer.css';

const PROGRESO_VIDEO = 60 * 5;

let controlsTimeout: any;
let values = { duration: 0, played: 0 };

interface OpenPlayerProps {
  player: React.MutableRefObject<any>;
  src?: string;
  maxSpeed?: number;
  minSpeed?: number;
  leccion?: ILeccion;
  playedSeconds: number;
  enableKeyboard?: boolean;
  _progresoLecciones: any;
  onPlay: (e?: any) => void | any;
  onPause: (e?: any) => void | any;
  onEnded: (e?: any) => void | any;
  onStart: (e?: any) => void | any;
  onUpdate: (e?: any) => void | any;
  setPlayedSeconds: (e?: any) => void | any;
}

type Quality = '360p' | '720p' | '1080p' | 'auto';

const VideoSpeed = [
  { value: 0.25, label: 'x0.25' },
  { value: 0.5, label: 'x0.5' },
  { value: 0.75, label: 'x0.75' },
  { value: 1, label: 'x1' },
  { value: 1.25, label: 'x1.25' },
  { value: 1.5, label: 'x1.5' },
  { value: 2, label: 'x2' },
];

export const OpenPlayer = ({
  player,
  leccion,
  onUpdate,
  onStart,
  onEnded,
  onPlay,
  onPause,
  src = '',
  maxSpeed = 1,
  minSpeed = 1,
  playedSeconds,
  setPlayedSeconds,
  _progresoLecciones,
  enableKeyboard = false,
}: OpenPlayerProps) => {
  const valuesRef = useRef(values);
  const fullscreenHandler = useFullScreenHandle();

  const [volume, setVolume] = useState<number>(100);
  const [error, setError] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>(0);
  const [isMute, setIsMute] = useState<boolean>(false);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [quality, setQuality] = useState<Quality>('auto');
  const [savedSeconds, setSavedSeconds] = useState<number>();
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMobilePlayer] = useMediaQuery('(max-width: 490px)');
  const [isFirstPlay, setIsFirstPlay] = useState<boolean>(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isBuffering, setIsBuffering] = useState<boolean>(false);

  const [shouldMountPlayer, setShouldMountPlayer] = useState<boolean>(true);
  const [areControlsVisible, setAreControlsVisible] = useState<boolean>(true);
  const [refreshProgressVideo, setRefreshProgressVideo] = useState<boolean>(false);

  const handleKeyboardCallback = useCallback((e: any) => handleKeyboardControls(e), []);

  useEffect(() => {
    valuesRef.current.duration = duration;
    valuesRef.current.played = playedSeconds;
  }, [duration, playedSeconds]);

  useEffect(() => {
    if (enableKeyboard) window.addEventListener('keydown', handleKeyboardCallback);
    else window.removeEventListener('keydown', handleKeyboardCallback);
  }, [enableKeyboard]);

  /*   useEffect(() => {
    window.removeEventListener('keydown', handleKeyboardCallback);
    window.addEventListener('keydown', handleKeyboardCallback);
  }, [playedSeconds, duration, player]); */

  useEffect(() => {
    setIsFirstPlay(true);
  }, [leccion?.id]);

  useEffect(() => {
    setIsReady(false);
    setIsPlaying(false);
    setRefreshProgressVideo(!refreshProgressVideo);
  }, []);

  useEffect(() => {
    const segundos = _progresoLecciones && leccion?.id ? _progresoLecciones[leccion?.id] : 0;

    setError(false);
    setIsPlaying(false);
    setSavedSeconds(segundos);
    setPlayedSeconds(segundos);
  }, [leccion?.id]);

  useEffect(() => {
    if (shouldMountPlayer && isReady && player?.current) seekTo(playedSeconds);
  }, [shouldMountPlayer]);

  useEffect(() => {
    let tmout = setTimeout(() => onUpdate(), PROGRESO_VIDEO * 1000);

    return () => clearTimeout(tmout);
  }, [refreshProgressVideo]);

  const handleVolumeChange = (volume: number) => {
    setVolume(volume);

    if (volume === 0) setIsMute(true);
    else setIsMute(false);
  };

  const showControls = (shouldSetTimeout: boolean) => {
    setAreControlsVisible(true);
    clearTimeout(controlsTimeout);

    if (shouldSetTimeout) controlsTimeout = setTimeout(() => setAreControlsVisible(false), 2000);
  };

  /** Método interno para navegar a los segundos del video marcados. */
  const seekTo = async (seconds: number) => {
    try {
      await player?.current?.seekTo(seconds);

      onUpdate();
    } catch (error) {
      console.log('Error al cambiar el tiempo 😅');
    }
  };

  const handleOnReady = async (msg: any) => {
    console.log('⚡ Vídeo preparado');

    /** Verificamos que no vayamos a navegar a unos segundos del video incorrectos. */
    if (savedSeconds !== undefined && savedSeconds >= 0) await seekTo(savedSeconds);

    await setIsPlaying(false);
    setIsReady(true);

    return true;
  };

  /** Retrocedemos 10 segundos en el vídeo */
  const onPrev10Seconds = () => {
    /** Verificamos que no vayamos a navegar a unos segundos del video incorrectos. */
    if (playedSeconds !== undefined && playedSeconds >= 0) seekTo(playedSeconds - 10);
  };

  /** Adelantamos 10 segundos en el vídeo */
  const onNext10Seconds = () => {
    /** Verificamos que no vayamos a navegar a unos segundos del video incorrectos. */
    if (playedSeconds !== undefined && playedSeconds >= 0) seekTo(playedSeconds + 10);
  };

  function handleOnSeek(seconds: number) {
    setPlayedSeconds(seconds);
  }

  const handleOnPlayClick = () => {
    if (!leccion?.contenido) return;

    setIsPlaying(!isPlaying);

    setIsFirstPlay(false);
    onPlay();
  };

  const handleOnPlay = () => {
    console.log(`📹 Reproduciendo vídeo... La url ${!!src ? 'SI' : 'NO'} está cargada`);

    setIsPlaying(true);
  };

  function handleOnPause() {
    setIsPlaying(false);
    onUpdate();

    if (onPause) onPause();
  }

  const handleChangeQuality = async (quality: Quality) => {
    await setShouldMountPlayer(false);
    await setQuality(quality);
    await setShouldMountPlayer(true);
  };

  function handleKeyboardControls(event: KeyboardEvent) {
    if (!leccion?.contenido) return;

    switch (event.code) {
      case 'ArrowRight':
        seekTo(Math.min(valuesRef.current.duration, valuesRef.current.played + 60));
        break;
      case 'ArrowLeft':
        seekTo(Math.max(0, valuesRef.current.played - 60));
        break;

      case 'Space':
        setIsPlaying((c) => !c);
        break;
    }
  }

  function qualitySelect(quality: string) {
    if (quality === '1080p') handleChangeQuality('1080p');
    else if (quality === '720p') handleChangeQuality('720p');
    else if (quality === '360p') handleChangeQuality('360p');
    else handleChangeQuality('auto');
  }

  const updateTime = async (time: number) => {
    await seekTo(time);
  };

  return error ? (
    <Center color="white" w="100%" bg="#000" style={{ aspectRatio: '16/9' }}>
      <Icon m="20px" fontSize="7xl" as={BiError} />

      <Flex fontWeight="bold" fontSize="3xl">
        Se ha producido un error inesperado
      </Flex>

      <Flex fontSize="xl">Inténtalo de nuevo más tarde</Flex>
    </Center>
  ) : (
    <FullScreen handle={fullscreenHandler} className="fullscreen-container hidden">
      <Flex boxSize="100%" position="relative" align="center">
        {isFirstPlay && (
          <Flex position="absolute" zIndex="50" boxSize="100%">
            <Flex boxSize="100%" align="center" justify="center" position="relative">
              <Icon
                data-cy="play_video"
                as={BiPlay}
                ml="auto"
                color="#fff"
                boxSize="64px"
                zIndex="15"
                rounded="full"
                p="2px 0px 2px 4px"
                cursor="pointer"
                position="absolute"
                bg="rgba(0, 0, 0, 0.6)"
                transition="all 0.5s ease"
                border="1px solid rgba(255, 255, 255, 0.15)"
                _hover={{ bgColor: 'var(--chakra-colors-primary_neon)' }}
                onClick={handleOnPlayClick}
              />

              <ThumbnailLeccion
                leccion={leccion}
                size={ThumbnailSizeEnum.FULL}
                leccionNumber={leccion?.orden}
                curso={leccion?.modulo?.curso}
                moduloNumber={leccion?.modulo?.orden}
              />
            </Flex>
          </Flex>
        )}

        <Flex
          bg="#000"
          align="center"
          boxSize="100%"
          position="relative"
          style={{ aspectRatio: '16/9' }}
          minH={{ base: '248px', sm: '348px' }}
          // maxH={fullscreenHandler.active ? {} : { base: '650px', '2xl': '748px' }}
        >
          <ReactPlayer
            pip
            ref={player}
            url={leccion?.contenido || undefined}
            disableDeferredLoading
            width="100%"
            height={fullscreenHandler.active ? 'unset' : '100%'}
            muted={isMute}
            controls={false}
            playing={isPlaying}
            stopOnUnmount={false}
            volume={(volume || 0) / 100}
            playbackRate={playbackSpeed || 1}
            onStart={onStart}
            onEnded={onEnded}
            onSeek={handleOnSeek}
            onPlay={handleOnPlay}
            onReady={handleOnReady}
            onPause={handleOnPause}
            onDuration={setDuration}
            onBuffer={() => setIsBuffering(true)}
            onBufferEnd={() => setIsBuffering(false)}
            onProgress={(p) => setPlayedSeconds(p?.playedSeconds)}
            config={{ vimeo: { playerOptions: { quality, responsive: true } } }}
            style={{
              aspectRatio: '16/9',
              display: shouldMountPlayer ? 'unset' : 'none',
            }}
          />

          <Flex
            top="0px"
            left="0px"
            right="0px"
            bottom="54px"
            align="center"
            justify="center"
            cursor="pointer"
            position="absolute"
            onClick={handleOnPlayClick}
            onMouseMove={() => showControls(true)}
            bg={isBuffering || !isPlaying ? 'blackAlpha.400' : 'transparent'}
          >
            {isBuffering && <Spinner size="xl" color="white" />}

            {!isBuffering && !isPlaying && <Icon as={BiPlay} boxSize="90px" color="#FFF" />}
          </Flex>

          <Flex
            px="16px"
            h="54px"
            left="0px"
            right="0px"
            bottom="0px"
            color="white"
            align="center"
            position="absolute"
            bg="rgb(0, 0, 0, 0.6)"
            onMouseEnter={() => showControls(false)}
            style={{ backdropFilter: 'blur(100px)' }}
            visibility={!isPlaying || areControlsVisible ? 'visible' : 'hidden'}
          >
            <Menu placement="top">
              <Tooltip
                placement="top"
                bg="black"
                label={
                  <span
                    style={{
                      fontWeight: 'bold',
                      color: 'var(--chakra-colors-white)',
                    }}
                  >
                    {isPlaying ? 'Pause' : 'Play'}
                  </span>
                }
              >
                <MenuButton
                  p="0px"
                  w="fit-content"
                  bg="transparent"
                  minW="fit-content"
                  paddingInline="0px"
                  color="whiteAlpha.800"
                  transition="all 0.2s ease"
                  _active={{ bg: 'transparent' }}
                  _hover={{ bg: 'transparent', color: '#FFF' }}
                  onClick={() => setIsPlaying(!isPlaying)}
                >
                  <Icon
                    boxSize="34px"
                    cursor="pointer"
                    color="whiteAlpha.800"
                    transition="all 0.2s ease"
                    as={isPlaying ? BiPause : BiPlay}
                    _hover={{ color: '#FFF' }}
                  />
                </MenuButton>
              </Tooltip>
            </Menu>

            <Menu placement="top">
              <Tooltip
                placement="top"
                bg="black"
                label={
                  <span
                    style={{
                      fontWeight: 'bold',
                      color: 'var(--chakra-colors-white)',
                    }}
                  >
                    Retroceder 10s
                  </span>
                }
              >
                <MenuButton
                  p="0px"
                  w="fit-content"
                  bg="transparent"
                  minW="fit-content"
                  paddingInline="0px"
                  color="whiteAlpha.800"
                  transition="all 0.2s ease"
                  _active={{ bg: 'transparent' }}
                  _hover={{ bg: 'transparent', color: '#FFF' }}
                  onClick={onPrev10Seconds}
                >
                  <Icon
                    boxSize="24px"
                    cursor="pointer"
                    color="whiteAlpha.800"
                    transition="all 0.2s ease"
                    as={BiRotateLeft}
                    _hover={{ color: '#FFF' }}
                  />
                </MenuButton>
              </Tooltip>
            </Menu>

            <Menu placement="top">
              <Tooltip
                placement="top"
                bg="black"
                label={
                  <span
                    style={{
                      fontWeight: 'bold',
                      color: 'var(--chakra-colors-white)',
                    }}
                  >
                    Avanzar 10s
                  </span>
                }
              >
                <MenuButton
                  mr="10px"
                  w="fit-content"
                  bg="transparent"
                  minW="fit-content"
                  paddingInline="0px"
                  color="whiteAlpha.800"
                  transition="all 0.2s ease"
                  _active={{ bg: 'transparent' }}
                  _hover={{ bg: 'transparent', color: '#FFF' }}
                  onClick={onNext10Seconds}
                >
                  <Icon
                    boxSize="24px"
                    cursor="pointer"
                    color="whiteAlpha.800"
                    transition="all 0.2s ease"
                    as={BiRotateRight}
                    _hover={{ color: '#FFF' }}
                  />
                </MenuButton>
              </Tooltip>
            </Menu>

            <Flex w="100%" px="8px" align="center" gap="8px" tabIndex={-1}>
              <Slider
                h="5px"
                tabIndex={-1}
                max={duration || 100}
                value={playedSeconds}
                focusThumbOnChange={false}
                onChange={updateTime}
                aria-label="video-playedSeconds"
              >
                <SliderTrack bgColor="whiteAlpha.300">
                  <SliderFilledTrack bgColor="whiteAlpha.800" />
                </SliderTrack>

                <Tooltip
                  color="#000"
                  placement="top"
                  bgColor="white"
                  label={fmtSnds(playedSeconds)}
                  visibility={isPlaying ? 'hidden' : 'visible'}
                >
                  <SliderThumb tabIndex={-1} bg="whiteAlpha.900" />
                </Tooltip>
              </Slider>

              <Flex data-cy="time_rest" color="whiteAlpha.800">{`${duration - playedSeconds > 0 ? '-' : ''}${fmtSnds(
                duration - playedSeconds
              )}`}</Flex>

              {!isMobilePlayer && (
                <>
                  <Menu placement="top">
                    <Tooltip
                      placement="top"
                      bg="black"
                      label={
                        <span
                          style={{
                            fontWeight: 'bold',
                            color: 'var(--chakra-colors-white)',
                          }}
                        >
                          Velocidad de reproducción
                        </span>
                      }
                    >
                      <MenuButton
                        as={Button}
                        p="0px"
                        w="fit-content"
                        bg="transparent"
                        minW="fit-content"
                        paddingInline="0px"
                        color="whiteAlpha.800"
                        transition="all 0.2s ease"
                        _active={{ bg: 'transparent' }}
                        _hover={{ bg: 'transparent', color: '#FFF' }}
                      >
                        {playbackSpeed === 1 && <Icon boxSize="25px" cursor="pointer" as={BiCog} _hover={{ color: '#FFF' }} />}
                        {playbackSpeed !== 1 && <Flex>{`x${playbackSpeed}`}</Flex>}
                      </MenuButton>
                    </Tooltip>

                    <MenuList title="Velocidad de reproducción" color="black">
                      {VideoSpeed.filter((speed) => speed.value <= maxSpeed && speed.value >= minSpeed).map((speed, index) => (
                        <MenuItem key={index} onClick={() => setPlaybackSpeed(speed.value)}>
                          {speed.label}
                        </MenuItem>
                      ))}
                    </MenuList>
                  </Menu>

                  <Menu placement="top">
                    <Tooltip
                      placement="top"
                      label={
                        <span
                          style={{
                            fontWeight: 'bold',
                            color: 'var(--chakra-colors-white)',
                          }}
                        >
                          Calidad de reproducción
                        </span>
                      }
                      bg="black"
                    >
                      <MenuButton
                        as={Button}
                        p="0px"
                        pl="1px"
                        m="0px"
                        bg="transparent"
                        justify="center"
                        alignContent="center"
                        color="whiteAlpha.800"
                        transition="all 0.2s ease"
                        _active={{ bg: 'transparent' }}
                        _hover={{ bg: 'transparent', color: '#FFF' }}
                      >
                        <Flex _hover={{ color: '#FFF' }}>{capitalizeFirst(quality)}</Flex>
                      </MenuButton>
                    </Tooltip>

                    <MenuList title="Calidad de reproducción" color="black">
                      {['1080p', '720p', '360p', 'auto'].map((quality, index) => (
                        <MenuItem key={index} onClick={() => qualitySelect(quality)}>
                          {quality}
                        </MenuItem>
                      ))}
                    </MenuList>
                  </Menu>
                </>
              )}

              {isMobilePlayer && (
                <Menu placement="top">
                  <Tooltip
                    placement="top"
                    label={
                      <span
                        style={{
                          fontWeight: 'bold',
                          color: 'var(--chakra-colors-white)',
                        }}
                      >
                        Ajustes
                      </span>
                    }
                    bg="black"
                  >
                    <MenuButton
                      as={Button}
                      p="0px"
                      w="fit-content"
                      bg="transparent"
                      minW="fit-content"
                      paddingInline="0px"
                      color="whiteAlpha.800"
                      _hover={{ bg: 'transparent' }}
                      _active={{ bg: 'transparent' }}
                    >
                      <Icon boxSize="25px" cursor="pointer" as={BiCog} />
                    </MenuButton>
                  </Tooltip>

                  <MenuList
                    p="5px"
                    color="#000"
                    w="fit-content"
                    display="flex"
                    bg="whiteAlpha.900"
                    flexDirection="column"
                    title="Velocidad de reproducción"
                  >
                    <Menu>
                      <MenuButton
                        as={Button}
                        p="0px"
                        w="fit-content"
                        color="#5b5b5b"
                        bg="transparent"
                        minW="fit-content"
                        paddingInline="0px"
                        _hover={{ bg: 'transparent' }}
                        _active={{ bg: 'transparent' }}
                      >
                        Velocidad
                      </MenuButton>

                      <MenuList title="Velocidad de reproducción" color="#000">
                        {VideoSpeed.filter((speed) => speed.value <= maxSpeed && speed.value >= minSpeed).map(
                          (speed, index) => (
                            <MenuItem key={index} onClick={() => setPlaybackSpeed(speed.value)}>
                              {speed.label}
                            </MenuItem>
                          )
                        )}
                      </MenuList>
                    </Menu>

                    <Menu placement="top">
                      <Tooltip
                        placement="top"
                        label={
                          <span
                            style={{
                              fontWeight: 'bold',
                              color: 'var(--chakra-colors-white)',
                            }}
                          >
                            Calidad de reproducción
                          </span>
                        }
                        bg="black"
                      >
                        <MenuButton
                          as={Button}
                          m="0px"
                          color="#5b5b5b"
                          bg="transparent"
                          p="3px 0px 0px 1px"
                          textTransform="capitalize"
                          _hover={{ bg: 'transparent', color: '#FFF' }}
                          _active={{ bg: 'transparent' }}
                        >
                          {quality}
                        </MenuButton>
                      </Tooltip>

                      <MenuList title="Calidad de reproducción" color="black">
                        {['1080p', '720p', '360p', 'auto'].map((quality, index) => (
                          <MenuItem key={index} textTransform="capitalize" onClick={() => qualitySelect(quality)}>
                            {quality}
                          </MenuItem>
                        ))}
                      </MenuList>
                    </Menu>
                  </MenuList>
                </Menu>
              )}

              {!isMobilePlayer && (
                <>
                  <Icon
                    cursor="pointer"
                    fontSize="25px"
                    color="whiteAlpha.800"
                    transition="all 0.2s ease"
                    onClick={() => setIsMute(!isMute)}
                    as={isMute ? BiVolumeMute : BiVolumeFull}
                    _hover={{ color: '#FFF' }}
                  />

                  <Slider
                    aria-label="video-playedSeconds"
                    w="120px"
                    h="5px"
                    min={0}
                    max={100}
                    value={isMute ? 0 : volume}
                    onChange={handleVolumeChange}
                  >
                    <SliderTrack bgColor="whiteAlpha.200">
                      <SliderFilledTrack bgColor="whiteAlpha.800" />
                    </SliderTrack>

                    <SliderThumb bg="whiteAlpha.900" />
                  </Slider>
                </>
              )}

              {isMobilePlayer && (
                <Popover placement="top">
                  <PopoverTrigger>
                    <IconButton
                      p="0px"
                      outline="none"
                      bg="transparent"
                      fontSize="25px"
                      w="fit-content"
                      minW="fit-content"
                      aria-label="sonido"
                      paddingInline="0px"
                      color="whiteAlpha.800"
                      _active={{ border: 'none' }}
                      icon={<Icon boxSize="25px" as={isMute ? BiVolumeMute : BiVolumeFull} />}
                    />
                  </PopoverTrigger>

                  <PopoverContent w="fit-content" bg="transparent" border="none" _active={{ outline: 'none' }}>
                    <PopoverBody>
                      <Slider
                        w="5px"
                        h="120px"
                        min={0}
                        max={100}
                        orientation="vertical"
                        aria-label="video-playedSeconds"
                        value={isMute ? 0 : volume}
                        onChange={(v: any) => handleVolumeChange(v)}
                      >
                        <SliderTrack bgColor="whiteAlpha.300">
                          <SliderFilledTrack bgColor="whiteAlpha.800" />
                        </SliderTrack>

                        <SliderThumb bg="whiteAlpha.900" />
                      </Slider>
                    </PopoverBody>
                  </PopoverContent>
                </Popover>
              )}

              <Tooltip
                placement="top"
                shouldWrapChildren
                bg="black"
                label={
                  fullscreenHandler.active ? (
                    <span
                      style={{
                        fontWeight: 'bold',
                        color: 'var(--chakra-colors-white)',
                      }}
                    >
                      Exit fullscreen
                    </span>
                  ) : (
                    <span
                      style={{
                        fontWeight: 'bold',
                        color: 'var(--chakra-colors-white)',
                      }}
                    >
                      Fullscreen
                    </span>
                  )
                }
              >
                <Icon
                  ml="8px"
                  pt="5px"
                  w="30px"
                  h="30px"
                  fontSize="20px"
                  cursor="pointer"
                  color="whiteAlpha.800"
                  transition="all 0.2s ease"
                  onClick={fullscreenHandler.active ? fullscreenHandler.exit : fullscreenHandler.enter}
                  as={fullscreenHandler.active ? BiExitFullscreen : BiFullscreen}
                  _hover={{ color: '#FFF' }}
                />
              </Tooltip>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </FullScreen>
  );
};
