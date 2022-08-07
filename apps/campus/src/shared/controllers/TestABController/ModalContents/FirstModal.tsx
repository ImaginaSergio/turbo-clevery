import { Box, Button } from '@chakra-ui/react';

import { ModalVariant } from '../types';
import { OpenModalHeader, OpenModalBody, OpenModalFooter } from './_template';

export const FirstModal = ({
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
        <Box w="100%">💼 ¡Encuentra trabajo con OpenBootcamp!</Box>
      </OpenModalHeader>

      <OpenModalBody>
        Para ofrecerte vacantes laborales adecuadas para tu perfil necesitamos
        que dediques menos de 2 minutos a responder unas preguntas.
      </OpenModalBody>

      <OpenModalFooter>
        <Button disabled>No me interesa ahora</Button>

        <Button bg="black" color="white" disabled>
          Responder Preguntas
        </Button>
      </OpenModalFooter>
    </>
  );
};
