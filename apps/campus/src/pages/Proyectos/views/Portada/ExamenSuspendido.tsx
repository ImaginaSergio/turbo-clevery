import { useNavigate } from 'react-router-dom';

import { BiCheckboxChecked, BiRefresh } from 'react-icons/bi';
import { Flex, Box, Icon, Button, Image, Text } from '@chakra-ui/react';

import { IProyectoBoost } from 'data';
import { fmtTiempoTotal } from 'utils';

export const ExamenSuspendido = ({
  proyecto,
  resultados,
}: {
  proyecto?: IProyectoBoost;
  resultados?: {
    intentosTotales: number;
    intentosRestantes: number;
    preguntasTotales: number;
    preguntasCorrectas: number;
    tiempoUtilizado: number;
  };
}) => {
  const navigate = useNavigate();

  return (
    <Flex
      maxW="960px"
      align="center"
      justify="center"
      direction="column"
      p={{ base: '20px ', md: '0' }}
      gap={{ base: '18px', sm: '60px' }}
    >
      <Flex align="center" direction="column" gap={{ base: '8px', sm: '40px' }}>
        <Image h="125px" minW="125px" fit="cover" src={`data:image/svg+xml;utf8,${proyecto?.icono}`} />

        <Flex direction="column" align="center" gap={{ base: '0', sm: '18px' }}>
          <Box lineHeight="29px" fontWeight="bold" fontSize={{ base: '20px', sm: '24px' }}>
            Vaya...
          </Box>

          <Text lineHeight="22px" textAlign="center" fontSize={{ base: '14px', sm: '15px' }}>
            {(resultados?.intentosRestantes || 0) > 0
              ? `No has logrado superar el examen pero no te rindas, todavía te
            quedan ${resultados?.intentosRestantes} intentos para realizar la
            certificación ${proyecto?.titulo}. Aprovecha y mejora tus
            conocimientos antes de reintentarlo.`
              : `Has gastado todos tus intentos para conseguir la certificación de SpringBoot Avanzado. No te rindas, en ${
                  process.env.REACT_APP_ORIGEN_CAMPUS === 'OPENBOOTCAMP' ? 'OpenBootcamp' : 'OpenMarketers'
                } tenemos muchas más certificaciones con las que puedes probar tu destreza.`}
          </Text>
        </Flex>
      </Flex>

      <Flex w="100%" gap={{ base: '11px', sm: '32px' }} direction={{ base: 'column', sm: 'row' }}>
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
          columnGap="20px"
          border="1px solid var(--chakra-colors-gray_3)"
        >
          <Flex p="10px" boxSize="44px" rounded="10px" align="center" justify="center" bg="primary_light">
            <Icon as={BiCheckboxChecked} boxSize="24px" color="primary_dark" />
          </Flex>

          <Flex direction="column" rowGap="6px">
            <Box w="100%" lineHeight="100%" fontWeight="medium" fontSize="14px" color="gray_4" whiteSpace="nowrap">
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
      </Flex>

      <Flex gap="15px" direction={{ base: 'column', sm: 'row' }}>
        <Flex justify="center">
          <Button bg="gray_3" onClick={() => navigate(`/roadmap`)}>
            Seguir con mi hoja de ruta
          </Button>
        </Flex>

        <Flex justify="center">
          {(resultados?.intentosRestantes || 0) > 0 && (
            <Button
              bg="black"
              color="white"
              rightIcon={<Icon as={BiRefresh} boxSize="24px" />}
              onClick={() => navigate(`/proyectos/${proyecto?.id}/examen`)}
            >
              Intentar de nuevo
            </Button>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
};
