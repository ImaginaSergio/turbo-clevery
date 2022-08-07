import { useState } from 'react';

import { debounce } from 'lodash';
import { OpenInput } from 'ui';
import { Box, Button } from '@chakra-ui/react';

import { addCookie } from 'data';

import { ModalVariant } from '../types';
import { OpenModalHeader, OpenModalBody, OpenModalFooter } from './_template';

export const LinkedinModal = ({
  onClose,
  variant,
  onUpdate,
  defaultValue,
}: {
  variant: ModalVariant;
  onClose: () => any;
  onUpdate: (e?: any) => any;
  defaultValue: { linkedin?: string };
}) => {
  const [linkedin, setLinkedin] = useState<string>(defaultValue?.linkedin || '');

  const handleSubmit = () => {
    onUpdate({ newUser: { linkedin } });
    onClose();
  };

  const handleOnClose = () => {
    addCookie({ key: 'linkedin', value: 'no-interest', expirationMinutes: 30 });

    onClose();
  };

  const validateLinkedin = debounce(async (value: string, resolve: (val: string) => void) => {
    let error: string = '';

    if (value !== '' && !value.startsWith('https://www.linkedin.com/in/'))
      error = '¡Debes introducir una dirección válida a LinkedIn!';

    return resolve(error);
  }, 350);

  return (
    <>
      <OpenModalHeader>
        <Box w="100%" fontSize="18px" lineHeight="27px">
          Necesitamos que respondas una pregunta para mejorar tu experiencia en OB 🙏
        </Box>
      </OpenModalHeader>

      <OpenModalBody>
        <OpenInput
          name="linkedin"
          label="LinkedIn"
          defaultValue={linkedin}
          onValidate={async (value) => new Promise((resolve) => validateLinkedin(value || '', resolve))}
          placeholder="https://www.linkedin.com/in/tu-usuario"
          onChange={(value: any) => {
            setLinkedin(value.linkedin);
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
