import { useNavigate } from 'react-router-dom';

import { Flex, Box, Image, Button, Progress, Skeleton, Icon } from '@chakra-ui/react';

import { IBoost } from 'data';
import { OpenParser } from 'ui';

import BoostBG from '../../../../assets/roadmap/BoostBG.png';
import { BiPlay } from 'react-icons/bi';

export const Header = ({ boost, progreso = 0 }: { boost?: IBoost; progreso?: number }) => {
  const navigate = useNavigate();

  return (
    <Box>
      <Box mb="20px" fontSize="28px" fontWeight="bold" lineHeight="34px">
        🚀 Continua el Boost al que te has inscrito
      </Box>

      <Flex w="100%" bg="white" rounded="20px" overflow="hidden" direction="column" border="1px solid" borderColor="gray_3">
        <Flex w="100%" p="20px" gap="24px" align="center" bgPos="center" bgImage={BoostBG}>
          <Flex w="100%" gap="24px" direction="column">
            <Flex gap="24px">
              <Skeleton rounded="20px" isLoaded={!!boost?.icono}>
                <Image minW="64px" boxSize="64px" src={`data:image/svg+xml;utf8,${boost?.icono}`} />
              </Skeleton>

              <Box w="100%">
                <Flex mb="5px" gap="10px" w="100%">
                  <Skeleton minW="220px" isLoaded={!!boost?.titulo}>
                    <Box color="#FFFFFF" fontSize="24px" fontWeight="bold" lineHeight="29px" whiteSpace="nowrap">
                      {boost?.titulo}
                    </Box>
                  </Skeleton>

                  <Box bg="#FFF" p="0px 10px" h="fit-content" color="#040F36" rounded="5px" fontSize="18px" fontWeight="bold">
                    BOOST
                  </Box>
                </Flex>

                <Skeleton minW="80px" isLoaded={!!boost?.empresa?.nombre}>
                  <Box fontSize="18px" lineHeight="22px" color="#FFFFFF">
                    {boost?.empresa?.nombre}
                  </Box>
                </Skeleton>
              </Box>
            </Flex>

            <OpenParser value={boost?.descripcion} style={{ color: '#fff', fontSize: '15px', lineHeight: '22px' }} />
          </Flex>

          <Button
            h="auto"
            bg="white"
            p="10px 16px"
            rounded="10px"
            fontSize="16px"
            fontWeight="bold"
            lineHeight="22px"
            minW="fit-content"
            rightIcon={<Icon as={BiPlay} boxSize="24px" />}
            onClick={() => navigate('/roadmap')}
          >
            Continuar ruta del Boost
          </Button>
        </Flex>

        {process.env.NODE_ENV !== 'production' && (
          <Flex overflow="hidden">
            <Progress
              h="8px"
              w="100%"
              value={100}
              sx={{
                '& > div': {
                  background: `linear-gradient(90deg, #6350B0 0%, #6350B0 ${progreso + '%'}, #FFFFFFCC ${
                    progreso + '%'
                  }, #FFFFFFCC 100%)`,
                },
              }}
            />
          </Flex>
        )}
      </Flex>
    </Box>
  );
};
