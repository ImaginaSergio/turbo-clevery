import { Flex, Box, Image, Icon } from '@chakra-ui/react';
import { RutaItinerarioLoaded, ICurso, IProyectoBoost } from 'data';
import { fmtMnts } from 'utils';
import { AiFillCheckCircle } from 'react-icons/ai';

export const RoadmapItem = ({ item, index }: { item: RutaItinerarioLoaded; index: number }) => {
  return item?.tipo === 'curso' ? (
    <RoadmapItem_Curso curso={item?.curso} index={index} />
  ) : (
    <RoadmapItem_Proyecto proyecto={item?.proyecto} index={index} />
  );
};

const RoadmapItem_Curso = ({ curso, index }: { curso?: ICurso; index: number }) => {
  return (
    <Flex
      key={index}
      w="100%"
      p="10px"
      gap="20px"
      rounded="12px"
      align="center"
      cursor="pointer"
      height="fit-content"
      justify="space-between"
      transition="all 0.5s ease"
      border="1px solid var(--chakra-colors-gray_3)"
      bg={curso?.meta?.isCompleted ? 'gray_2' : 'white'}
    >
      <Flex align="center" gap="10px">
        {curso?.icono && <Image boxSize="40px" src={`data:image/svg+xml;utf8,${curso?.icono}`} />}

        <Flex gap="70px" align="center">
          <Flex direction="column">
            <Box fontSize="16px" fontWeight="bold">
              {curso?.titulo}
            </Box>

            <Flex
              gap="4px"
              color="gray_4"
              align="center"
              display="flex"
              fontSize="14px"
              direction={{ base: 'column', md: 'row' }}
            >
              {curso?.disponible ? (
                <>
                  <Box pl={{ base: '10px', md: 'unset' }}>{curso?.modulos?.length || 0} módulos</Box>
                  <Box display={{ base: 'none', md: 'unset' }}>|</Box>
                  <Box>{fmtMnts(curso?.meta?.duracionTotal)}</Box>{' '}
                </>
              ) : (
                <Box>Disponible próximamente...</Box>
              )}
            </Flex>
          </Flex>
        </Flex>
      </Flex>

      {curso?.meta?.isCompleted && <Icon as={AiFillCheckCircle} boxSize="28px" color="primary" />}
    </Flex>
  );
};

const RoadmapItem_Proyecto = ({ proyecto, index }: { proyecto?: IProyectoBoost; index: number }) => {
  return (
    <Flex
      key={index}
      w="100%"
      p="10px"
      gap="20px"
      rounded="12px"
      align="center"
      cursor="pointer"
      height="fit-content"
      justify="space-between"
      transition="all 0.5s ease"
      border="1px solid var(--chakra-colors-gray_3)"
      bg={proyecto?.meta?.isCompleted ? 'gray_2' : 'white'}
    >
      <Flex align="center" gap="10px">
        {proyecto?.icono && <Image boxSize="40px" src={`data:image/svg+xml;utf8,${proyecto?.icono}`} />}

        <Flex gap="70px" align="center">
          <Flex direction="column">
            <Box fontSize="16px" fontWeight="bold">
              {proyecto?.titulo}
            </Box>
          </Flex>
        </Flex>
      </Flex>

      {proyecto?.meta?.isCompleted && <Icon as={AiFillCheckCircle} boxSize="28px" color="primary" />}
    </Flex>
  );
};
