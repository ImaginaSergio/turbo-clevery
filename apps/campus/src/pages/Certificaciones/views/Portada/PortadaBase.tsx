import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { AiFillStar } from 'react-icons/ai';
import { toast, useMediaQuery } from '@chakra-ui/react';
import { Flex, Box, Icon, Button, Skeleton } from '@chakra-ui/react';
import { BiCheckboxChecked, BiDownload, BiRightArrowAlt, BiStar } from 'react-icons/bi';

import { IExamen, IFavorito, ICertificacion, generateDiploma, FavoritoTipoEnum } from 'data';
import { FavoritosContext, LoginContext, LayoutContext } from '../../../../shared/context';
import { Avatar, OpenParser } from 'ui';
import { fmtMnts, onFailure } from 'utils';

export const PortadaBase = ({ examen, certificacion }: { examen?: IExamen; certificacion?: ICertificacion }) => {
  const navigate = useNavigate();

  const { user } = useContext(LoginContext);
  const { isMobile } = useContext(LayoutContext);
  const { favoritos, addFavorito, removeFavorito, controladorFav } = useContext(FavoritosContext);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [certiFavorita, setCertiFavorita] = useState<IFavorito>();
  const [intentosRestantes, setIntentosRestantes] = useState<number>(0);

  const [smallDevice] = useMediaQuery('(max-height: 600px)');
  const [loadingDowload, setLoadingDowload] = useState<boolean>(false);

  useEffect(() => {
    certificacion && setIsLoading(true);
  }, [certificacion]);

  useEffect(() => {
    setIntentosRestantes(
      (examen?.numIntentos || 0) -
        (user?.certificaciones?.find((c: any) => c.id === examen?.certificacionId)?.meta?.pivot_intento || 0)
    );
  }, [certificacion, examen]);

  useEffect(() => {
    if (favoritos?.length >= 0 && certificacion?.id)
      setCertiFavorita(favoritos?.find((f) => f.tipo === FavoritoTipoEnum.CERTIFICACION && f.objetoId === certificacion?.id));
  }, [favoritos, certificacion?.id]);

  const onDowload = async () => {
    if (!certificacion?.id) {
      onFailure(toast, 'Error inesperado', 'El ID de la entidad es indefinido. Por favor, contacte con soporte.');

      return;
    }

    setLoadingDowload(true);

    await generateDiploma({ id: certificacion?.id })
      .then((url: string) => {
        var link: HTMLAnchorElement = document.createElement('a');

        link.target = '_blank';
        link.href = url;
        link.click();

        setLoadingDowload(false);
      })
      .catch(() => {
        onFailure(toast, 'Error inesperado', 'Error al descargar diploma. Por favor, contacte con soporte.');

        setLoadingDowload(false);
      });
  };

  return isLoading ? (
    <Flex
      w="100%"
      align="center"
      justify="center"
      direction="column"
      gap={{ base: '20px', sm: '60px' }}
      p={{ base: '30px 10px 70px', sm: '0px' }}
      pb={{ base: '100px', sm: 'unset' }}
    >
      <Flex direction="column" gap="45px" align="center">
        <Avatar size="125px" variant="marble" src={examen?.imagen?.url} name={examen?.nombre || 'Imagen del examen'} />

        <Flex direction="column" align="center" gap="18px">
          <Box fontSize="24px" lineHeight="29px" fontWeight="bold" data-cy="titulo_certi_portada_base">
            Certificación - {certificacion?.nombre}
          </Box>

          <Box
            fontSize="15px"
            lineHeight="22px"
            pl={{ base: '5px', sm: '0px' }}
            pr={{ base: '5px', sm: '0px' }}
            textAlign="center"
          >
            <OpenParser value={certificacion?.descripcion} />
          </Box>
        </Flex>
      </Flex>

      <Flex
        w={{ base: '100%', sm: 'unset' }}
        align="center"
        gap={{ base: '15px', sm: '32px' }}
        direction={{ base: 'column', sm: 'row' }}
      >
        <Flex
          w="100%"
          p="18px"
          bg="white"
          align="center"
          rounded="20px"
          columnGap="20px"
          border="1px solid var(--chakra-colors-gray_3)"
          data-cy="num_preguntas_container"
        >
          <Flex p="10px" boxSize="44px" rounded="10px" align="center" justify="center" bg="primary_light">
            <Icon as={BiCheckboxChecked} boxSize="24px" color="primary_dark" />
          </Flex>

          <Flex direction="column" rowGap="6px">
            <Box w="100%" color="gray_4" fontSize="14px" lineHeight="100%" fontWeight="medium" whiteSpace="nowrap">
              Número de preguntas
            </Box>

            <Box lineHeight="100%" fontWeight="bold" fontSize="19px" data-cy="num_preguntas_portada_base">
              {examen?.numPreguntas || 0}
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
          data-cy="tiempo_total_container"
        >
          <Flex p="10px" boxSize="44px" rounded="10px" bg="primary_light" align="center" justify="center">
            <Icon as={BiCheckboxChecked} boxSize="24px" color="primary_dark" />
          </Flex>

          <Flex direction="column" rowGap="6px">
            <Box w="100%" lineHeight="100%" fontWeight="medium" fontSize="14px" color="gray_4" whiteSpace="nowrap">
              Tiempo total
            </Box>

            <Box lineHeight="100%" fontWeight="bold" fontSize="19px" data-cy="tiempo_total_portada_base">
              {fmtMnts(examen?.duracion || 0)}
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
          data-cy="intentos_restantes_container"
        >
          <Flex p="10px" boxSize="44px" rounded="10px" align="center" justify="center" bg="primary_light">
            <Icon as={BiCheckboxChecked} boxSize="24px" color="primary_dark" />
          </Flex>

          <Flex direction="column" rowGap="6px">
            <Box w="100%" lineHeight="100%" fontWeight="medium" fontSize="14px" color="gray_4" whiteSpace="nowrap">
              Intentos restantes
            </Box>

            <Box lineHeight="100%" fontWeight="bold" fontSize="19px" data-cy="intentos_restantes_portada_base">
              {Math.max(intentosRestantes, 0)} / {examen?.numIntentos}
            </Box>
          </Flex>
        </Flex>
      </Flex>

      <Flex align="center" gap="15px" display={{ base: 'none', sm: 'flex' }}>
        <Button
          h="42px"
          w="100%"
          border="none"
          data-cy="fav_button_portada_base"
          rounded="10px"
          color={certiFavorita ? 'primary' : undefined}
          bg={certiFavorita ? 'primary_light' : 'gray_3'}
          onClick={
            certiFavorita
              ? () => {
                  if (certiFavorita) controladorFav(certiFavorita, false);
                }
              : () => {
                  if (certificacion?.id && user?.id)
                    controladorFav(
                      {
                        userId: user?.id,
                        objeto: certificacion,
                        objetoId: certificacion?.id,
                        tipo: FavoritoTipoEnum.CERTIFICACION,
                      },
                      true
                    );
                }
          }
          _hover={{ bg: 'gray_2' }}
          leftIcon={
            <Icon boxSize="21px" as={certiFavorita ? AiFillStar : BiStar} color={certiFavorita ? 'primary' : undefined} />
          }
        >
          <Box lineHeight="18px">{certiFavorita ? 'Favorito' : 'Añadir favorito'}</Box>
        </Button>

        <Button
          w="100%"
          px="20px"
          bg="black"
          color="white"
          isLoading={loadingDowload}
          loadingText="Generando diploma..."
          data-cy="empezar_button_portada_base"
          isDisabled={
            (certificacion?.meta?.isCompleted && process.env.NX_ORIGEN_CAMPUS === 'OPENMARKETERS') ||
            (intentosRestantes === 0 && !certificacion?.meta?.isCompleted)
          }
          _hover={{ bg: 'gray_2', color: '#bdbdbd' }}
          rightIcon={
            certificacion?.meta?.isCompleted ? (
              <Icon as={BiDownload} boxSize="24px" pr="5px" />
            ) : intentosRestantes > 0 ? (
              <Icon as={BiRightArrowAlt} boxSize="24px" pr="5px" />
            ) : undefined
          }
          onClick={
            certificacion?.meta?.isCompleted
              ? onDowload
              : () => navigate(`/certificaciones/${certificacion?.id}/examen/${examen?.id}`)
          }
        >
          {certificacion?.meta?.isCompleted
            ? 'Descargar diploma'
            : intentosRestantes <= 0
            ? 'Sin intentos restantes'
            : 'Empezar examen'}
        </Button>
      </Flex>
      <Flex
        display={{ base: 'flex', sm: 'none' }}
        w="100%"
        position="fixed"
        bottom={0}
        px="20px"
        py="19px"
        bg="white"
        h="89px"
        align="center"
        justify="center"
        boxShadow="0px -4px 20px 0px rgba(0, 0, 0, 0.1)"
      >
        <Button
          boxSize="100%"
          bg="black"
          color="white"
          _hover={{ opacity: 0.8 }}
          isLoading={loadingDowload}
          loadingText="Generando diploma..."
          data-cy="empezar_button_portada_base"
          isDisabled={
            (certificacion?.meta?.isCompleted && process.env.NX_ORIGEN_CAMPUS === 'OPENMARKETERS') ||
            (intentosRestantes === 0 && !certificacion?.meta?.isCompleted)
          }
          rightIcon={
            certificacion?.meta?.isCompleted ? (
              <Icon as={BiDownload} boxSize="24px" pr="5px" />
            ) : intentosRestantes > 0 ? (
              <Icon as={BiRightArrowAlt} boxSize="24px" pr="5px" />
            ) : undefined
          }
          onClick={
            certificacion?.meta?.isCompleted
              ? onDowload
              : () => navigate(`/certificaciones/${certificacion?.id}/examen/${examen?.id}`)
          }
        >
          {certificacion?.meta?.isCompleted
            ? 'Descargar diploma'
            : intentosRestantes <= 0
            ? 'Sin intentos restantes'
            : 'Empezar examen'}
        </Button>
      </Flex>
    </Flex>
  ) : (
    <Flex p="20px" w="100%" align="center" justify="center" direction="column" gap={{ base: '30px', sm: '60px' }}>
      <Skeleton boxSize="125px" rounded="xl" />
      <Flex direction="column" gap="15px" align="center">
        <Skeleton w="325px" h="29px" />
        <Skeleton w="150px" h="22px" />
      </Flex>

      <Flex columnGap="20px" direction={{ base: 'column', sm: 'row' }}>
        <Skeleton w="186px" h="82px" rounded="xl" mb={{ base: '10px', sm: '0px' }} />
        <Skeleton w="186px" h="82px" rounded="xl" mb={{ base: '10px', sm: '0px' }} />
        <Skeleton w="186px" h="82px" rounded="xl" mb={{ base: '10px', sm: '0px' }} />
      </Flex>

      <Flex columnGap="20px" direction={{ base: 'column', sm: 'row' }}>
        <Skeleton w="176px" h="42px" rounded="xl" mb={{ base: '10px', sm: '0px' }} />

        <Skeleton w="176px" h="42px" rounded="xl" />
      </Flex>
    </Flex>
  );
};
