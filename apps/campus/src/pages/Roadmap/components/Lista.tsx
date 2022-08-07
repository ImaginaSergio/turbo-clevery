import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { Box, Flex, Icon, Image, Center, Skeleton, CircularProgress } from '@chakra-ui/react';
import { BiLock, BiCheck, BiBook, BiBox } from 'react-icons/bi';

import { IRuta, ICurso, useCurso, RutaItinerario, IProyectoBoost, useProyectoBoost, RutaItinerarioTipoEnum } from 'data';
import { OpenParser } from 'ui';
import { fmtMnts } from 'utils';

import { LoginContext } from '../../../shared/context';

export const RutaLista = ({ ruta }: { ruta?: IRuta }) => {
  const { user } = useContext(LoginContext);

  const isFromBoost = user?.boosts?.find((b) => b.meta.pivot_activo === true) !== undefined;

  return (
    <Flex w="100%" h="auto" gap="12px" direction="column" data-cy="rutaLista" px={{ base: '10px', sm: '0px' }}>
      {ruta?.meta?.itinerario?.map((item: RutaItinerario) => (
        <RutaListaItem {...item} userId={user?.id} isFromBoost={isFromBoost} key={'ruta-item-' + item.id} />
      ))}
    </Flex>
  );
};

const RutaListaItem = (props: { id: number; userId?: number; isFromBoost?: boolean; tipo: RutaItinerarioTipoEnum }) => {
  const navigate = useNavigate();

  const { data, isLoading } =
    props.tipo === RutaItinerarioTipoEnum.CURSO
      ? useCurso({ id: props.id, userId: props.userId })
      : useProyectoBoost({ id: props.id });

  return (
    <Flex w="100%" gap="12px" align="center">
      {props.tipo === RutaItinerarioTipoEnum.CURSO && (
        <>
          <Skeleton boxSize="32px" rounded="50%" isLoaded={!isLoading}>
            <RutaItemList_CursoProgress curso={data} isFromBoost={props.isFromBoost} />
          </Skeleton>

          <Skeleton w="100%" rounded="20px" isLoaded={!isLoading}>
            <RutaItemList_Curso
              curso={data}
              isFromBoost={props.isFromBoost}
              onClick={() => navigate('/cursos/' + data?.id || '')}
            />
          </Skeleton>
        </>
      )}

      {props.tipo === RutaItinerarioTipoEnum.PROYECTO && (
        <>
          <Skeleton boxSize="32px" rounded="50%" isLoaded={!isLoading}>
            <RutaItemList_ProyectoProgress proyecto={data} />
          </Skeleton>

          <Skeleton w="100%" rounded="20px" isLoaded={!isLoading}>
            <RutaItemList_Proyecto
              proyecto={data}
              isFromBoost={props.isFromBoost}
              onClick={() => navigate('/proyectos/' + data?.id || '')}
            />
          </Skeleton>
        </>
      )}
    </Flex>
  );
};

const RutaItemList_Curso = ({
  curso,
  isFromBoost,
  onClick = () => {},
}: {
  curso: ICurso;
  isFromBoost?: boolean;
  onClick: () => any | void;
}) => {
  return (
    <Flex
      data-cy={`${curso?.titulo}_curso_item`}
      w="100%"
      bg="white"
      rounded="20px"
      border="1px solid"
      borderColor="gray_3"
      transition="all 0.3s ease"
      _hover={{ opacity: '0.7' }}
      cursor={curso?.meta?.isBlocked ? 'not-allowed' : 'pointer'}
      onClick={curso?.meta?.isBlocked ? undefined : onClick}
    >
      <Flex direction="column" w="100%" gap="20px" p="20px">
        {isFromBoost && (
          <Flex w="100%" gap="18px" align="center">
            <Flex gap="6px" p="3px 8px" bg="#6350B0" color="white" rounded="5px" align="center" backdropFilter="blur(24px)">
              <Icon boxSize="14px" as={BiBook} />

              <Box fontSize="13px" lineHeight="16px" fontWeight="bold" textTransform="uppercase">
                CURSO
              </Box>
            </Flex>

            <Box fontSize="14px" lineHeight="17px" color="gray_4">
              {curso?.modulos?.length} módulos | {fmtMnts(curso?.meta?.duracionTotal)}
            </Box>
          </Flex>
        )}

        <Flex direction="column" gap="10px" w="100%">
          <Box fontSize="18px" lineHeight="22px" fontWeight="bold">
            {curso?.titulo}
          </Box>

          {!isFromBoost && (
            <Box fontSize="14px" lineHeight="17px" color="gray_4">
              {curso?.modulos?.length} módulos | {fmtMnts(curso?.meta?.duracionTotal)}
            </Box>
          )}

          <OpenParser value={curso?.descripcion} maxChars={200} />
        </Flex>
      </Flex>

      {curso?.imagen?.url && (
        <Image
          h="auto"
          w="152px"
          minW="152px"
          display={{ base: 'none', md: 'flex' }}
          fit="cover"
          roundedRight="20px"
          src={curso?.imagen?.url}
        />
      )}
    </Flex>
  );
};

