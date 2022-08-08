import { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { Flex, useToast, Spinner, Center, Icon } from '@chakra-ui/react';
import { BiRedo, BiTask, BiIdCard, BiEnvelope, BiBriefcase } from 'react-icons/bi';

import { isRoleAllowed } from 'utils';
import { onFailure, onSuccess } from 'ui';
import { IUser, updateUser, UserRolEnum, getUserByID, resendCredentials } from 'data';
import { LoginContext } from '../../../../../shared/context';
import { PageHeader, PageSidebar } from '../../../../../shared/components';

import { TabEmpleo } from './TabEmpleo';
import { TabProgreso } from './TabProgreso';
import { TabEjercicios } from './TabEjercicios';
import { TabInformacion } from './TabInformacion';

enum Tab {
  INFORMACION = 'informacion',
  PROGRESO = 'progreso',
  EJERCICIOS = 'ejercicios',
  EMPLEO = 'empleo',
}

export default function AlumnosInformation() {
  const { userId } = useParams<any>();
  const { user } = useContext(LoginContext);

  const [alumno, setAlumno] = useState<IUser>();
  const [tab, setTab] = useState<any>(Tab.INFORMACION);

  const toast = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const hash = (location?.hash || '')?.replaceAll('#', '');

    setTab(hash || Tab.INFORMACION);
  }, []);

  useEffect(() => {
    refreshState();
  }, [userId]);

  const refreshState = async () => {
    if (!userId) {
      onFailure(toast, 'Error inesperado', 'El ID de usuario es undefined. Por favor, contacte con soporte.');
      return;
    }

    const _user = await getUserByID({ id: +userId, client: 'admin' });
    setAlumno(_user);
  };

  const updateValue = (value: any) => {
    if (!userId) {
      onFailure(toast, 'Error inesperado', 'El ID de usuario es undefined. Por favor, contacte con soporte.');
      return;
    }

    return updateUser({ id: +userId, user: value, client: 'admin' })
      .then(async (msg: any) => {
        await refreshState();

        return msg;
      })
      .catch((error: any) => {
        console.error('Todo fue mal D:', { error });
        onFailure(toast, error.title, error.message);

        return error;
      });
  };

  return (
    <Flex boxSize="100%">
      <PageSidebar
        title="Ficha del alumno"
        items={[
          {
            icon: BiIdCard,
            title: 'Información',
            isActive: tab === Tab.INFORMACION,
            onClick: () => {
              setTab(Tab.INFORMACION);
              navigate(`/alumnado/usuarios/${userId}#${Tab.INFORMACION}`);
            },
          },
          {
            icon: BiRedo,
            title: 'Progreso',
            isActive: tab === Tab.PROGRESO,
            onClick: () => {
              setTab(Tab.PROGRESO);
              navigate(`/alumnado/usuarios/${userId}#${Tab.PROGRESO}`);
            },
          },
          {
            icon: BiBriefcase,
            title: 'Datos Empleo',
            isActive: tab === Tab.EMPLEO,
            onClick: () => {
              setTab(Tab.EMPLEO);
              navigate(`/alumnado/usuarios/${userId}#${Tab.EMPLEO}`);
            },
          },
          {
            icon: BiTask,
            title: 'Ejercicios',
            isActive: tab === Tab.EJERCICIOS,
            onClick: () => {
              setTab(Tab.EJERCICIOS);
              navigate(`/alumnado/usuarios/${userId}#${Tab.EJERCICIOS}`);
            },
          },
        ]}
      />

      <Flex direction="column" w="100%" overflow="hidden">
        <PageHeader
          head={{
            title: alumno?.fullName,
            subtitle: alumno?.email,
            image: alumno?.avatar?.url,
          }}
          button={{
            text: 'Reenviar credenciales',
            leftIcon: <Icon as={BiEnvelope} boxSize="21px" />,
            isDisabled: !isRoleAllowed([UserRolEnum.ADMIN], user?.rol),
            onClick: () => {
              resendCredentials({ id: +(userId || 0), client: 'admin' })
                .then(() => onSuccess(toast, 'Email de credenciales reenviado.'))
                .catch(() => onFailure(toast, 'Algo ha fallado', 'Contacta con el administrador.'));
            },
          }}
        />

        {!alumno ? (
          <Center boxSize="100%">
            <Spinner boxSize="40px" />
          </Center>
        ) : tab === Tab.INFORMACION ? (
          <TabInformacion user={alumno} updateValue={updateValue} refreshState={refreshState} />
        ) : tab === Tab.EJERCICIOS ? (
          <TabEjercicios user={alumno} updateValue={updateValue} refreshState={refreshState} />
        ) : tab === Tab.PROGRESO ? (
          <TabProgreso user={alumno} updateValue={updateValue} refreshState={refreshState} />
        ) : (
          <TabEmpleo user={alumno} updateValue={updateValue} refreshState={refreshState} />
        )}
      </Flex>
    </Flex>
  );
}
