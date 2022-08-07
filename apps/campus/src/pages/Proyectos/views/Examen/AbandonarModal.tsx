import { useContext } from 'react';

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  Flex,
  ModalBody,
  ModalFooter,
  Button,
  Box,
  CloseButton,
} from '@chakra-ui/react';

import { IExamen } from 'data';
import { LoginContext } from '../../../../shared/context';

export const AbandonarModal = ({
  examen,
  isOpen,
  onClose,
  onAbandonExam,
}: {
  examen: IExamen;
  isOpen: boolean;
  onClose: () => void;
  onAbandonExam: () => void;
}) => {
  const { user } = useContext(LoginContext);

  const certificacion = user?.certificaciones?.find((c) => c.id === examen?.certificacionId);
  const numIntentosRestante = (examen?.numIntentos || 0) - (certificacion?.meta?.pivot_intento || 0);

  return (
    <Modal onClose={onClose} isOpen={isOpen} isCentered>
      <ModalOverlay bg="gray_6" />

      <ModalContent maxW="56em" maxH="56em" bg="white" ml="1.25rem" mr="1.25rem">
        <ModalHeader color="black">
          <Flex w="100%" justify="space-between" align="center">
            <Box fontSize="18px" fontWeight="semibold" lineHeight="21px">
              ¿Estás seguro?
            </Box>

            <CloseButton onClick={onClose} />
          </Flex>
        </ModalHeader>

        <ModalBody px="30px">
          <Flex direction="column" h="100%" justify="space-between">
            <Box fontSize="16px" pb="30px">
              Si eliges abandonar la prueba contará como si hubieras utilizado un intento y se descontará de los intentos
              restantes de la certificación.
            </Box>

            <Flex
              p="14px"
              w="100%"
              h="44px"
              maxH="44px"
              bg="gray_1"
              rounded="10px"
              align="center"
              justify="space-between"
              border="1px solid var(--chakra-colors-gray_3)"
              direction={{ base: 'column', sm: 'row' }}
            >
              <Box color="gray_4">Intentos Restantes después de abandonar</Box>
              <Flex fontWeight="bold" align="center" bg="gray_1">
                {numIntentosRestante} intento
              </Flex>
            </Flex>
          </Flex>
        </ModalBody>

        <ModalFooter p={{ base: '20px', md: 'unset' }} gap="15px">
          <Button
            w="100%"
            p="15px 20px 15px 25px"
            bg="transparent"
            rounded="12px"
            fontSize="16px"
            fontWeight="bold"
            lineHeight="18px"
            border="2px solid var(--chakra-colors-gray_3)"
            onClick={onClose}
          >
            Cancelar
          </Button>

          <Button
            w="100%"
            minW="160px"
            p="15px 20px 15px 25px"
            bg="black"
            rounded="12px"
            fontSize="15px"
            fontWeight="bold"
            lineHeight="18px"
            color="white"
            _hover={{
              backgroundColor: 'cancel',
              opacity: 0.8,
            }}
            border="2px solid var(--chakra-colors-black)"
            onClick={onAbandonExam}
          >
            Abandonar examen
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
