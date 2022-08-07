import { useState, useEffect } from 'react';

import { BiTimeFive, BiCheck, BiRightArrowAlt, BiExit } from 'react-icons/bi';
import {
  Flex,
  Text,
  Box,
  Icon,
  Button,
  Center,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  useDisclosure,
} from '@chakra-ui/react';

import { useCountdown } from 'utils';
import { AbandonarModal } from './AbandonarModal';
import { IntegridadModal } from './IntegridadModal';
import { ExamenProgress } from '../../../../shared/components';
import { IExamen, IRespuesta, IPregunta } from 'data';

export const ContenidoExamen = ({
  examen,
  nivel,
  onFinish,
}: {
  examen: IExamen;
  nivel?: number;
  onFinish: (respuestas: any, tiempoUtilizado: number) => void;
}) => {
  const { isOpen = true, onOpen, onClose } = useDisclosure();
  const { isOpen: isOpen_Integridad, onOpen: onOpen_Integridad, onClose: onClose_Integridad } = useDisclosure();
  const { isOpen: isOpenAlert, onOpen: onOpenAlert, onClose: onCloseAlert } = useDisclosure();

  const [respuestas, setRespuestas] = useState<any>({});
  const [respuestaActual, setRespuestaActual] = useState<IRespuesta>();
  const [preguntaActualIndex, setPreguntaActualIndex] = useState<number>(1);
  const [preguntaActual, setPreguntaActual] = useState<IPregunta | undefined>(
    examen?.preguntas ? examen?.preguntas[0] : undefined
  );

  const [finishLoading, setFinishLoading] = useState<boolean>(false);

  /**
   * true: No mostramos alerta para descontar 5min
   * false: Mostramos la alerta (Pondremos temporizador para 1s)
   */
  const [guardAbandon, setGuardAbandon] = useState<boolean>(false);
  const [preventAbandon, setPreventAbandon] = useState<boolean>(true);
  const [progress, minutes, seconds, secs, decrementSecs] = useCountdown(examen.duracion || 0);

  // !TODO RECUPERAR FUNCIONALIDAD. BORRADA EN REACT-ROUTER V.6
  // usePrompt(`¿Estás seguro de querer abandonar el examen?\nSi te marchas ahora, perderás un intento.`, preventAbandon);

  const onSiguientePregunta = async () => {
    if (!respuestas || !preguntaActual?.id || !respuestaActual?.id) return;

    if ((examen.preguntas?.length || 0) > preguntaActualIndex) {
      setRespuestas({
        ...respuestas,
        [preguntaActual?.id]: respuestaActual?.id,
      });

      setRespuestaActual(undefined);
      setPreguntaActual(examen?.preguntas ? examen?.preguntas[preguntaActualIndex] : undefined);
      setPreguntaActualIndex(preguntaActualIndex + 1);
    } else {
      setFinishLoading(true);
      setPreventAbandon(false);

      await onFinish({ ...respuestas, [preguntaActual?.id]: respuestaActual?.id }, examen.duracion * 60 - secs);

      setFinishLoading(false);
    }
  };

  useEffect(() => {
    window.onbeforeunload = preventAbandon ? onPreventAbandon : null;
    window.onpagehide = preventAbandon ? onPreventAbandon : null; // PARA SAFARI

    window.addEventListener('blur', onPreventSwitchTab);
    window.addEventListener('beforeunload', preventAbandon ? onPreventAbandon : () => {});

    window.addEventListener('pagehide', preventAbandon ? onPreventAbandon : () => {});

    return () => {
      window.removeEventListener('blur', onPreventSwitchTab);
      window.removeEventListener('beforeunload', onPreventAbandon);
      window.addEventListener('pagehide', onPreventAbandon);
    };
  }, [preventAbandon]);

  const onPreventAbandon = (e: any) => {
    var message = '¿Estás seguro de querer abandonar el examen?\nSi te marchas ahora, perderás un intento.',
      e = e || window.event;

    // For IE and Firefox
    if (e) e.returnValue = message;

    // For Safari
    return message;
  };

  const onPreventSwitchTab = () => {
    if (!guardAbandon) {
      setGuardAbandon(true);
      decrementSecs(60 * 5);
      onOpenAlert();
      setTimeout(() => setGuardAbandon(false), 1000);
    }
  };

  useEffect(() => {
    if (progress > 99.9) {
      setPreventAbandon(false);
      onFinish(respuestas, examen.duracion * 60 - secs);
    }
  }, [progress]);

  const handleWindowLeave = (e: any) => {
    const mouseY = e.clientY;
    const topValue = 0;

    if (mouseY < topValue) onOpen_Integridad();
  };

  useEffect(() => {
    // Intercom timeout initializer

    window.addEventListener('mouseout', handleWindowLeave, false);

    return () => {
      window.removeEventListener('mouseout', handleWindowLeave);
    };
  }, []);

  return (
    <Flex direction="column" boxSize="100%" overflow="auto" align="center" pt="10px">
      <Flex h="80px" align="center" gap="14px" w="100%" px="20px">
        <Button
          variant="solid"
          bg="gray_3"
          leftIcon={<Icon as={BiExit} boxSize="18px" />}
          rounded="10px"
          fontSize="16px"
          fontWeight="bold"
          w="fit-content"
          onClick={onOpen}
          _hover={{
            opacity: 0.8,
          }}
          pl={{ base: '12px', sm: '42px' }}
          pr={{ base: '4px', sm: '42px' }}
        >
          <Text display={{ base: 'none', sm: 'flex' }}>Salir de la prueba</Text>
        </Button>

        <Flex w="100%" justify="center" align="center" pt="10px" direction="column">
          <ExamenProgress value={(preguntaActualIndex / (examen.preguntas?.length || 0)) * 100} />
        </Flex>

        <Flex minW="fit-content" align="center" columnGap="10px" pt="10px">
          <Icon as={BiTimeFive} boxSize="21px" />

          <Text variant="h2_heading" fontSize={{ base: '14px', sm: '18px' }}>{`${minutes}:${seconds}`}</Text>
        </Flex>
      </Flex>
      <Flex
        bg="white"
        marginTop={{ base: 'unset', sm: '34px' }}
        justify="center"
        gap="80px"
        roundedTop={{ base: '0px', md: '20px' }}
        border={{
          base: 'unset',
          sm: '1px solid var(--chakra-colors-gray_3)',
        }}
        px="20px"
        pt="32px"
        boxSize="100%"
        align="center"
      >
        <Flex w="100%" direction="column" gap={{ base: '15px', sm: '40px' }} align="center">
          <Box fontSize="16px" fontWeight="bold" lineHeight="19px" color="gray_4" letterSpacing="0.115em">
            PREGUNTA {preguntaActualIndex}/{examen.preguntas?.length || 0}
          </Box>
          <Flex>
            <Text variant="h2_heading" textAlign="center" userSelect="none">
              {preguntaActual?.contenido}
            </Text>
          </Flex>
          <Flex direction="column" boxSize="100%" maxW="850px" rowGap="10px">
            {preguntaActual?.respuestas?.map((respuesta: IRespuesta, index: number) => (
              <Button
                h="auto"
                w="100%"
                p="18px 24px"
                rounded="12px"
                display="flex"
                columnGap="24px"
                key={'examen-respuesta-' + respuesta.id}
                onClick={() => setRespuestaActual(respuesta)}
                color="black"
                bg="white"
                border="1px solid"
                borderColor={respuestaActual?.id === respuesta.id ? 'primary' : 'gray_3'}
              >
                <Center boxSize="26px" bg="gray_2" fontWeight="bold" fontSize="18px" color="gray_4" rounded="6px">
                  {index + 1}
                </Center>

                <Box w="100%" textAlign="start" fontSize="15px" whiteSpace="break-spaces" userSelect="none">
                  {respuesta.contenido}
                </Box>

                {respuestaActual?.id === respuesta.id && (
                  <Center bg="primary" rounded="full">
                    {' '}
                    <Icon as={BiCheck} boxSize="24px" color="white" />
                  </Center>
                )}
              </Button>
            ))}
          </Flex>{' '}
        </Flex>{' '}
      </Flex>
      <Flex
        w="100%"
        bg="white"
        justify="center"
        borderTop="1px solid var(--chakra-colors-gray_2)"
        h="88px"
        align="center"
        px="20px"
        py="18px"
      >
        <Button
          w={{ base: '100%', sm: 'unset' }}
          h="100%"
          fontSize="18px"
          rounded="14px"
          fontWeight="extrabold"
          p="20px 30px 20px 35px"
          isLoading={finishLoading}
          onClick={onSiguientePregunta}
          isDisabled={!respuestaActual}
          bg={respuestaActual ? 'primary' : 'gray_3'}
          color={respuestaActual ? 'white' : 'black'}
        >
          {preguntaActualIndex === examen?.preguntas?.length ? 'Terminar examen' : 'Siguiente pregunta'}
        </Button>
      </Flex>
      <AbandonarModal
        examen={examen}
        isOpen={isOpen}
        onClose={onClose}
        onAbandonExam={() => {
          onFinish(respuestas, examen.duracion * 60 - secs);
          onClose();
        }}
      />

      <IntegridadModal examen={examen} isOpen={isOpen_Integridad} onClose={onClose_Integridad} />

      <Modal isOpen={isOpenAlert} onClose={onCloseAlert} isCentered>
        <ModalOverlay />
        <ModalContent ml="1.25rem" mr="1.25rem">
          <ModalHeader>Aviso</ModalHeader>
          <ModalCloseButton />
          <ModalBody>Hemos descontado 5 minutos del tiempo del examen</ModalBody>

          <ModalFooter>
            <Button bg="cancel" color="white" mr={3} onClick={onCloseAlert}>
              Aceptar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
};
