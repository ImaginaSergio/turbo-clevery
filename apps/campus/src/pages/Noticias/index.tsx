import { useContext, useEffect, useState } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { useDisclosure } from '@chakra-ui/react';

import {
  Header,
  CalendarDrawer,
  NotificationsDrawer,
} from '../../shared/components';
import { LayoutContext, LoginContext } from '../../shared/context';
import { debounce } from 'lodash';
import ListadoNoticias from './pages/Listado';

const Foro = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user } = useContext(LoginContext);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpen_Notis,
    onOpen: onOpen_Notis,
    onClose: onClose_Notis,
  } = useDisclosure();

  const { showHeader, setShowHeader, setShowSidebar } =
    useContext(LayoutContext);

  useEffect(() => {
    setShowHeader(true);
    setShowSidebar(true);
  }, []);

  return (
    <>
      {showHeader && (
        <Header
          showSearchbar
          title="Noticias"
          calendarState={{ isOpen, onOpen }}
          notificationsState={{ isOpen: isOpen_Notis, onOpen: onOpen_Notis }}
          goBack={
            pathname.startsWith('/foro/') ? () => navigate(-1) : undefined
          }
        />
      )}

      <div className="page-container">
        <Routes>
          <Route index element={<ListadoNoticias />} />
        </Routes>

        <CalendarDrawer state={{ isOpen, onClose }} />
        <NotificationsDrawer
          state={{ isOpen: isOpen_Notis, onClose: onClose_Notis }}
        />
      </div>
    </>
  );
};

export default Foro;
