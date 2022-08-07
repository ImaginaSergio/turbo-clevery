import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { Center } from '@chakra-ui/react';
import { Flex, Box, Icon, Button, Image } from '@chakra-ui/react';
import { BiCheckboxChecked, BiRightArrowAlt } from 'react-icons/bi';

import { IProyectoBoost } from 'data';
import { OpenParser } from 'ui';
import { fmtHours } from 'utils';

export const PortadaBase = ({ proyecto }: { proyecto?: IProyectoBoost }) => {
  const navigate = useNavigate();

  const [intentosRestantes, setIntentosRestantes] = useState<number>(0);

  useEffect(() => {
    setIntentosRestantes(0);
  }, [proyecto?.id]);

  return (
    <Flex
      w="100%"
      align="center"
      justify="center"
      direction="column"
      gap={{ base: '20px', sm: '60px' }}
      pb={{ base: '100px', sm: 'unset' }}
      p={{ base: '30px 10px 70px', sm: '0px' }}
    >
      <Flex direction="column" gap="45px" align="center">
        <Image h="125px" minW="125px" fit="cover" src={`data:image/svg+xml;utf8,${proyecto?.icono}`} />

        <Flex direction="column" align="center" gap="18px">
          <Box fontSize="24px" lineHeight="29px" fontWeight="bold" data-cy="titulo_proyecto_portada_base">
            {proyecto?.titulo}
          </Box>

          <Box
            fontSize="15px"
            lineHeight="22px"
            textAlign="center"
            pl={{ base: '5px', sm: '0px' }}
            pr={{ base: '5px', sm: '0px' }}
          >
            <OpenParser value={proyecto?.descripcionLarga} />
          </Box>
        </Flex>
      </Flex>

      <Flex
        align="center"
        w={{ base: '100%', sm: 'unset' }}
        gap={{ base: '15px', sm: '32px' }}
        direction={{ base: 'column', sm: 'row' }}
      >
        <Flex
          data-cy="num_preguntas_container"
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
              Número de preguntas
            </Box>

            <Box data-cy="num_preguntas_portada_base" lineHeight="100%" fontWeight="bold" fontSize="19px">
              666
            </Box>
          </Flex>
        </Flex>

        <Flex
          data-cy="tiempo_total_container"
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
              Tiempo total
            </Box>

            <Box fontSize="19px" lineHeight="100%" fontWeight="bold" data-cy="tiempo_total_portada_base">
              {fmtHours(proyecto?.tiempoLimite || 0)}
            </Box>
          </Flex>
        </Flex>

        <Flex
          data-cy="intentos_restantes_container"
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

            <Box fontSize="19px" lineHeight="100%" fontWeight="bold" data-cy="intentos_restantes_portada_base">
              {Math.max(intentosRestantes, 0)} / {777}
            </Box>
          </Flex>
        </Flex>
      </Flex>

      <Center
        h="89px"
        w="100%"
        p="20px"
        bg="white"
        bottom={0}
        position="fixed"
        display={{ base: 'flex', sm: 'none' }}
        boxShadow="0px -4px 20px 0px rgba(0, 0, 0, 0.1)"
      >
        <Button
          bg="black"
          color="white"
          boxSize="100%"
          _hover={{ opacity: 0.8 }}
          data-cy="empezar_button_portada_base"
          isDisabled={intentosRestantes === 0 || proyecto?.meta?.isCompleted}
          onClick={() => navigate(`/proyectos/${proyecto?.id}/examen`)}
          rightIcon={intentosRestantes > 0 ? <Icon as={BiRightArrowAlt} boxSize="24px" pr="5px" /> : undefined}
        >
          {proyecto?.meta?.isCompleted
            ? 'Proyecto completado'
            : intentosRestantes <= 0
            ? 'Sin intentos restantes'
            : 'Empezar examen'}
        </Button>
      </Center>
    </Flex>
  );
};
