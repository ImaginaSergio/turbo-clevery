import { createContext } from 'react';

interface ContextProps {
  showHeader?: boolean;
  setShowHeader: (e: any) => void;

  showSidebar?: boolean;
  setShowSidebar: (e: any) => void;

  onOpenSidebar?: (e: any) => void;

  isMobile?: any;

  sidebarState: {
    isOpen: boolean;
    onOpen: (e?: any) => void;
    onClose: (e?: any) => void;
  };
}

export const LayoutContext = createContext<ContextProps>({
  showHeader: true,
  setShowHeader: (e: any) => {},
  showSidebar: true,
  setShowSidebar: (e: any) => {},
  sidebarState: {
    isOpen: true,
    onOpen: (e: any) => {},
    onClose: (e: any) => {},
  },
});
