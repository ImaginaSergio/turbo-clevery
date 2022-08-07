import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Flex, Box, Stack, HStack, Button, Spinner, useToast, PinInput, PinInputField, useColorMode } from '@chakra-ui/react';
import * as Yup from 'yup';
import { Formik, Form } from 'formik';

import { errorHandler, onFailure } from 'utils';
import { checkHashOnboarding, login } from 'data';

import { LoginContext } from '../../../shared/context';
import { Checkbox, FormInput } from '../../../shared/components';
import { LogoOBFullWhite } from '../../../assets/logos/openbootcamp/LogoOBFullWhite';
import { LogoOMFullWhite } from '../../../assets/logos/openmarketers/LogoOMFullWhite';
import { LogoOBFullBlack } from '../../../assets/logos/openbootcamp/LogoOBFullBlack';
import { LogoOMFullBlack } from '../../../assets/logos/openmarketers/LogoOMFullBlack';

const LoginForm = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const loginContext = useContext(LoginContext);

  const { colorMode } = useColorMode();
  const { hashCode } = useParams();

  const [loading, setLoading] = useState<boolean>(false);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [requires2FA, setRequires2FA] = useState<boolean>(false);

  useEffect(() => {
    if (hashCode)
      checkHashOnboarding({ hashCode })
        .then((res: any) => {
          setLoading(false);

          if (res.isAxiosError) {
            onFailure(
              toast,
              'Error al reconocer el hashCode del onboarding',
              'Tu sesión ha caducado. Prueba reestablecer contraseña o solicita un reenvio de credenciales a soporte.'
            );

            navigate('/login');
          } else {
            loginContext
              .login(res?.token, res?.data.id, false)
              .then(() => navigate('/'))
              .catch((error: any) => {
                onFailure(toast, 'Error al iniciar sesión', 'Vuelve a intentarlo o contacta con soporte si el error persiste.');
              });
          }
        })
        .catch((err) => {
          setLoading(false);
          onFailure(
            toast,
            'Error al reconocer el hashCode del onboarding',
            'Tu sesión ha caducado. Prueba reestablecer contraseña o solicita un reenvio de credenciales a soporte.'
          );

          navigate('/login');
        });
  }, [hashCode]);

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

        if (error?.message === 'E_ROW_NOT_FOUND: Row not found')
          onFailure(toast, 'Error al iniciar sesión', 'No existe una cuenta con esta dirección de correo');
        else if (error?.error?.response?.data?.requires2FA) setRequires2FA(true);
        else if (error?.response?.data === 'Error 2FA')
          onFailure(toast, 'Error al iniciar sesión', 'El código del authenticator no es correcto.');
        else {
          onFailure(toast, 'Error al iniciar sesión', errorHandler(error), 8000);
        }

        return;
      });
  };

  return loading ? (
    <Flex boxSize="100%" align="center" justify="center">
      <Spinner />
    </Flex>
  ) : (
    <Flex
      p={{ base: '12px', sm: '30px' }}
      boxSize="100%"
      color="white"
      align="center"
      overflow="auto"
      direction="column"
      justify="space-between"
      minW={{ md: '768px' }}
      bg={colorMode === 'dark' ? 'gray_1' : 'white'}
      boxShadow="0px 4px 71px rgba(7, 15, 48, 0.15)"
    >
      <Flex w="100%">
        <Box>
          {process.env.NX_ORIGEN_CAMPUS === 'OPENBOOTCAMP' ? (
            colorMode === 'dark' ? (
              <LogoOBFullWhite w={{ base: '138px', sm: '184px' }} h="51px" />
            ) : (
              <LogoOBFullBlack w={{ base: '138px', sm: '184px' }} h="51px" />
            )
          ) : colorMode === 'dark' ? (
            <LogoOMFullWhite w={{ base: '138px', sm: '184px' }} h="51px" />
          ) : (
            <LogoOMFullBlack w={{ base: '138px', sm: '184px' }} h="51px" />
          )}
        </Box>
      </Flex>

      <Flex direction="column" minW={{ base: '95%', xs: '405px' }} gap={{ base: '22px', sm: '40px' }}>
        <Box color="black" fontSize={{ base: '26px', sm: '28px' }} fontWeight="bold">
          ¡Bienvenido/a!
        </Box>

        <FormLoginForm
          login={loginUser}
          requires2FA={requires2FA}
          isLoggingIn={isLoggingIn}
          setIsLoggingIn={setIsLoggingIn}
          onRegister={() => navigate('/register')}
          onPassRecovery={() => navigate('/login/recovery')}
          showRegister={!(process.env.NX_DISABLED_PAGES || '')?.split(' ')?.includes('register')}
        />
      </Flex>

      <Flex
        w="100%"
        color="black"
        fontSize="12px"
        textAlign="start"
        fontWeight="medium"
        direction={{ base: 'column', sm: 'row' }}
      >
        <Box w="100%">
          Copyright © {new Date().getFullYear()}
          {process.env.NX_ORIGEN_CAMPUS === 'OPENBOOTCAMP' ? ' OpenBootcamp S.L. ' : ' OpenMarketers S.L. '}
          Todos los derechos reservados.
        </Box>

        <Box
          w="100%"
          as="a"
          target="_blank"
          textAlign={{ base: 'start', sm: 'end' }}
          whiteSpace="nowrap"
          textDecoration="underline"
          href={
            process.env.NX_ORIGEN_CAMPUS === 'OPENBOOTCAMP'
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
  showRegister,
  onRegister,
  onPassRecovery,
  setIsLoggingIn,
  requires2FA,
}: {
  login: any;
  showRegister: boolean;
  onRegister: () => void;
  onPassRecovery: () => void;
  isLoggingIn: boolean;
  setIsLoggingIn: (e?: any) => void | any;
  requires2FA: boolean;
}) => {
  const { colorMode } = useColorMode();

  const initialValues = { email: '', password: '', remember: false };
  const [code, setCode] = useState<string | undefined>(undefined);

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

    await login(values.email, values.password, values.remember, code).catch((error: any) => {
      console.log('¡Error inesperado durante el login!', { error });
    });
  };

  return (
    <Formik onSubmit={submitForm} initialValues={initialValues} validationSchema={validationSchema}>
      {(formik) => {
        const { handleSubmit } = formik;

        if (requires2FA)
          return (
            <Form onSubmit={handleSubmit}>
              <Flex color="white" direction="column" w="100%" gap="30px">
                <Stack>
                  <Box fontSize="16px" fontWeight="semibold" lineHeight="29px">
                    Introduce el pin de tu Authenticator
                  </Box>

                  <HStack>
                    <PinInput type="number" onChange={setCode}>
                      <PinInputField />
                      <PinInputField />
                      <PinInputField />
                      <PinInputField />
                      <PinInputField />
                      <PinInputField />
                    </PinInput>
                  </HStack>
                </Stack>

                <Flex align="center" justify="space-between">
                  <Button
                    isLoading={isLoggingIn}
                    h="auto"
                    _hover={{
                      bg: 'var(--chakra-colors-primary)',
                      opacity: 0.7,
                      color: '#000',
                    }}
                    color={process.env.NX_ORIGEN_CAMPUS === 'OPENBOOTCAMP' ? '#000' : '#fff'}
                    bg="primary"
                    w="100%"
                    p="12px 20px"
                    type="submit"
                    rounded="12px"
                  >
                    <Box fontSize="16px" fontWeight="semibold" lineHeight="29px">
                      Iniciar sesión
                    </Box>
                  </Button>
                </Flex>
              </Flex>
            </Form>
          );

        return (
          <Form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <Flex gap={{ base: '10px', sm: '30px' }} direction="column" w="100%">
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

              <Flex
                w="100%"
                gap="10px"
                justify="space-between"
                align={{ base: 'start', sm: 'center' }}
                direction={{ base: 'column', sm: 'row' }}
              >
                <Checkbox
                  name="remember"
                  label="Recuérdame"
                  style={{
                    fontSize: '14px',
                    color: 'var(--chakra-colors-black)',
                  }}
                  controlStyle={{
                    textAlign: 'left',
                    color: 'rgba(255, 255, 255, 0.4)',
                  }}
                />

                <Box
                  whiteSpace="nowrap"
                  color="primary_neon"
                  fontSize="14px"
                  cursor="pointer"
                  fontWeight="semibold"
                  onClick={onPassRecovery}
                  _hover={{ textDecoration: 'underline' }}
                >
                  ¿Has olvidado la contraseña?
                </Box>
              </Flex>

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

                {showRegister && (
                  <Button
                    h="42px"
                    bg="black"
                    p="12px 20px"
                    color="white"
                    rounded="12px"
                    onClick={onRegister}
                    w={{ base: '250px', sm: '100%' }}
                  >
                    <Box fontSize="16px" lineHeight="22px" fontWeight="semibold">
                      Registrar nueva cuenta
                    </Box>
                  </Button>
                )}
              </Flex>
            </Flex>
          </Form>
        );
      }}
    </Formik>
  );
};
