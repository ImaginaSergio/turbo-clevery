import { useContext, useEffect } from 'react';
import { useDisclosure } from '@chakra-ui/react';

import {
  Header,
  CalendarDrawer,
  NotificationsDrawer,
} from '../../shared/components';
import { HomeDashboard } from './views/Dashboard';
import { LayoutContext } from '../../shared/context';

const Home = () => {
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
          title="Inicio"
          calendarState={calendarState}
          notificationsState={notisState}
        />
      )}

      <div className="page-container">
        <HomeDashboard />

        <CalendarDrawer state={calendarState} />
        <NotificationsDrawer state={notisState} />
      </div>
    </>
  );
};

export default Home;
