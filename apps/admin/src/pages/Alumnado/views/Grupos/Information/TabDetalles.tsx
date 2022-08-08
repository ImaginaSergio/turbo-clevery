import { useContext } from 'react';
import { Box, Flex } from '@chakra-ui/react';

import { IGrupo, UserRolEnum } from 'data';
import { InformationInput, InformationTextEditor } from '../../../../../shared/components';
import { LoginContext } from '../../../../../shared/context';
import { isRoleAllowed } from 'utils';

type TabDetallesProps = {
  grupo: IGrupo;
  updateValue: (value: any) => void;
};

export const TabDetalles = ({ grupo, updateValue }: TabDetallesProps) => {
  const { user } = useContext(LoginContext);

  return (
    <Flex direction="column" p="30px" boxSize="100%" rowGap="30px" overflow="auto">
      <Flex minH="fit-content" w="100%" direction="column" rowGap="8px">
        <Box fontSize="18px" fontWeight="semibold">
          Información General
        </Box>

        <Box fontSize="14px" fontWeight="medium" color="#84889A">
          Información sobre el alumno como su nombre, datos de contacto, ajustes...
        </Box>
      </Flex>

      <Flex direction="column" gap="30px" w="100%">
        <InformationInput
          name="nombre"
          label="Nombre del grupo"
          updateValue={updateValue}
          defaultValue={grupo?.nombre}
          isDisabled={!isRoleAllowed([UserRolEnum.SUPERVISOR], user?.rol)}
        />

        <InformationTextEditor
          name="descripcion"
          label="Descripción del grupo"
          updateValue={updateValue}
          defaultValue={grupo?.descripcion}
          isDisabled={!isRoleAllowed([UserRolEnum.SUPERVISOR], user?.rol)}
        />
      </Flex>
    </Flex>
  );
};
