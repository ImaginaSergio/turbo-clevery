import { useContext, useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';

import { Image, Flex, useColorMode } from '@chakra-ui/react';

import LoginForm from './views/LoginForm';

import { UserRolEnum } from '@clevery/data';
import { isRoleAllowed } from '@clevery/utils';
import { LoginContext } from '../../shared/context';

import loginDarkBg from '../../assets/login/login_dark.png';
import loginLightBg from '../../assets/login/login_light.png';

import './Login.scss';

const Login = () => {
  const navigate = useNavigate();
  const { colorMode } = useColorMode();
  const { user } = useContext(LoginContext);

  useEffect(() => {
    if (isRoleAllowed([UserRolEnum.ADMIN], user?.rol)) navigate('/');
  }, []);

  return (
    <Flex w="100%" h="100vh" overflow="hidden">
      <Routes>
        <Route index element={<LoginForm />} />
      </Routes>

      <Image
        w="100%"
        objectFit="cover"
        objectPosition="center"
        display={{ base: 'none', md: 'none', lg: 'unset' }}
        src={colorMode === 'dark' ? loginDarkBg : loginLightBg}
      />
    </Flex>
  );
};

export default Login;
