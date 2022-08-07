import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Flex, Box, Text, Icon, Image, Button, Progress, Skeleton } from '@chakra-ui/react';
import stc from 'string-to-color';
import { FaRegEyeSlash } from 'react-icons/fa';
import { BiAward, BiListOl, BiPlay, BiTimeFive } from 'react-icons/bi';

import { fmtMnts } from 'utils';
import { ICurso, ILeccion } from 'data';
import { ThumbnailLeccion, ThumbnailSizeEnum } from 'ui';

export const CardCurso = ({
  curso,
  style,
  isLoading = false,
  isPublished = true,
  showProgress = true,
}: {
  curso: ICurso;
  style?: React.CSSProperties;
  isLoading?: boolean;
  isPublished?: boolean;
  showProgress?: boolean;
}) => {
  return !isLoading ? (
    isPublished ? (
      <Flex
        data-cy={`curso_recomendado_${curso?.id}`}
        minH="100%"
        boxSize="100%"
        overflow="hidden"
        direction="column"
        justify="space-between"
        style={style}
      >
        <Flex w="100%" direction="column" overflow="hidden">
          <Flex position="relative" h="140px" w="100%">
            <Image
              fit="cover"
              boxSize="100%"
              roundedTop="12px"
              src={curso?.imagen?.url}
              bgColor={stc(curso?.titulo || 'Lorem Ipsum')}
            />

            <Flex p="15px" boxSize="100%" align="flex-start" position="absolute" justify="space-between">
              <Box
                bg="black"
                p="5px 8px"
                color="white"
                rounded="full"
                fontWeight="bold"
                textTransform="capitalize"
                backdropFilter="blur(24px)"
              >
                {curso?.nivel}
              </Box>

              {curso?.meta?.isCompleted && (
                <Flex
                  boxSize="42px"
                  rounded="50%"
                  align="center"
                  justify="center"
                  bg="primary_graded"
                  filter="drop-shadow(0px 4px 20px primary_dark)"
                >
                  <Icon as={BiAward} boxSize="32px" color="#fff" />
                </Flex>
              )}
            </Flex>
          </Flex>

          <Flex p="20px 24px" w="100%" direction="column" gap="8px" overflow="hidden">
            <Box
              whiteSpace="nowrap"
              overflow="hidden"
              textOverflow="ellipsis"
              lineHeight="19px"
              fontWeight="bold"
              fontSize="16px"
              title={curso?.titulo}
            >
              {curso?.titulo}
            </Box>

            <Flex align="center" gap="12px">
              <Flex align="center" gap="5px">
                <Icon as={BiListOl} boxSize="20px" color="#8B8FA2" />

                <Box whiteSpace="nowrap" fontSize="14px" fontWeight="semibold" lineHeight="16px" color="gray_4">
                  {curso?.modulos?.length || 0} módulos
                </Box>
              </Flex>

              <Flex align="center" gap="5px">
                <Icon as={BiTimeFive} boxSize="20px" color="#8B8FA2" />

                <Box whiteSpace="nowrap" fontSize="14px" fontWeight="semibold" lineHeight="16px" color="gray_4">
                  {fmtMnts(curso?.meta?.duracionTotal, false)}
                </Box>
              </Flex>

              {!curso?.publicado && (
                <Flex align="center" gap="5px">
                  <Icon as={FaRegEyeSlash} boxSize="20px" color="cancel" />

                  <Box whiteSpace="nowrap" fontSize="14px" fontWeight="semibold" lineHeight="16px" color="cancel">
                    No publicado
                  </Box>
                </Flex>
              )}
            </Flex>
          </Flex>

          {showProgress && (
            <Flex overflow="hidden" roundedBottom="full" justify="center" align="center" w="100%">
              <Box h="4px" w="100%" bg="gray_2">
                {' '}
                <Box
                  h="4px"
                  minW={curso?.meta?.progreso_count + '%'}
                  bg={
                    !curso?.meta?.progreso_count
                      ? 'white'
                      : `linear-gradient(90deg, var(--chakra-colors-primary) 0%, var(--chakra-colors-primary_dark) ${
                          curso?.meta?.progreso_count + '%'
                        }, var(--chakra-colors-gray_2) ${curso?.meta?.progreso_count + '%'}, var(--chakra-colors-gray_2) 100%)`
                  }
                ></Box>
              </Box>
              {/* //! TODO: Investigar porqué el progress de chakra se sale del container
              <Progress
                maxW="full"
                rounded="full"
                w="full"
                h="4px"
                value={100}
                zIndex="1"
                sx={{
                  '& > div': {
                    background: !curso?.meta?.progreso_count
                      ? 'white'
                      : `linear-gradient(90deg, var(--chakra-colors-primary) 0%, var(--chakra-colors-primary_dark) ${
                          curso?.meta?.progreso_count + '%'
                        }, var(--chakra-colors-gray_2) ${
                          curso?.meta?.progreso_count + '%'
                        }, var(--chakra-colors-gray_2) 100%)`,
                  },
                }}
              /> */}
            </Flex>
          )}
        </Flex>
      </Flex>
    ) : (
      <Flex
        w="100%"
        direction="column"
        justify="space-between"
        overflow="hidden"
        minH="100%"
        style={{ filter: 'grayscale(100%)', mixBlendMode: 'luminosity' }}
        opacity="0.6"
        cursor="default"
      >
        <Flex w="100%" direction="column" overflow="hidden">
          <Flex position="relative" h="140px" w="100%">
            <Image
              fit="cover"
              boxSize="100%"
              roundedTop="12px"
              src={curso?.imagen?.url}
              bgColor={stc(curso?.titulo || 'Lorem Ipsum')}
            />

            <Flex p="15px" boxSize="100%" position="absolute" justify="space-between" align="flex-start">
              <Box
                color="white"
                fontWeight="bold"
                rounded="full"
                p="5px 8px"
                bg="black"
                backdropFilter="blur(24px)"
                textTransform="capitalize"
              >
                {curso?.nivel}
              </Box>

              {curso?.meta?.isCompleted && (
                <Flex
                  boxSize="42px"
                  rounded="50%"
                  align="center"
                  justify="center"
                  filter="drop-shadow(0px 4px 20px primary_light"
                  bg="linear-gradient(227.34deg, var(--chakra-colors-primary) -4.81%, var(--chakra-colors-primary_dark) 97.15%)"
                >
                  <Icon as={BiAward} boxSize="32px" color="#fff" />
                </Flex>
              )}
            </Flex>
          </Flex>

          <Flex p="20px 24px" w="100%" direction="column" gap="6px" overflow="hidden">
            <Box
              whiteSpace="nowrap"
              overflow="hidden"
              textOverflow="ellipsis"
              lineHeight="19px"
              fontWeight="bold"
              fontSize="16px"
              title={curso?.titulo}
            >
              {curso?.titulo}
            </Box>

            <Flex align="center" gap="12px">
              <Flex align="center" gap="5px">
                <Icon as={BiTimeFive} boxSize="20px" color="#8B8FA2" />

                <Text as="i" variant="card_description" whiteSpace="nowrap" fontWeight="semibold" color="gray_4">
                  Disponible próximamente...
                </Text>
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    )
  ) : (
    <Flex direction="column" w="100%">
      <Skeleton h="140px" w="100%" />

      <Flex direction="column" w="100%" p="24px">
        <Skeleton h="22px" w="100%" mb="8px" />

        <Flex w="100%" justify="space-between">
          <Skeleton h="22px" w="48%" />
          <Skeleton h="22px" w="48%" />
        </Flex>
      </Flex>
    </Flex>
  );
};

