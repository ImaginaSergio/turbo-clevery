import { useContext, useState, useEffect } from 'react';

import Select from 'react-select';
import { BiRadioCircle, BiRadioCircleMarked } from 'react-icons/bi';
import { Box, Button, Flex, Icon, Text, useToast } from '@chakra-ui/react';

import { Avatar } from 'ui';
import { onFailure } from 'utils';
import { getUsers, updateLeccion } from 'data';
import { ApiFile, IGrupo, ILeccion } from 'data';
import { LoginContext } from '../../../../../shared/context';

interface AsistenciaUser {
  id: number;
  email: string;
  avatar: ApiFile;
  username: string;
  nombre?: string;
  apellidos?: string;
  asistencia: boolean | null;
}

export const AsistenciaModal = ({ leccion, isOpen, onClose }: { leccion?: ILeccion; isOpen: boolean; onClose: () => void }) => {
  const toast = useToast();
  const { user } = useContext(LoginContext);

  const [grupo, setGrupo] = useState<IGrupo>();
  const [users, setUsers] = useState<AsistenciaUser[]>([]);

  useEffect(() => {
    if (!isOpen) {
      setGrupo(undefined);
      setUsers([]);
    }
  }, [isOpen]);

  useEffect(() => {
    (async () => {
      if (grupo) {
        const _users = await getUsers({
          query: [{ grupo_id: grupo.id }, { limit: 10000 }],
        });

        setUsers([
          ...(_users?.data?.map((u) => ({
            id: u.id,
            email: u.email,
            avatar: u.avatar,
            username: u.username,
            nombre: u.nombre,
            apellidos: u.apellidos,
            asistencia: null,
          })) || []),
        ]);
      } else setUsers([]);
    })();
  }, [grupo]);

  const updateUsers = (user: any) => {
    setUsers([...users].map((u) => (u.id === user.id ? user : u)));
  };

  const sendAsistencia = () => {
    if (!leccion?.id) return;

    const asistencias: any = {};

    for (const user of users) {
      asistencias[user.id] = { confirmado: user.asistencia };
    }

    updateLeccion({ id: leccion.id, leccion: { asistencias } })
      .then(() => onClose())
      .catch((err) =>
        onFailure(toast, 'Error inesperado', 'Error al guardar el listado de asistencias. Por favor, contacte con soporte.')
      );
  };

  return (
    <Flex direction="column" p="30px" overflow="hidden">
      <Flex h="100%" gap="12px" minH="256px" direction="column" overflowY="hidden">
        <Box fontSize="16px">{grupo ? `Listado de alumnos del grupo ${grupo?.nombre}` : 'Selecciona un grupo'}</Box>

        <Select
          styles={selectStyles}
          onChange={(e) => setGrupo(e?.value || undefined)}
          options={(user?.grupos || []).map((g: IGrupo) => ({
            label: g.nombre,
            value: g,
          }))}
        />

        <Flex direction="column" gap="12px" overflow="auto">
          {users?.map((user: AsistenciaUser, index: number) => (
            <UserAsistenciaItem user={user} updateUsers={updateUsers} key={`alumno-asistencia-${index}`} />
          ))}
        </Flex>
      </Flex>

      <Flex gap="15px" w="100%" align="flex-end">
        <Button
          rounded="12px"
          w="fit-content"
          fontSize="16px"
          bg="transparent"
          fontWeight="bold"
          lineHeight="18px"
          onClick={onClose}
          p="15px 20px 15px 25px"
          border="2px solid var(--chakra-colors-gray_3)"
        >
          Cancelar
        </Button>

        <Button
          bg="black"
          color="white"
          rounded="12px"
          fontSize="15px"
          fontWeight="bold"
          lineHeight="18px"
          w="fit-content"
          p="15px 20px 15px 25px"
          onClick={sendAsistencia}
          border="2px solid var(--chakra-colors-black)"
        >
          Guardar asistencia
        </Button>
      </Flex>
    </Flex>
  );
};

const selectStyles = {
  indicatorSeparator: (styles: any) => ({ ...styles, display: 'none' }),
  control: (styles: any, { isDisabled }: any) => ({
    ...styles,
    height: '40px',
    textAlign: 'left',
    padding: '0px 12px',
    borderRadius: '12px',
    cursor: isDisabled ? 'not-allowed' : 'default',
    backgroundColor: 'var(--chakra-colors-gray_2)',
    border: '1px solid var(--chakra-colors-gray_3)',
  }),
  container: (styles: any) => ({ ...styles, width: '100%' }),
  valueContainer: (styles: any) => ({ ...styles, padding: '0px' }),
  menu: (styles: any) => ({
    ...styles,
    backgroundColor: 'var(--chakra-colors-white)',
  }),
  dropdownIndicator: (styles: any) => ({
    ...styles,
    color: 'var(--chakra-colors-black)',
  }),
  option: (styles: any, { isFocused }: any) => ({
    ...styles,
    cursor: 'pointer',
    textAlign: 'left',
    color: 'var(--chakra-colors-black)',
    backgroundColor: isFocused ? 'var(--chakra-colors-primary_light)' : 'var(--chakra-colors-white)',
    fontWeight: 'medium',
  }),
  singleValue: (styles: any) => ({
    ...styles,
    fontWeight: 'medium',
    color: 'var(--chakra-colors-black)',
  }),
};

const UserAsistenciaItem = ({
  user,
  updateUsers,
}: {
  user: AsistenciaUser;
  updateUsers: (newUser: AsistenciaUser) => void;
}) => {
  return (
    <Flex boxSize="100%" align="center" gap="14px">
      <Avatar
        size="45px"
        src={user?.avatar?.url}
        name={user?.username || 'Avatar del usuario'}
        colorVariant={(user?.id || 0) % 2 == 1 ? 'hot' : 'cold'}
      />

      <Flex w="100%" direction="column" gap="4px">
        <Text variant="card_title" fontSize="16px">
          {(user?.nombre || ' ') + (user?.apellidos || ' ')}
        </Text>

        <Text variant="card_title" fontSize="13px" color="gray_5">
          {user.email}
        </Text>
      </Flex>

      <Flex minW="fit-content" align="center" gap="8px">
        <Flex align="center" onClick={() => updateUsers({ ...user, asistencia: true })}>
          <Icon
            boxSize="32px"
            color={user.asistencia === true ? 'accept' : 'gray_4'}
            as={user.asistencia === true ? BiRadioCircleMarked : BiRadioCircle}
          />
        </Flex>

        <Flex align="center" onClick={() => updateUsers({ ...user, asistencia: false })}>
          <Icon
            boxSize="32px"
            color={user.asistencia === false ? 'cancel' : 'gray_4'}
            as={user.asistencia === false ? BiRadioCircleMarked : BiRadioCircle}
          />
        </Flex>
      </Flex>
    </Flex>
  );
};
