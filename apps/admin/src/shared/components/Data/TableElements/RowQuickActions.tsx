import React, { useState, useEffect } from 'react';

import {
  Button,
  Icon,
  Modal,
  ModalFooter,
  ModalHeader,
  ModalContent,
  ModalOverlay,
  ModalBody,
  FormLabel,
  Input,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Box,
} from '@chakra-ui/react';

import {
  BiCheckboxChecked,
  BiDownload,
  BiDuplicate,
  BiShowAlt,
  BiTrash,
  BiLinkExternal,
  BiPencil,
  BiDotsVerticalRounded,
} from 'react-icons/bi';

export interface RowQuickActionProps {
  edit?: {
    title?: string;
    isDisabled?: boolean;
    onClick: (e?: any) => any;
  };
  view?: {
    title?: string;
    isDisabled?: boolean;
    onClick: (e?: any) => any;
  };
  download?: {
    title?: string;
    isDisabled?: boolean;
    onClick: (e?: any) => any;
  };
  remove?: {
    title?: string;
    isDisabled?: boolean;
    onClick: (e?: any) => any;
  };
  check?: {
    title?: string;
    value: boolean;
    isDisabled?: boolean;
    onClick: (e?: any) => any;
  };
  duplicate?: {
    title?: string;
    isDisabled?: boolean;
    onClick: (e?: any) => any;
  };
}

export const rowQuickActions = ({
  edit,
  view,
  download,
  remove,
  check,
  duplicate,
}: RowQuickActionProps) => {
  return (
    <Menu isLazy>
      <MenuButton
        as={IconButton}
        outline={'none'}
        bg={'transparent'}
        className="action-icon"
        onClick={(e) => e.stopPropagation()}
        _focus={{ bg: 'transparent' }}
        _hover={{ bg: 'transparent', color: '#71717E' }}
        _active={{ bg: 'transparent', color: '#3484FB' }}
        _expanded={{ bg: 'transparent', color: '#3484FB' }}
        icon={
          <Icon
            color="#55556A"
            as={BiDotsVerticalRounded}
            w={'24px'}
            h={'24px'}
          />
        }
      />
      <MenuList
        p="0px"
        maxH="380px"
        w="fit-content"
        overflowY="auto"
        rounded="8px"
        boxShadow={'0px 10px 30px rgba(1, 20, 52, 0.2)'}
      >
        {edit && (
          <MenuItem
            icon={<BiPencil />}
            mb="5px"
            p="10px 20px"
            _last={{ mb: '0px' }}
            isDisabled={edit.isDisabled}
            onClick={(e) => {
              e.stopPropagation();

              if (edit.onClick) edit.onClick(e);
            }}
          >
            <Box color="#55556A" fontSize="16px">
              {edit.title || 'Editar'}
            </Box>
          </MenuItem>
        )}

        {view && (
          <MenuItem
            icon={<BiShowAlt />}
            mb="5px"
            p="10px 20px"
            _last={{ mb: '0px' }}
            isDisabled={view.isDisabled}
            onClick={(e) => {
              e.stopPropagation();
              if (view.onClick) view.onClick(e);
            }}
          >
            <Box color="#55556A" fontSize="16px">
              {view.title || 'Abrir'}
            </Box>
          </MenuItem>
        )}

        {download && (
          <MenuItem
            icon={<BiDownload />}
            mb="5px"
            p="10px 20px"
            _last={{ mb: '0px' }}
            isDisabled={download.isDisabled}
            onClick={(e) => {
              e.stopPropagation();
              if (download.onClick) download.onClick(e);
            }}
          >
            <Box color="#55556A" fontSize="16px">
              {download.title || 'Descargar'}
            </Box>
          </MenuItem>
        )}

        {check && (
          <MenuItem
            icon={<BiCheckboxChecked />}
            mb="5px"
            p="10px 20px"
            _last={{ mb: '0px' }}
            isDisabled={check.isDisabled}
            onClick={(e) => {
              e.stopPropagation();
              if (check.onClick) check.onClick(e);
            }}
          >
            <Box color="#55556A" fontSize="16px">
              {check.title || 'Completar'}
            </Box>
          </MenuItem>
        )}

        {duplicate && (
          <MenuItem
            icon={<BiDuplicate />}
            mb="5px"
            p="10px 20px"
            _last={{ mb: '0px' }}
            isDisabled={duplicate.isDisabled}
            onClick={(e) => {
              e.stopPropagation();
              if (duplicate.onClick) duplicate.onClick(e);
            }}
          >
            <Box color="#55556A" fontSize="16px">
              {duplicate.title || 'Duplicar'}
            </Box>
          </MenuItem>
        )}

        {remove && (
          <MenuItem
            icon={<BiTrash />}
            mb="5px"
            p="10px 20px"
            _last={{ mb: '0px' }}
            isDisabled={remove.isDisabled}
            onClick={(e) => {
              e.stopPropagation();
              if (remove.onClick) remove.onClick(e);
            }}
          >
            <Box color="#55556A" fontSize="16px">
              {remove.title || 'Eliminar'}
            </Box>
          </MenuItem>
        )}
      </MenuList>
    </Menu>
  );
};

export const DeleteModal = ({
  title,
  isOpen,
  securityWord,
  onClose,
  onAccept,
}: {
  title: React.ReactNode;
  isOpen: boolean;
  securityWord: string;
  onClose: (e?: any) => void;
  onAccept: (e?: any) => void;
}) => {
  const [value, setValue] = useState('');

  useEffect(() => {
    setValue('');
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />

      <ModalContent>
        <ModalHeader>{title}</ModalHeader>

        <ModalBody>
          <FormLabel className="form-label">
            Escribe <i>{securityWord}</i> para confirmar{' '}
            <strong>que quieres borrar</strong> el elemento.
          </FormLabel>
          <Input
            className="form-input"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
            }}
            placeholder={securityWord}
          />
        </ModalBody>

        <ModalFooter mt={3}>
          <Button colorScheme="gray" mr={3} onClick={onClose}>
            Cancelar
          </Button>

          <Button
            colorScheme={value !== securityWord ? 'gray' : 'red'}
            isDisabled={value !== securityWord}
            onClick={onAccept}
          >
            Eliminar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export const RelatedEntitiesModal = ({
  isOpen,
  relatedEntities,
  onClose,
  onAccept,
  refreshRelatedEntities,
}: {
  isOpen: boolean;
  relatedEntities: { title: string; href: string }[];
  onClose: (e?: any) => void;
  onAccept: (e?: any) => void;
  refreshRelatedEntities: (e?: any) => void;
}) => {
  const [value, setValue] = useState('');

  useEffect(() => {
    setValue('');
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />

      <ModalContent>
        <ModalHeader>¡Existen entidades relacionadas!</ModalHeader>

        <ModalBody>
          <FormLabel className="form-label">
            Por favor, borra las siguientes entidades o des-relaciónalas de la
            entidad que tratas de borrar.
          </FormLabel>

          <Table size="sm">
            <Thead>
              <Tr>
                <Th>Nombre</Th>
                <Th>Abrir []</Th>
              </Tr>
            </Thead>

            <Tbody>
              {relatedEntities.map((entity, index) => (
                <Tr key={index}>
                  <Td>{entity.title}</Td>
                  <Td>
                    <a
                      target="_blank"
                      href={process.env.NX_ERP_URL + '/' + entity.href}
                      rel="noreferrer"
                    >
                      <Icon as={BiLinkExternal} />
                    </a>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={refreshRelatedEntities}>
            Actualizar
          </Button>

          <Button onClick={onClose}>Cancelar</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
