import { BiMap } from 'react-icons/bi';
import { Box, Flex, Icon, Image, Skeleton } from '@chakra-ui/react';

import { IBoost } from 'data';
import { OpenParser } from 'ui';

export const Empresa = ({ boost, isLoading }: { boost: IBoost; isLoading: boolean }) => {
  return (
    <Skeleton rounded="20px" isLoaded={!isLoading}>
      <Flex
        p="24px"
        gap="32px"
        bg="white"
        minW={{ base: 'unset', sm: '490px' }}
        w="100%"
        maxW={{ base: '100%', lg: '510px' }}
        rounded={{ base: '0px', sm: '20px' }}
        direction="column"
        border={{ base: 'none', sm: '1px solid var(--chakra-colors-gray_3)' }}
        borderColor="gray_3"
      >
        <Box>
          <Box mb="9px" fontSize="24px" lineHeight="29px" fontWeight="bold" data-cy="titulo_info_empresa_boost">
            Sobre {boost?.empresa?.nombre}
          </Box>

          <Flex mb="18px" gap="9px" align="center">
            <Icon as={BiMap} boxSize="20px" color="gray_5" />

            <Box fontSize="16px" lineHeight="16px" fontWeight="semibold" data-cy="localizacion_info_empresa_boost">
              {boost?.empresa?.estado?.nombre}, {boost?.empresa?.pais?.nombre}
            </Box>
          </Flex>

          <OpenParser
            data-cy="descripcion_info_empresa_boost"
            value={boost?.empresa?.descripcion}
            style={{ fontSize: '15px', lineHeight: '22px' }}
          />
        </Box>

        {boost?.empresa?.imagen?.url && <Image fit="cover" maxH="165px" rounded="10px" src={boost?.empresa?.imagen?.url} />}

        <Box
          as="a"
          h="auto"
          w="100%"
          p="15px"
          bg="gray_3"
          cursor="pointer"
          rounded="14px"
          target="_blank"
          textAlign="center"
          fontSize="18px"
          lineHeight="22px"
          fontWeight="bold"
          transition="0.2s ease"
          href={boost?.empresa?.web}
          _hover={{
            bg: 'gray_2',
          }}
        >
          Ver web de {boost?.empresa?.nombre}
        </Box>
      </Flex>
    </Skeleton>
  );
};
