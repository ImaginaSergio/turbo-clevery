import { Box, Flex, useColorMode } from '@chakra-ui/react';

import { OpenLiveCoder } from 'ui';

type InputProps = {
  value?: string;
  errorOutput?: any;
};

function OBCodeOutput({ value, errorOutput }: InputProps) {
  const { colorMode } = useColorMode();

  return (
    <Flex direction="column" w="100%">
      <Flex
        h="70px"
        minH="70px"
        width="100%"
        p="15px 20px"
        align="center"
        bg={colorMode === 'dark' ? '#242529' : 'white'}
        borderBottom="1px solid var(--chakra-colors-gray_3)"
      >
        <Box color="black" fontSize="14px" fontWeight="bold">
          Consola
        </Box>
      </Flex>

      <OpenLiveCoder readOnly language="bat" defaultValue={value || 'Ejecuta tu código para ver el resultado.'} />
    </Flex>
  );
}

export default OBCodeOutput;
