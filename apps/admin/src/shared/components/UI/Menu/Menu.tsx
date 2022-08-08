import { useEffect, useState } from 'react';

import {
  Box,
  Menu as ChakraMenu,
  MenuButton,
  Icon,
  IconButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';

import { BiSlider } from 'react-icons/bi';

interface ItemProps {
  icon?: any;
  label: string;
  disabled?: boolean;
  onClick?: () => void | any;
}

interface MenuProps {
  icon?: any;
  items: ItemProps[];
}

export const Menu = ({ icon, items = [] }: MenuProps) => {
  const [_items, setItems] = useState<ItemProps[]>(items);

  useEffect(() => {
    setItems(items);
  }, [items]);

  return (
    <ChakraMenu closeOnSelect={false} isLazy>
      <MenuButton
        as={IconButton}
        outline={'none'}
        bg={'transparent'}
        onClick={(e) => e.stopPropagation()}
        _focus={{ bg: 'transparent' }}
        _hover={{ bg: 'transparent', color: '#71717E' }}
        _active={{ bg: 'transparent', color: '#3484FB' }}
        _expanded={{ bg: 'transparent', color: '#3484FB' }}
        icon={
          icon ? (
            icon
          ) : (
            <Icon color="#55556A" as={BiSlider} w={'28px'} h={'28px'} />
          )
        }
      />

      <MenuList
        p="10px 0px"
        maxH="380px"
        rounded="8px"
        w="fit-content"
        overflowY="auto"
        boxShadow="0px 10px 30px rgba(1, 20, 52, 0.2)"
      >
        {_items.map((item: ItemProps, index) => (
          <MenuItem
            icon={item.icon}
            key={index}
            mb="5px"
            p="10px 20px"
            _last={{ mb: '0px' }}
            isDisabled={item.disabled}
            onClick={(e) => {
              e.stopPropagation();

              if (item.onClick) item.onClick();
            }}
          >
            <Box color="#55556A" fontSize={'16px'}>
              {item.label}
            </Box>
          </MenuItem>
        ))}
      </MenuList>
    </ChakraMenu>
  );
};
