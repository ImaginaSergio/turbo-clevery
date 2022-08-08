import { useEffect, useState } from 'react';
import { Route, Routes, Navigate, BrowserRouter as Router } from 'react-router-dom';

/** Page imports */
import Login from './pages/Login';
import Clientes from './pages/Clientes';
import Alumnado from './pages/Alumnado';
import Contenidos from './pages/Contenidos';
import Miscelanea from './pages/Miscelanea';
import Configuracion from './pages/Configuracion';

/* Component imports */
import { Sidebar, RequireAuth } from './shared/components';

/* Third-party imports */
import ClipboardJS from 'clipboard';
import { ChakraProvider, Flex, Spinner, useColorMode } from '@chakra-ui/react';

/** Other imports */
import {
  IUser,
  getItem,
  setItem,
  removeItem,
  LOGIN_USER,
  LOGIN_TOKEN,
  UserRolEnum,
  getUserByID,
  setItemWithExpire,
} from 'data';
import { theme } from 'ui';
import { isRoleAllowed } from 'utils';
import { LoginContext, QueryContext, ThemeContext } from './shared/context';

/** Style imports */
import './styles.scss';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

function App() {
  const { colorMode, toggleColorMode } = useColorMode();

  const [page, setPage] = useState<string>('');
  const [firstLoad, setFirstLoad] = useState<boolean>(true);
  const [query, setQuery] = useState<Map<string, any>>(new Map<string, any>());

  const [user, setUser] = useState<any>();
  const [token, setToken] = useState<string>();
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('light');

  const clipboard = new ClipboardJS('.clipboard-button');

  useEffect(() => {
    const storageUser = getItem(LOGIN_USER);
    const storageToken = getItem(LOGIN_TOKEN);

    // Si existe token en localStorage probamos a hacer login con él.
    // Si no, limpiamos la información redundante.
    if (storageToken) login({ token: storageToken }, storageUser.id, true);
    else logout();

    // Hasta que tengamos diseñado el tema oscuro, forzamos el modo claro (conflictos en localhost)
    if (colorMode === 'dark') toggleColorMode();

    return () => {
      clipboard.destroy();
    };
  }, []);

  const login = async (_token: { token: string; type?: string }, userId: number, saveInStorage: boolean) => {
    // Guardamos el token en la contextAPI
    setToken(_token.token);

    // Y también en el localStorage para posteriores inicios de sesión durante una semana.
    // Si no quiere guardar sesión, guardaremos únicamente durante 1h.
    if (saveInStorage) setItem(LOGIN_TOKEN, _token.token);
    else setItemWithExpire(LOGIN_TOKEN, _token.token);

    // Y también recuperamos los datos del usuario
    const _user: IUser = await getUserByID({ id: userId, client: 'admin' });

    if (_user?.id && isRoleAllowed([UserRolEnum.ADMIN, UserRolEnum.SUPERVISOR], _user?.rol)) {
      setUser({ ..._user });

      // Y los guardamos en local o session storage según convenga.
      if (saveInStorage) setItem(LOGIN_USER, { ..._user });
      else setItemWithExpire(LOGIN_USER, { ..._user });
    } else {
      logout();
    }

    return Promise.resolve();
  };

  useEffect(() => {
    if (user !== undefined) setFirstLoad(false);
  }, [user]);

  const logout = () => {
    setUser(null);
    setToken(undefined);

    removeItem(LOGIN_USER);
    removeItem(LOGIN_TOKEN);
  };

  return (
    <Router basename="/">
      <ChakraProvider theme={theme}>
        <LoginContext.Provider value={{ user, setUser, token, setToken, login, logout }}>
          <ThemeContext.Provider value={{ themeMode, setThemeMode }}>
            <QueryContext.Provider
              value={{
                page,
                setPage,
                query,
                resetQuery: () => setQuery(new Map<string, any>()),
                setQuery: (key: string, value: any) => setQuery(new Map<string, any>(query.set(key, value))),
              }}
            >
              <div className="app">
                {firstLoad ? (
                  <Flex w="100%" h="100vh" align="center" justify="center">
                    <Spinner boxSize="40px" />
                  </Flex>
                ) : (
                  <>
                    {user && <Sidebar />}

                    <div className="app-container">
                      <Routes>
                        <Route element={<RequireAuth isAuthenticated={isRoleAllowed([UserRolEnum.ADMIN], user?.rol)} />}>
                          <Route path="miscelanea/*" element={<Miscelanea />} />
                        </Route>

                        <Route element={<RequireAuth isAuthenticated={isRoleAllowed([UserRolEnum.ADMIN], user?.rol)} />}>
                          <Route path="contenidos/*" element={<Contenidos />} />
                        </Route>

                        <Route element={<RequireAuth isAuthenticated={isRoleAllowed([UserRolEnum.ADMIN], user?.rol)} />}>
                          <Route path="clientes/*" element={<Clientes />} />
                        </Route>

                        <Route
                          element={
                            <RequireAuth
                              isAuthenticated={isRoleAllowed(
                                [UserRolEnum.ADMIN, UserRolEnum.SUPERVISOR, UserRolEnum.PROFESOR],
                                user?.rol
                              )}
                            />
                          }
                        >
                          <Route path="alumnado/*" element={<Alumnado />} />
                        </Route>

                        <Route element={<RequireAuth isAuthenticated={isRoleAllowed([UserRolEnum.ADMIN], user?.rol)} />}>
                          <Route path="configuracion/*" element={<Configuracion />} />
                        </Route>

                        <Route path="login/*" element={<Login />} />

                        <Route
                          path="*"
                          element={
                            isRoleAllowed([UserRolEnum.SUPERVISOR], user?.rol) ? (
                              <Navigate to="/alumnado" />
                            ) : (
                              <Navigate to="/contenidos" />
                            )
                          }
                        />
                      </Routes>
                    </div>
                  </>
                )}
              </div>
            </QueryContext.Provider>
          </ThemeContext.Provider>
        </LoginContext.Provider>
      </ChakraProvider>
    </Router>
  );
}

export default App;
