import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Box, Flex, Icon, Button, useToast, useColorMode, Tooltip } from '@chakra-ui/react';
import * as Yup from 'yup';
import { Formik, Form } from 'formik';
import { BiCheck, BiChevronsLeft, BiX } from 'react-icons/bi';

import { onFailure } from 'utils';
import { FormInput } from '../../../shared/components';
import { LoginContext } from '../../../shared/context';
import { checkCode, resetPassword } from 'data';
import { LogoImaginaFullBlack } from 'apps/campus/src/assets/logos/imagina/LogoImaginaFullBlack';
import { LogoImaginaFullWhite } from 'apps/campus/src/assets/logos/imagina/LogoImaginaFullWhite';
import { LogoOBFullBlack } from 'apps/campus/src/assets/logos/openbootcamp/LogoOBFullBlack';
import { LogoOBFullWhite } from 'apps/campus/src/assets/logos/openbootcamp/LogoOBFullWhite';
import { LogoOMFullBlack } from 'apps/campus/src/assets/logos/openmarketers/LogoOMFullBlack';
import { LogoOMFullWhite } from 'apps/campus/src/assets/logos/openmarketers/LogoOMFullWhite';

const NewPassForm = () => {
  const toast = useToast();
  const navigate = useNavigate();

  const { colorMode } = useColorMode();
  const { hashCode } = useParams<any>();
  const loginContext = useContext(LoginContext);

  const [loading, setLoading] = useState(true);
  const [hashValid, setHashValid] = useState(false);

  useEffect(() => {
    if (!hashCode) {
      onFailure(toast, 'No se reconoce el hashcode', 'Actualize la página y contacte con soporte si el error persiste.');
      return;
    }

    checkCode({ hashCode })
      .then((res: any) => {
        setLoading(false);
        setHashValid(res.isAxiosError === true ? false : true);
      })
      .catch(() => {
        setLoading(false);
        setHashValid(false);
      });
  }, [hashCode]);

  const onSubmit = async (password: string) => {
    const { token, data, error } = await resetPassword({
      hashCode: hashCode || '',
      password,
    });

    if (error) {
      onFailure(toast, 'Error al iniciar sesión', 'Actualize la página y contacte con soporte si el error persiste.');
    } else {
      loginContext
        .login(token, data.id, false)
        .then(() => {
          toast.closeAll();
          navigate('/');
        })
        .catch((error: any) => {
          onFailure(toast, 'Error al iniciar sesión', 'Actualize la página y contacte con soporte si el error persiste.');
        });
    }
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
      <Flex top="0px" p="40px" w="100%" position="absolute" justify="space-between">
        <Box>
          {process.env.NX_ORIGEN_CAMPUS === 'OPENBOOTCAMP' ? (
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
        <Flex direction="column" gap="14px" textAlign="left">
          <Box color="black" fontSize="28px" lineHeight="34px" fontWeight="bold">
            Recupera tu contraseña
          </Box>

          {!loading ? (
            hashValid ? (
              <Box fontWeight="medium" fontSize="16px" lineHeight="24px">
                Por favor, indica tu nueva contraseña
              </Box>
            ) : (
              <Box
                p="10px 15px"
                color="cancel"
                rounded="11px"
                bg="rgba(246, 90, 90, 0.15)"
                borderLeft="4px solid var(--chakra-colors-cancel)"
              >
                El enlace de recuperación ha caducado. Por favor, solicita otro desde la{' '}
                <strong style={{ cursor: 'pointer' }} onClick={() => navigate(`/login/recovery`)}>
                  página de recuperación
                </strong>
                .
              </Box>
            )
          ) : null}
        </Flex>

        {!loading && hashValid && <FormNewPassForm onSubmit={onSubmit} />}
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
          {process.env.NX_ORIGEN_CAMPUS === 'OPENBOOTCAMP' ? ' OpenBootcamp S.L. ' : ' OpenMarketers S.L. '}
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

export default NewPassForm;

const FormNewPassForm = ({ onSubmit }: { onSubmit: (password: string) => void }) => {
  const { colorMode } = useColorMode();
  const initialValues = { password: '', confirmPassword: '' };

  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .required('Introduce una contraseña.')
      .min(8, 'Contraseña muy corta. Debe tener como mínimo 8 carácteres.')
      .max(50, 'Contraseña muy larga. Debe tener como máximo 50 carácteres.')
      .matches(/(?=.*\d){1}/, 'La contraseña debe contener al menos un número.')
      .matches(/(?=.*[a-z]){1}/, 'La contraseña debe contener al menos una letra en minúscula.')
      .matches(/(?=.*[A-Z]){1}/, 'La contraseña debe contener al menos una letra en mayúscula.')
      .matches(/(?=.[!@#$%^&()-=+{};:,<.>]){1}/, 'La contraseña debe contener al menos un carácter especial.')
      .test('Espacios en blanco', '¡La contraseña no puede contener espacios en blanco!', (value) => !/(\s)/g.test(value || ''))
      .typeError('Introduce tu contraseña.'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Las contraseñas deben coincidir')
      .required(),
  });

  const submitForm = (values: any) => onSubmit(values.password);

  return (
    <Formik initialValues={initialValues} onSubmit={submitForm} validationSchema={validationSchema}>
      {(formik) => {
        const { values, handleSubmit } = formik;

        return (
          <Form style={{ width: '100%' }} onSubmit={handleSubmit}>
            <Flex direction="column" gap="20px" w="100%">
              <Tooltip
                hasArrow
                shouldWrapChildren
                p="20px"
                bg="#fff"
                rounded="8px"
                label={<PasswordTooltip password={values.password} />}
              >
                <FormInput
                  color="black"
                  name="password"
                  type="password"
                  label="Nueva contraseña"
                  placeholder="Introduce tu contraseña"
                  background={colorMode === 'dark' ? 'white' : 'gray_1'}
                />
              </Tooltip>

              <FormInput
                color="black"
                type="password"
                name="confirmPassword"
                label="Confirma la contraseña"
                placeholder="Introduce tu contraseña"
                background={colorMode === 'dark' ? 'white' : 'gray_1'}
              />

              <Button h="42px" w="100%" color="#fff" bg="primary" p="12px 20px" type="submit" _hover={{ opacity: 0.7 }}>
                <Box fontSize="16px" fontWeight="semibold" lineHeight="29px">
                  Guardar nueva contraseña
                </Box>
              </Button>
            </Flex>
          </Form>
        );
      }}
    </Formik>
  );
};

const PasswordTooltip = ({ password }: { password: string }) => {
  return (
    <Flex direction="column" gap="10px">
      <PasswordTooltipItem label="8 carácteres mínimo" isCorrect={password?.length > 8} />

      <PasswordTooltipItem label="Al menos una letra mayúscula" isCorrect={/(?=.*[A-Z])/.test(password)} />

      <PasswordTooltipItem label="Al menos un caracter numérico" isCorrect={/(?=.*\d)/.test(password)} />

      <PasswordTooltipItem label="Al menos una letra minúscula" isCorrect={/(?=.*[a-z])/.test(password)} />

      <PasswordTooltipItem label="Al menos un carácter especial" isCorrect={/(?=.*[^\w\s])/.test(password)} />
    </Flex>
  );
};

const PasswordTooltipItem = ({ label, isCorrect }: { label: string; isCorrect?: boolean }) => {
  return (
    <Flex gap="5px" align="center">
      <Icon boxSize="22px" as={isCorrect ? BiCheck : BiX} color={isCorrect ? 'accept' : 'cancel'} />

      <Box
        textDecoration={isCorrect ? 'line-through' : 'unset'}
        color={isCorrect ? 'rgba(165, 168, 179, 1)' : 'rgba(18, 22, 37, 1)'}
      >
        {label}
      </Box>
    </Flex>
  );
};
