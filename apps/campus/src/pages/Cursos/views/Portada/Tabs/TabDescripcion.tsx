import { Box, Divider, Flex, Text } from '@chakra-ui/react';

import { Avatar, OpenParser } from 'ui';
import { ICurso } from 'data';

export const TabDescripcion = ({ curso }: { curso: ICurso }) => {
  return (
    <Flex w="100%" direction={{ base: 'column', md: 'row' }} gap={{ base: '10px', md: 'unset' }}>
      <Flex direction="column" gap="16px" flex={2}>
        <Text display={{ base: 'none', sm: 'flex' }} variant="h1_heading">
          Sobre este curso
        </Text>

        <Text variant="text_summary">
          <OpenParser value={curso?.descripcion} />
        </Text>
      </Flex>

      <Box minW="1px" minH="100%" bg="gray_3" mx="32px" />

      <Flex direction="column" gap="16px" flex={1}>
        <Divider display={{ base: 'flex', sm: 'none' }} />
        <Text variant="h2_heading">Sobre el tutor</Text>

        <Flex gap="18px" align="center">
          <Avatar
            size="45px"
            variant="bauhaus"
            src={curso?.profesor?.avatar?.url}
            name={curso?.profesor?.fullName || 'Avatar del profesor'}
            colorVariant={(curso?.profesor?.id || 0) % 2 == 1 ? 'hot' : 'cold'}
          />

          <Flex direction="column" gap="4px">
            <Text fontWeight="bold" fontSize="16px">
              {curso?.profesor?.fullName.split(' ')[0]}
            </Text>

            <Text fontSize="14px" color="gray_5">
              {curso?.profesor?.fullName.replace(curso?.profesor?.fullName.split(' ')[0], '')}
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};
