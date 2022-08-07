import { useState } from 'react';

import {
  Box,
  Flex,
  Icon,
  Menu,
  Image,
  Button,
  Tooltip,
  MenuItem,
  MenuList,
  Skeleton,
  Collapse,
  MenuButton,
  useMediaQuery,
} from '@chakra-ui/react';
import { BiChevronDown, BiChevronUp } from 'react-icons/bi';

interface ISidebarItem {
  titulo: string;
  slug: string;
  icono: string;
  isActive: boolean;
  onClick: () => any;
}

export const PageSidebar = ({
  itemsRuta,
  itemsOtros,
}: {
  itemsRuta: ISidebarItem[];
  itemsOtros: ISidebarItem[];
}) => {
  const [openRuta, setOpenRuta] = useState(true);
  const [openOtros, setOpenOtros] = useState(false);

  const [isMobile] = useMediaQuery('(max-width: 948px)');

  return (
    <Flex direction="column" minW="275px" gap="30px" h="100%">
      <Flex direction="column" gap="20px" w="100%">
        {isMobile ? (
          <MobileSidebar items={itemsRuta} label="Tu hoja de ruta" />
        ) : (
          <>
            <Flex w="100%" justify="space-between">
              <Box
                fontWeight="bold"
                fontSize="14px"
                lineHeight="17px"
                data-cy="tu_hoja_de_ruta_desplegable"
              >
                Tu hoja de ruta
              </Box>

              <Icon
                data-cy="button_tu_hoja_de_ruta"
                boxSize="24px"
                color="gray_4"
                cursor="pointer"
                onClick={() => setOpenRuta(!openRuta)}
                as={openRuta ? BiChevronUp : BiChevronDown}
              />
            </Flex>

            {itemsRuta.length === 0 &&
              [0, 1, 2, 3].map((i: any, index: number) => (
                <Skeleton
                  w="100%"
                  h="40px"
                  rounded="8px"
                  key={`sidebar-skeleton-${index}`}
                />
              ))}

            <Collapse in={openRuta} animateOpacity>
              <Flex direction="column" gap="10px">
                {itemsRuta?.map((item, index) => (
                  <SidebarItem item={item} key={`sidebar-item-${index}`} />
                ))}
              </Flex>
            </Collapse>
          </>
        )}
      </Flex>

      <Flex direction="column" gap="20px" w="100%">
        {isMobile ? (
          <MobileSidebar items={itemsOtros} label="Otros cursos" />
        ) : (
          <>
            <Flex w="100%" justify="space-between">
              <Box
                fontWeight="bold"
                fontSize="14px"
                lineHeight="17px"
                data-cy="otros_cursos_desplegable"
              >
                Otros cursos
              </Box>

              <Icon
                data-cy="button_otros_cursos"
                boxSize="24px"
                color="gray_4"
                cursor="pointer"
                onClick={() => setOpenOtros(!openOtros)}
                as={openOtros ? BiChevronUp : BiChevronDown}
              />
            </Flex>

            <Collapse in={openOtros} animateOpacity>
              <Flex direction="column" gap="10px">
                {itemsOtros.length === 0 &&
                  [0, 1, 2, 3, 4].map((i: any, index: number) => (
                    <Skeleton
                      w="100%"
                      h="40px"
                      rounded="8px"
                      key={`sidebar_otros-skeleton-${index}`}
                    />
                  ))}

                {itemsOtros?.map((item, index) => (
                  <SidebarItem
                    item={item}
                    key={`sidebar_otros-item-${index}`}
                  />
                ))}
              </Flex>
            </Collapse>
          </>
        )}
      </Flex>
    </Flex>
  );
};

const SidebarItem = ({
  item,
  tooltipDisabled = false,
}: {
  item: ISidebarItem;
  tooltipDisabled?: boolean;
}) => (
  <Tooltip
    label={item.titulo}
    hasArrow
    placement="right"
    isDisabled={tooltipDisabled}
  >
    <Flex
      data-cy={`${item.slug}_desplegable`}
      w="100%"
      gap="10px"
      p="6px 10px"
      rounded="8px"
      align="center"
      cursor="pointer"
      overflow="hidden"
      onClick={item.onClick}
      _hover={{ bg: 'gray_3' }}
      transition="all 0.2s ease"
      bg={item.isActive ? 'gray_3' : undefined}
    >
      <Image boxSize="28px" src={`data:image/svg+xml;utf8,${item.icono}`} />

      <Box
        fontSize="15px"
        lineHeight="24px"
        overflow="hidden"
        whiteSpace="nowrap"
        fontWeight="semibold"
        textOverflow="ellipsis"
      >
        {item.titulo}
      </Box>
    </Flex>
  </Tooltip>
);

const MobileSidebar = ({ items, label }: { items: any; label: string }) => (
  <Flex direction="column" w="100%" gap="12px">
    <Box
      fontSize="15px"
      lineHeight="24px"
      overflow="hidden"
      whiteSpace="nowrap"
      fontWeight="semibold"
      textOverflow="ellipsis"
    >
      {label}
    </Box>

    <Menu>
      <MenuButton
        as={Button}
        w="100%"
        bg="gray_3"
        rounded="md"
        textAlign="left"
        borderWidth="1px"
        fontWeight="normal"
        transition="all 0.2s"
        _focus={{ bg: 'gray_3' }}
        _selected={{ bg: 'gray_3' }}
        _expanded={{ bg: 'gray_3' }}
        rightIcon={<Icon as={BiChevronDown} />}
      >
        {
          items
            ?.filter((i: any) => i.isActive === true)
            ?.map((item: any, index: any) => (
              <SidebarItem
                tooltipDisabled
                item={item}
                key={`sidebar-item-${index}`}
              />
            ))[0]
        }
      </MenuButton>

      <MenuList zIndex="20" maxH="300px" overflow="auto" w="100%" minW="100%">
        {items?.map((item: any, index: any) => (
          <MenuItem
            w="100%"
            minW="100%"
            color="black"
            key={`sidebar-menuitem-${index}`}
            _hover={{ bg: 'transparent' }}
          >
            <SidebarItem tooltipDisabled item={item} />
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  </Flex>
);
