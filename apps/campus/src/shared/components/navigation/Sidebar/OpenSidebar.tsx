import { useContext } from 'react';

import { Sidebar } from './Sidebar';
import { MovilSidebar } from './MovilSidebar';
import { LayoutContext } from '../../../context';

const OpenSidebar = () => {
  const { showSidebar, sidebarState, isMobile } = useContext(LayoutContext);

  return showSidebar && isMobile ? (
    <MovilSidebar state={sidebarState} />
  ) : showSidebar ? (
    <Sidebar />
  ) : (
    <></>
  );
};

export { OpenSidebar };
