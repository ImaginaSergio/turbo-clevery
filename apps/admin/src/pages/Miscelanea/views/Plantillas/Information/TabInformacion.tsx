import { useContext } from 'react';

import { Box, Flex } from '@chakra-ui/react';

import { InformationInput, InformationMde } from '../../../../../shared/components';
import { IPlantilla, UserRolEnum } from 'data';
import { isRoleAllowed } from 'utils';
import { LoginContext } from 'apps/admin/src/shared/context';

type TabInformacionProps = {
  plantilla: IPlantilla;
  updateValue: (value: any) => void;
};

export const TabInformacion = ({ plantilla, updateValue }: TabInformacionProps) => {
  const { user } = useContext(LoginContext);

  return (
    <Flex p="30px" gap="30px" boxSize="100%" direction="column" overflow="auto">
      <Flex minH="fit-content" w="100%" direction="column" rowGap="8px">
        <Box fontSize="18px" fontWeight="semibold">
          Información General
        </Box>

        <Box fontSize="14px" fontWeight="medium" color="#84889A">
          Información sobre la plantilla, como su título, contenido y el icono de la misma.
        </Box>
      </Flex>

      <Flex direction="column" gap="30px" w="100%">
        <InformationInput
          name="titulo"
          label="Título de la plantilla"
          placeholder="Introduce el texto"
          defaultValue={plantilla?.titulo}
          updateValue={updateValue}
          isDisabled={!isRoleAllowed([UserRolEnum.ADMIN], user?.rol)}
        />

        <Flex direction={{ base: 'column', lg: 'row' }} gap="30px" w="100%">
          <InformationMde
            allowCopy
            name="icono"
            label="Icono de la plantilla"
            placeholder="Introduce el texto"
            defaultValue={plantilla?.icono}
            updateValue={updateValue}
            isDisabled={!isRoleAllowed([UserRolEnum.ADMIN], user?.rol)}
            style={{ width: '100%' }}
          />

          <InformationMde
            name="contenido"
            label="Contenido de la plantilla"
            placeholder="Introduce el texto"
            defaultValue={plantilla?.contenido}
            updateValue={updateValue}
            isDisabled={!isRoleAllowed([UserRolEnum.ADMIN], user?.rol)}
            style={{ width: '100%' }}
          />
        </Flex>
      </Flex>
    </Flex>
  );
};
