import { Box, Divider, Flex, Icon, Skeleton } from '@chakra-ui/react';
import { BiMapPin, BiTimeFive, BiCoin, BiMap } from 'react-icons/bi';

import { capitalizeFirst } from 'utils';
import { BoostJornadaEnum, IBoost } from 'data';
import React from 'react';
import { OpenParser } from 'ui';

export const Info = ({ boost, isLoading }: { boost: IBoost; isLoading: boolean }) => {
  return (
    <Skeleton rounded="20px" isLoaded={!isLoading}>
      <Flex
        bg={{ base: 'gray_1', sm: 'white' }}
        rounded={{ base: '0px', sm: '20px' }}
        direction="column"
        border={{ base: 'none', sm: '1px solid var(--chakra-colors-gray_3)' }}
        borderColor="gray_3"
      >
        <Flex
          p={{ base: '0px', sm: '32px' }}
          boxSize="100%"
          gap={{ base: '22px', md: '32px' }}
          borderBottom="1px solid"
          borderBottomColor="gray_2"
          direction={{ base: 'column', md: 'row' }}
        >
          <Flex w="100%" gap="5px" direction="column" p={{ base: '22px 22px 0px 22px', sm: '0' }}>
            <Flex gap="6px" align="center">
              <Icon as={BiMap} boxSize="20px" color="gray_5" />

              <Box fontSize="14px" lineHeight="17px" fontWeight="bold">
                Localidad
              </Box>
            </Flex>

            <Box fontSize="14px" lineHeight="17px" data-cy="localidad_boost">
              {boost?.estado?.nombre}, {boost?.pais.nombre}
            </Box>
          </Flex>
          <Box
            w={{ base: '100%', md: '1px' }}
            minW={{ base: '100%', md: '1px' }}
            bg="gray_3"
            h={{ base: '1px', md: '100%' }}
            minH={{ base: '1px', md: '52px' }}
          />
          <Flex w="100%" gap="5px" direction="column" p={{ base: '0px 22px 0px 22px', sm: '0' }}>
            <Flex gap="6px" align="center">
              <Icon as={BiMapPin} boxSize="20px" color="gray_5" />

              <Box fontSize="14px" lineHeight="17px" fontWeight="bold">
                Presencialidad
              </Box>
            </Flex>

            <Box fontSize="14px" lineHeight="17px" data-cy="presencialidad_boost">
              {capitalizeFirst(boost?.remoto)}
            </Box>
          </Flex>

          <Box
            w={{ base: '100%', md: '1px' }}
            minW={{ base: '100%', md: '1px' }}
            bg="gray_3"
            h={{ base: '1px', md: '100%' }}
            minH={{ base: '1px', md: '52px' }}
          />
          <Flex w="100%" gap="5px" direction="column" p={{ base: '0px 22px 0px 22px', sm: '0' }}>
            <Flex gap="6px" align="center">
              <Icon as={BiTimeFive} boxSize="20px" color="gray_5" />

              <Box fontSize="14px" lineHeight="17px" fontWeight="bold">
                Horario
              </Box>
            </Flex>

            <Box fontSize="14px" lineHeight="17px" data-cy="horario_boost">
              {boost?.jornada === BoostJornadaEnum.COMPLETA ? 'Jornada Completa' : 'Jornada Parcial'}
            </Box>
          </Flex>
          <Box
            w={{ base: '100%', md: '1px' }}
            minW={{ base: '100%', md: '1px' }}
            bg="gray_3"
            h={{ base: '1px', md: '100%' }}
            minH={{ base: '1px', md: '52px' }}
          />
          <Flex w="100%" gap="5px" direction="column" p={{ base: '0px 22px 22px 22px', sm: '0' }}>
            <Flex gap="6px" align="center">
              <Icon as={BiCoin} boxSize="20px" color="gray_5" />

              <Box fontSize="14px" lineHeight="17px" fontWeight="bold">
                Rango Salarial
              </Box>
            </Flex>

            <Box fontSize="14px" lineHeight="17px" data-cy="rango_salarial_boost">
              {boost?.salarioMin}€ - {boost?.salarioMax}€ / Año
            </Box>
          </Flex>
        </Flex>

        <Flex w="100%" gap="32px" p={{ base: '22px', sm: '32px' }} direction="column">
          <Flex direction="column" gap="16px">
            <Box fontSize="18px" fontWeight="bold" lineHeight="22px">
              Descripción de la vacante
            </Box>

            <React.Fragment data-cy="descripcion_boost">
              <OpenParser
                value={boost?.descripcion}
                style={{
                  fontSize: '15px',
                  lineHeight: '22px',
                  paddingBottom: '24px',
                }}
              />
            </React.Fragment>
          </Flex>

          <Flex direction="column" gap="16px">
            <Box fontSize="18px" fontWeight="bold" lineHeight="22px">
              Tecnologías solicitadas
            </Box>

            <Flex w="100%" align="start" gap="14px" data-cy="tecnologias_boost" wrap="wrap">
              {boost?.habilidades?.map((hab: any) => (
                <Box
                  key={'hab-' + hab.id}
                  bg="gray_1"
                  p="6px 12px"
                  rounded="5px"
                  color="gray_6"
                  fontSize="13px"
                  lineHeight="16px"
                  fontWeight="bold"
                >
                  {hab.nombre}
                </Box>
              ))}
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Skeleton>
  );
};
