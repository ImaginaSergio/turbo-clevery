import { useEffect, useState } from 'react';

import { Box, Center, Flex, Icon, IconButton, useToast } from '@chakra-ui/react';
import { BiChevronDown, BiChevronUp, BiPencil, BiPlusCircle, BiTrash } from 'react-icons/bi';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

import { onFailure } from 'ui';
import { updateModulo } from 'data';

export type InformationDragDropListProps = {
  label?: string;
  items: ListItemProps[];

  allowOpen?: boolean;
  allowDragDrop?: boolean;

  onCreate?: () => void;
  createTitle?: string;

  refresh?: () => void;
};

export type ListItemProps = {
  title: string;
  foot?: string;
  orden?: number;
  id?: number;

  showIndex?: boolean;

  allowDragDrop?: boolean;

  onEdit?: () => void;
  onClick?: () => void;
  onDelete?: () => void;
  onCreate?: () => void;
  createTitle?: string;

  subitems?: ListSubItemProps[];
};

export type ListSubItemProps = {
  title: string;
  icon?: any;

  isSelected?: boolean;

  foot?: string;
  onClick?: () => void;
  onDelete?: () => void;
};

export const InformationDragDropList = ({
  label,
  items,
  onCreate,
  allowOpen,
  createTitle = 'Añadir',
  refresh,
}: InformationDragDropListProps) => {
  const toast = useToast();

  function handleOnDragEnd(result: any) {
    if (!result.destination) return;

    const startIndex = result.source.index;
    const endIndex = result.destination.index;

    const startItem = items[startIndex];
    const endItem = items[endIndex];

    let startModulo = {
      orden: startItem.orden,
    };

    let endModulo = {
      orden: endItem.orden,
    };

    if (startItem.id && endItem.id) {
      updateModulo({ id: startItem.id, modulo: endModulo });
      updateModulo({ id: endItem.id, modulo: startModulo });
    } else {
      console.error('❌ Algo ha fallado...');
      onFailure(toast, 'Error: ', 'Fallo en la reordenación');
    }

    // Actualizamos la lista desde props
    if (refresh) refresh();
  }

  return (
    <Flex direction="column" overflow="hidden">
      {label && <label className="information-block-label">{label}</label>}

      {/* <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="orden">
          {(provided) => ( */}
      <Flex
        w="100%"
        gap="10px"
        overflow="auto"
        direction="column"
        // {...provided.droppableProps}
        // ref={provided.innerRef}
      >
        {items?.map((item: ListItemProps, index: number) => (
          // <Draggable
          //   key={item.id}
          //   index={index}
          //   draggableId={'orden-' + item.orden}
          // >
          //   {(provided) => (
          //     <Box
          //       ref={provided.innerRef}
          //       {...provided.draggableProps}
          //       {...provided.dragHandleProps}
          //     >
          <ListItem key={item.id} props={{ ...item }} allowOpen={allowOpen} index={item?.orden || 0} />
          //     </Box>
          //   )}
          // </Draggable>
        ))}

        <Flex
          h="44px"
          w="100%"
          mt="10px"
          gap="8px"
          p="10px 12px"
          rounded="12px"
          align="center"
          justify="center"
          color="#84889A"
          cursor="pointer"
          onClick={onCreate}
          border="1px solid #E6E8EE"
          transition="all 0.3s ease-in-out"
          _hover={{
            bg: 'white',
            color: '#10172E',
            boxShadow: '0px 1px 7px rgba(7, 15, 48, 0.14)',
          }}
        >
          <Icon as={BiPlusCircle} boxSize="21px" />

          <Box fontSize="12px" fontWeight="semibold" textTransform="uppercase">
            {createTitle}
          </Box>
        </Flex>
      </Flex>

      {/* )}
         </Droppable>
      </DragDropContext> */}
    </Flex>
  );
};

