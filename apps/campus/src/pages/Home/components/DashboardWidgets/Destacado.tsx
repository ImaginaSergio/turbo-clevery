import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Flex, Box, Text, Image, Button } from '@chakra-ui/react';

import { getProgresos, ProgresoTipoEnum, useCurso } from 'data';
import { LoginContext } from '../../../../shared/context';

export const DestacadoWidget = () => {
  const navigate = useNavigate();

  const { user } = useContext(LoginContext);
  const [hideWidget, setHideWidget] = useState<boolean>(true);

  const { data: curso, isLoading } = useCurso({
    treatData: false,
    id: +(user?.preferencias?.cursoDestacado || 0),
  });

  useEffect(() => {
    let leccionId = curso?.modulos[0]?.lecciones[0]?.id;

    if (!!leccionId)
      getProgresos({
        query: [
          {
            user_id: user?.id,
            leccion_id: leccionId,
            tipo: ProgresoTipoEnum.COMPLETADO,
          },
        ],
      }).then((data) => {
        if ((data?.data || [])?.length === 0) setHideWidget(false);
      });
  }, [curso?.id]);

  return !hideWidget ? (
    <Flex h="100%" gap="20px" direction="column" p={{ base: '12px', sm: 0 }} mt={{ base: '42px', sm: 0 }}>
      <Flex w="100%" gap="10px" direction="column">
        <Text variant="h2_heading" isTruncated>
          Curso Destacado ✨
        </Text>

        <Text variant="p_text">
          Aunque te recomendamos realizar tu formación siguiendo la hoja de ruta propuesta, aquí tienes tu curso destacado.
        </Text>
      </Flex>

      <Flex
        p="8px 12px"
        w="100%"
        gap="15px"
        minH="76px"
        bg="gray_1"
        rounded="xl"
        align="center"
        boxShadow="0px -4px 20px 0px rgba(0, 0, 0, 0.1)"
        cursor={curso?.disponible ? 'pointer' : 'not-allowed'}
        opacity={curso?.meta?.isCompleted === 'completed' ? 0.6 : 1}
        onClick={curso?.disponible ? () => navigate(`/cursos/${curso?.id}`) : undefined}
      >
        <Image bg="#FFF" boxSize="60px" rounded="15px" src={`data:image/svg+xml;utf8,${curso?.icono}`} />

        <Flex w="100%" align="center" justify="space-between">
          <Flex width="100%" direction="column" align={{ base: 'start', md: 'unset' }}>
            <Text
              noOfLines={1}
              fontSize="16px"
              fontWeight="bold"
              textOverflow="ellipsis"
              data-cy={`roadmap_item_titulo_${curso?.id}`}
            >
              {curso?.titulo}
            </Text>

            {curso?.disponible ? (
              <Flex direction="column" mt="6px">
                <Text fontSize="14px" color="gray_4">
                  <strong>Nº módulos: </strong>
                  {curso?.modulos?.length}
                </Text>

                <Text fontSize="14px" color="gray_4">
                  <strong>Tutor: </strong>
                  {curso?.profesor?.fullName}
                </Text>
              </Flex>
            ) : (
              <Box>Disponible próximamente...</Box>
            )}
          </Flex>

          <Button
            bg="white"
            p="10px 15px"
            rounded="6px"
            minW="fit-content"
            isDisabled={!curso?.disponible}
            onClick={() => navigate(`/cursos/${curso?.id}`)}
          >
            Ir al curso
          </Button>
        </Flex>
      </Flex>
    </Flex>
  ) : (
    <></>
  );
};
