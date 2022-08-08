import { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import {
  BiBadgeCheck,
  BiBookBookmark,
  BiGroup,
  BiIdCard,
} from 'react-icons/bi';
import { Flex, useToast, Spinner, Center } from '@chakra-ui/react';

import { IGrupo, getGrupoByID, updateGrupo } from '@clevery/data';
import { onFailure } from '@clevery/utils';
import { PageHeader, PageSidebar } from '../../../../../shared/components';

import { TabCursos } from './TabCursos';
import { TabAlumnos } from './TabAlumnos';
import { TabDetalles } from './TabDetalles';
import { TabCertificaciones } from './TabCertificaciones';

enum Tab {
  DETALLES = 'informacion',
  ALUMNOS = 'alumnos',
  CURSOS = 'cursos',
  CERTIFICACIONES = 'certificaciones',
}

export default function GruposInformation() {
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const { grupoID } = useParams<any>();

  const [grupo, setGrupo] = useState<IGrupo>();
  const [tab, setTab] = useState<any>(Tab.DETALLES);

  useEffect(() => {
    const hash = (location?.hash || '')?.replaceAll('#', '');

    setTab(hash || Tab.DETALLES);
  }, []);

  useEffect(() => {
    refreshState();
  }, [grupoID]);

  const refreshState = async () => {
    if (!grupoID) return;

    const _grupo = await getGrupoByID({ id: +grupoID, client: 'admin' });
    setGrupo(_grupo);
  };

  const updateValue = (value: any) => {
    if (!grupoID) return;

    return updateGrupo({ id: +grupoID, grupo: value, client: 'admin' })
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
        title="Ficha del grupo"
        items={[
          {
            icon: BiIdCard,
            title: 'Detalles',
            isActive: tab === Tab.DETALLES,
            onClick: () => {
              setTab(Tab.DETALLES);
              navigate(`/alumnado/grupos/${grupoID}#${Tab.DETALLES}`);
            },
          },
          {
            icon: BiGroup,
            title: 'Alumnos',
            isActive: tab === Tab.ALUMNOS,
            onClick: () => {
              setTab(Tab.ALUMNOS);
              navigate(`/alumnado/grupos/${grupoID}#${Tab.ALUMNOS}`);
            },
          },
          {
            icon: BiBookBookmark,
            title: 'Cursos',
            isActive: tab === Tab.CURSOS,
            onClick: () => {
              setTab(Tab.CURSOS);
              navigate(`/alumnado/grupos/${grupoID}#${Tab.CURSOS}`);
            },
          },
          {
            icon: BiBadgeCheck,
            title: 'Certificaciones',
            isActive: tab === Tab.CERTIFICACIONES,
            onClick: () => {
              setTab(Tab.CERTIFICACIONES);
              navigate(`/alumnado/grupos/${grupoID}#${Tab.CERTIFICACIONES}`);
            },
          },
        ]}
      />

      <Flex direction="column" w="100%">
        <PageHeader head={{ title: grupo?.nombre || '-' }} />

        {!grupo ? (
          <Center boxSize="100%">
            <Spinner boxSize="40px" />
          </Center>
        ) : tab === Tab.CURSOS ? (
          <TabCursos
            grupo={grupo}
            updateValue={updateValue}
            refreshState={refreshState}
          />
        ) : tab === Tab.ALUMNOS ? (
          <TabAlumnos grupo={grupo} updateValue={updateValue} />
        ) : tab === Tab.CERTIFICACIONES ? (
          <TabCertificaciones
            grupo={grupo}
            updateValue={updateValue}
            refreshState={refreshState}
          />
        ) : (
          <TabDetalles grupo={grupo} updateValue={updateValue} />
        )}
      </Flex>
    </Flex>
  );
}
