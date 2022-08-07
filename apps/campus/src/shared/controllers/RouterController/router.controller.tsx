import { useContext } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { Box } from '@chakra-ui/react';

import { UserRolEnum } from 'data';
import { isRoleAllowed } from 'utils';

import { CampusPages, LayoutContext, LoginContext, VisibilityContext } from '../../context';
import { RequireAuth } from '../../components';

/** Page imports */
import Home from '../../../pages/Home';
import Foro from '../../../pages/Foro';
import Login from '../../../pages/Login';
import Boosts from '../../../pages/Boosts';
import Cursos from '../../../pages/Cursos';
import Perfil from '../../../pages/Perfil';
import Roadmap from '../../../pages/Roadmap';
import Register from '../../../pages/Register';
import Noticias from '../../../pages/Noticias';
import Comunidad from '../../../pages/Comunidad';
import Favoritos from '../../../pages/Favoritos';
import Certificaciones from '../../../pages/Certificaciones';

export const RouterController = ({ children, ...props }: any) => {
  const { user } = useContext(LoginContext);
  const { disabledPages } = useContext(VisibilityContext);
  const { showSidebar, isMobile } = useContext(LayoutContext);

  return (
    <Box className="app-container" pl={isMobile ? 'unset' : showSidebar ? { base: '86px', '2xl': '230px' } : 'unset'}>
      <Routes>
        <Route element={<RequireAuth isAuthenticated={!!user && user.activo} />}>
          <Route path="/" element={<Home />} />
        </Route>

        {!disabledPages?.includes(CampusPages.CURSOS) && (
          <Route element={<RequireAuth isAuthenticated={!!user && user.activo} />}>
            <Route path="cursos/*" element={<Cursos />} />
          </Route>
        )}

        {!disabledPages?.includes(CampusPages.PERFIL) && (
          <Route element={<RequireAuth isAuthenticated={!!user && user.activo} />}>
            <Route path="perfil/*" element={<Perfil />} />
          </Route>
        )}

        {!disabledPages?.includes(CampusPages.ROADMAP) && (
          <Route element={<RequireAuth isAuthenticated={!!user && user.activo} />}>
            <Route path="roadmap/*" element={<Roadmap />} />
          </Route>
        )}

        {!disabledPages?.includes(CampusPages.BOOSTS) && (
          <Route element={<RequireAuth isAuthenticated={!!user && user.activo} />}>
            <Route path="boosts/*" element={<Boosts />} />
          </Route>
        )}

        {!disabledPages?.includes(CampusPages.COMUNIDAD) && (
          <Route element={<RequireAuth isAuthenticated={!!user && user.activo} />}>
            <Route path="comunidad/*" element={<Comunidad />} />
          </Route>
        )}

        {!disabledPages?.includes(CampusPages.CERTIFICACIONES) && (
          <Route element={<RequireAuth isAuthenticated={!!user && user.activo} />}>
            <Route path="certificaciones/*" element={<Certificaciones />} />
          </Route>
        )}

        {!disabledPages?.includes(CampusPages.NOTICIAS) && (
          <Route element={<RequireAuth isAuthenticated={!!user && user.activo} />}>
            <Route path="noticias/*" element={<Noticias />} />
          </Route>
        )}

        {!disabledPages?.includes(CampusPages.FAVORITOS) && (
          <Route element={<RequireAuth isAuthenticated={!!user && user.activo} />}>
            <Route path="favoritos/*" element={<Favoritos />} />
          </Route>
        )}

        {!disabledPages?.includes(CampusPages.FORO) && (
          <Route element={<RequireAuth isAuthenticated={!!user && user.activo} />}>
            <Route path="foro/*" element={<Foro />} />
          </Route>
        )}

        {!disabledPages?.includes(CampusPages.REGISTER) && <Route path="register/*" element={<Register />} />}

        <Route path="login/*" element={<Login />} />

        <Route element={<RequireAuth isAuthenticated={!!user} />}>
          <Route path="*" element={<Navigate to="/" />} />
        </Route>
      </Routes>
    </Box>
  );
};
