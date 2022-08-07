import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { BiCheckboxChecked } from 'react-icons/bi';
import { Flex, Box, Icon, Button, Grid, Text, useToast } from '@chakra-ui/react';

import { Avatar, onFailure } from 'ui';
import { fmtTiempoTotal } from 'utils';
import { IExamen, ICertificacion, generateDiploma } from 'data';

import { Confetti } from './Confetti';
import { LayoutContext } from '../../../../shared/context';

export const ExamenAprobado = ({
  examen,
  certificacion,
  resultados,
}: {
  examen?: IExamen;
  certificacion?: ICertificacion;
  resultados?: {
    intentosTotales: number;
    intentosRestantes: number;
    preguntasTotales: number;
    preguntasCorrectas: number;
    tiempoUtilizado: number;
  };
}) => {
  const toast = useToast();

  const navigate = useNavigate();
  const { isMobile } = useContext(LayoutContext);

  const [loadingDowload, setLoadingDowload] = useState<boolean>();

  const onDowload = async () => {
    if (!certificacion?.id) {
      onFailure(toast, 'Error inesperado', 'El ID de la entidad es indefinido. Por favor, contacte con soporte.');

      return;
    }

    setLoadingDowload(true);

    await generateDiploma({ id: certificacion?.id })
      .then((url: string) => {
        if (!url) {
          onFailure(
            toast,
            'Error inesperado',
            'No hemos podido generar tu diploma correctamente. Por favor, contacte con soporte.'
          );
        } else {
          var link: HTMLAnchorElement = document.createElement('a');

          link.target = '_blank';
          link.href = url;
          link.click();
        }
      })
      .catch((error) => {
        onFailure(toast, 'Error inesperado', 'Error al descargar diploma. Por favor, contacte con soporte.');
      });

    setLoadingDowload(false);
  };

  return (
    <Flex w="100%" gap="50px" align="center" justify="center" direction="column">
      <Confetti />

      <Flex align="center" direction="column" pt={isMobile ? '10px' : 'unset'} gap={isMobile ? '25px' : '45px'}>
        <Avatar src={examen?.imagen?.url} size={isMobile ? '100px' : '125px'} name={examen?.nombre || 'Imagen del examen'} />

        <Flex direction="column" align="center" gap="18px">
          <Box fontSize="24px" lineHeight="29px" fontWeight="bold">
            ¡Has superado la prueba!
          </Box>

          <Text fontSize="15px" lineHeight="22px" textAlign="center">
            ¡Enhorabuena! Has logrado superar la prueba para obtener la certificación {certificacion?.nombre} en nivel
            {certificacion?.nivel === 3 ? 'Avanzado' : certificacion?.nivel === 2 ? 'Intermedio' : 'Iniciación'}.
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
        <Button bg="gray_3" onClick={() => navigate(`/certificaciones`)}>
          Explorar otras certificaciones
        </Button>

        {process.env.REACT_APP_ORIGEN_CAMPUS !== 'OPENMARKETERS' && (
          <Button bg="gray_3" onClick={onDowload} isLoading={loadingDowload} loadingText="Generando diploma...">
            Descargar diploma
          </Button>
        )}
      </Flex>
    </Flex>
  );
};
