import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { BiPen, BiCheck, BiBriefcase, BiChevronRight, BiSquareRounded } from 'react-icons/bi';
import { Box, Button, Flex, Icon, Image, Progress, Skeleton, useDisclosure } from '@chakra-ui/react';

import { IBoost, ICertificacion, useCertificaciones } from 'data';

import { LoginContext } from '../../../../shared/context';
import { InscribirseModal } from './InscribirseModal';

export const Requisitos = ({ boost, isLoading }: { boost: IBoost; isLoading: boolean }) => {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { user } = useContext(LoginContext);

  const { certificaciones, isLoading: isLoadingCertificaciones } = useCertificaciones({
    query: [{ lista: boost?.certificacionesRequeridas?.map((c) => c.id) }],
    certificacionesIniciadas: user?.progresoGlobal?.meta?.certificacionesIniciadas,
    certificacionesCompletadas: user?.progresoGlobal?.meta?.certificacionesCompletadas,
  });

  const certisCompleted = certificaciones?.reduce((acc: number, c: ICertificacion) => {
    if (c.meta?.isCompleted) return acc + 1;
    else return acc;
  }, 0);

  return (
    <>
      <Flex
        p={{ base: '24px 0px', sm: '24px' }}
        gap="16px"
        bg="white"
        w="100%"
        rounded={{ base: '0px', sm: '20px' }}
        direction="column"
        border={{ base: 'none', sm: '1px solid var(--chakra-colors-gray_3)' }}
        borderColor="gray_3"
      >
        <Flex w="100%" direction="column" gap="8px" px={{ base: '24px', sm: '0px' }}>
          <Flex gap="10px">
            <Skeleton w="100%" isLoaded={!isLoading && !isLoadingCertificaciones}>
              <Box w="100%" fontSize="18px" lineHeight="22px" fontWeight="bold">
                {certisCompleted}/{certificaciones?.length} requisitos
              </Box>
            </Skeleton>

            <Icon as={BiBriefcase} boxSize="20px" color="gray_5" />
          </Flex>

          <Progress
            h="8px"
            w="100%"
            value={100}
            rounded="22px"
            sx={{
              '& > div': {
                background: `linear-gradient(90deg, var(--chakra-colors-primary) 0%, var(--chakra-colors-primary) ${
                  (certisCompleted / certificaciones?.length) * 100
                }%, var(--chakra-colors-gray_3) ${
                  (certisCompleted / certificaciones?.length) * 100
                }%, var(--chakra-colors-gray_3) 100%)`,
              },
            }}
          />
        </Flex>

        <Flex
          data-cy="requisitos_boost"
          w="100%"
          p="14px"
          gap="14px"
          bg="gray_1"
          direction="column"
          rounded={{ base: '0px', sm: '8px' }}
        >
          {isLoading || isLoadingCertificaciones
            ? [1, 2, 3, 4]?.map((index: number) => (
                <Skeleton key={'requisito_skeleton-' + index} w="100%" h="50px" rounded="20px" />
              ))
            : certificaciones?.map((c: ICertificacion, index: number) => (
                <RequisitosItem
                  key={'requisito-' + index}
                  title={c.nombre}
                  image={c.imagen?.url}
                  isCompleted={c?.meta?.isCompleted}
                  onClick={() => navigate(`/certificaciones/${c.id}`)}
                />
              ))}
        </Flex>

        <Skeleton boxSize="100%" rounded="14px" isLoaded={!isLoading && !isLoadingCertificaciones}>
          <Button
            h="auto"
            w="100%"
            p="15px"
            bg="black"
            color="white"
            rounded="14px"
            onClick={onOpen}
            leftIcon={<BiPen />}
            mx={{ base: '24px', sm: '0px' }}
            _hover={{ bg: 'gray_3', color: 'black' }}
            isDisabled={certisCompleted !== certificaciones?.length}
          >
            Inscribirse al Boost
          </Button>
        </Skeleton>
      </Flex>

      <InscribirseModal boost={boost} state={{ isOpen, onClose }} />
    </>
  );
};

type RequisitosItemProps = {
  title: string;
  image?: string;
  isCompleted?: boolean;
  onClick: () => void;
};

const RequisitosItem = (props: RequisitosItemProps) => {
  return (
    <Flex w="100%" gap="14px" align="center">
      {props.isCompleted ? (
        <Icon as={BiCheck} color="primary" boxSize="32px" />
      ) : (
        <Icon as={BiSquareRounded} color="gray_3" boxSize="32px" />
      )}

      <Flex
        w="100%"
        gap="18px"
        align="center"
        overflow="hidden"
        rounded="67px"
        border="1px solid"
        borderColor="gray_3"
        opacity={props.isCompleted ? 0.4 : 1}
        bg="white"
      >
        <Image fit="cover" minW="46px" rounded="50%" boxSize="46px" src={props.image} />

        <Box w="100%" fontSize="16px" noOfLines={1} lineHeight="20px" fontWeight="semibold" textOverflow="ellipsis">
          {props.title}
        </Box>

        <Icon as={BiChevronRight} color="gray_4" boxSize="32px" cursor="pointer" onClick={props.onClick} />
      </Flex>
    </Flex>
  );
};
