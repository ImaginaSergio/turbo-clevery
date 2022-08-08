import { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';

import { Flex, Icon, useToast, Spinner, Center } from '@chakra-ui/react';
import {
  BiBookContent,
  BiBookReader,
  BiDirections,
  BiShow,
} from 'react-icons/bi';

import { IProceso } from '@clevery/data';
import { onFailure } from '@clevery/utils';
import { getProceso, updateProceso } from '@clevery/data';
import { PageHeader, PageSidebar } from '../../../../../shared/components';

import { TabRuta } from './TabRuta';
import { TabInscritos } from './TabInscritos';
import { TabInformacion } from './TabInformacion';

enum Tab {
  INFORMACION = 'informacion',
  RUTA = 'ruta',
  INSCRITOS = 'inscritos',
}

export default function VacantesInformation() {
  const { vacanteID } = useParams<any>();

  const [proceso, setProceso] = useState<IProceso>();
  const [tab, setTab] = useState<any>(Tab.INFORMACION);

  const toast = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const hash = (location?.hash || '')?.replaceAll('#', '');

    if (hash === 'vacantes') setTab(Tab.RUTA);
    else if (hash === 'inscritos') setTab(Tab.INSCRITOS);
    else setTab(Tab.INFORMACION);
  }, []);

  useEffect(() => {
    refreshState();
  }, [vacanteID]);

  const refreshState = async () => {
    if (!vacanteID) return;

    const _proceso = await getProceso({ id: +vacanteID, client: 'admin' });
    setProceso(_proceso);
  };

  const updateValue = (value: any) => {
    if (!vacanteID) return;

    return updateProceso({ id: +vacanteID, proceso: value, client: 'admin' })
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
        title={'Ficha de la vacante'}
        items={[
          {
            icon: BiBookContent,
            title: 'Información',
            isActive: tab === Tab.INFORMACION,
            onClick: () => {
              setTab(Tab.INFORMACION);
              navigate(`/clientes/vacantes/${vacanteID}#informacion`);
            },
          },
          {
            icon: BiDirections,
            title: 'Hoja de ruta',
            isActive: tab === Tab.RUTA,
            onClick: () => {
              setTab(Tab.RUTA);
              navigate(`/clientes/vacantes/${vacanteID}#ruta`);
            },
          },
          {
            icon: BiBookReader,
            title: 'Inscritos',
            isDisabled: true,
            isActive: tab === Tab.INSCRITOS,
            onClick: () => {
              setTab(Tab.INSCRITOS);
              navigate(`/clientes/vacantes/${vacanteID}#inscritos`);
            },
          },
        ]}
      />

      <Flex direction="column" w="100%">
        <PageHeader
          head={{ title: proceso?.titulo || '-', image: proceso?.imagen?.url }}
          button={{
            text: 'Previsualizar proceso',
            leftIcon: <Icon as={BiShow} boxSize="21px" />,
            isDisabled: true,
            onClick: () => {},
          }}
        />

        {!proceso ? (
          <Center boxSize="100%">
            <Spinner boxSize="40px" />
          </Center>
        ) : tab === Tab.INFORMACION ? (
          <TabInformacion proceso={proceso} updateValue={updateValue} />
        ) : tab === Tab.RUTA ? (
          <TabRuta proceso={proceso} updateValue={updateValue} />
        ) : (
          <TabInscritos proceso={proceso} updateValue={updateValue} />
        )}
      </Flex>
    </Flex>
  );
}
