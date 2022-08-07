import { useContext, useEffect } from 'react';
import { Route, useLocation, Routes, useNavigate } from 'react-router-dom';

import { useDisclosure } from '@chakra-ui/react';

import {
  Header,
  CalendarDrawer,
  NotificationsDrawer,
} from '../../shared/components';
import { LayoutContext } from '../../shared/context';

import BoostsList from './views/Listado';
import BoostsCover from './views/Portada';

const Boosts = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const notisState = useDisclosure();
  const calendarState = useDisclosure();

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
          title="Boosts"
          calendarState={calendarState}
          notificationsState={notisState}
          goBack={
            pathname !== '/boosts' ? () => navigate('/boosts') : undefined
          }
        />
      )}

      <div className="page-container">
        <Routes>
          <Route index element={<BoostsList />} />
          <Route path=":boostId" element={<BoostsCover />} />
        </Routes>

        <CalendarDrawer state={calendarState} />
        <NotificationsDrawer state={notisState} />
      </div>
    </>
  );
};

export default Boosts;
