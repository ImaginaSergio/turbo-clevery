import { useContext } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';

import { useDisclosure } from '@chakra-ui/react';

import {
  Header,
  CalendarDrawer,
  NotificationsDrawer,
} from '../../shared/components';
import { LayoutContext } from '../../shared/context';

import ProyectosExam from './views/Examen';
import ProyectosCover from './views/Portada';

const Proyectos = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const { showHeader } = useContext(LayoutContext);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const {
    isOpen: isOpen_Notis,
    onOpen: onOpen_Notis,
    onClose: onClose_Notis,
  } = useDisclosure();

  return (
    <>
      {showHeader && (
        <Header
          showSearchbar
          title="Proyectos"
          calendarState={{ isOpen, onOpen }}
          notificationsState={{ isOpen: isOpen_Notis, onOpen: onOpen_Notis }}
          goBack={
            pathname !== '/proyectos' ? () => navigate('/proyectos') : undefined
          }
        />
      )}

      <div className="page-container">
        <Routes>
          <Route path=":proyectoId" element={<ProyectosCover />} />
          <Route path=":proyectoId/examen" element={<ProyectosExam />} />
        </Routes>

        <CalendarDrawer state={{ isOpen, onClose }} />

        <NotificationsDrawer
          state={{ isOpen: isOpen_Notis, onClose: onClose_Notis }}
        />
      </div>
    </>
  );
};

export default Proyectos;
