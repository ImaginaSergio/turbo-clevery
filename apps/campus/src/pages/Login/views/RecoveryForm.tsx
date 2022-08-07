import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Flex, Box, Button, Input, useColorMode } from '@chakra-ui/react';

import { recoverRequest } from 'data';

import { LogoOBFullBlack } from '../../../assets/logos/openbootcamp/LogoOBFullBlack';
import { LogoOBFullWhite } from '../../../assets/logos/openbootcamp/LogoOBFullWhite';
import { LogoOMFullBlack } from '../../../assets/logos/openmarketers/LogoOMFullBlack';
import { LogoOMFullWhite } from '../../../assets/logos/openmarketers/LogoOMFullWhite';

const RecoveryForm = () => {
  const navigate = useNavigate();
  const { colorMode } = useColorMode();

  const [email, setEmail] = useState<string>('');
  const [emailErroneo, setEmailErroneo] = useState<string>();
  const [emailEnviado, setEmailEnviado] = useState<boolean>(false);

  const onSubmit = () => {
    recoverRequest({ email })
      .then((res: any) => {
        if (res?.error?.response?.status === 404) setEmailErroneo('Este email no existe en nuestra base de datos.');
        else setEmailErroneo(undefined);

        setEmailEnviado(true);
      })
      .catch((err) => {
        setEmailEnviado(true);
        setEmailErroneo('Este correo no existe.');
      });
  };

  useEffect(() => {
    if ((email && emailErroneo) || (email && emailEnviado)) {
      setEmailErroneo(undefined);
      setEmailEnviado(false);
    }
  }, [email]);

  return (
    <Flex
      color="white"
      align="center"
      direction="column"
      position="relative"
      justify="center"
      p="30px 30px 30px 20px"
      minW={{ lg: '768px' }}
      w={{ base: '100%', lg: '20rem' }}
      bg={colorMode === 'dark' ? 'gray_1' : 'white'}
      boxShadow="0px 4px 71px rgba(7, 15, 48, 0.15)"
    >
      <Flex top="0px" p="40px" w="100%" position="absolute" justify="space-between">
        <Box>
          {process.env.REACT_APP_ORIGEN_CAMPUS === 'OPENBOOTCAMP' ? (
            colorMode === 'dark' ? (
              <LogoOBFullWhite />
            ) : (
              <LogoOBFullBlack />
            )
          ) : colorMode === 'dark' ? (
            <LogoOMFullWhite w="184" h="51" />
          ) : (
            <LogoOMFullBlack w="184" h="51" />
          )}
        </Box>

        <Button
          h="42px"
          p="10px 16px"
          bg="black"
          color="white"
          fontSize="16px"
          fontWeight="bold"
          lineHeight="22px"
          onClick={() => navigate('/login')}
        >
          Volver a Inicio de Sesión
        </Button>
      </Flex>

      <Flex direction="column" p="120px" align="center" gap="60px">
        <Flex direction="column" gap="15px" textAlign="left">
          <Box color="black" fontWeight="black" fontSize="34px" lineHeight="40px">
            Recupera tu contraseña
          </Box>

          <Box color="black" fontWeight="medium" fontSize="16px" lineHeight="24px">
            {emailEnviado && !emailErroneo ? (
              <div>
                Te hemos enviado el correo de recuperación a <strong>{email}</strong>. Para recuperar tu contraseña sigue las
                instrucciones especificadas en el correo.
              </div>
            ) : (
              'Introduce tu dirección de email. Te enviaremos un correo con un enlace para cambiar tu contraseña.'
            )}
          </Box>
        </Flex>

        {!(emailEnviado && !emailErroneo) && (
          <Flex w="100%" direction="column" textAlign="left" gap="30px">
            <Flex direction="column" gap="8px">
              <Box color="black" fontSize="14px" fontWeight="bold" lineHeight="20px">
                Email
              </Box>

              <Input
                p="17px"
                h="42px"
                type="email"
                border="1px"
                rounded="13px"
                value={email}
                color="black"
                placeholder="Introduce tu email"
                _placeholder={{ color: 'gray_4' }}
                borderColor="rgba(255, 255, 255, 0.4)"
                onChange={(e: any) => setEmail(e.target.value)}
                background={colorMode === 'light' ? 'gray_1' : 'gray_3'}
              />
            </Flex>

            <Button
              h="42px"
              w="100%"
              p="13px 15px"
              color="#fff"
              bg="primary"
              rounded="10px"
              onClick={onSubmit}
              _hover={{ opacity: 0.7 }}
              isDisabled={!email || !email?.includes('@')}
              border={`1px solid ${emailEnviado ? '#E6E8EE' : '#26FC95'}`}
            >
              <Box fontSize="16px" fontWeight="semibold" lineHeight="29px">
                Enviar mail
              </Box>
            </Button>

            {emailEnviado && emailErroneo && (
              <Box
                rounded="11px"
                color="cancel"
                p="10px 15px"
                bg="rgba(246, 90, 90, 0.15)"
                borderLeft="4px solid var(--chakra-colors-cancel)"
              >
                {emailErroneo}
              </Box>
            )}
          </Flex>
        )}
      </Flex>

      <Flex
        p="40px"
        w="100%"
        bottom="0px"
        color="black"
        fontSize="12px"
        textAlign="start"
        fontWeight="medium"
        position="absolute"
      >
        <Box w="100%">
          Copyright © {new Date().getFullYear()}
          {process.env.REACT_APP_ORIGEN_CAMPUS === 'OPENBOOTCAMP' ? ' OpenBootcamp S.L. ' : ' OpenMarketers S.L. '}
          Todos los derechos reservados.
        </Box>

        <Box
          w="100%"
          as="a"
          target="_blank"
          textAlign="end"
          whiteSpace="nowrap"
          textDecoration="underline"
          href={
            process.env.REACT_APP_ORIGEN_CAMPUS === 'OPENBOOTCAMP'
              ? 'https://open-bootcamp.com/politica-privacidad'
              : 'https://open-marketers.com/politica-privacidad'
          }
        >
          Política de Privacidad
        </Box>
      </Flex>
    </Flex>
  );
};

export default RecoveryForm;
