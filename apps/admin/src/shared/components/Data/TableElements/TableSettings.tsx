import { useEffect, useState } from 'react';

import { Box, Menu, MenuButton, Icon, IconButton, MenuList, MenuItem } from '@chakra-ui/react';
import { BiSlider, BiCheckbox, BiCheckboxChecked } from 'react-icons/bi';

import { setItem } from 'data';

export interface ColumnSettings {
  label?: string;
  value?: string;
  checked?: boolean;
  onClick?: () => void | any;
}

export const TableSettings = ({ icon, columns = [] }: { icon?: any; columns: ColumnSettings[] }) => {
  const [_columns, setColumns] = useState<ColumnSettings[]>(columns);

  useEffect(() => {
    setColumns(columns);
  }, [columns]);

  return (
    <Menu closeOnSelect={false} isLazy>
      <MenuButton
        as={IconButton}
        title="Configuración"
        aria-label="Table configuration"
        outline={'none'}
        bg={'transparent'}
        color={'#55556A'}
        _hover={{ bg: 'transparent', color: '#71717E' }}
        _focus={{ bg: 'transparent' }}
        _active={{ bg: 'transparent', color: '#3484FB' }}
        _expanded={{ bg: 'transparent', color: '#3484FB' }}
        icon={<Icon as={icon || BiSlider} w={'28px'} h={'28px'} />}
      />

      <MenuList p="10px 0px" overflowY="auto" maxHeight="380px" rounded="8px" boxShadow={'0px 10px 30px rgba(1, 20, 52, 0.2)'}>
        {_columns.map((c, index) => (
          <MenuItem
            key={'tablesettings-menu-item-' + index}
            icon={
              c.checked ? (
                <Icon as={BiCheckboxChecked} boxSize="24px" color="#3484FB" />
              ) : (
                <Icon as={BiCheckbox} boxSize="24px" color="#AEB9CB" />
              )
            }
            onClick={(e) => {
              e.stopPropagation();

              if (c.onClick) c.onClick();
            }}
            mb="5px"
            p="10px 20px"
            _last={{ mb: '0px' }}
          >
            <Box color={`#131340`} fontSize={'18px'}>
              {c.label}
            </Box>
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};

export const checkColumn = (page: string, value: string, columnSettings: any[], setColumnSettings: any) => {
  const newValue = columnSettings?.find((c: any) => c.value === value)?.checked;

  if (typeof newValue === 'boolean') {
    setItem(`user_${page}_${value}`, !newValue);

    setColumnSettings((lastC: any) => [
      ...lastC?.map((c: any) => (c.value === value ? { ...c, checked: !c.checked } : { ...c })),
    ]);
  } else {
    alert('Error al filtrar columnas');
  }
};
