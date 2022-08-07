import { useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import {
  BiX,
  BiHome,
  BiStar,
  BiRocket,
  BiDirections,
  BiBadgeCheck,
  BiBookBookmark,
  BiConversation,
  BiNetworkChart,
  BiNews,
} from 'react-icons/bi';
import { Flex, Icon, IconButton, Drawer, DrawerBody, DrawerHeader, DrawerOverlay, DrawerContent } from '@chakra-ui/react';

import { NavLink } from './NavLink';
import { CampusPages, LoginContext, ThemeContext } from '../../../context';

import { LogoOBFullBlack } from '../../../../assets/logos/openbootcamp/LogoOBFullBlack';
import { LogoOBFullWhite } from '../../../../assets/logos/openbootcamp/LogoOBFullWhite';
import { LogoOMFullBlack } from '../../../../assets/logos/openmarketers/LogoOMFullBlack';
import { LogoOMFullWhite } from '../../../../assets/logos/openmarketers/LogoOMFullWhite';

type MovilSidebarProps = {
  state: { isOpen: boolean; onClose: () => void };
};

const MovilSidebar = ({ state }: MovilSidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const { user } = useContext(LoginContext);
  const { themeMode } = useContext(ThemeContext);

  const disabledPages = process.env.REACT_APP_DISABLED_PAGES?.split(' ');

  return (
    <Drawer placement="left" isOpen={state.isOpen} onClose={state.onClose}>
      <DrawerOverlay />

      <DrawerContent bg="white">
        <DrawerHeader>
          <Flex w="100%" align="center" justify="space-between">
            <Flex
              h="90px"
              pl="10px"
              align="center"
              cursor="pointer"
              onClick={() => navigate('/')}
              style={{ transition: 'all 0.6s ease-in-out' }}
            >
              {process.env.REACT_APP_ORIGEN_CAMPUS === 'OPENBOOTCAMP' ? (
                themeMode === 'light' ? (
                  <LogoOBFullBlack h="35" w="128" />
                ) : (
                  <LogoOBFullWhite h="35" w="128" />
                )
              ) : themeMode === 'light' ? (
                <LogoOMFullBlack h="35" w="128" />
              ) : (
                <LogoOMFullWhite h="35" w="128" />
              )}
            </Flex>

            <IconButton
              bg="transparent"
              aria-label="Cerrar Sidebar"
              onClick={state.onClose}
              icon={<Icon as={BiX} boxSize="30px" color="gray_4" />}
            />
          </Flex>
        </DrawerHeader>

        <DrawerBody p="0px">
          <Flex direction="column" h="100%" w="100%" gap="7px" overflow="auto" p="30px 0px 20px 0px" align="flex-start">
            <NavLink title="Inicio" to="/" icon={BiHome} isActive={location.pathname === '/'} onClose={state.onClose} />

            {!disabledPages?.includes('roadmap') && (
              <NavLink
                title="Hoja de ruta"
                to="/roadmap"
                icon={BiDirections}
                isActive={location.pathname.startsWith('/roadmap')}
                onClose={state.onClose}
              />
            )}

            {!disabledPages?.includes('cursos') && (
              <NavLink
                title="Cursos"
                to="/cursos"
                icon={BiBookBookmark}
                isActive={location.pathname.startsWith('/cursos')}
                onClose={state.onClose}
              />
            )}

            {!disabledPages?.includes('certificaciones') && (
              <NavLink
                title="Certificaciones"
                to="/certificaciones"
                icon={BiBadgeCheck}
                isActive={location.pathname.startsWith('/certificaciones')}
                onClose={state.onClose}
              />
            )}

            {!disabledPages?.includes('boosts') && (
              <NavLink
                title="Boosts"
                to="/boosts"
                icon={BiRocket}
                isActive={location.pathname.startsWith('/boosts')}
                onClose={state.onClose}
              />
            )}

            {!disabledPages?.includes('foro') && (
              <NavLink
                title="Foros"
                to="/foro"
                icon={BiConversation}
                isActive={location.pathname.startsWith('/foro')}
                onClose={state.onClose}
              />
            )}

            {!disabledPages?.includes(CampusPages.NOTICIAS) && (
              <NavLink
                title="Noticias"
                to="/noticias"
                icon={BiNews}
                isActive={location.pathname.startsWith('/noticias')}
                onClose={state.onClose}
              />
            )}

            {!disabledPages?.includes('comunidad') && (
              <NavLink
                title="Comunidad"
                to="/comunidad"
                icon={BiNetworkChart}
                isActive={location.pathname.startsWith('/comunidad')}
                onClose={state.onClose}
              />
            )}

            {!disabledPages?.includes('favoritos') && (
              <NavLink
                title="Favoritos"
                to="/favoritos"
                icon={BiStar}
                isActive={location.pathname.startsWith('/favoritos')}
                onClose={state.onClose}
              />
            )}
          </Flex>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export { MovilSidebar };