const RutaItemList_Proyecto = ({
  proyecto,
  isFromBoost,
  onClick = () => {},
}: {
  proyecto: IProyectoBoost;
  isFromBoost?: boolean;
  onClick: () => any | void;
}) => {
  return (
    <Flex
      data-cy={`${proyecto?.titulo}_proyecto_item`}
      w="100%"
      bg="white"
      rounded="20px"
      border="1px solid"
      borderColor="gray_3"
      transition="all 0.3s ease"
      _hover={{ opacity: '0.7' }}
      cursor={proyecto?.meta?.isBlocked ? 'not-allowed' : 'pointer'}
      onClick={proyecto?.meta?.isBlocked ? undefined : onClick}
    >
      <Flex direction="column" w="100%" gap="20px" p="20px">
        {isFromBoost && (
          <Flex w="100%" gap="18px" align="center">
            <Flex gap="6px" p="3px 8px" bg="#6350B0" color="white" rounded="5px" align="center" backdropFilter="blur(24px)">
              <Icon boxSize="14px" as={BiBox} />

              <Box fontSize="13px" lineHeight="16px" fontWeight="bold" textTransform="uppercase">
                PROYECTO
              </Box>
            </Flex>

            <Box fontSize="14px" lineHeight="17px" color="gray_4">
              {proyecto?.tiempoLimite}h de tiempo límite | {fmtMnts(proyecto?.duracionLectura)} de duración de lectura
            </Box>
          </Flex>
        )}

        <Flex direction="column" gap="10px" w="100%">
          <Box fontSize="18px" lineHeight="22px" fontWeight="bold">
            {proyecto?.titulo}
          </Box>

          {!isFromBoost && (
            <Box fontSize="14px" lineHeight="17px" color="gray_4">
              {proyecto?.tiempoLimite}h de tiempo límite | {fmtMnts(proyecto?.duracionLectura)} de duración de lectura
            </Box>
          )}

          <OpenParser value={proyecto?.descripcionCorta} maxChars={200} />
        </Flex>
      </Flex>

      {proyecto?.icono && (
        <Image
          h="auto"
          w="152px"
          minW="152px"
          fit="cover"
          roundedRight="20px"
          display={{ base: 'none', md: 'flex' }}
          src={`data:image/svg+xml;utf8,${proyecto?.icono}`}
        />
      )}
    </Flex>
  );
};

const RutaItemList_CursoProgress = ({ curso, isFromBoost }: { curso?: ICurso; isFromBoost?: boolean }) => {
  return (
    <Center
      minW="32px"
      rounded="50%"
      boxSize="32px"
      bg={curso?.meta?.isCompleted ? 'primary' : curso?.meta?.isBlocked ? 'transparent' : 'gray_2'}
    >
      {curso?.meta?.isBlocked && <Icon as={BiLock} color="gray_4" boxSize="24px" bg="gray_1" />}

      {curso?.meta?.isCompleted && <Icon as={BiCheck} color="white" boxSize="24px" />}

      {!curso?.meta?.isBlocked &&
        !curso?.meta?.isCompleted &&
        (curso?.meta?.progreso_count === 0 ? null : (
          <CircularProgress
            size="32px"
            bg="gray_1"
            rounded="100%"
            thickness="12px"
            value={curso?.meta?.progreso_count}
            color={isFromBoost ? '#6350B0' : 'primary'}
          />
        ))}
    </Center>
  );
};

const RutaItemList_ProyectoProgress = ({ proyecto }: { proyecto?: IProyectoBoost }) => {
  return (
    <Center
      minW="32px"
      rounded="50%"
      boxSize="32px"
      bg={proyecto?.meta?.isCompleted ? 'primary' : proyecto?.meta?.isBlocked ? 'transparent' : 'gray_2'}
    >
      {proyecto?.meta?.isBlocked && <Icon as={BiLock} color="gray_4" boxSize="24px" bg="gray_1" />}

      {proyecto?.meta?.isCompleted && <Icon as={BiCheck} color="white" boxSize="24px" />}
    </Center>
  );
};
