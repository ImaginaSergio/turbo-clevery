import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { BiBriefcase, BiPlay } from 'react-icons/bi';
import { Box, Button, Flex, Icon, Progress, Skeleton } from '@chakra-ui/react';

import { LoginContext } from '../../../../shared/context';

export const Progreso = ({ isLoading }: { isLoading: boolean }) => {
  const navigate = useNavigate();

  const { user } = useContext(LoginContext);

  return (
    <Flex
      p="24px"
      gap="16px"
      bg="white"
      minW={{ base: 'unset', sm: '490px' }}
      w="100%"
      rounded={{ base: '0px', sm: '20px' }}
      direction="column"
      border={{ base: 'none', sm: '1px solid var(--chakra-colors-gray_3)' }}
      borderColor="gray_3"
    >
      <Flex direction="column" gap="8px">
        <Flex gap="10px">
          <Skeleton w="100%" isLoaded={!isLoading}>
            <Box w="100%" fontSize="18px" lineHeight="22px" fontWeight="bold">
              {user?.progresoGlobal?.meta?.progresoCampus || 0}% del Boost
              completado
            </Box>
          </Skeleton>

          <Icon as={BiBriefcase} boxSize="20px" color="gray_5" />
        </Flex>

        <Progress
          h="8px"
          w="100%"
          value={100}
          rounded="22px"
          sx={{
            '& > div': {
              background: `linear-gradient(90deg, var(--chakra-colors-primary) 0%, var(--chakra-colors-primary) ${
                user?.progresoGlobal?.meta?.progresoCampus || 0
              }%, var(--chakra-colors-gray_3) ${
                user?.progresoGlobal?.meta?.progresoCampus || 0
              }%, var(--chakra-colors-gray_3) 100%)`,
            },
          }}
        />
      </Flex>

      <Button
        h="auto"
        w="100%"
        p="15px"
        bg="black"
        color="white"
        rounded="14px"
        rightIcon={<BiPlay />}
        onClick={() => navigate(`/roadmap`)}
        _hover={{
          bg: 'gray_3',
          color: 'black',
        }}
      >
        Continuar ruta del Boost
      </Button>
    </Flex>
  );
};