const ListItem = ({ allowOpen = true, index, props }: { allowOpen?: boolean; index: number; props: ListItemProps }) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <Flex bg="#FAFAFC" direction="column">
      <Flex
        h="44px"
        className="list-item"
        rounded="12px"
        align="center"
        p="10px 12px"
        cursor="pointer"
        justify="space-between"
        onClick={() => {
          if (allowOpen) setOpen(!open);
          if (props.onClick) props.onClick();
        }}
      >
        <Flex align="center" columnGap="12px">
          {props.showIndex && (
            <Center bg="#E6E8EE" rounded="6px" boxSize="24px" fontSize="13px" lineHeight="15px" fontWeight="semibold">
              {index}
            </Center>
          )}

          <Box fontSize="14px" fontWeight="medium" lineHeight="16px" textAlign="start">
            {props.title}
          </Box>

          <Flex
            display="none"
            align="center"
            color="#878EA0"
            columnGap="10px"
            sx={{ '.list-item:hover &': { display: 'flex' } }}
          >
            {props.onEdit && (
              <Icon
                as={BiPencil}
                boxSize="21px"
                onClick={(e) => {
                  e.stopPropagation();
                  if (props.onEdit) props.onEdit();
                }}
              />
            )}
          </Flex>
        </Flex>

        <Flex align="center" columnGap="10px">
          <Flex
            display="none"
            align="center"
            color="#878EA0"
            columnGap="10px"
            sx={{ '.list-item:hover &': { display: 'flex' } }}
          >
            {props.onDelete && (
              <IconButton
                minW="21px"
                bg="transparent"
                aria-label="Borrado de módulo"
                icon={<Icon as={BiTrash} boxSize="21px" />}
                onClick={(e) => {
                  e.stopPropagation();
                  if (props.onDelete) props.onDelete();
                }}
              />
            )}
          </Flex>

          <Box fontSize="14px" fontWeight="medium" lineHeight="16px">
            {props.foot}
          </Box>

          {allowOpen && <Icon boxSize="24px" color="#878EA0" as={open ? BiChevronUp : BiChevronDown} />}
        </Flex>
      </Flex>

      {open && (
        <Flex direction="column" w="100%" p="10px 12px">
          <Box mb="12px" bg="#fff" h="1px" />

          <Flex w="100%" direction="column" rowGap="7px">
            {props.subitems?.map((subitem, _index) => (
              <ListSubItem key={`list-item-${index}-subitem-${_index}`} {...subitem} />
            ))}
          </Flex>

          <Flex
            h="35px"
            w="100%"
            align="center"
            justify="center"
            columnGap="8px"
            p="10px 12px"
            rounded="12px"
            color="#84889A"
            cursor="pointer"
            onClick={props.onCreate}
            border="1px solid #E6E8EE"
            transition="all 0.3s ease-in-out"
            _hover={{
              bg: 'white',
              color: '#10172E',
              boxShadow: '0px 1px 7px rgba(7, 15, 48, 0.14)',
            }}
          >
            <Icon as={BiPlusCircle} boxSize="21px" />

            <Box fontSize="12px" fontWeight="semibold" textTransform="uppercase">
              {props.createTitle}
            </Box>
          </Flex>
        </Flex>
      )}
    </Flex>
  );
};

const ListSubItem = (props: ListSubItemProps) => (
  <Flex
    h="35px"
    className="list-subitem"
    bg="#FAFAFC"
    rounded="12px"
    align="center"
    p="10px 12px"
    cursor="pointer"
    justify="space-between"
    onClick={props.onClick}
    color={props.isSelected ? '#26C8AB' : '#878EA0'}
    border={props.isSelected ? '2px solid #26C8AB' : '2px solid #FAFAFC'}
  >
    <Flex align="center" columnGap="12px">
      {props.icon}

      <Box fontSize="14px" fontWeight="medium" lineHeight="16px">
        {props.title}
      </Box>
    </Flex>

    <Flex align="center" columnGap="10px">
      <Flex
        display="none"
        align="center"
        color="#878EA0"
        columnGap="10px"
        sx={{ '.list-subitem:hover &': { display: 'flex' } }}
      >
        <Icon
          as={BiTrash}
          boxSize="21px"
          onClick={(e) => {
            e.stopPropagation();
            if (props.onDelete) props.onDelete();
          }}
        />
      </Flex>

      <Box fontSize="14px" fontWeight="medium" lineHeight="16px">
        {props.foot}
      </Box>
    </Flex>
  </Flex>
);
