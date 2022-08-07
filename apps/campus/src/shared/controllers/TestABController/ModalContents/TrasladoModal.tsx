import { useState } from 'react';

import { Box, Button } from '@chakra-ui/react';

import { OpenRadio } from 'ui';
import { ModalVariant } from '../types';
import { OpenModalHeader, OpenModalBody, OpenModalFooter } from './_template';
import { addCookie } from 'data';

export const TrasladoModal = ({
  onClose,
  variant,
  onUpdate,
  defaultValue,
}: {
  variant: ModalVariant;
  onClose: () => any;
  onUpdate: (e?: any) => any;
  defaultValue?: { posibilidadTraslado?: boolean };
}) => {
  const [posibilidadTraslado, setPosibilidadTraslado] = useState<boolean | undefined>(defaultValue?.posibilidadTraslado);

  const handleSubmit = () => {
    onUpdate({ newUser: { posibilidadTraslado } });
    onClose();
  };

  const handleOnClose = () => {
    addCookie({
      key: 'traslado',
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
          name="posibilidadTraslado"
          label="¿Estás dispuesto a trasladarte por trabajo?"
          defaultValue={posibilidadTraslado === true ? 'Sí' : posibilidadTraslado === false ? 'No' : undefined}
          onChange={(e: any) => {
            setPosibilidadTraslado(e.posibilidadTraslado === 'Sí' ? true : e.posibilidadTraslado === 'No' ? false : undefined);
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
