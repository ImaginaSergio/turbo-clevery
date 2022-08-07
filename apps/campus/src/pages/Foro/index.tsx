import { useCallback, useContext, useEffect, useState } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';

import smartlookClient from 'smartlook-client';
import { useDisclosure } from '@chakra-ui/react';

import ForoTopic from './views/Tema';
import ForoList from './views/Listado';
import NuevoTema from './views/NuevoTema';
import ForoPregunta from './views/Pregunta';
import NuevaPregunta from './views/NuevaPregunta';

import { getVotos, addVoto as serverAddVoto, updateVoto as serverUpdateVoto, removeVoto as serverRemoveVoto } from 'data';
import { IForoVoto } from 'data';

import { Header, CalendarDrawer, NotificationsDrawer } from '../../shared/components';
import { LayoutContext, LoginContext, VotosContext } from '../../shared/context';
import { debounce } from 'lodash';

const Foro = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user } = useContext(LoginContext);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isOpen_Notis, onOpen: onOpen_Notis, onClose: onClose_Notis } = useDisclosure();

  const { showHeader, setShowHeader, setShowSidebar } = useContext(LayoutContext);

  const [votos, setVotos] = useState<IForoVoto[]>([]);
  const [tiempoForo, setTiempoForo] = useState<number>(1);

  useEffect(() => {
    setShowHeader(true);
    setShowSidebar(true);

    const intervalId = setInterval(() => {
      setTiempoForo((prev) => {
        smartlookClient.track('TiempoForo', { TiempoForo: prev });

        return prev + 1;
      });
    }, 60 * 1000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    // TODO: Queremos borrar esta petición y filtrar los votos por preguntaId
    // ¡Solo pediremos votos al entrar en las preguntas!

    (async () => {
      const dataVotos = await getVotos({
        query: [{ user_id: user?.id }, { limit: 10000 }],
      });

      setVotos([...(dataVotos || [])]);
    })();
  }, [user]);

  // TODO: WIP (faltan endpoints de back)
  const filterVotos = (query: string) => {};

  const addVoto = useCallback(
    (newVoto: IForoVoto, tipo: 'pregunta' | 'respuesta') => {
      // Validamos antes de meter votos duplicados
      const key: 'preguntaId' | 'respuestaId' = tipo === 'pregunta' ? 'preguntaId' : 'respuestaId';

      if (votos.find((v) => v[key] == newVoto[key] && v.userId == newVoto.userId)) return;

      debounceAddVoto(newVoto, key);
    },
    [votos]
  );

  const updateVoto = useCallback(
    (newVoto: IForoVoto, tipo: 'pregunta' | 'respuesta') => {
      const key: 'preguntaId' | 'respuestaId' = tipo === 'pregunta' ? 'preguntaId' : 'respuestaId';

      debounceUpdateVoto(newVoto, key);
    },
    [votos]
  );

  const removeVoto = useCallback(
    (voto: IForoVoto, tipo: 'pregunta' | 'respuesta') => {
      const key: 'preguntaId' | 'respuestaId' = tipo === 'pregunta' ? 'preguntaId' : 'respuestaId';

      debounceRemoveVoto(voto, key);
    },
    [votos]
  );

  const debounceRemoveVoto = debounce((voto: any, key: any) => {
    const last: any[] = [...votos]
      .map((v: any) => (v[key] == voto[key] && v?.id == voto?.id ? undefined : v))
      .filter((v: any) => v);

    setVotos([...last]);
    if (voto.id) serverRemoveVoto({ id: voto?.id });
  }, 10);

  const debounceUpdateVoto = debounce((newVoto: any, key: any) => {
    const last: any[] = [...votos].map((v: any) => (v[key] == newVoto[key] && v.id === newVoto.id ? newVoto : v));
    setVotos([...last]);
    if (newVoto.id) serverUpdateVoto({ id: newVoto.id, voto: newVoto });
  }, 10);

  const debounceAddVoto = debounce((newVoto: any, key: any) => {
    setVotos((last) => [...last, newVoto]);
    serverAddVoto({ voto: newVoto }).then((value) => {
      newVoto.id = value?.value?.id;
      setVotos((last) => [...last]);
      const last: any[] = [...votos]
        .map((v: any) => (v[key] == newVoto[key] && v?.id == newVoto?.id ? undefined : v))
        .filter((v: any) => v);

      setVotos([...last, newVoto]);
    });
  }, 10);

  return (
    <>
      {showHeader && (
        <Header
          showSearchbar
          title="Foros"
          calendarState={{ isOpen, onOpen }}
          notificationsState={{ isOpen: isOpen_Notis, onOpen: onOpen_Notis }}
          goBack={pathname.startsWith('/foro/') ? () => navigate(-1) : undefined}
        />
      )}

      <div className="page-container">
        <VotosContext.Provider value={{ votos, addVoto, updateVoto, removeVoto, filterVotos }}>
          <Routes>
            <Route index element={<ForoList />} />
            <Route path="new" element={<NuevoTema />} />
            <Route path=":temaId">
              <Route index element={<ForoTopic />} />
              <Route path="new" element={<NuevaPregunta />} />
              <Route path=":preguntaId" element={<ForoPregunta />} />
            </Route>
          </Routes>
        </VotosContext.Provider>

        <CalendarDrawer state={{ isOpen, onClose }} />
        <NotificationsDrawer state={{ isOpen: isOpen_Notis, onClose: onClose_Notis }} />
      </div>
    </>
  );
};

export default Foro;
