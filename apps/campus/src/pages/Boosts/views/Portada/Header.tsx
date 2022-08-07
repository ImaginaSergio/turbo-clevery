import { Flex, Box, Image, Icon, Skeleton } from '@chakra-ui/react';

import { IBoost } from 'data';
import { BiBuilding, BiGroup } from 'react-icons/bi';

export const Header = ({ boost, isLoading }: { boost: IBoost; isLoading: boolean }) => {
  return (
    <Flex w="100%" gap="25px" align="start" px={{ base: '20px', sm: '0px' }} direction={{ base: 'column', sm: 'row' }}>
      <Flex w="100%" gap="25px">
        <Skeleton rounded="20px" isLoaded={!!boost?.icono}>
          <Image minW="75px" boxSize="75px" src={`data:image/svg+xml;utf8,${boost?.icono}`} />
        </Skeleton>
        <Flex w="100%" gap="8px" direction="column">
          <Skeleton minW="220px" isLoaded={!!boost?.titulo}>
            <Box fontSize="32px" fontWeight="bold" lineHeight="39px" data-cy="titulo_boost">
              {boost?.titulo}
            </Box>
          </Skeleton>

          <Flex gap="5px" align="center">
            <Icon as={BiBuilding} boxSize="20px" color="gray_6" />

            <Skeleton minW="80px" isLoaded={!!boost?.empresa?.nombre}>
              <Box fontSize="16px" lineHeight="16px" fontWeight="semibold" data-cy="empresa_titulo_boost">
                {boost?.empresa?.nombre}
              </Box>
            </Skeleton>
          </Flex>
        </Flex>
      </Flex>

      <Flex
        h="auto"
        bg="white"
        p="10px 15px"
        align="start"
        rounded="12px"
        color="#6350B0"
        fontSize="14px"
        fontWeight="bold"
        minW="fit-content"
        borderColor="gray_3"
      >
        <Icon as={BiGroup} mr="5px" boxSize="20px" />

        <Box>{boost?.meta?.inscritos || 0} alumnos</Box>

        <Box color="gray_5" ml="4px">
          inscritos
        </Box>
      </Flex>
    </Flex>
  );
};
