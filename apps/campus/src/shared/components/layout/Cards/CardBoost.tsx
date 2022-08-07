import { useNavigate } from 'react-router-dom';

import { BiTimeFive, BiMapPin, BiCoin, BiBuilding } from 'react-icons/bi';
import { Flex, Box, Icon, Skeleton, Image } from '@chakra-ui/react';

import { BoostJornadaEnum, IBoost } from 'data';
import { OpenParser } from 'ui';

export const CardBoost = ({ boost, isLoading = false }: { boost: IBoost; isLoading: boolean }) => {
  const navigate = useNavigate();

  return (
    <Skeleton w="100%" minH="272px" isLoaded={!isLoading}>
      <Flex
        p="24px"
        boxSize="100%"
        data-cy={`${boost?.titulo}_boost`}
        cursor="pointer"
        direction="column"
        justify="space-between"
        onClick={() => navigate('/boosts/' + boost?.id)}
      >
        <Flex w="100%" align="start" gap="18px" pb="18px" direction={{ base: 'column', sm: 'row' }}>
          <Image boxSize="42px" src={`data:image/svg+xml;utf8,${boost?.icono}`} />

          <Flex direction="column" w="100%" gap="10px">
            <Box fontSize="18px" fontWeight="semibold" lineHeight="22px">
              {boost?.titulo}
            </Box>

            <Flex gap="5px" align="center">
              <Icon as={BiBuilding} boxSize="20px" color="gray_6" />

              <Skeleton minW="80px" isLoaded={!!boost?.empresa?.nombre}>
                <Box fontSize="14px" lineHeight="17px">
                  {boost?.empresa?.nombre}
                </Box>
              </Skeleton>
            </Flex>
          </Flex>

          <Box
            p="7px"
            rounded="12px"
            fontSize="14px"
            lineHeight="17px"
            fontWeight="bold"
            minW="fit-content"
            bg={boost?.meta?.compatible === 100 ? 'primary_light' : 'gray_1'}
            color={boost?.meta?.compatible === 100 ? 'primary_dark' : 'gray_6'}
          >
            {boost?.meta?.compatible}% Compatible
          </Box>
        </Flex>

        <Flex boxSize="100%" pb={{ base: '10px', sm: '24px' }}>
          <OpenParser
            maxChars={200}
            value={boost?.descripcion}
            style={{
              fontSize: '15px',
              lineHeight: '22px',
            }}
          />
        </Flex>

        <Flex w="100%" align="start" gap="14px" pb="28px" direction={{ base: 'column', sm: 'row' }}>
          <Flex gap="5px" color="gray_5" align="center">
            <Icon as={BiMapPin} boxSize="20px" />

            <Box fontSize="14px" lineHeight="17px">
              {boost?.estado?.nombre || boost?.pais.nombre || '-'}
            </Box>
          </Flex>

          <Flex gap="5px" color="gray_5" align="center">
            <Icon as={BiTimeFive} boxSize="20px" />

            <Box fontSize="14px" lineHeight="17px">
              {boost?.jornada === BoostJornadaEnum.COMPLETA ? 'Jornada Completa' : 'Jornada Parcial'}
            </Box>
          </Flex>

          <Flex gap="5px" align="center">
            <Icon as={BiCoin} boxSize="20px" />

            <Box fontSize="14px" lineHeight="17px">
              {boost?.salarioMin}€ - {boost?.salarioMax}€ / Año
            </Box>
          </Flex>
        </Flex>

        <Flex w="100%" align="start" gap="14px" wrap="wrap">
          {boost?.habilidades?.map((hab: any) => (
            <Box bg="gray_1" p="6px 12px" rounded="5px" color="gray_6" fontSize="13px" lineHeight="16px" fontWeight="bold">
              {hab.nombre}
            </Box>
          ))}
        </Flex>
      </Flex>
    </Skeleton>
  );
};
