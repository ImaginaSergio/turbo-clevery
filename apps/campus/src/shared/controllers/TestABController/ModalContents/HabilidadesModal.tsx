import { Box, Button } from '@chakra-ui/react';
import { addCookie } from 'data';
import { OpenHabilidades, OpenRadio } from 'ui';
import { useState } from 'react';

import { ModalVariant } from '../types';
import { OpenModalHeader, OpenModalBody, OpenModalFooter } from './_template';

export const HabilidadesModal = ({
  onClose,
  variant,
  onUpdate,
  defaultValue,
}: {
  variant: ModalVariant;
  onClose: () => any;
  onUpdate: (e?: any) => any;
  defaultValue: { tieneExperiencia?: boolean; habilidades: any[] };
}) => {
  const [tieneExperiencia, setTieneExperiencia] = useState<boolean | undefined>(defaultValue?.tieneExperiencia);

  const [habilidades, setHabilidades] = useState<any[]>(
    (defaultValue.habilidades || []).map((h: any) => ({
      value: h.id,
      icono: h.icono,
      label: h.nombre,
      experiencia: h.meta.pivot_experiencia,
    }))
  );

  const handleSubmit = () => {
    onUpdate({ newUser: { tieneExperiencia, habilidades: treatHabilidadesObj() } });
    onClose();
  };

  const handleOnClose = () => {
    addCookie({
      key: 'habilidades',
      value: 'no-interest',
      expirationMinutes: 30,
    });

    onClose();
  };

  const treatHabilidadesObj = (): any => {
    const habilidadesResponse: any = {};

    [...habilidades]?.forEach((habilidad: any) => {
      if (!habilidad.value) return undefined;

      habilidadesResponse[habilidad.value + ''] = {
        experiencia: habilidad?.experiencia,
      };

      return habilidad;
    });

    return habilidadesResponse;
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
          name="tieneExperiencia"
          label={
            process.env.REACT_APP_ORIGEN_CAMPUS === 'OPENMARKETERS'
              ? '¿Tienes experiencia en alguna habilidad?'
              : '¿Tienes experiencia en alguna tecnología?'
          }
          defaultValue={tieneExperiencia === true ? 'Sí' : tieneExperiencia === false ? 'No' : undefined}
          onChange={(e: any) => {
            setTieneExperiencia(e.tieneExperiencia === 'Sí' ? true : e.tieneExperiencia === 'No' ? false : undefined);
          }}
          radios={[
            { label: 'Sí', value: 'Sí' },
            { label: 'No', value: 'No' },
          ]}
        />

        {tieneExperiencia && (
          <OpenHabilidades
            name="habilidades"
            label={`${
              process.env.REACT_APP_ORIGEN_CAMPUS === 'OPENMARKETERS' ? 'Habilidades' : 'Tecnologías'
            } que conoces y los años de experiencia en cada una:`}
            defaultValue={habilidades}
            onChange={(e: any) => {
              setHabilidades(e);
            }}
          />
        )}
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
