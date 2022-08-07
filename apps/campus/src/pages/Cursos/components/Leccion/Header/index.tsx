import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Flex,
  Button,
  Icon,
  Box,
  Text,
  Progress,
  IconButton,
  useMediaQuery,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  UseDisclosureReturn,
} from '@chakra-ui/react';
import { BsArrowBarRight } from 'react-icons/bs';
import { BiChevronsRight, BiCodeBlock, BiDotsHorizontalRounded, BiExit, BiMenu, BiNote } from 'react-icons/bi';

import { ICurso } from 'data';
import { useHover } from 'utils';
import { Searchbar } from '../../../../../shared/components';

export const LeccionHeader = ({
  curso,
  showSearchbar,
  showCodeMirror,
  stateNotas,
  stateSidebar,
  stateCodeMirror,
}: {
  curso?: ICurso;
  showSearchbar: boolean;
  showCodeMirror: boolean;
  stateNotas: UseDisclosureReturn;
  stateSidebar: UseDisclosureReturn;
  stateCodeMirror: UseDisclosureReturn;
}) => {
  const navigate = useNavigate();
  const hoverRef = useRef(null);
  const isHover = useHover(hoverRef);

  const [isMobile] = useMediaQuery('(max-width: 1024px)');

  return isMobile ? (
    <Flex
      top="0"
      w="100%"
      px="20px"
      pt="20px"
      bg="gray_1"
      zIndex="80"
      align="center"
      h="fit-content"
      position="sticky"
      justify="space-between"
    >
      <Flex w="100%" gap="30px" justify="space-between" align="center">
        {!stateSidebar.isOpen && (
          <IconButton
            ref={hoverRef}
            bg="gray_3"
            color="black"
            boxSize="42px"
            aria-label="Abrir sidebar"
            onClick={stateSidebar.onOpen}
            _hover={{ backgroundColor: 'gray_4', opacity: 0.8 }}
            icon={<Icon as={isHover ? BsArrowBarRight : BiMenu} boxSize={6} />}
          />
        )}

        <Flex w="100%" gap="6px" maxW="600px" align="center" justify="center" direction="column">
          <Box fontSize="18px" fontWeight="bold" lineHeight="25px" textAlign="center">
            Curso de {curso?.titulo}
          </Box>

          <Flex w="100%" align="center" gap="12px">
            <Progress
              value={curso?.meta?.progreso_count || 0}
              bg="gray_3"
              w="100%"
              h="6px"
              rounded="10px"
              sx={{ '& > div': { background: 'primary' } }}
            />
          </Flex>
        </Flex>

        <Flex>
          <Menu>
            <MenuButton
              as={IconButton}
              icon={<Icon as={BiDotsHorizontalRounded} />}
              boxSize="42px"
              color="black"
              bg="gray_3"
              _hover={{
                backgroundColor: 'gray_4',
                opacity: 0.8,
              }}
            />

            <MenuList zIndex={100}>
              <MenuItem display="flex" gap="12px" alignItems="center" onClick={stateNotas.onOpen}>
                <Icon as={BiNote} boxSize="15px" color="gray_5" />
                <Text fontSize="13px" fontWeight="semibold">
                  Ver Notas
                </Text>
              </MenuItem>

              <Searchbar isMenu />
            </MenuList>
          </Menu>
        </Flex>
      </Flex>
    </Flex>
  ) : (
    <Flex
      h="80px"
      align="center"
      p="18px 5px 12px"
      justify="space-between"
      gap="26px"
      w="100%"
      position="sticky"
      top="0"
      bg="gray_1"
      zIndex="80"
    >
      <Flex align="center" gap="24px">
        {!stateSidebar.isOpen && (
          <IconButton
            ref={hoverRef}
            color="gray_4"
            bg="transparent"
            onClick={stateSidebar.onOpen}
            aria-label="Abrir sidebar"
            icon={<Icon as={isHover ? BiChevronsRight : BiMenu} boxSize={6} />}
            _hover={{ backgroundColor: 'transparent' }}
          />
        )}

        <Button
          h="auto"
          bg="gray_3"
          data-cy="cursos_lecciones_salir"
          leftIcon={<Icon as={BiExit} boxSize="18px" />}
          p="10px 16px"
          rounded="10px"
          fontSize="15px"
          minW="fit-content"
          fontWeight="bold"
          lineHeight="17px"
          data-phone-text=""
          onClick={() => navigate(`/cursos/${curso?.id || ''}`)}
          _hover={{
            backgroundColor: 'gray_4',
            opacity: 0.8,
          }}
        >
          Salir del curso
        </Button>
      </Flex>

      <Flex direction="column" align="center" justify="center" gap="9px" w="100%" maxW="600px">
        <Box fontSize="18px" fontWeight="bold" lineHeight="22px" textOverflow="ellipsis">
          Curso de {curso?.titulo}
        </Box>

        <Flex w="100%" align="center" gap="12px">
          <Box fontSize="13px" fontWeight="bold" lineHeight="16px" color="primary" textAlign="center">
            {curso?.meta?.progreso_count || 0}%
          </Box>

          <Progress
            value={curso?.meta?.progreso_count || 0}
            bg="gray_3"
            w="100%"
            h="6px"
            rounded="10px"
            sx={{ '& > div': { background: 'primary' } }}
          />
        </Flex>
      </Flex>

      <Flex minW="fit-content" align="center" gap="20px">
        {showSearchbar && <Searchbar />}

        {showCodeMirror && (
          <IconButton
            boxSize="42px"
            rounded="10px"
            aria-label="Abrir live coder"
            onClick={stateCodeMirror.onToggle}
            bg={stateCodeMirror?.isOpen ? 'black' : 'gray_3'}
            icon={<Icon as={BiCodeBlock} boxSize="24px" color={stateCodeMirror?.isOpen ? 'white' : 'unset'} />}
          />
        )}

        <Button
          data-cy="notas_button"
          h="auto"
          p="10px 16px"
          rounded="10px"
          fontSize="15px"
          fontWeight="bold"
          lineHeight="17px"
          minW="fit-content"
          _hover={{ opacity: 0.8 }}
          onClick={stateNotas.onToggle}
          bg={stateNotas.isOpen ? 'black' : 'gray_3'}
          color={stateNotas.isOpen ? 'white' : 'unset'}
          leftIcon={<Icon as={BiNote} boxSize="18px" />}
        >
          <span data-cy="notas_text_button">{stateNotas.isOpen ? 'Ocultar notas' : 'Ver notas'}</span>
        </Button>
      </Flex>
    </Flex>
  );
};
