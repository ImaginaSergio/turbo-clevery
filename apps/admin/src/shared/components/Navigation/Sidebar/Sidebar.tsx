import { useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Flex } from '@chakra-ui/react';
import { FiUsers } from 'react-icons/fi';
import { BiCog, BiBox, BiBriefcase, BiBookBookmark } from 'react-icons/bi';

import { NavLink } from './NavLink';
import { UserRolEnum } from 'data';
import { isRoleAllowed } from 'utils';
import { LoginContext } from '../../../context';

import { LogoOB } from 'apps/campus/src/assets/logos/openbootcamp/LogoOB';
import { LogoOM } from 'apps/campus/src/assets/logos/openmarketers/LogoOM';
import { LogoImagina } from 'apps/campus/src/assets/logos/imagina/LogoImagina';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { user } = useContext(LoginContext);

  return (
    <Flex w="80px" h="100vh" bg="#1B1F31" p="0px 0px 15px" rowGap="20px" direction="column" align="flex-start">
      <Flex h="90px" w="100%" align="center" cursor="pointer" justify="center" data-cy="logo_ob" onClick={() => navigate('/')}>
        <Flex display={{ base: 'flex', '2xl': 'none' }}>
          {process.env.REACT_APP_ORIGEN_CAMPUS === 'OPENBOOTCAMP' ? <LogoOB w="30" h="35" /> : <LogoOM w="30" h="35" />}
        </Flex>
      </Flex>

      <Flex direction="column" boxSize="100%">
        {isRoleAllowed([UserRolEnum.ADMIN], user?.rol) && (
          <NavLink
            label="Contenidos"
            to="/contenidos"
            icon={BiBookBookmark}
            isActive={location.pathname.startsWith('/contenidos')}
          />
        )}

        {isRoleAllowed([UserRolEnum.ADMIN], user?.rol) && (
          <NavLink label="Clientes" to="/clientes" icon={BiBriefcase} isActive={location.pathname.startsWith('/clientes')} />
        )}

        {isRoleAllowed([UserRolEnum.ADMIN, UserRolEnum.SUPERVISOR], user?.rol) && (
          <NavLink label="Alumnado" to="/alumnado" icon={FiUsers} isActive={location.pathname.startsWith('/alumnado')} />
        )}

        {isRoleAllowed([UserRolEnum.ADMIN], user?.rol) && (
          <NavLink label="Miscelánea" to="/miscelanea" icon={BiBox} isActive={location.pathname.startsWith('/miscelanea')} />
        )}
      </Flex>

      <Flex direction="column" w="100%" minH="fit-content">
        {isRoleAllowed([UserRolEnum.ADMIN], user?.rol) && (
          <NavLink
            label="Configuración"
            to="/configuracion"
            icon={BiCog}
            isActive={location.pathname.startsWith('/configuracion')}
          />
        )}
      </Flex>
    </Flex>
  );
};

export { Sidebar };
