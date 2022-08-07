import { useState } from 'react';

import { Box, Button } from '@chakra-ui/react';

import { OpenRadio } from 'ui';
import { addCookie } from 'data';

import { ModalVariant } from '../types';
import { OpenModalHeader, OpenModalBody, OpenModalFooter } from './_template';

export const TrabajoActualModal = ({
  onClose,
  variant,
  onUpdate,
  defaultValue,
}: {
  variant: ModalVariant;
  onClose: () => any;
  onUpdate: (e?: any) => any;
  defaultValue?: { actualmenteTrabajando?: boolean };
}) => {
  const [actualmenteTrabajando, setActualmenteTrabajando] = useState<boolean | undefined>(defaultValue?.actualmenteTrabajando);

  const handleSubmit = () => {
    onUpdate({ newUser: { actualmenteTrabajando } });
    onClose();
  };

  const handleOnClose = () => {
    addCookie({
      key: 'trabajo',
      value: 'no-interest',
      expirationMinutes: 60 * 24,
    });

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
        <OpenRadio
          name="actualmenteTrabajando"
          label={
            process.env.NX_ORIGEN_CAMPUS === 'OPENMARKETERS'
              ? '¿Estás trabajando como marketer actualmente?'
              : '¿Estás trabajando como desarrollador actualmente?'
          }
          defaultValue={actualmenteTrabajando === true ? 'Sí' : actualmenteTrabajando === false ? 'No' : undefined}
          onChange={(e: any) => {
            setActualmenteTrabajando(
              e.actualmenteTrabajando === 'Sí' ? true : e.actualmenteTrabajando === 'No' ? false : undefined
            );
          }}
          radios={[
            { label: 'Sí', value: 'Sí' },
            { label: 'No', value: 'No' },
          ]}
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
