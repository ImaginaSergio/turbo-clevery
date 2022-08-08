import { Flex, Box } from '@chakra-ui/react';
import { IEmpresa } from '@clevery/data';

type TabVacantesProps = {
  empresa: IEmpresa;
  updateValue: (value: any) => void;
};

export const TabVacantes = ({ empresa, updateValue }: TabVacantesProps) => {
  return (
    <Flex
      direction="column"
      p="30px"
      boxSize="100%"
      rowGap="30px"
      overflow="auto"
    >
      <Flex minH="fit-content" w="100%" direction="column" rowGap="8px">
        <Box fontSize="18px" fontWeight="semibold">
          Vacantes creadas por la empresa
        </Box>

        <Box fontSize="14px" fontWeight="medium" color="#84889A">
          Información sobre la empresa
        </Box>
      </Flex>

      <Flex direction={{ base: 'column', lg: 'row' }} gap="30px" w="100%">
        Coming soon...
      </Flex>
    </Flex>
  );
};
