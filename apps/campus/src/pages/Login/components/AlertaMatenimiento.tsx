import {
  Box,
  Flex,
  Icon,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import { BiX } from 'react-icons/bi';

export const AlertaMatenimiento = ({
  state,
}: {
  state: { isOpen: boolean; onClose: () => void };
}) => {
  return (
    <Modal onClose={state.onClose} isOpen={state.isOpen} isCentered>
      <ModalOverlay />

      <ModalContent maxW="56em" maxH="56em">
        <ModalHeader p="30px 30px 0px">MANTENIMIENTO</ModalHeader>

        <ModalBody>a</ModalBody>
      </ModalContent>
    </Modal>
  );
};
