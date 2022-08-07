import { useContext } from 'react';

import { Flex } from '@chakra-ui/react';

import { LoginContext } from '../../../shared/context';

import { RutaInfo } from '../components/Info';
import { RutaLista } from '../components/Lista';

const RoadmapList = () => {
  const { user } = useContext(LoginContext);

  return (
    <Flex
      w="100%"
      h="auto"
      pb="12px"
      gap="46px"
      p={{ base: '0px', sm: '34px' }}
      direction={{ base: 'column', lg: 'row' }}
    >
      {user?.progresoGlobal?.ruta && (
        <Flex
          h="100%"
          position="relative"
          minW={{ base: '100%', lg: '530px' }}
          maxW={{ base: '100%', lg: '530px' }}
        >
          <RutaInfo
            ruta={user?.progresoGlobal?.rutaPro || user?.progresoGlobal?.ruta}
          />
        </Flex>
      )}

      {user?.progresoGlobal?.ruta && (
        <RutaLista
          ruta={user?.progresoGlobal?.rutaPro || user?.progresoGlobal?.ruta}
        />
      )}
    </Flex>
  );
};

export default RoadmapList;
