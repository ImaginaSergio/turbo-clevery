import { useContext, useEffect } from 'react';

import { useDisclosure } from '@chakra-ui/react';

import {
  Header,
  CalendarDrawer,
  NotificationsDrawer,
} from '../../shared/components';
import FavoritosList from './views/List';
import { LayoutContext } from '../../shared/context';

const Favoritos = () => {
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
          title="Favoritos"
          calendarState={calendarState}
          notificationsState={notisState}
        />
      )}

      <div className="page-container">
        <FavoritosList />

        <CalendarDrawer state={calendarState} />
        <NotificationsDrawer state={notisState} />
      </div>
    </>
  );
};

export default Favoritos;
