import { useContext, useEffect, useState } from 'react';

import { Box, Center, Flex, Icon, Image, Skeleton } from '@chakra-ui/react';
import { BiCheck, BiFolder, BiGlasses, BiLock, BiBook } from 'react-icons/bi';

import { IBoost, ICurso, useCursos, RutaItinerarioTipoEnum } from 'data';
import { OpenParser } from 'ui';
import { fmtMnts } from 'utils';

import { LoginContext } from '../../../../shared/context';

export const Ruta = ({ boost, isLoading }: { boost: IBoost; isLoading: boolean }) => {
  const { user } = useContext(LoginContext);

  const [cursosQuery, setCursosQuery] = useState<any[]>([]);

  const { cursos, isLoading: isLoadingCursos } = useCursos({
    userId: user?.id,
    strategy: 'invalidate-on-undefined',
    query: cursosQuery,
  });

  useEffect(() => {
    if ((boost?.ruta?.meta?.itinerario?.length || 0) > 0)
      setCursosQuery([
        {
          ruta: boost?.ruta?.meta?.itinerario
            ?.filter((i: any) => i.tipo === RutaItinerarioTipoEnum.CURSO && !isNaN(i.id))
            ?.map((i) => i.id),
        },
      ]);
    else {
      setCursosQuery([]);
    }
  }, [boost?.id]);

  return (
    <Flex
      w="100%"
      h="fit-content"
      p={{ base: '20px', sm: '32px' }}
      gap="16px"
      bg="white"
      rounded={{ base: '0px', sm: '20px' }}
      direction="column"
      border={{ base: 'none', sm: '1px solid var(--chakra-colors-gray_3)' }}
      borderColor="gray_3"
    >
      <Box fontSize="18px" lineHeight="22px" fontWeight="bold">
        Hoja de ruta
      </Box>

      <Flex gap="7px" rounded="12px" direction="column" p="7px 7px 7px 15px" data-cy="roadmap_boost">
        {isLoadingCursos ? (
          [1, 2, 3, 4, 5].map((index: number) => (
            <Skeleton w="100%" minH="180px" rounded="8px" key={`ruta-curso_skeleton-${index}`} />
          ))
        ) : cursosQuery?.length > 0 ? (
          cursos?.map((c: ICurso, index: number) => (
            <RutaItem
              key={`ruta-curso-${index}`}
              type={RutaItinerarioTipoEnum.CURSO}
              icon={c.icono}
              title={c.titulo}
              description={c.descripcion}
              isBlocked={c.meta?.isBlocked}
              isCompleted={c.meta?.isCompleted}
              info={fmtMnts(c?.meta?.duracionTotal)}
            />
          ))
        ) : (
          <Box color="gray_4" fontSize="16px" fontWeight="bold" lineHeight="100%">
            Aún estamos preparando el contenido de esta ruta. ¡Vuelve pronto!
          </Box>
        )}
      </Flex>
    </Flex>
  );
};

type RutaItemProps = {
  icon?: string;
  info: string;
  title: string;
  description: string;
  type: RutaItinerarioTipoEnum;
  isBlocked?: boolean;
  isCompleted?: boolean;
};

const RutaItem = (props: RutaItemProps) => (
  <Flex w="100%" gap="12px" align="center">
    <Center
      minW="24px"
      rounded="50%"
      boxSize="24px"
      border="2px solid"
      bg={props.isCompleted ? '#6350B0' : 'gray_2'}
      borderColor={props.isCompleted ? '#6350B0' : 'white'}
    >
      {props.isBlocked && <Icon as={BiLock} color="gray_4" boxSize="14px" />}

      {props.isCompleted && <Icon as={BiCheck} color="white" boxSize="14px" />}
    </Center>

    <Flex p="20px" w="100%" gap="20px" bg="white" rounded="8px" direction="column" border="1px solid" borderColor="gray_3">
      <Flex w="100%" gap="18px" align="center">
        <Flex gap="6px" p="3px 8px" bg="#6350B0" color="white" rounded="5px" align="center" backdropFilter="blur(24px)">
          <Icon
            boxSize="14px"
            as={
              props.type === RutaItinerarioTipoEnum.CURSO
                ? BiBook
                : props.type === RutaItinerarioTipoEnum.ENTREVISTA
                ? BiGlasses
                : BiFolder
            }
          />

          <Box fontSize="13px" lineHeight="16px" fontWeight="bold" textTransform="uppercase">
            {props.type}
          </Box>
        </Flex>

        <Box fontSize="14px" lineHeight="17px" color="gray_4">
          {props.info}
        </Box>
      </Flex>

      <Flex gap="20px">
        <Flex w="100%" gap="10px" align="start" justify="space-between">
          <Flex direction="column">
            <Box fontSize="18px" lineHeight="22px" fontWeight="bold">
              {props.title}
            </Box>

            <Flex display={{ base: 'flex', sm: 'none' }}>
              <OpenParser value={props.description} maxChars={50} />
            </Flex>

            <Flex display={{ base: 'none', sm: 'flex' }}>
              <OpenParser value={props.description} maxChars={200} />
            </Flex>
          </Flex>

          {props.icon && <Image minW="60px" boxSize="60px" src={`data:image/svg+xml;utf8,${props.icon}`} />}
        </Flex>
      </Flex>
    </Flex>
  </Flex>
);
