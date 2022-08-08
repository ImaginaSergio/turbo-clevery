import { useEffect, useState } from 'react';

import { BiX } from 'react-icons/bi';
import {
  Icon,
  Flex,
  Modal,
  ModalBody,
  ModalHeader,
  ModalContent,
  ModalOverlay,
  Box,
  Button,
} from '@chakra-ui/react';

import { getUsersStats } from '@clevery/data';

export default function UsuariosInactivosModal({
  state,
}: {
  state: { isOpen: boolean; onOpen: () => void; onClose: () => void };
}) {
  const [usuarios, setUsuarios] = useState<any[]>([]);

  useEffect(() => {
    if (state.isOpen) getUsuariosInactivos();
  }, [state.isOpen]);

  const getUsuariosInactivos = async () => {
    const _data = await getUsersStats({
      query: [{ inactivo: true }, { limit: 10000 }],
      client: 'admin',
    });

    setUsuarios(
      _data?.data?.filter((u) => ({
        email: u.email,
        nombre: u.nombre || '',
        apellidos: u.apellidos || '',
      })) || []
    );
  };

  const copyUsuarios = () => {
    navigator.clipboard.writeText(
      usuarios?.reduce(
        (acc, u) =>
          (acc +=
            (u.nombre || '') +
            ' ' +
            (u.apellidos || '') +
            ',' +
            u.email +
            '\n'),
        ''
      )
    );
  };

  return (
    <Modal onClose={state.onClose} isOpen={state.isOpen} isCentered>
      <ModalOverlay />

      <ModalContent maxW="56em" maxH="56em">
        <ModalHeader p="30px 30px 0px">
          <Flex justify="space-between" align="center">
            <Box fontSize="19px">Listado alumnos inactivos</Box>

            <Icon
              as={BiX}
              boxSize="32px"
              cursor="pointer"
              onClick={state.onClose}
            />
          </Flex>
        </ModalHeader>

        <ModalBody p="30px">
          <Flex direction="column" gap="30px">
            <Button onClick={copyUsuarios}>
              Copiar listado al portapapeles
            </Button>

            <Flex direction="column" w="100%" overflow="auto" maxH="500px">
              <Flex fontWeight="semibold" gap="20px">
                <Box w="100%">Nombre completo</Box>
                <Box w="100%">Email</Box>
              </Flex>

              {usuarios?.map((u, index) => (
                <Flex key={'usuario-' + index} gap="20px">
                  <Box w="100%">
                    {(u.nombre || '') + ' ' + (u.apellidos || '')}
                  </Box>

                  <Box w="100%">{u.email}</Box>
                </Flex>
              ))}
            </Flex>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
