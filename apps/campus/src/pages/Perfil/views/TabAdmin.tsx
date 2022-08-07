import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useToast, Flex, Box, Button } from '@chakra-ui/react';

import { getUsers, loginViaId, getUserByID, removeFromBoost } from 'data';
import { onFailure } from 'utils';
import { OpenAsyncSelect } from 'ui';
import { LoginContext } from '../../../shared/context';

export const TabAdmin = () => {
  const toast = useToast();
  const navigate = useNavigate();

  const { user, setUser, login } = useContext(LoginContext);

  const isInscribed = (user?.boosts?.length || 0) > 0;

  const [userId, setUserId] = useState<number>();
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [loadingDesuscribe, setLoading] = useState<boolean>(false);

  const loadUsersByEmail = async (value: string) => {
    const _users = await getUsers({ query: [{ email: value }] });

    return _users?.data?.map((user: any) => ({
      value: user.id,
      label: user.email,
    }));
  };

  const handleDesuscribe = async () => {
    setLoading(true);

    let boostActivo = user?.boosts?.find((boost) => boost?.meta?.pivot_activo === true);

    if (boostActivo?.id)
      await removeFromBoost({ id: boostActivo.id }).then(async () => {
        const _user = await getUserByID({ id: user?.id || 0 });

        if (_user.id) setUser({ ..._user });
        else console.error({ error: _user });
      });

    setLoading(false);
  };

  const handleLoginViaId = async () => {
    setIsLoggingIn(true);

    if (userId)
      loginViaId({ userId: userId })
        .then((res) => {
          login(res, userId, true)
            .then(() => navigate('/'))
            .catch((error: any) => {
              setIsLoggingIn(false);
              onFailure(toast, 'Error al iniciar sesión', 'Actualice la página y contacte con soporte si el error persiste.');
            });
        })
        .catch((e) => {
          setIsLoggingIn(false);
          onFailure(toast, 'Error al iniciar sesión', 'Actualice la página y contacte con soporte si el error persiste.');
        });
  };

  return (
    <Flex w="100%" direction="column" gap="30px">
      <Flex direction="column" gap="24px">
        <Box fontSize="18px" fontWeight="bold">
          Admin
        </Box>

        <OpenAsyncSelect
          name="id_usuario"
          label="Iniciar sesión por email de usuario"
          placeholder="Escribe para buscar..."
          onChange={setUserId}
          loadOptions={loadUsersByEmail}
        />

        <Button bg="primary" color="white" isLoading={isLoggingIn} onClick={handleLoginViaId}>
          Iniciar sesión
        </Button>
      </Flex>

      <Flex direction="column" gap="24px">
        <Box fontSize="18px" fontWeight="bold">
          Misceláneo
        </Box>

        <Flex align={{ base: 'start', md: 'center' }} gap="20px" direction={{ base: 'column', md: 'row' }}>
          <Button
            bg="cancel"
            color="white"
            onClick={() => {
              throw Error('ERROR CONTROLADO - DEBUG');
            }}
          >
            Generar alerta Sentry
          </Button>

          <Button
            bg="black"
            h="auto"
            p="10px 20px"
            color="white"
            isDisabled={!isInscribed}
            isLoading={loadingDesuscribe}
            loadingText={'Desuscribiendo...'}
            onClick={handleDesuscribe}
          >
            Desuscribirse del Boost
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
};
