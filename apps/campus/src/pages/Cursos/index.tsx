import { useState, useContext, useEffect } from 'react';
import { Route, useLocation, Routes, useNavigate } from 'react-router-dom';

import { useDisclosure } from '@chakra-ui/react';

import { Header, CalendarDrawer, NotificationsDrawer } from '../../shared/components';
import { getCookie } from 'data';
import { LayoutContext, LoginContext } from '../../shared/context';
import { MODALS_EVENT, ModalType, TestABModal } from '../../shared/controllers';

import Test from './views/Test/Test';
import Listado from './views/Listado';
import Portada from './views/Portada/Portada';
import Leccion from './views/Leccion';

import './Cursos.scss';

const Cursos = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user, totalPerfil } = useContext(LoginContext);

  const notisState = useDisclosure();
  const testABState = useDisclosure();
  const calendarState = useDisclosure();

  const { showHeader } = useContext(LayoutContext);

  const [popupType, setPopupType] = useState<ModalType>('trabajo');

  useEffect(() => {
    window.addEventListener(MODALS_EVENT, handleTestABEvent);

    return () => {
      window.removeEventListener(MODALS_EVENT, handleTestABEvent);
    };
  }, [user]);

  const handleTestABEvent = () => {
    // Si ya se ha abierto el popup recientemente, lo cerramos
    if (getCookie('popup-delay') !== undefined) return;

    // Si ya hemos completado todas las preguntas, cerramos.
    if (totalPerfil >= 100) return;

    let showTrabajo = typeof user?.actualmenteTrabajando !== 'boolean' && getCookie('trabajo') === undefined;

    let showTraslado = typeof user?.posibilidadTraslado !== 'boolean' && getCookie('traslado') === undefined;

    let showRemoto = user?.trabajoRemoto === null && getCookie('remoto') === undefined;

    let showHabilidades = typeof user?.tieneExperiencia !== 'boolean' && getCookie('habilidades') === undefined;

    let showTelefono = !user?.telefono && getCookie('telefono') === undefined;

    let showSalario =
      (!user?.expectativasSalarialesMax || !user?.expectativasSalarialesMin) && getCookie('salario') === undefined;

    let showLocalizacion = user?.pais === null && getCookie('localizacion') === undefined;

    let showLinkedIn = !user?.linkedin && getCookie('linkedin') === undefined;

    /** Sacamos qué tipo de popup mostrar */
    if (showTrabajo) setPopupType('trabajo');
    else if (showRemoto) setPopupType('remoto');
    else if (showTraslado) setPopupType('traslado');
    else if (showHabilidades) setPopupType('habilidades');
    else if (showTelefono) setPopupType('telefono');
    else if (showSalario) setPopupType('salario');
    else if (showLocalizacion) setPopupType('localizacion');
    else if (showLinkedIn) setPopupType('linkedin');
    // Si ya está toda la información completa, cancelamos.
    else return;

    testABState.onOpen();
  };

  return (
    <>
      {showHeader && (
        <Header
          showSearchbar
          title="Cursos"
          calendarState={calendarState}
          notificationsState={notisState}
          goBack={pathname !== '/cursos' ? () => navigate(-1) : undefined}
        />
      )}

      <div className="page-container">
        <Routes>
          <Route index element={<Listado />} />
          <Route path=":cursoId" element={<Portada />} />
          <Route path=":cursoId/test/:testId" element={<Test />} />
          <Route path=":cursoId/leccion/:leccionId" element={<Leccion />} />
        </Routes>

        <CalendarDrawer state={calendarState} />
        <NotificationsDrawer state={notisState} />

        <TestABModal type={popupType} variant="UNIQUE" state={testABState} />
      </div>
    </>
  );
};

export default Cursos;
