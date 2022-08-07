import { Image, Flex, Text } from '@chakra-ui/react';

import { InactiveVector } from '../components';

import { LogoOBFullBlack } from '../../../assets/logos/openbootcamp/LogoOBFullBlack';
import { LogoOMFullBlack } from '../../../assets/logos/openmarketers/LogoOMFullBlack';

export const InactivePage = () => {
  return (
    <Flex p="75px" gap="60px" boxSize="100%" align="center" justify="start" direction="column">
      {process.env.REACT_APP_ORIGEN_CAMPUS === 'OPENBOOTCAMP' ? <LogoOBFullBlack /> : <LogoOMFullBlack w="184" h="51" />}

      <Flex h="100%" gap="28px" align="center" justify="center" direction="column">
        <Text variant="h1_heading">¡Ya está casi!</Text>

        <InactiveVector />

        <Text color="gray_4" fontSize="18px" lineHeight="22px" textAlign="center" variant="card_title">
          Estamos validando tu cuenta para darte acceso al campus, te avisaremos en cuanto tengas acceso.
        </Text>
      </Flex>
    </Flex>
  );
};
