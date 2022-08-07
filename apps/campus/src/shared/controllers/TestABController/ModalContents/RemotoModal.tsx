import { useState } from 'react';

import { Box, Button } from '@chakra-ui/react';

import { OpenSelect } from 'ui';
import { addCookie, UserRemotoEnum } from 'data';

import { ModalVariant } from '../types';
import { OpenModalHeader, OpenModalBody, OpenModalFooter } from './_template';
import { capitalizeFirst } from 'utils';

export const RemotoModal = ({
  onClose,
  variant,
  onUpdate,
  defaultValue,
}: {
  variant: ModalVariant;
  onClose: () => any;
  onUpdate: (e?: any) => any;
  defaultValue?: { trabajoRemoto?: UserRemotoEnum };
}) => {
  const [trabajoRemoto, setTrabajoRemoto] = useState<UserRemotoEnum | undefined>(defaultValue?.trabajoRemoto);

  const handleSubmit = () => {
    onUpdate({ newUser: { trabajoRemoto } });
    onClose();
  };

  const handleOnClose = () => {
    addCookie({
      key: 'remoto',
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
        <OpenSelect
          name="trabajoRemoto"
          label="¿Qué tipo de trabajo prefieres?"
          placeholder="Elige una opción del listado"
          onChange={(e: any) => {
            setTrabajoRemoto(e);
          }}
          options={[
            { label: 'Remoto', value: UserRemotoEnum.REMOTO },
            { label: 'Presencial', value: UserRemotoEnum.PRESENCIAL },
            { label: 'Híbrido', value: UserRemotoEnum.HIBRIDO },
            { label: 'Indiferente', value: UserRemotoEnum.INDIFERENTE },
          ]}
          defaultValue={
            trabajoRemoto
              ? {
                  label: capitalizeFirst(trabajoRemoto),
                  value: trabajoRemoto,
                }
              : null
          }
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
