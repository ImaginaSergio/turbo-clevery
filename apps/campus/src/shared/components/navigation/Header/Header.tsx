import { useContext, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { isMobile as isMobileBrowser } from 'react-device-detect';

import { BiMenu, BiBell, BiCalendar, BiChevronLeft, BiLeftArrowAlt, BiChevronsRight } from 'react-icons/bi';

import { Icon, Box, Flex, Button, Text, IconButton, useColorMode, useMediaQuery } from '@chakra-ui/react';

import { LoginContext, ThemeContext, LayoutContext, VisibilityContext } from '../../../context';
import { Searchbar } from '../..';
import { useHover } from 'utils';
import { updateUser } from 'data';
import { UserMenu } from './UserMenu';

type HeaderProps = {
  title?: string;
  showSearchbar?: boolean;
  goBack?: (event: any) => void;
  breadcrumb?: {
    text: string;
    isActive?: boolean;
    onClick?: (event: any) => void;
  }[];
  hasAlerts?: boolean;
  calendarState: { isOpen: boolean; onOpen: () => void };
  notificationsState: { isOpen: boolean; onOpen: () => void };
};

export const Header = ({ title, goBack, breadcrumb, showSearchbar, calendarState, notificationsState }: HeaderProps) => {
  const navigate = useNavigate();

  const { disabledPages } = useContext(VisibilityContext);
  const { user, logout, totalPerfil } = useContext(LoginContext);
  const { showHeader, sidebarState, isMobile } = useContext(LayoutContext);

  const { themeMode, setThemeMode } = useContext(ThemeContext);
  const { toggleColorMode } = useColorMode();

  const hoverRef = useRef(null);
  const isHover = useHover(hoverRef);

  const [isLargerThan710] = useMediaQuery('(min-width: 710px)');

  // TODO: Usar TestABContexts
  const [isPopoverHover, setIsPopoverHover] = useState(false);

  const onThemeToggle = (e: any) => {
    const nextTheme = themeMode === 'dark' ? 'light' : 'dark';

    if (user?.id) {
      setThemeMode(nextTheme);

      updateUser({
        id: user?.id,
        user: {
          preferencias: { ...(user?.preferencias || {}), theme: nextTheme },
        },
      });

      toggleColorMode();
    }
  };

  return (
    <Flex
      top="0"
      w="100%"
      h="80px"
      bg="gray_1"
      minH="80px"
      zIndex={100}
      align="center"
      position="sticky"
      justify="space-between"
      transition="all 0.7s ease"
      px={{ base: '20px', md: '34px' }}
      display={showHeader ? 'flex' : 'none'}
    >
      <Flex align="center" maxW="fit-content" gap={{ base: '6px', sm: '30px' }}>
        {(isMobileBrowser || isMobile) && (
          <IconButton
            ref={hoverRef}
            bg="transparent"
            onClick={sidebarState.onOpen}
            aria-label="Abrir sidebar"
            _hover={{ backgroundColor: 'transparent' }}
            icon={<Icon boxSize={6} color="gray_4" as={isHover ? BiChevronsRight : BiMenu} />}
          />
        )}

        {goBack ? (
          <Button
            bg="gray_3"
            rounded="10px"
            pl={{ base: '22px', sm: '12px' }}
            w={{ base: '38px', sm: 'fit-content' }}
            h="38px"
            onClick={goBack}
            _hover={{ bg: 'gray_2' }}
            _focus={{ bg: 'gray_2' }}
            leftIcon={<Icon as={BiLeftArrowAlt} boxSize="20px" />}
          >
            <Text display={{ base: 'none', sm: 'flex' }}>Volver</Text>
          </Button>
        ) : breadcrumb ? (
          breadcrumb?.map((item, index) => (
            <Flex
              align="center"
              key={'header-breadcrumb-' + index}
              cursor={!item.isActive ? 'pointer' : undefined}
              onClick={!item.isActive ? item.onClick : undefined}
            >
              {index > 0 && <Icon mx="6px" boxSize="30px" opacity="0.4" as={BiChevronLeft} />}

              <Box
                fontSize="24px"
                fontWeight="bold"
                lineHeight="29px"
                opacity={item.isActive ? 1 : 0.4}
                _hover={!item.isActive ? { textDecoration: 'underline', opacity: 0.6 } : undefined}
              >
                {item.text}
              </Box>
            </Flex>
          ))
        ) : title ? (
          <Text variant="h1_heading" data-cy={`${title}_titulo_header`} fontSize={{ base: '16px', sm: '20px', md: '26px' }}>
            {isLargerThan710 ? title : title === 'Hoja de ruta' ? title.replace('Hoja de ruta', 'Ruta') : title}
          </Text>
        ) : undefined}
      </Flex>

      <Flex gap="6px" align="center" w="fit-content" justify="flex-end">
        {showSearchbar && <Searchbar />}

        <IconButton
          icon={<Icon as={BiCalendar} boxSize="20px" color="gray_4" />}
          aria-label="Abrir calendario"
          bg="transparent"
          _hover={{ opacity: 0.8 }}
          onClick={calendarState.onOpen}
          display={{ base: 'none', sm: 'flex' }}
        />

        <IconButton
          icon={<Icon as={BiBell} boxSize="20px" color="gray_4" />}
          bg="transparent"
          _hover={{ opacity: 0.8 }}
          onClick={notificationsState.onOpen}
          aria-label="Abrir notificaciones"
          display={{ base: 'none', sm: 'flex' }}
        />

        <Flex w="fit-content" h="fit-content" pr={{ base: '20px', sm: '34px' }}>
          <UserMenu onOpenCalendar={calendarState.onOpen} onOpenNotifications={notificationsState.onOpen} />
        </Flex>
      </Flex>
    </Flex>
  );
};
