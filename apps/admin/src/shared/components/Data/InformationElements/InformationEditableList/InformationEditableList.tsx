import { useState, useEffect } from 'react';

import { BiPlus, BiPencil, BiTrash } from 'react-icons/bi';
import { Button, Box, Flex, Icon, Input } from '@chakra-ui/react';

import { UserRolEnum } from 'data';

import './InformationEditableList.scss';

export type InformationEditableListProps = {
  name: string;
  data: any[];
  onNewClick: (e: any) => void;
  onTextClick: (e: any) => void;
  onRemoveClick: (e: any) => void;
  onItemChange: (id: any, value: any) => void;
};

export const InformationEditableList = ({
  name,
  data = [],
  onTextClick,
  onRemoveClick,
  onItemChange,
  onNewClick,
}: InformationEditableListProps) => {
  return (
    <Flex direction="column" h="100%" rowGap="32px" justify="space-between" overflowY="hidden">
      <Flex direction="column" rowGap="12px" overflow="auto">
        {data?.map((item) => (
          <InformationEditableListItem
            value={item[name]}
            onTextClick={() => onTextClick(item)}
            onRemoveClick={() => onRemoveClick(item)}
            onChange={(value: any) => onItemChange(item.id, { [name]: value })}
          />
        ))}
      </Flex>

      <Button
        minH="fit-content"
        h="auto"
        py="12px"
        w="100%"
        bg="#3182FC"
        color="#fff"
        rightIcon={<Icon as={BiPlus} boxSize="21px" />}
        onClick={onNewClick}
      >
        Nuevo
      </Button>
    </Flex>
  );
};

const InformationEditableListItem = ({
  value,
  onChange,
  inputStyle,
  textStyle,
  textPreffix,
  onTextClick,
  onRemoveClick,
  allowCopy = false,
}: any) => {
  /**
   * -1: No se ha inicializado el valor
   * 0: Se deja de editar el input
   * 1: Se empieza a editar el input
   */
  const [isEditing, setEditing] = useState<-1 | 0 | 1>(-1);
  const [_value, setValue] = useState(value);

  useEffect(() => {
    setValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing === 0 && value !== undefined) {
      if (value !== _value) onChange(_value);
    }
  }, [isEditing]);

  const startEditing = () => setEditing(1);

  const inputRefCallback = (inputElement: any) => {
    if (inputElement) inputElement.focus();

    function handleClickOutside(event: any) {
      if (event.type === 'keypress' && event.key === 'Enter' && inputElement) setEditing(0);
    }

    document.addEventListener('keypress', handleClickOutside);

    // Unbind the event listener on clean up
    return () => document.removeEventListener('keypress', handleClickOutside);
  };

  const handleInputChange = (e: any) => setValue(e.target.value);

  return (
    <Flex position="relative" w="100%">
      {isEditing === 1 ? (
        <Input
          value={_value}
          ref={inputRefCallback}
          onChange={handleInputChange}
          className="inputtooltip-input"
          style={inputStyle ? inputStyle : {}}
          onBlur={() => setEditing(0)}
        />
      ) : (
        <Flex
          w="100%"
          py="6px"
          border="2px solid #EBE8F0"
          rounded="6px"
          align="center"
          columnGap="8px"
          cursor="pointer"
          onClick={onTextClick}
          style={{ ...textStyle }}
        >
          <Box minW="fit-content">{textPreffix}</Box>

          <Box w="100%">{_value || 'Sin especificar'}</Box>

          <Icon as={BiPencil} minW="21px" minH="21px" onClick={startEditing} />
          <Icon as={BiTrash} minW="21px" minH="21px" onClick={onRemoveClick} />
        </Flex>
      )}
    </Flex>
  );
};
