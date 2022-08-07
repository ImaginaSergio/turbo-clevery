import { useContext, useEffect } from 'react';
import { useDisclosure } from '@chakra-ui/react';

import {
  Header,
  CalendarDrawer,
  NotificationsDrawer,
} from '../../shared/components';
import RoadmapList from './views/Listado';
import { LayoutContext } from '../../shared/context';

const Roadmap = () => {
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
          title="Hoja de ruta"
          calendarState={calendarState}
          notificationsState={notisState}
        />
      )}

      <div className="page-container">
        <RoadmapList />

        <CalendarDrawer state={calendarState} />
        <NotificationsDrawer state={notisState} />
      </div>
    </>
  );
};

export default Roadmap;
