import { useContext } from 'react';

import { Text, Flex, Box, Button, Icon, Grid } from '@chakra-ui/react';
import { BiLaptop, BiCalendarX, BiTimeFive, BiPlay } from 'react-icons/bi';

import { IExamen } from 'data';
import { fmtMnts } from 'utils';
import { LayoutContext } from '../../../../shared/context';

export const PortadaExamen = ({ examen, onStart }: { examen?: IExamen; onStart: () => void }) => {
  const { isMobile } = useContext(LayoutContext);
  return (
    <Flex m={{ base: '0px', sm: '34px 34px 10px 34px' }}>
      <Flex
        p={{ base: 'unset', md: '34px' }}
        bg="white"
        rounded={{ base: '0px', sm: '20px' }}
        align="center"
        justify="center"
        direction={{ base: 'column', md: 'row' }}
        gap="40px"
      >
        <Flex gap="50px" direction="column" px={{ base: '20px', md: 'unset' }} pt={{ base: '40px', md: 'unset' }}>
          <Flex gap="18px" direction="column" align="start">
            <Text variant="h1_heading">Antes de empezar...</Text>

            <Box fontSize="15px" lineHeight="18px">
              Las certificaciones son una manera que tenemos de validar vuestro nivel de conocimientos de la manera más objetiva
              posible. Para obtener las certificaciones tendrás que seguir las normas y recomendaciones que te facilitamos en
              esta página.
            </Box>
          </Flex>

          <Button
            bg="black"
            display={{ base: 'none', md: 'flex' }}
            rounded="14px"
            w="fit-content"
            color="white"
            p="15px 24px"
            rightIcon={<Icon as={BiPlay} />}
            fontSize="18px"
            lineHeight="22px"
            fontWeight="bold"
            onClick={onStart}
          >
            Empezar ahora
          </Button>
        </Flex>

        <Flex
          p="40px"
          gap="40px"
          bg="gray_1"
          border={{
            base: 'unset',
            md: '2px solid var(--chakra-colors-gray_3)',
          }}
          direction="column"
          ml={{ base: '0px', md: '20px' }}
          rounded={{ base: '', sm: '20px' }}
          pb={{ base: '100px', md: '40px' }}
        >
          <Flex gap="17px">
            <Icon as={BiTimeFive} boxSize="20px" color="cancel" />

            <Flex w="100%" direction="column" gap="10px">
              <Box fontSize="16px" fontWeight="bold" lineHeight="22px">
                Límite de {fmtMnts(examen?.duracion)}
              </Box>

              <Box fontSize="15px" lineHeight="22px">
                Dispones de {fmtMnts(examen?.duracion)} minutos para realizar la certificación. El temporizador empezará a
                contar en cuanto pulses el botón “Empezar ahora”.
              </Box>
            </Flex>
          </Flex>

          <Flex gap="17px">
            <Icon as={BiCalendarX} boxSize="20px" color="cancel" />

            <Flex w="100%" direction="column" gap="10px">
              <Box fontSize="16px" fontWeight="bold" lineHeight="22px">
                No abandones la página
              </Box>

              <Box fontSize="15px" lineHeight="22px">
                Mantén el ratón en la página en todo momento y no cambies de página. Si cambias o abandonas la página{' '}
                <strong>se te descontarán 5 minutos</strong> del tiempo disponible que tienes para realizar la certificación.
              </Box>
            </Flex>
          </Flex>

          <Flex gap="17px">
            <Icon as={BiLaptop} boxSize="20px" color="primary" />

            <Flex w="100%" direction="column" gap="10px">
              <Box fontSize="16px" fontWeight="bold" lineHeight="22px">
                Utiliza un PC o portátil
              </Box>

              <Box fontSize="15px" lineHeight="22px">
                Recomendamos realizar las certificaciones desde un ordenador para evitar posibles fallos de visualización de las
                mismas.
              </Box>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
      <Flex
        w="100%"
        display={{ base: 'flex', md: 'none' }}
        position="fixed"
        bottom={0}
        justify="center"
        px="20px"
        py="18px"
        bg="white"
        h="89px"
        boxShadow="0px -4px 20px 0px rgba(0, 0, 0, 0.1)"
      >
        <Button
          bg="black"
          rounded="14px"
          boxSize="100%"
          color="white"
          p="15px 24px"
          rightIcon={<Icon as={BiPlay} />}
          fontSize="18px"
          lineHeight="22px"
          fontWeight="bold"
          onClick={onStart}
          _hover={{ opacity: 0.8 }}
        >
          Empezar ahora
        </Button>
      </Flex>
    </Flex>
  );
};
