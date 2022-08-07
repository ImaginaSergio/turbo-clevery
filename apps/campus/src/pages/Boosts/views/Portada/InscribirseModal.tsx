import { useContext, useEffect, useState } from 'react';

import {
  Box,
  Image,
  Flex,
  Progress,
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalContent,
  ModalOverlay,
  ModalCloseButton,
} from '@chakra-ui/react';

import { IBoost, getUserByID, applyToBoost, removeFromBoost } from 'data';

import { LoginContext } from '../../../../shared/context';

import BoostBG from '../../../../assets/roadmap/BoostBG.png';

export const InscribirseModal = ({ boost, state }: { boost?: IBoost; state: { isOpen: boolean; onClose: any } }) => {
  const { user, setUser } = useContext(LoginContext);

  const [loading, setLoading] = useState<boolean>(false);

  const isInscribed = (user?.boosts?.length || 0) > 0;

  const onInscribe = async () => {
    if (!boost?.id) return;

    setLoading(true);

    if (isInscribed) {
      let boostActivo = user?.boosts?.find((boost) => boost?.meta?.pivot_activo === true);

      if (boostActivo?.id) await removeFromBoost({ id: boostActivo.id });
      else return;
    }

    await applyToBoost({ id: boost?.id })
      .then(async () => {
        if (!user?.id || !user?.progresoGlobal?.id) return;

        const _user = await getUserByID({ id: user?.id });

        if (_user?.id) setUser({ ..._user });
        else console.error({ 'Error actualizando el usuario': _user });
      })
      .catch((error) => {
        console.error('¡Error al inscribirse al boost!', { error });
      });

    setLoading(false);
    state.onClose();
  };

  return (
    <Modal isOpen={state.isOpen} onClose={state.onClose} isCentered>
      <ModalOverlay />

      <ModalContent p="42px" maxW="600px" rounded="20px" boxShadow="0px 4px 16px rgba(117, 114, 150, 0.15)">
        {isInscribed && (
          <ModalCambioDeBoost
            boost={boost}
            isLoading={loading}
            isOpen={state.isOpen}
            onAccept={onInscribe}
            onCancel={state.onClose}
          />
        )}

        {!isInscribed && (
          <ModalNuevoBoost
            boost={boost}
            isLoading={loading}
            isOpen={state.isOpen}
            onAccept={onInscribe}
            onCancel={state.onClose}
          />
        )}
      </ModalContent>
    </Modal>
  );
};

const ModalCambioDeBoost = ({
  boost,
  isOpen,
  isLoading,
  onCancel,
  onAccept,
}: {
  boost?: IBoost;
  isOpen: boolean;
  isLoading: boolean;
  onCancel: () => any;
  onAccept: () => any;
}) => {
  const { user } = useContext(LoginContext);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  const userBoost = user?.boosts?.find((b) => b.meta.pivot_activo === true);

  useEffect(() => {
    if (isOpen) setTimeLeft(5);
    else setTimeLeft(0);
  }, [isOpen]);

  useEffect(() => {
    if (timeLeft === 0) setTimeLeft(null);
    if (!timeLeft) return;

    const intervalId = setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft]);

  return (
    <>
      <ModalHeader p="0px" mb="30px">
        ¿Estás seguro de que quieres inscribirte al Boost de {boost?.empresa?.nombre}?
      </ModalHeader>

      <ModalCloseButton />

      <ModalBody p="0px" mb="40px">
        <Box mb="15px">Si lo haces perderás el progreso actual del Boost que estás realizando:</Box>

        <Flex w="100%" h="fit-content" direction="column" justify="space-between">
          <Flex w="100%" bg="white" rounded="20px" overflow="hidden" direction="column" border="1px solid" borderColor="gray_3">
            <Flex w="100%" p="20px" gap="24px" bgPos="center" bgImage={BoostBG}>
              <Image minW="64px" boxSize="64px" src={`data:image/svg+xml;utf8,${userBoost?.icono}`} />

              <Box w="100%">
                <Flex mb="5px" gap="10px" w="100%">
                  <Box color="#fff" fontSize="24px" fontWeight="bold" lineHeight="29px">
                    {userBoost?.titulo}
                  </Box>

                  <Box bg="#fff" p="0px 10px" rounded="5px" fontSize="18px" h="fit-content" color="#040F36" fontWeight="bold">
                    BOOST
                  </Box>
                </Flex>

                <Box fontSize="18px" lineHeight="22px" color="gray_2">
                  {userBoost?.empresa?.nombre}
                </Box>
              </Box>
            </Flex>

            <Flex overflow="hidden">
              <Progress
                h="8px"
                w="100%"
                value={100}
                sx={{
                  '& > div': {
                    background: `linear-gradient(90deg, #6350B0 0%, #6350B0 ${
                      user?.progresoGlobal?.meta?.progresoCampus + '%'
                    }, #FFFFFFCC ${user?.progresoGlobal?.meta?.progresoCampus + '%'}, #FFFFFFCC 100%)`,
                  },
                }}
              />
            </Flex>
          </Flex>
        </Flex>
      </ModalBody>

      <ModalFooter p="0px" display="flex" gap="15px">
        <Button h="auto" p="10px" bg="gray_3" color="#fff" onClick={onCancel}>
          Mantener progreso
        </Button>

        <Button
          h="auto"
          p="10px"
          bg="black"
          color="white"
          onClick={onAccept}
          isLoading={isLoading}
          loadingText="Inscribiendo..."
          isDisabled={timeLeft !== null}
          _hover={{ bg: 'gray_3', color: 'black' }}
        >
          Borrar progreso del Boost {timeLeft !== null ? `(${timeLeft})` : ''}
        </Button>
      </ModalFooter>
    </>
  );
};

const ModalNuevoBoost = ({
  boost,
  isOpen,
  isLoading,
  onCancel,
  onAccept,
}: {
  boost?: IBoost;
  isOpen: boolean;
  isLoading: boolean;

  onCancel: () => any;
  onAccept: () => any;
}) => {
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  useEffect(() => {
    if (timeLeft === 0) setTimeLeft(null);
    if (!timeLeft) return;

    const intervalId = setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft]);

  useEffect(() => {
    if (isOpen) setTimeLeft(5);
    else setTimeLeft(0);
  }, [isOpen]);

  return (
    <>
      <ModalHeader p="0px" mb="30px">
        ¿Quieres inscribirte al Boost de {boost?.empresa?.nombre}?
      </ModalHeader>

      <ModalCloseButton />

      <ModalBody p="0px" mb="40px">
        <Box fontSize="15px" mb="15px">
          Si te inscribes tu hoja de ruta se actualizará con los módulos del Boost, pero no perderás el progreso de los cursos
          que realizaste.
        </Box>

        <Box fontSize="15px">
          Una vez que empieces no podrás cambiar tu hoja de ruta hasta terminar el Boost, ¡así que piénsalo bien!
        </Box>
      </ModalBody>

      <ModalFooter p="0px" display="flex" gap="15px">
        <Button
          h="auto"
          p="10px"
          bg="primary"
          color="white"
          onClick={onAccept}
          isLoading={isLoading}
          loadingText="Inscribiendo..."
          isDisabled={timeLeft !== null}
        >
          Inscribirse al Boost {timeLeft !== null ? `(${timeLeft})` : ''}
        </Button>
      </ModalFooter>
    </>
  );
};
