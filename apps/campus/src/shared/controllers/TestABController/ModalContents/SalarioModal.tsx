import { useEffect, useState } from 'react';
import { Box, Button } from '@chakra-ui/react';

import { addCookie } from 'data';
import { OpenRangeInput } from 'ui';

import { ModalVariant } from '../types';
import { OpenModalHeader, OpenModalBody, OpenModalFooter } from './_template';

export const SalarioModal = ({
  onClose,
  variant,
  onUpdate,
  defaultValue,
}: {
  variant: ModalVariant;
  onClose: () => any;
  onUpdate: (e?: any) => any;
  defaultValue?: [number | undefined, number | undefined];
}) => {
  const [expectativasSalariales, setExpectativasSalariales] = useState<[number | undefined, number | undefined]>(
    defaultValue || [undefined, undefined]
  );

  const handleSubmit = () => {
    onUpdate({
      newUser: {
        expectativasSalarialesMin: expectativasSalariales[0],
        expectativasSalarialesMax: expectativasSalariales[1],
      },
    });

    onClose();
  };

  const handleOnClose = () => {
    addCookie({
      key: 'salario',
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
        <OpenRangeInput
          name="expectativasSalariales"
          label="¿Qué expectativas salariales tienes? (Cantidad en bruto €/año)"
          defaultValue={defaultValue}
          onChange={(e: any) => setExpectativasSalariales(e.expectativasSalariales)}
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