export const CardCursoActivo = ({
  curso,
  leccion,
  style = {},
  isLoading = false,
  isFirstCurso = false,
}: {
  curso?: ICurso;
  leccion?: ILeccion;
  isLoading?: boolean;
  isFirstCurso?: boolean;
  style?: React.CSSProperties;
}) => {
  const navigate = useNavigate();

  const [duracionLeccion, setDuracionLeccion] = useState<string>();

  useEffect(() => {
    let duracion1 = leccion?.duracion;
    let duracion2 = ((curso?.modulos || [])[0]?.lecciones || [])[0]?.duracion;

    setDuracionLeccion(fmtMnts(duracion1 || duracion2 || 0, false));
  }, [leccion?.duracion, curso?.id]);

  return !isLoading ? (
    <Flex
      data-cy="home_curso-inicial"
      w="100%"
      align="center"
      overflow="hidden"
      rounded={{ base: 'none', sm: '2xl' }}
      direction={{ base: 'column', sm: 'row' }}
      style={style}
    >
      <Flex
        minW="250px"
        boxSize="100%"
        align="center"
        justify="center"
        overflow="hidden"
        position="relative"
        maxW={{ base: '100%', sm: '250px' }}
        minH={{ base: '250px', sm: 'unset' }}
        borderStartRadius={{ base: 'none', sm: '2xl' }}
      >
        <Icon
          as={BiPlay}
          zIndex="15"
          color="#fff"
          boxSize="46px"
          rounded="full"
          position="absolute"
          p="2px 0px 2px 4px"
          bg="rgba(0, 0, 0, 0.6)"
          transition="all 0.5s ease"
          border="1px solid rgba(255, 255, 255, 0.15)"
          _hover={{ bgColor: 'primary_neon' }}
          onClick={() => (leccion ? navigate(`/cursos/${curso?.id}/leccion/${leccion.id}`) : navigate(`/cursos/${curso?.id}`))}
        />

        <ThumbnailLeccion
          curso={curso}
          leccion={leccion}
          leccionNumber={leccion?.orden}
          moduloNumber={leccion?.modulo?.orden}
          size={{ base: ThumbnailSizeEnum.MINI, md: ThumbnailSizeEnum.MINI }}
        />
      </Flex>

      <Flex w="100%" direction="column" justify="space-between">
        <Flex direction="column" gap="10px" p="19px">
          <Box
            data-cy="home_curso_activo_titulo"
            color="gray_4"
            fontSize="12px"
            lineHeight="14px"
            fontWeight="bold"
            textTransform="uppercase"
          >
            {curso?.titulo}
          </Box>

          <Box
            data-cy="home_curso_activo_descripcion"
            fontSize="16px"
            lineHeight="19px"
            fontWeight="bold"
            overflow="hidden"
            whiteSpace="nowrap"
            textOverflow="ellipsis"
          >
            {isFirstCurso
              ? curso?.modulos
                ? curso?.modulos[0]?.titulo
                : curso?.titulo
              : leccion
              ? leccion?.modulo?.titulo
              : curso?.titulo}
          </Box>
        </Flex>

        <Flex
          w="100%"
          p="19px"
          gap="13px"
          justify="space-between"
          align={{ base: 'start', sm: 'center' }}
          direction={{ base: 'column', sm: 'row' }}
        >
          <Flex align="end" gap="10px">
            <Box
              color="gray_4"
              fontSize="16px"
              lineHeight="16px"
              whiteSpace="nowrap"
              fontWeight="semibold"
              textTransform="capitalize"
            >
              {isFirstCurso
                ? curso?.modulos
                  ? curso?.modulos[0]?.lecciones
                    ? curso?.modulos[0]?.lecciones[0]?.tipo
                    : 'Vídeo'
                  : curso?.titulo
                : leccion?.tipo}
            </Box>

            {duracionLeccion !== '-' && (
              <>
                <Box color="gray_4" fontSize="16px" lineHeight="16px" fontWeight="semibold">
                  ·
                </Box>

                <Flex
                  gap="6px"
                  color="gray_4"
                  align="center"
                  fontSize="16px"
                  lineHeight="16px"
                  whiteSpace="nowrap"
                  fontWeight="semibold"
                >
                  <Icon as={BiTimeFive} boxSize="20px" color="gray_4" />

                  <Box data-cy="home_curso_activo_minutos">{duracionLeccion}</Box>
                </Flex>
              </>
            )}
          </Flex>

          <Button
            data-cy="home_curso_activo_button"
            bg="black"
            p="10px 15px"
            fontSize="13px"
            w={{ base: '100%', sm: 'auto' }}
            rightIcon={<Icon as={BiPlay} color="white" />}
            onClick={() =>
              leccion ? navigate(`/cursos/${curso?.id}/leccion/${leccion?.id}`) : navigate(`/cursos/${curso?.id}`)
            }
            _hover={{ opacity: '0.8' }}
          >
            <Box color="white">Continuar lección</Box>
          </Button>
        </Flex>

        {!isFirstCurso && (
          <Progress
            h="4px"
            w="100%"
            value={100}
            sx={{
              '& > div': {
                background: !curso?.meta?.progreso_count
                  ? 'white'
                  : `linear-gradient(90deg, var(--chakra-colors-primary) 0%, var(--chakra-colors-primary_dark) ${
                      curso?.meta?.progreso_count + '%'
                    }, var(--chakra-colors-gray_3) ${curso?.meta?.progreso_count + '%'}, var(--chakra-colors-gray_3) 100%)`,
              },
            }}
          />
        )}
      </Flex>
    </Flex>
  ) : (
    <Flex direction="column" w="100%">
      <Skeleton h="140px" w="100%" />

      <Flex direction="column" w="100%" p="24px">
        <Skeleton h="22px" w="100%" mb="8px" />

        <Flex w="100%" justify="space-between">
          <Skeleton h="22px" w="48%" />
          <Skeleton h="22px" w="48%" />
        </Flex>
      </Flex>
    </Flex>
  );
};
