import { useContext, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import {
  BiStar,
  BiHome,
  BiRocket,
  BiDirections,
  BiBadgeCheck,
  BiBookBookmark,
  BiNetworkChart,
  BiConversation,
  BiNews,
} from 'react-icons/bi';
import { Flex } from '@chakra-ui/react';

import { NavLinkNoMobile } from './NavLinkNoMobile';
import { CampusPages, LoginContext, ThemeContext, VisibilityContext } from '../../../context';

import { LogoOB } from '../../../../../src/assets/logos/openbootcamp/LogoOB';
import { LogoOM } from '../../../../../src/assets/logos/openmarketers/LogoOM';
import { LogoOBFullBlack } from '../../../../../src/assets/logos/openbootcamp/LogoOBFullBlack';
import { LogoOBFullWhite } from '../../../../../src/assets/logos/openbootcamp/LogoOBFullWhite';
import { LogoOMFullBlack } from '../../../../../src/assets/logos/openmarketers/LogoOMFullBlack';
import { LogoOMFullWhite } from '../../../../../src/assets/logos/openmarketers/LogoOMFullWhite';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isHover, setIsHover] = useState(false);

  const { user } = useContext(LoginContext);
  const { themeMode } = useContext(ThemeContext);
  const { disabledPages } = useContext(VisibilityContext);

  const itinerarioRuta = user?.progresoGlobal?.rutaPro?.meta?.itinerario || user?.progresoGlobal?.ruta?.meta?.itinerario;

  return (
    <Flex
      data-cy="sidebar"
      zIndex={101}
      bg="white"
      height="100vh"
      position="fixed"
      overflow="visible"
      direction="column"
      borderRight="1px solid"
      borderRightColor="gray_3"
      transition="all 0.2s linear"
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      w={{ base: isHover ? '230px' : '86px', '2xl': '230px' }}
      minW={{ base: isHover ? '230px' : '86px', '2xl': '230px' }}
    >
      <Flex
        h="90px"
        align="center"
        cursor="pointer"
        overflow="hidden"
        data-cy="logo_ob"
        justify="flex-start"
        onClick={() => navigate('/')}
        pl={{ base: isHover ? '24px' : '0px', '2xl': '24px' }}
      >
        {process.env.REACT_APP_ORIGEN_CAMPUS === 'OPENBOOTCAMP' ? (
          themeMode === 'light' ? (
            <LogoOBFullBlack
              h="35"
              w="128"
              minW="128px"
              minH="35px"
              display={{ base: isHover ? 'flex' : 'none', '2xl': 'flex' }}
            />
          ) : (
            <LogoOBFullWhite
              h="35"
              w="128"
              minH="35px"
              minW="128px"
              display={{ base: isHover ? 'flex' : 'none', '2xl': 'flex' }}
            />
          )
        ) : themeMode === 'light' ? (
          <LogoOMFullBlack
            h="35"
            w="128"
            minH="35px"
            minW="128px"
            display={{ base: isHover ? 'flex' : 'none', '2xl': 'flex' }}
          />
        ) : (
          <LogoOMFullWhite
            h="35"
            w="128"
            minH="35px"
            minW="128px"
            display={{ base: isHover ? 'flex' : 'none', '2xl': 'flex' }}
          />
        )}

        <Flex pl="25px" display={{ base: isHover ? 'none' : 'flex', '2xl': 'none' }}>
          {process.env.REACT_APP_ORIGEN_CAMPUS === 'OPENBOOTCAMP' ? <LogoOB w="30" h="35" /> : <LogoOM w="30" h="35" />}
        </Flex>
      </Flex>

      <Flex direction="column" boxSize="100%" gap="7px" overflow="hidden" p="30px 0px 20px 0px" align="flex-start">
        <NavLinkNoMobile
          isHover={isHover}
          data-cy="sidebar_home"
          title="Inicio"
          to="/"
          icon={BiHome}
          isActive={location.pathname === '/'}
        />

        {!disabledPages?.includes(CampusPages.ROADMAP) && (
          <NavLinkNoMobile
            isHover={isHover}
            data-cy="sidebar_roadmap"
            title="Ruta"
            to="/roadmap"
            icon={BiDirections}
            isActive={location.pathname.startsWith('/roadmap')}
          />
        )}

        {!disabledPages?.includes(CampusPages.CURSOS) && (
          <NavLinkNoMobile
            isHover={isHover}
            data-cy="sidebar_cursos"
            title="Cursos"
            to="/cursos"
            icon={BiBookBookmark}
            isActive={location.pathname.startsWith('/cursos')}
          />
        )}

        {!disabledPages?.includes(CampusPages.CERTIFICACIONES) && (
          <NavLinkNoMobile
            isHover={isHover}
            data-cy="sidebar_certificaciones"
            title="Certificaciones"
            to="/certificaciones"
            icon={BiBadgeCheck}
            isActive={location.pathname.startsWith('/certificaciones')}
          />
        )}

        {!disabledPages?.includes(CampusPages.BOOSTS) && (
          <NavLinkNoMobile
            isHover={isHover}
            data-cy="sidebar_boosts"
            title="Boosts"
            to="/boosts"
            icon={BiRocket}
            isActive={location.pathname.startsWith('/boosts')}
          />
        )}

        {!disabledPages?.includes(CampusPages.FORO) && (
          <NavLinkNoMobile
            isHover={isHover}
            data-cy="sidebar_foro"
            title="Foros"
            to="/foro"
            icon={BiConversation}
            isActive={location.pathname.startsWith('/foro')}
            state={{
              cursoId: itinerarioRuta ? itinerarioRuta[0].id : undefined,
            }}
          />
        )}

        {!disabledPages?.includes(CampusPages.NOTICIAS) && (
          <NavLinkNoMobile
            isHover={isHover}
            data-cy="sidebar_noticias"
            title="Noticias"
            to="/noticias"
            icon={BiNews}
            isActive={location.pathname.startsWith('/noticias')}
          />
        )}

        {!disabledPages?.includes(CampusPages.COMUNIDAD) && (
          <NavLinkNoMobile
            isHover={isHover}
            data-cy="sidebar_comunidad"
            title="Comunidad"
            to="/comunidad"
            icon={BiNetworkChart}
            isActive={location.pathname.startsWith('/comunidad')}
          />
        )}

        {!disabledPages?.includes(CampusPages.FAVORITOS) && (
          <NavLinkNoMobile
            isHover={isHover}
            data-cy="sidebar_favoritos"
            title="Favoritos"
            to="/favoritos"
            icon={BiStar}
            isActive={location.pathname.startsWith('/favoritos')}
          />
        )}
      </Flex>
    </Flex>
  );
};

export { Sidebar };
