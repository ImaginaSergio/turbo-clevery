import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import * as Yup from 'yup';
import { Formik, Form } from 'formik';
import { Flex, Box, Button, useToast, useColorMode } from '@chakra-ui/react';

import { login } from '@clevery/data';
import { errorHandler, onFailure } from '@clevery/utils';

import { LoginContext } from '../../../shared/context';
import { FormInput } from '../../../shared/components';
import { LogoOBFullWhite } from '../../../assets/logos/openbootcamp/LogoOBFullWhite';
import { LogoOMFullWhite } from '../../../assets/logos/openmarketers/LogoOMFullWhite';
import { LogoImaginaFullWhite } from '../../../assets/logos/imagina/LogoImaginaFullWhite';
import { LogoOBFullBlack } from 'apps/campus/src/assets/logos/openbootcamp/LogoOBFullBlack';
import { LogoOMFullBlack } from 'apps/campus/src/assets/logos/openmarketers/LogoOMFullBlack';
import { LogoImaginaFullBlack } from 'apps/campus/src/assets/logos/imagina/LogoImaginaFullBlack';

const LoginForm = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const loginContext = useContext(LoginContext);

  const { colorMode } = useColorMode();

  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);

  const loginUser = async (email: string, password: string, remember: boolean, code?: string) => {
    login({ email, password, code })
      .then(({ token, data }) => {
        loginContext
          .login(token, data.id, remember)
          .then(() => {
            toast.closeAll();
            navigate('/');
          })
          .catch((error: any) => {
            setIsLoggingIn(false);

            onFailure(toast, 'Error al iniciar sesión', errorHandler(error), 8000);
          });
      })
      .catch((error) => {
        setIsLoggingIn(false);

        onFailure(toast, 'Error al iniciar sesión', errorHandler(error), 8000);

        return;
      });
  };

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
      <Flex position="absolute" top="0px" p="40px" w="100%">
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
      </Flex>

      <Flex direction="column" p={[0, 20, 120]}>
        <Box mb="42px" color="black" fontSize="28px" fontWeight="bold">
          ¡Bienvenido/a!
        </Box>

        <FormLoginForm login={loginUser} isLoggingIn={isLoggingIn} setIsLoggingIn={setIsLoggingIn} />
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

export default LoginForm;

const FormLoginForm = ({
  login,
  isLoggingIn,
  setIsLoggingIn,
}: {
  login: any;
  isLoggingIn: boolean;
  setIsLoggingIn: (e?: any) => void | any;
}) => {
  const { colorMode } = useColorMode();

  const initialValues = { email: '', password: '', remember: false };

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email('Introduce una dirección de correo válida.')
      .required('Introduce una dirección de correo.')
      .typeError('Introduce una dirección de correo.')
      .test(
        'Espacios en blanco',
        '¡El email no puede contener espacios en blanco al principio o al final!',
        (value) => !/^\s+|\s+$/.test(value || '')
      ),
    password: Yup.string()
      .required('Introduce una contraseña.')
      .typeError('Introduce tu contraseña.')
      .test(
        'Espacios en blanco',
        '¡La contraseña no puede contener espacios en blanco!',
        (value) => !/(\s)/g.test(value || '')
      ),
    remember: Yup.boolean().notRequired().nullable(),
  });

  const submitForm = async (values: any) => {
    setIsLoggingIn(true);

    await login(values.email, values.password, values.remember).catch((error: any) => {
      console.log('¡Error inesperado durante el login!', { error });
    });
  };

  return (
    <Formik onSubmit={submitForm} initialValues={initialValues} validationSchema={validationSchema}>
      {(formik) => {
        const { handleSubmit } = formik;

        return (
          <Form onSubmit={handleSubmit}>
            <Flex gap="30px" direction="column" w={{ base: '250px', sm: '100%' }}>
              <FormInput
                data-cy="login_email"
                name="email"
                label="Email"
                type="email"
                placeholder="Introduce tu email"
                background={colorMode === 'light' ? 'gray_1' : 'gray_3'}
              />

              <FormInput
                data-cy="login_password"
                name="password"
                label="Contraseña"
                type="password"
                placeholder="Introduce tu contraseña"
                background={colorMode === 'light' ? 'gray_1' : 'gray_3'}
              />

              <Flex gap="12px" align="center" direction="column" justify="space-between">
                <Button
                  data-cy="login_submit"
                  h="42px"
                  color="white"
                  bg="primary"
                  p="12px 20px"
                  type="submit"
                  rounded="12px"
                  isLoading={isLoggingIn}
                  w={{ base: '250px', sm: '100%' }}
                >
                  <Box fontSize="16px" fontWeight="semibold" lineHeight="22px">
                    Iniciar sesión
                  </Box>
                </Button>
              </Flex>
            </Flex>
          </Form>
        );
      }}
    </Formik>
  );
};
