import { useState } from 'react';
import { isMobile as isMobileBrowser } from 'react-device-detect';

import { useDisclosure, useMediaQuery } from '@chakra-ui/react';

import { LayoutContext } from '../../context';

export const LayoutController = ({ children, ...props }: any) => {
  const [showHeader, setShowHeader] = useState<boolean>(true);
  const [showSidebar, setShowSidebar] = useState<boolean>(true);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [isMobile] = useMediaQuery('(max-width: 768px)');

  return (
    <LayoutContext.Provider
      value={{
        showHeader,
        showSidebar,
        setShowHeader,
        setShowSidebar,
        isMobile: isMobile || isMobileBrowser,
        sidebarState: { isOpen, onOpen, onClose },
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
};
