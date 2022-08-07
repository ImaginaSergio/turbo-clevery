import {
  Box,
  Button,
  CircularProgress,
  CircularProgressLabel,
  Flex,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

export const WidgetPerfil = ({ totalPerfil }: { totalPerfil: number }) => {
  const navigate = useNavigate();

  return (
    <Flex
      p="24px"
      gap="34px"
      bg="black"
      direction="column"
      mb={{ base: '26px', sm: 0 }}
      rounded={{ base: '0px', sm: '22px' }}
      transition="color 0.7s ease, background-color 0.7s ease"
    >
      <Flex align="center">
        <CircularProgress
          size="75px"
          bg="#15363A"
          rounded="100%"
          color="#5BD4A4"
          trackColor="#1F514C"
          value={totalPerfil}
        >
          <CircularProgressLabel
            color="#FFF"
            fontSize="21px"
            fontWeight="bold"
            lineHeight="27px"
          >{`${totalPerfil}%`}</CircularProgressLabel>
        </CircularProgress>

        <Flex direction="column" ml="24px" gap="10px" color="white">
          <Box fontWeight="bold" fontSize="20px" lineHeight="22px">
            Progreso del perfil
          </Box>

          <Box fontSize="14px" lineHeight="21px">
            Completa la información de tu perfil para optar a mayores ventajas
            como acceso a vacantes, entre otras características.
          </Box>
        </Flex>
      </Flex>

      <Button
        bg="white"
        minWidth="100%"
        _hover={{ bg: 'primary' }}
        onClick={() => navigate('/perfil#empleo')}
      >
        <Box color="black">Completar mi Perfil</Box>
      </Button>
    </Flex>
  );
};
