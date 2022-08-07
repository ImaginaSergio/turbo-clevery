import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Menu,
  Flex,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  CircularProgress,
  CircularProgressLabel,
  Button,
  MenuButton,
  Icon,
  Portal,
  MenuList,
  useColorMode,
  Box,
  Text,
  Divider,
} from '@chakra-ui/react';

import { IUser, updateUser } from 'data';
import { Avatar } from 'ui';
import { CampusPages, LoginContext, ThemeContext, VisibilityContext } from 'apps/campus/src/shared/context';

import { AiOutlinePoweroff } from 'react-icons/ai';
import { BiCalendar, BiChevronDown, BiUserCircle, BiBell } from 'react-icons/bi';
import { BsFillSunFill, BsFillMoonFill } from 'react-icons/bs';

export const UserMenu = ({ onOpenCalendar, onOpenNotifications }: { onOpenCalendar: any; onOpenNotifications: any }) => {
  const { user, logout, totalPerfil } = useContext(LoginContext);
  const [isPopoverHover, setIsPopoverHover] = useState(false);
  const { themeMode, setThemeMode } = useContext(ThemeContext);
  const { disabledPages } = useContext(VisibilityContext);

  const { toggleColorMode } = useColorMode();
  const navigate = useNavigate();

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
    <Menu>
      {({ isOpen }) => (
        <>
          <Flex h="40px" bg="white" gap="10px" color="black" rounded="91px" align="center" pr={{ base: '0px', sm: '10px' }}>
            <Flex align="center" gap="15px" display={{ base: 'none', sm: 'flex' }}>
              <PopoverPerfil
                isPopoverHover={isPopoverHover}
                setIsPopoverHover={setIsPopoverHover}
                totalPerfil={totalPerfil}
                user={user}
                onClick={() => {
                  navigate('/perfil#empleo');
                  setIsPopoverHover(false);
                }}
              />
            </Flex>
            <MenuButton
              as={Button}
              outline="none"
              w="fit-content"
              bg="transparent"
              minW="fit-content"
              aria-label="Options"
              data-cy="header_menu"
              _hover={{ bg: 'transparent' }}
              _focus={{ bg: 'transparent' }}
              _active={{ bg: 'transparent' }}
              _expanded={{ bg: 'transparent' }}
              px="0"
              pr={{ base: 'none', sm: '12px' }}
            >
              <Flex align="center" gap="12px">
                <Flex display={{ base: 'flex', sm: 'none' }}>
                  <Avatar
                    size="40px"
                    src={user?.avatar?.url}
                    name={user?.username || 'Avatar del usuario'}
                    colorVariant={(user?.id || 0) % 2 === 1 ? 'hot' : 'cold'}
                  />
                </Flex>
                <Text minW="fit-content" fontSize="16px" fontWeight="semibold" display={{ base: 'none', sm: 'flex' }}>
                  {user?.username}
                </Text>
                <Icon
                  display={{ base: 'none', sm: 'flex' }}
                  as={BiChevronDown}
                  boxSize="20px"
                  color="gray_4"
                  transition="all 0.2s ease"
                  transform={isOpen ? 'rotate(180deg)' : 'rotate(0deg)'}
                />
              </Flex>
            </MenuButton>
          </Flex>

          <Portal>
            <MenuList zIndex="dropdown" py={0} color="black" bg="white" rounded="14px" boxShadow="0px 4px 29px 0px #00000040">
              <Flex direction="column" px="18px" py="22px" gap="10px">
                <Box fontSize="13px" fontWeight="medium" lineHeight="16px">
                  Tema de la interfaz
                </Box>

                <Flex bg="gray_2" align="center" justify="center" p="7px" rounded="10px" gap="10px" transition="all 0.7s ease">
                  <Flex
                    align="center"
                    w="102px"
                    gap="8px"
                    p="4px 10px"
                    rounded="5px"
                    cursor="pointer"
                    textAlign="center"
                    fontWeight="bold"
                    bg={themeMode === 'light' ? 'white' : 'unset'}
                    color={themeMode === 'light' ? 'black' : 'gray_4'}
                    boxShadow={themeMode === 'light' ? '0px 2px 3px rgba(0, 0, 0, 0.25)' : 'unset'}
                    onClick={onThemeToggle}
                  >
                    <Icon as={BsFillSunFill} />
                    <Box textAlign="center">Claro</Box>
                  </Flex>

                  <Flex
                    align="center"
                    w="102px"
                    gap="8px"
                    p="4px 10px"
                    rounded="5px"
                    cursor="pointer"
                    textAlign="center"
                    fontWeight="bold"
                    bg={themeMode === 'dark' ? 'white' : 'unset'}
                    color={themeMode === 'dark' ? 'black' : 'gray_4'}
                    boxShadow={themeMode === 'dark' ? '0px 2px 3px rgba(0, 0, 0, 0.25)' : 'unset'}
                    onClick={onThemeToggle}
                  >
                    <Icon as={BsFillMoonFill} /> <Box textAlign="center">Oscuro</Box>
                  </Flex>
                </Flex>
              </Flex>

              <Divider bg="gray_2" display={{ base: 'flex', sm: 'none' }} />
              <Flex display={{ base: 'flex', sm: 'none' }} direction="column" px="18px" py="22px" gap="15px" justify="center">
                {!disabledPages?.includes(CampusPages.PERFIL) && (
                  <Flex onClick={onOpenNotifications} cursor="pointer" gap="10px" align="center">
                    {<Icon as={BiBell} color="gray_5" boxSize="16px" />} Notificaciones
                  </Flex>
                )}

                <Flex onClick={onOpenCalendar} cursor="pointer" gap="10px" align="center">
                  {<Icon as={BiCalendar} color="gray_5" boxSize="16px" />} Calendario
                </Flex>
              </Flex>
              <Divider bg="gray_2" />

              <Flex direction="column" px="18px" py="22px" gap="15px" justify="center">
                {!disabledPages?.includes(CampusPages.PERFIL) && (
                  <Flex
                    onClick={() => navigate('/perfil')}
                    cursor="pointer"
                    gap="10px"
                    align="center"
                    data-cy="modal_header_perfil"
                  >
                    {<Icon as={BiUserCircle} color="gray_5" boxSize="16px" />} Perfil
                  </Flex>
                )}

                <Flex onClick={logout} data-cy="header_logout" cursor="pointer" gap="10px" align="center">
                  <Icon as={AiOutlinePoweroff} color="gray_5" boxSize="16px" />
                  Cerrar sesión
                </Flex>
              </Flex>
            </MenuList>
          </Portal>
        </>
      )}
    </Menu>
  );
};

