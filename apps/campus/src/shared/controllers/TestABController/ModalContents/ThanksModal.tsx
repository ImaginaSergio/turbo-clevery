import { Box, Button } from '@chakra-ui/react';

import { ModalVariant } from '../types';
import { OpenModalHeader, OpenModalBody, OpenModalFooter } from './_template';

export const ThanksModal = ({
  onClose,
  variant,
  onUpdate,
}: {
  variant: ModalVariant;
  onClose: () => any;
  onUpdate: (e?: any) => any;
}) => {
  return (
    <>
      <OpenModalHeader>
        <Box w="100%" fontSize="24px" fontWeight="bold">
          ¡Gracias por tu tiempo! 😊
        </Box>
      </OpenModalHeader>

      <OpenModalBody>
        <Box>
          Utilizaremos tus respuestas para ofrecerte las vacantes que mejor se
          adapten a tus conocimientos y capacidades.
        </Box>
      </OpenModalBody>

      <OpenModalFooter>
        <Button bg="black" color="white" disabled>
          Aceptar y salir
        </Button>
      </OpenModalFooter>
    </>
  );
};
