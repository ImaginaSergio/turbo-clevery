import { useEffect, useState } from 'react';

import { Box, Flex, useToast } from '@chakra-ui/react';

import { ItinerarioList, InformationInput } from '../../../../../shared/components';
import { onFailure } from 'ui';
import { IBoost, IRuta, getRutaByID, updateRuta } from 'data';

type TabRutaProps = {
  boost: IBoost;
};

export const TabRuta = ({ boost }: TabRutaProps) => {
  const toast = useToast();
  const [ruta, setRuta] = useState<IRuta>();

  useEffect(() => {
    refreshState();
  }, [boost?.rutaId]);

  const refreshState = async () => {
    if (!boost?.rutaId) {
      setRuta(undefined);
    } else {
      const _ruta = await getRutaByID({ id: boost.rutaId, client: 'admin' });
      setRuta(_ruta);
    }
  };

  const updateRutaValue = (value: any) => {
    if (!ruta?.id) return;

    return updateRuta({ id: ruta?.id, ruta: value, client: 'admin' })
      .then(async (msg: any) => {
        await refreshState();

        return msg;
      })
      .catch((error: any) => {
        console.error('Todo fue mal D:', { error });
        onFailure(toast, error.title, error.message);

        return error;
      });
  };

  return (
    <Flex p="30px" gap="30px" boxSize="100%" overflow="auto" direction="column">
      <Flex minH="fit-content" w="100%" direction="column" rowGap="8px">
        <Box fontSize="18px" fontWeight="semibold">
          Hoja de ruta
        </Box>

        <Box fontSize="14px" fontWeight="medium" color="#84889A">
          Hoja de ruta asociada al Boost, que los alumnos inscritos tendrán que completar antes de optar a la oferta laboral.
        </Box>
      </Flex>

      <Flex direction="column" gap="30px" w="100%">
        <InformationInput
          name="nombre"
          label="Titulo de la hoja de ruta"
          placeholder="Escribe para buscar"
          defaultValue={ruta?.nombre}
          updateValue={updateRutaValue}
          style={{ width: '100%' }}
        />

        <ItinerarioList ruta={ruta} updateRuta={updateRutaValue} />
      </Flex>
    </Flex>
  );
};
