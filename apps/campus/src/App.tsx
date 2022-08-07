import { useEffect, useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

/* Third-party imports */
import TagManager from 'react-gtm-module';
import { Flex, Spinner, useToast, ChakraProvider } from '@chakra-ui/react';

/** Own component imports */
import {
  LayoutController,
  TestABController,
  RouterController,
  FavoritosController,
  PusherController,
} from './shared/controllers';
import { theme } from 'ui';
import { onFailure } from 'ui';
import { OpenSidebar } from './shared/components';
import { IUser, UserRolEnum } from 'data';
import { CampusPages, LoginContext, ThemeContext, VisibilityContext } from './shared/context';
import { getItem, getUserByID, LOGIN_TOKEN, LOGIN_USER, setItem, setItemWithExpire, removeItem } from 'data';

/** Style imports */
import './styles.scss';

const getTheme = (user: IUser) => {
  let data = user?.preferencias?.theme || localStorage.getItem('chakra-ui-color-mode');

  return data === 'light' || data === 'dark' ? data : 'light';
};

function App() {
  const toast = useToast();

  const [token, setToken] = useState<string>();
  const [user, setUser] = useState<IUser | null>();
  const [firstLoad, setFirstLoad] = useState<boolean>(true);
  const [totalPerfil, setTotalPerfil] = useState<number>(0);
  const [disabledPages, setDisabledPages] = useState<CampusPages[]>([]);
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // DEBUG
    console.log('#############################');
    console.log('🏚️ Entorno: ' + process.env.NODE_ENV);
    console.log('#############################');

    // Inicializamos el GTM
    TagManager.initialize({ gtmId: process.env.REACT_APP_GTM_ID || '' });

    const storageUser = getItem(LOGIN_USER);
    const storageToken = getItem(LOGIN_TOKEN);

    // Si existe token en localStorage probamos a hacer login con él.
    // Si no, limpiamos la información redundante.
    if (storageToken && storageUser)
      login({ token: storageToken }, storageUser?.id, true).catch(() => {
        onFailure(toast, 'Error inesperado', 'Fallo al iniciar sesión.');
        logout();
      });
    else logout();
  }, []);

  useEffect(() => {
    if (user !== undefined) {
      if (user) {
        const _themeMode: 'light' | 'dark' = getTheme(user);

        setThemeMode(_themeMode);
        localStorage.setItem('chakra-ui-color-mode', _themeMode);

        checkDisabledPages();

        calcTotalPerfil();
      }

      if (firstLoad) setFirstLoad(false);
    }
  }, [user]);

  const checkDisabledPages = () => {
    let _disabledPages: CampusPages[] = [];

    (process.env.REACT_APP_DISABLED_PAGES?.split(' ') || []).forEach((page: any) => {
      if (Object.values(CampusPages).includes(page)) _disabledPages.push(page);
    });

    if (user?.rol === UserRolEnum.ESTUDIANTE) {
      let showForo = user.empresa?.configCampus?.estudiante?.campus?.FORO_SHOW
        ? user.empresa?.configCampus?.estudiante?.campus?.FORO_SHOW?.value
        : true;

      if (!showForo && !_disabledPages?.includes(CampusPages.FORO)) _disabledPages.push(CampusPages.FORO);
    }

    setDisabledPages([..._disabledPages]);
  };

  const calcTotalPerfil = () => {
    const total = 12;
    let calc = 0;

    // Tab Perfil
    if (!!user?.email) calc += 1;
    if (!!user?.nombre) calc += 1;
    if (!!user?.apellidos) calc += 1;
    if (!!user?.telefono) calc += 1;
    if (!!user?.linkedin) calc += 1;
    if (user?.pais !== null) calc += 1;
    // if (user?.estado !== null) calc += 1; Como faltan estados de algunos paises, no calculamos.

    // Tab Empleo
    if (user?.trabajoRemoto !== null) calc += 1;
    if (!!user?.expectativasSalarialesMin) calc += 1;
    if (!!user?.expectativasSalarialesMax) calc += 1;
    if (typeof user?.tieneExperiencia === 'boolean') calc += 1;
    if (typeof user?.posibilidadTraslado === 'boolean') calc += 1;
    if (typeof user?.actualmenteTrabajando === 'boolean') calc += 1;

    setTotalPerfil(Math.floor((calc * 100) / total));
  };

  const login = async (_token: { token: string; type?: string }, userId: any, saveInStorage: boolean) => {
    // Si encontramos algún error, dejamos la petición.
    if (!_token.token || !userId) {
      logout();

      return Promise.reject('¡Faltan datos!');
    }

    // Guardamos el token en la contextAPI
    setToken(_token.token);

    // Y también en el localStorage para posteriores inicios de sesión durante una semana.
    // Si no quiere guardar sesión, guardaremos únicamente durante 1h.
    if (saveInStorage) setItem(LOGIN_TOKEN, _token.token);
    else setItemWithExpire(LOGIN_TOKEN, _token.token);

    // Y también recuperamos los datos del usuario
    const _user: IUser = await getUserByID({
      id: userId,
      client: 'campus',
      strategy: 'invalidate-on-undefined',
    });

    // Si encontramos algún error, dejamos la petición.
    if (!_user) {
      logout();

      return Promise.reject('¡Fallo al pedir datos del usuario!');
    }

    if (_user?.id) setUser({ ..._user });
    else console.error({ '⚠️ Error actualizando el usuario': _user });

    // Y los guardamos en local o session storage según convenga.
    if (saveInStorage) setItem(LOGIN_USER, { ..._user });
    else setItemWithExpire(LOGIN_USER, { ..._user });

    return Promise.resolve({ user: _user });
  };

  const logout = () => {
    setUser(null);
    setToken(undefined);

    removeItem(LOGIN_USER);
    removeItem(LOGIN_TOKEN);
  };

  window.addEventListener('keydown', function (e) {
    if (e.keyCode == 32 && e.target == document.body) {
      e.preventDefault();
    }
  });

  return (
    <Router basename="/">
      <ChakraProvider theme={theme}>
        {firstLoad ? (
          <Flex w="100%" h="100vh" align="center" justify="center">
            <Spinner boxSize="40px" />
          </Flex>
        ) : (
          <LoginContext.Provider
            value={{
              user,
              setUser,
              token,
              setToken,
              login,
              logout,
              totalPerfil,
            }}
          >
            <PusherController>
              <ThemeContext.Provider value={{ themeMode, setThemeMode }}>
                <VisibilityContext.Provider value={{ disabledPages, setDisabledPages }}>
                  <TestABController>
                    <LayoutController>
                      <FavoritosController>
                        <Flex className="app" transition="color 0.7s ease, background-color 0.7s ease">
                          <OpenSidebar />

                          <RouterController />
                        </Flex>
                      </FavoritosController>
                    </LayoutController>
                  </TestABController>
                </VisibilityContext.Provider>
              </ThemeContext.Provider>
            </PusherController>
          </LoginContext.Provider>
        )}
      </ChakraProvider>
    </Router>
  );
}

export default App;
