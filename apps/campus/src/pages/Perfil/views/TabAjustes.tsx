import { useContext } from 'react';

import { Flex, Box, Icon, Image, Center, useColorMode, useDisclosure } from '@chakra-ui/react';
import { MdKeyboardArrowDown } from 'react-icons/md';
import { BsFillSunFill, BsFillMoonFill } from 'react-icons/bs';

import { useRutas, updateUser } from 'data';
import { ModalRoadmap } from '../../../shared/components';
import { LoginContext, ThemeContext } from '../../../shared/context';

export const TabAjustes = () => {
  const rutaState = useDisclosure();

  const { user } = useContext(LoginContext);
  const { toggleColorMode } = useColorMode();
  const { themeMode, setThemeMode } = useContext(ThemeContext);

  const { data: rutas } = useRutas({
    query: [{ privada: false }, { limit: 100 }],
  });

  const onThemeToggle = (e: any) => {
    let nextTheme = themeMode === 'dark' ? 'light' : 'dark';

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
    <>
      <Flex w="100%" direction="column" gap="30px">
        <Flex direction="column" gap="24px">
          <Box fontSize="14px" fontWeight="bold" lineHeight="17px">
            Tema de la interfaz
          </Box>

          <Center p="7px" gap="10px" bg="gray_2" rounded="10px" w="fit-content" transition="all 0.7s ease">
            <Flex
              w="102px"
              gap="8px"
              p="4px 10px"
              rounded="5px"
              align="center"
              cursor="pointer"
              textAlign="center"
              fontWeight="bold"
              onClick={onThemeToggle}
              bg={themeMode === 'light' ? 'white' : 'unset'}
              color={themeMode === 'light' ? 'black' : 'gray_4'}
              boxShadow={themeMode === 'light' ? '0px 2px 3px rgba(0, 0, 0, 0.25)' : 'unset'}
            >
              <Icon as={BsFillSunFill} /> <Box textAlign="center">Claro</Box>
            </Flex>

            <Flex
              gap="8px"
              w="102px"
              p="4px 10px"
              rounded="5px"
              align="center"
              cursor="pointer"
              textAlign="center"
              fontWeight="bold"
              onClick={onThemeToggle}
              bg={themeMode === 'dark' ? 'white' : 'unset'}
              color={themeMode === 'dark' ? 'black' : 'gray_4'}
              boxShadow={themeMode === 'dark' ? '0px 2px 3px rgba(0, 0, 0, 0.25)' : 'unset'}
            >
              <Icon as={BsFillMoonFill} /> <Box textAlign="center">Oscuro</Box>
            </Flex>
          </Center>
        </Flex>

        <Flex direction="column" gap="24px">
          <Box fontSize="14px" fontWeight="bold" lineHeight="17px">
            Hoja de ruta actual
          </Box>

          <Flex w="100%" p="15px" gap="10px" bg="white" align="center" rounded="15px" border="1px solid rgba(230, 230, 234, 1)">
            {(user?.progresoGlobal?.rutaPro?.icono || user?.progresoGlobal?.ruta?.icono) && (
              <Image
                boxSize="42px"
                src={`data:image/svg+xml;utf8,${user?.progresoGlobal?.rutaPro?.icono || user?.progresoGlobal?.ruta?.icono}`}
              />
            )}

            <Flex w="100%" align="center" justify="space-between">
              <Box fontSize="16px">{user?.progresoGlobal?.rutaPro?.nombre || user?.progresoGlobal?.ruta?.nombre}</Box>

              {!user?.progresoGlobal?.rutaProId && (
                <Center
                  data-cy="roadmap_button"
                  bg="gray_3"
                  boxSize="32px"
                  rounded="100%"
                  transition="all 0.7s ease"
                  _hover={{ opacity: 0.7 }}
                  onClick={process.env.REACT_APP_EDIT_ROADMAP === 'FALSE' ? undefined : rutaState.onOpen}
                  cursor={process.env.REACT_APP_EDIT_ROADMAP === 'FALSE' ? 'unset' : 'pointer'}
                >
                  <Icon boxSize="32px" color="gray_5" as={MdKeyboardArrowDown} />
                </Center>
              )}
            </Flex>
          </Flex>
        </Flex>
      </Flex>

      <ModalRoadmap rutas={rutas?.data} state={rutaState} />
    </>
  );
};
