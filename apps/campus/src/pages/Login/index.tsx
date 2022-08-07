import { useContext, useEffect } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import { Image, Flex, useColorMode } from '@chakra-ui/react';

import { LayoutContext, LoginContext } from '../../shared/context';

import LoginForm from './views/LoginForm';
import NewPassForm from './views/NewPassForm';
import RecoveryForm from './views/RecoveryForm';

import loginDarkBg from '../../assets/login/login_dark.png';
import loginLightBg from '../../assets/login/login_light.png';
import loginRecoveryBg from '../../assets/login/login_password.png';

import './Login.scss';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { colorMode } = useColorMode();
  const { user } = useContext(LoginContext);
  const { setShowSidebar } = useContext(LayoutContext);

  useEffect(() => {
    setShowSidebar(false);

    if (user) navigate('/');
  }, []);

  return (
    <Flex w="100%" h="100vh" overflow="hidden">
      <Routes>
        <Route index element={<LoginForm />} />
        <Route path=":hashCode" element={<LoginForm />} />

        <Route path="recovery">
          <Route index element={<RecoveryForm />} />
          <Route path=":hashCode" element={<NewPassForm />} />
        </Route>
      </Routes>

      <Image
        w="100%"
        objectFit="cover"
        objectPosition="right"
        display={{ base: 'none', md: 'none', lg: 'flex' }}
        src={
          location.pathname?.includes('recovery')
            ? loginRecoveryBg
            : colorMode === 'dark'
            ? loginDarkBg
            : loginLightBg
        }
      />
    </Flex>
  );
};

export default Login;
