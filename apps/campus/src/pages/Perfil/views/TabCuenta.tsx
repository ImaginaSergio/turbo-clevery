import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { Box, Button, Flex } from '@chakra-ui/react';

import { OpenInput } from 'ui';
import { LoginContext } from '../../../shared/context';
import { debounce } from 'lodash';

export const TabCuenta = ({ updateValue }: { updateValue: (e?: any) => any }) => {
  const navigate = useNavigate();
  const { user, logout } = useContext(LoginContext);

  const [pending, setPending] = useState<boolean>(false);
  const [linkedin, setLinkedin] = useState<string>(user?.linkedin || '');

  const handleUpdate = () => {
    let newData: any = {
      linkedin: linkedin === '' ? null : linkedin,
    };

    updateValue({ newData });
    setPending(false);
  };

  const handleUpdatePassword = () => {
    logout();
    navigate('/login/recovery');
  };

  const validateLinkedin = debounce(async (value: string, resolve: (val: string) => void) => {
    let error: string = '';

    if (value !== '' && !value.startsWith('https://www.linkedin.com/in/'))
      error = '¡Debes introducir una dirección válida a LinkedIn!';

    return resolve(error);
  }, 350);

  return (
    <Flex w="100%" direction="column" gap="32px">
      <Flex direction="column" gap="6px">
        <OpenInput isDisabled name="email" label="Correo electrónico" defaultValue={user?.email} />

        <Box color="gray_5" fontSize="14px" lineHeight="17px">
          Contacta con{' '}
          <Box
            as="a"
            color="gray_6"
            fontWeight="bold"
            textDecoration="underline"
            href={
              process.env.REACT_APP_ORIGEN_CAMPUS === 'OPENBOOTCAMP'
                ? 'mailto:hola@open-bootcamp.com'
                : 'mailto:hola@open-marketers.com'
            }
          >
            nosotros
          </Box>{' '}
          para cambiar tu cuenta de mail.
        </Box>
      </Flex>

      <Flex align={{ base: 'start', md: 'flex-end' }} gap="6px" direction={{ base: 'column', md: 'row' }}>
        <OpenInput isDisabled type="password" name="password" label="Contraseña" defaultValue="**********************" />

        <Button
          bg="black"
          p="0px 16px"
          color="white"
          rounded="10px"
          fontSize="16px"
          fontWeight="bold"
          lineHeight="22px"
          minW="fit-content"
          onClick={handleUpdatePassword}
        >
          Cambiar contraseña
        </Button>
      </Flex>

      <OpenInput
        name="linkedin"
        label="LinkedIn"
        defaultValue={linkedin}
        onValidate={async (value) => new Promise((resolve) => validateLinkedin(value || '', resolve))}
        placeholder="https://www.linkedin.com/in/usuario"
        onChange={(value: any) => {
          if (!pending) setPending(true);
          setLinkedin(value.linkedin);
        }}
      />

      {pending && (
        <Flex w="100%" justify="flex-start" mb="40px">
          <Button h="46px" bg="gray_3" rounded="12px" fontSize="14px" fontWeight="bold" onClick={() => setPending(false)}>
            Descartar cambios
          </Button>

          <Button
            h="46px"
            ml="17px"
            bg="primary"
            data-cy="guardar_cambios_cuenta"
            color="white"
            rounded="12px"
            fontSize="14px"
            fontWeight="bold"
            onClick={handleUpdate}
          >
            Guardar cambios
          </Button>
        </Flex>
      )}
    </Flex>
  );
};
