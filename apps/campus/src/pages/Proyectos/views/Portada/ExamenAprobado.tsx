import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { BiCheckboxChecked } from 'react-icons/bi';
import { Flex, Box, Icon, Button, Grid, Text, Image } from '@chakra-ui/react';

import { ICertificacion } from 'data';
import { fmtTiempoTotal } from 'utils';

import { Confetti } from './Confetti';
import { LayoutContext } from '../../../../shared/context';

export const ExamenAprobado = ({
  proyecto,
  resultados,
}: {
  proyecto?: ICertificacion;
  resultados?: {
    intentosTotales: number;
    intentosRestantes: number;
    preguntasTotales: number;
    preguntasCorrectas: number;
    tiempoUtilizado: number;
  };
}) => {
  const navigate = useNavigate();
  const { isMobile } = useContext(LayoutContext);

  return (
    <Flex w="100%" gap="50px" align="center" justify="center" direction="column">
      <Confetti />

      <Flex align="center" direction="column" pt={isMobile ? '10px' : 'unset'} gap={isMobile ? '25px' : '45px'}>
        <Image h="125px" minW="125px" fit="cover" src={`data:image/svg+xml;utf8,${proyecto?.icono}`} />

        <Flex direction="column" align="center" gap="18px">
          <Box fontSize="24px" lineHeight="29px" fontWeight="bold">
            ¡Has superado la prueba!
          </Box>

          <Text fontSize="15px" lineHeight="22px" textAlign="center">
            ¡Enhorabuena! Has logrado superar la prueba para obtener la certificación {proyecto?.nombre} en nivel
            {proyecto?.nivel === 3 ? 'Avanzado' : proyecto?.nivel === 2 ? 'Intermedio' : 'Iniciación'}.
          </Text>
        </Flex>
      </Flex>

      <Grid
        gap={isMobile ? 2 : 8}
        margin={isMobile ? '-40px' : ''}
        templateRows={isMobile ? 'repeat(3, 1fr)' : 'repeat(1, 1fr)'}
        templateColumns={isMobile ? 'repeat(1, 1fr)' : 'repeat(3, 1fr)'}
      >
        <Flex
          w="100%"
          p="18px"
          bg="white"
          align="center"
          rounded="20px"
          columnGap="20px"
          border="1px solid var(--chakra-colors-gray_3)"
        >
          <Flex p="10px" align="center" justify="center" boxSize="44px" rounded="10px" bg="primary_light">
            <Icon as={BiCheckboxChecked} boxSize="24px" color="primary_dark" />
          </Flex>

          <Flex direction="column" rowGap="6px">
            <Box w="100%" color="gray_4" fontSize="14px" lineHeight="100%" fontWeight="medium" whiteSpace="nowrap">
              Preguntas acertadas
            </Box>

            <Box lineHeight="100%" fontWeight="bold" fontSize="19px">
              {resultados?.preguntasCorrectas} / {resultados?.preguntasTotales}
            </Box>
          </Flex>
        </Flex>

        <Flex
          w="100%"
          p="18px"
          bg="white"
          align="center"
          rounded="20px"
          gap="20px"
          border="1px solid var(--chakra-colors-gray_3)"
        >
          <Flex p="10px" boxSize="44px" rounded="10px" align="center" justify="center" bg="primary_light">
            <Icon as={BiCheckboxChecked} boxSize="24px" color="primary_dark" />
          </Flex>

          <Flex direction="column" gap="6px">
            <Box w="100%" color="gray_4" fontSize="14px" lineHeight="100%" fontWeight="medium" whiteSpace="nowrap">
              Tiempo utilizado
            </Box>

            <Box lineHeight="100%" fontWeight="bold" fontSize="19px">
              {fmtTiempoTotal(resultados?.tiempoUtilizado || 0) || '< 1min'}
            </Box>
          </Flex>
        </Flex>

        <Flex
          w="100%"
          p="18px"
          bg="white"
          align="center"
          rounded="20px"
          columnGap="20px"
          border="1px solid var(--chakra-colors-gray_3)"
        >
          <Flex p="10px" boxSize="44px" rounded="10px" align="center" justify="center" bg="primary_light">
            <Icon as={BiCheckboxChecked} boxSize="24px" color="primary_dark" />
          </Flex>

          <Flex direction="column" rowGap="6px">
            <Box w="100%" color="gray_4" fontSize="14px" lineHeight="100%" fontWeight="medium" whiteSpace="nowrap">
              Intentos restantes
            </Box>

            <Box lineHeight="100%" fontWeight="bold" fontSize="19px">
              {Math.max(resultados?.intentosRestantes || 0, 0)} / {resultados?.intentosTotales}
            </Box>
          </Flex>
        </Flex>
      </Grid>

      <Flex align="center" gap="15px" direction={{ base: 'column', md: 'row' }}>
        <Button bg="gray_3" onClick={() => navigate(`/roadmap`)}>
          Seguir con mi hoja de ruta
        </Button>
      </Flex>
    </Flex>
  );
};