const PopoverPerfil = ({
  isPopoverHover,
  setIsPopoverHover,
  user,
  totalPerfil,
  onClick,
}: {
  isPopoverHover: boolean;
  setIsPopoverHover: any;
  user?: any;
  totalPerfil: number;

  onClick: () => void;
}) => {
  return (
    <Popover isOpen={isPopoverHover}>
      <Flex
        onMouseEnter={() => {
          if (totalPerfil < 100 && process.env.NX_ORIGEN_CAMPUS !== 'IMAGINA') setIsPopoverHover(true);
        }}
        onMouseLeave={() => {
          setIsPopoverHover(false);
        }}
      >
        <PopoverTrigger>
          <Flex>
            <Avatar
              size="40px"
              src={user?.avatar?.url}
              name={user?.username || 'Avatar del usuario'}
              colorVariant={(user?.id || 0) % 2 === 1 ? 'hot' : 'cold'}
            />
          </Flex>
        </PopoverTrigger>

        <PopoverContent bg="white" rounded="20px" mr="20px" w="600px">
          <PopoverBody>
            <Flex direction="column" p="24px" rounded="22px" gap="34px" justify="center" align="center">
              <Flex align="center">
                <CircularProgress value={totalPerfil} color="#5BD4A4" size="75px" rounded="100%" trackColor="gray_2">
                  <CircularProgressLabel
                    color="black"
                    fontSize="21px"
                    lineHeight="24px"
                    fontWeight="bold"
                  >{`${totalPerfil}%`}</CircularProgressLabel>
                </CircularProgress>

                <Flex direction="column" ml="24px" gap="10px">
                  <Box color="black" fontWeight="bold" fontSize="20px">
                    Progreso del perfil
                  </Box>

                  <Box color="black">
                    Completa la información de tu perfil para optar a mayores ventajas como acceso a vacantes, entre otras
                    características.
                  </Box>
                </Flex>
              </Flex>

              <Button
                minWidth="100%"
                bg="black"
                _hover={{ bg: 'primary' }}
                onClick={() => {
                  onClick();
                }}
              >
                <Box color="white">Completar mi Perfil</Box>
              </Button>
            </Flex>
          </PopoverBody>
        </PopoverContent>
      </Flex>
    </Popover>
  );
};
