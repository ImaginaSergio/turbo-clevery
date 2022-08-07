import { Flex, Center } from '@chakra-ui/react';

const filtros: { label: string; value: string }[] = [
  { label: 'Todas', value: 'todos' },
  { label: 'Cursos', value: 'cursos' },
  { label: 'General', value: 'general' },
];

function PageHeader({
  setFilterSelected,
  filterSelected,
}: {
  filterSelected: string;
  setFilterSelected: any;
}) {
  return (
    <Flex w="100%" gap="15px" transition="all 0.3 ease" align="start">
      {filtros.map(
        (filtro: { label: string; value: string }, index: number) => (
          <Center
            key={`novedades-filtro-${index}`}
            p="5px 15px"
            rounded="20px"
            cursor="pointer"
            fontSize="18px"
            fontWeight="semibold"
            transition="all 0.3 ease"
            onClick={() => setFilterSelected(filtro.value)}
            bg={filterSelected === filtro.value ? 'black' : 'gray_2'}
            color={filterSelected === filtro.value ? 'white' : 'black'}
            _hover={{ opacity: filterSelected === filtro.value ? 1 : 0.7 }}
          >
            {filtro.label}
          </Center>
        )
      )}
    </Flex>
  );
}

export default PageHeader;
