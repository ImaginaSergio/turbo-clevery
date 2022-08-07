import { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { BiCog, BiUser, BiIdCard, BiBriefcase, BiShieldQuarter } from 'react-icons/bi';
import { Box, CircularProgress, Flex, toast } from '@chakra-ui/react';

import { Avatar } from 'ui';
import { onFailure } from 'utils';
import { LoginContext } from '../../../shared/context';
import { getUserByID, updateUser, UserRolEnum } from 'data';

import { TabAdmin } from './TabAdmin';
import { TabCuenta } from './TabCuenta';
import { TabPerfil } from './TabPerfil';
import { TabEmpleo } from './TabEmpleo';
import { TabAjustes } from './TabAjustes';
import { TabsSidebar } from './TabsSidebar';

enum CuentaTabEnum {
  ADMIN = 'admin',
  CUENTA = 'cuenta',
  EMPLEO = 'empleo',
  PERFIL = 'perfil',
  AJUSTES = 'ajustes',
}

const Cuenta = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, setUser, totalPerfil } = useContext(LoginContext);

  const [tabs, setTabs] = useState<any[]>([]);
  const [tab, setTab] = useState<CuentaTabEnum>(CuentaTabEnum.PERFIL);

  const showAdmin = user?.rol === UserRolEnum.ADMIN;

  const showDotInPerfil = !user?.email || !user?.nombre || !user?.apellidos || !user?.telefono || user?.pais === null;

  const showDotInCuenta = !user?.linkedin;

  const showDotInEmpleo =
    user?.trabajoRemoto === null ||
    !user?.expectativasSalarialesMin ||
    !user?.expectativasSalarialesMax ||
    typeof user?.tieneExperiencia !== 'boolean' ||
    typeof user?.posibilidadTraslado !== 'boolean' ||
    typeof user?.actualmenteTrabajando !== 'boolean';

  useEffect(() => {
    let hash: any = (location.hash || '')?.replace('#', '');

    if (Object.values(CuentaTabEnum)?.includes(hash)) setTab(hash);
    else navigate(`/perfil#${CuentaTabEnum.PERFIL}`);
  }, [location.hash]);

  useEffect(() => {
    let _tabs = [
      {
        label: 'Perfil',
        icon: BiUser,
        showDot: showDotInPerfil,
        isActive: (location.hash || '')?.replace('#', '') === CuentaTabEnum.PERFIL,
        onClick: () => navigate(`/perfil#${CuentaTabEnum.PERFIL}`),
      },
      {
        label: 'Cuenta',
        icon: BiIdCard,
        showDot: showDotInCuenta,
        isActive: (location.hash || '')?.replace('#', '') === CuentaTabEnum.CUENTA,
        onClick: () => navigate(`/perfil#${CuentaTabEnum.CUENTA}`),
      },
      {
        label: 'Datos Empleo',
        icon: BiBriefcase,
        showDot: showDotInEmpleo,
        isActive: (location.hash || '')?.replace('#', '') === CuentaTabEnum.EMPLEO,
        onClick: () => navigate(`/perfil#${CuentaTabEnum.EMPLEO}`),
      },
      {
        label: 'Ajustes',
        icon: BiCog,
        isActive: (location.hash || '')?.replace('#', '') === CuentaTabEnum.AJUSTES,
        onClick: () => navigate(`/perfil#${CuentaTabEnum.AJUSTES}`),
      },
      {
        label: 'Admin',
        isDisabled: !showAdmin,
        icon: BiShieldQuarter,
        isActive: (location.hash || '')?.replace('#', '') === CuentaTabEnum.ADMIN,
        onClick: () => navigate(`/perfil#${CuentaTabEnum.ADMIN}`),
      },
    ];

    setTabs([..._tabs?.filter((t) => !t.isDisabled)]);
  }, [showAdmin, totalPerfil, location.hash]);

  const updateValue = ({ newData }: { newData: any }) => {
    if (!user?.id) {
      onFailure(toast, 'Error inesperado', 'El ID de usuario es undefined. Por favor, contacte con soporte.');

      return;
    }

    return updateUser({ id: user.id, user: newData })
      .then(async (res) => {
        const dataUser = await getUserByID({ id: user?.id || 0 });

        if (!dataUser.isAxiosError) refreshUserData({ newUser: dataUser });
        else console.error({ error: dataUser });
      })
      .catch((err) => console.error({ err }));
  };

  const refreshUserData = ({ newUser }: { newUser: any }) => {
    setUser({ ...newUser });
  };

  return (
    <Flex w="100%" p={{ base: '24px 24px 80px', md: '40px 40px 80px' }} align="flex-start" justify="center">
      <Flex direction="column" gap={{ base: '24px', md: '42px' }} w="100%" maxW="850px">
        <CuentaHeader
          totalPerfil={totalPerfil}
          title={user?.fullName || ''}
          avatar={{
            src: user?.avatar?.url,
            name: user?.username,
            colorVariant: (user?.id || 0) % 2 == 1 ? 'hot' : 'cold',
          }}
        />

        <Box h="1px" bg="gray_3" />

        <Flex gap={{ base: '20px', md: '80px' }} w={{ base: '100%', md: 'unset' }} direction={{ base: 'column', md: 'row' }}>
          <TabsSidebar tabs={tabs} />

          <Flex w="100%" minW={{ base: '100%', md: '500px' }}>
            {tab === CuentaTabEnum.PERFIL && <TabPerfil updateValue={updateValue} onRefresh={refreshUserData} />}

            {tab === CuentaTabEnum.CUENTA && <TabCuenta updateValue={updateValue} />}

            {tab === CuentaTabEnum.EMPLEO && <TabEmpleo updateValue={updateValue} onRefresh={refreshUserData} />}

            {tab === CuentaTabEnum.AJUSTES && <TabAjustes />}

            {showAdmin && tab === CuentaTabEnum.ADMIN && <TabAdmin />}
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

const CuentaHeader = ({
  title,
  avatar,
  totalPerfil,
}: {
  title: string;
  totalPerfil: number;
  avatar?: { src?: string; name?: string; colorVariant?: 'hot' | 'cold' };
}) => {
  return (
    <Flex
      justify="space-between"
      align={{ base: 'start', md: 'center' }}
      gap={{ base: '14px', md: '24px' }}
      direction={{ base: 'column', md: 'row' }}
    >
      <Flex gap="24px">
        <Avatar size="52px" src={avatar?.src} colorVariant={avatar?.colorVariant} name={avatar?.name || 'Avatar del usuario'} />

        <Flex direction="column" gap="6px">
          <Box fontSize="24px" fontWeight="bold" lineHeight="29px">
            {title}
          </Box>

          <Box fontWeight="medium" fontSize="13px" color="gray_5">
            Modifica los datos relacionados con tu perfil
          </Box>
        </Flex>
      </Flex>

      <Flex gap="15px" bg="white" p="10px 15px" align="center" rounded="15px" border="1px solid var(--chakra-colors-gray_3)">
        <Box fontWeight="bold" fontSize="14px" lineHeight="17px">
          Perfil completo al {totalPerfil}%
        </Box>

        <CircularProgress size="28px" color="primary" value={totalPerfil} trackColor="var(--chakra-colors-gray_2)" />
      </Flex>
    </Flex>
  );
};

export default Cuenta;
