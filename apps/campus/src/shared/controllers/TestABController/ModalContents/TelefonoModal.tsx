import { useState } from 'react';

import { OpenPhoneInput } from 'ui';
import { Box, Button } from '@chakra-ui/react';

import { addCookie } from 'data';

import { ModalVariant } from '../types';
import { OpenModalHeader, OpenModalBody, OpenModalFooter } from './_template';

export const TelefonoModal = ({
  onClose,
  variant,
  onUpdate,
  defaultValue,
}: {
  variant: ModalVariant;
  onClose: () => any;
  onUpdate: (e?: any) => any;
  defaultValue: { telefono?: string };
}) => {
  const [telefono, setTelefono] = useState<string>(defaultValue?.telefono || '');

  const handleSubmit = () => {
    onUpdate({ newUser: { telefono } });
    onClose();
  };

  const handleOnClose = () => {
    addCookie({ key: 'telefono', value: 'no-interest', expirationMinutes: 30 });

    onClose();
  };

  return (
    <>
      <OpenModalHeader>
        <Box w="100%" fontSize="18px" lineHeight="27px">
          Necesitamos que respondas una pregunta para mejorar tu experiencia en OB 🙏
        </Box>
      </OpenModalHeader>

      <OpenModalBody>
        <OpenPhoneInput
          name="telefono"
          label="Teléfono"
          defaultValue={telefono}
          onChange={(value: any) => {
            setTelefono(value.telefono);
          }}
        />
      </OpenModalBody>

      <OpenModalFooter>
        <Button bg="gray_3" onClick={handleOnClose}>
          No me interesa ahora
        </Button>

        <Button bg="black" color="white" onClick={handleSubmit}>
          Enviar respuesta
        </Button>
      </OpenModalFooter>
    </>
  );
};
