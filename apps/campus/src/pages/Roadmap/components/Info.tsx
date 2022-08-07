import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { Box, Flex, Icon, Image, Center, Button, Skeleton, useDisclosure } from '@chakra-ui/react';
import { MdKeyboardArrowDown } from 'react-icons/md';

import Kpis from './Kpis';
import { OpenParser } from 'ui';
import { IRuta, useBoost, useRutas } from 'data';
import { LoginContext } from '../../../shared/context';
import { ModalRoadmap } from '../../../shared/components';

const RutaBG = '../../../assets/roadmap/RutaBG.png';
const BoostBG = '../../../assets/roadmap/BoostBG.png';

export const RutaInfo = ({ ruta }: { ruta: IRuta }) => {
  const { user } = useContext(LoginContext);

  const userBoost = user?.boosts?.find((b) => b.meta.pivot_activo === true);

  return userBoost !== undefined ? <RutaInfoBoost boostId={userBoost?.id} /> : <RutaInfoPublic ruta={ruta} />;
};

const RutaInfoBoost = ({ boostId }: { boostId?: number }) => {
  const navigate = useNavigate();

  const { boost } = useBoost({
    id: boostId || -1,
    strategy: 'invalidate-on-undefined',
  });

  return (
    <Flex
      data-cy="rutaInfo"
      top="110"
      h="fit-content"
      maxH="fit-content"
      direction="column"
      minW={{ base: '100%', lg: '530px' }}
      maxW={{ base: '100%', lg: '530px' }}
      position={{ base: 'static', lg: 'fixed' }}
    >
      <Flex p="32px" gap="32px" bg="#21173B" roundedTop="20px" direction="column">
        <Flex w="100%" align="center" gap="24px">
          <Skeleton rounded="20px" isLoaded={!!boost?.icono}>
            <Image minW="64px" boxSize="64px" src={`data:image/svg+xml;utf8,${boost?.icono}`} />
          </Skeleton>

          <Box w="100%">
            <Flex mb="5px" gap="10px" w="100%">
              <Skeleton minW="220px" isLoaded={!!boost?.titulo}>
                <Box color="#FFF" fontSize="24px" fontWeight="bold" lineHeight="29px">
                  {boost?.titulo}
                </Box>
              </Skeleton>

              <Box bg="#FFF" p="0px 10px" rounded="5px" fontSize="18px" h="fit-content" color="#040F36" fontWeight="bold">
                BOOST
              </Box>
            </Flex>

            <Skeleton minW="80px" isLoaded={!!boost?.empresa?.nombre}>
              <Box fontSize="18px" lineHeight="22px" color="#FFF">
                {boost?.empresa?.nombre}
              </Box>
            </Skeleton>
          </Box>
        </Flex>

        <OpenParser value={boost?.descripcion} style={{ color: '#FFF' }} />

        <Button
          h="auto"
          p="10px 16px"
          color="#FFF"
          rounded="10px"
          fontSize="16px"
          bg="transparent"
          fontWeight="bold"
          lineHeight="22px"
          border="1px solid #FFF"
          onClick={() => navigate(`/boosts/${boost?.id}`)}
        >
          Ver ficha del Boost
        </Button>
      </Flex>

      <Flex p="32px" bgPos="center" bgImage={BoostBG} direction="column" roundedBottom="20px">
        <Flex direction="column" gap="32px" color="white">
          <Kpis tipo="progresoBoost" />

          <Kpis boost={boost} tipo="inscritos" />
        </Flex>
      </Flex>
    </Flex>
  );
};

const RutaInfoPublic = ({ ruta }: { ruta: IRuta }) => {
  const roadmapState = useDisclosure();

  const { data: rutas } = useRutas({
    query: [{ privada: false }, { limit: 1000 }],
  });

  return (
    <>
      <Flex
        data-cy="rutaInfo"
        top="110"
        h="fit-content"
        maxH="fit-content"
        direction="column"
        minW={{ base: '100%', lg: '530px' }}
        maxW={{ base: '100%', lg: '530px' }}
        position={{ base: 'static', lg: 'fixed' }}
      >
        <Box p="32px" bg="white" roundedTop={{ base: 'unset', sm: '20px' }}>
          <Flex w="100%" align="center" gap="24px" mb="32px">
            <Image minW="64px" boxSize="64px" src={`data:image/svg+xml;utf8,${ruta?.icono}`} />

            <Box w="100%">
              <Box
                data-cy="rutaTitulo"
                mb="5px"
                noOfLines={1}
                fontWeight="bold"
                lineHeight="29px"
                fontSize={{ base: '20px', md: '24px' }}
              >
                {ruta?.nombre}
              </Box>

              <Box fontSize="14px" lineHeight="17px">
                {ruta?.meta?.itinerario?.length || 0} cursos
              </Box>
            </Box>

            <Center
              w="100%"
              bg="gray_3"
              minW="42px"
              boxSize="42px"
              rounded="100%"
              transition="all 0.7s ease"
              _hover={{ opacity: 0.7 }}
              onClick={process.env.REACT_APP_EDIT_ROADMAP === 'FALSE' ? undefined : roadmapState.onOpen}
              cursor={process.env.REACT_APP_EDIT_ROADMAP === 'FALSE' ? 'unset' : 'pointer'}
            >
              <Icon boxSize="32px" color="gray_5" as={MdKeyboardArrowDown} />
            </Center>
          </Flex>

          <OpenParser value={ruta?.descripcion} />
        </Box>

        <Flex
          p="32px"
          gap="32px"
          bgSize="cover"
          bgPos="center"
          bgImage={RutaBG}
          direction="column"
          bgRepeat="no-repeat"
          roundedBottom={{ base: 'unset', sm: '20px' }}
        >
          <Kpis tipo="progresoRuta" />

          <Kpis tipo="ruta" />

          <Kpis tipo="tiempo" />
        </Flex>
      </Flex>

      <ModalRoadmap rutas={rutas?.data} state={roadmapState} />
    </>
  );
};
