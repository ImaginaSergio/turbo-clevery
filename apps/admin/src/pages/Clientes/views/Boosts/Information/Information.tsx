import { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';

import {
  BiShow,
  BiBookReader,
  BiDirections,
  BiBookContent,
  BiListCheck,
} from 'react-icons/bi';
import { Flex, Icon, useToast, Spinner, Center } from '@chakra-ui/react';

import { IBoost } from '@clevery/data';
import { onFailure } from '@clevery/utils';
import { getBoost, updateBoost } from '@clevery/data';
import { PageHeader, PageSidebar } from '../../../../../shared/components';

import { TabRuta } from './TabRuta';
import { TabInscritos } from './TabInscritos';
import { TabRequisitos } from './TabRequisitos';
import { TabInformacion } from './TabInformacion';

enum Tab {
  INFORMACION = 'informacion',
  RUTA = 'ruta',
  INSCRITOS = 'inscritos',
  REQUISITOS = 'requisitos',
}

export default function BoostsInformation() {
  const { boostID } = useParams<any>();

  const [boost, setBoost] = useState<IBoost>();
  const [tab, setTab] = useState<any>(Tab.INFORMACION);

  const toast = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const hash = (location?.hash || '')?.replaceAll('#', '');

    if (hash === Tab.RUTA) setTab(Tab.RUTA);
    else if (hash === Tab.INSCRITOS) setTab(Tab.INSCRITOS);
    else if (hash === Tab.REQUISITOS) setTab(Tab.REQUISITOS);
    else setTab(Tab.INFORMACION);
  }, []);

  useEffect(() => {
    refreshState();
  }, [boostID]);

  const refreshState = async () => {
    if (!boostID) return;

    const _boost = await getBoost({ id: +boostID, client: 'admin' });
    setBoost(_boost);
  };

  const updateValue = (value: any) => {
    if (!boostID) return;

    return updateBoost({ id: +boostID, boost: value, client: 'admin' })
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
        title="Ficha de la boost"
        items={[
          {
            icon: BiBookContent,
            title: 'Información',
            isActive: tab === Tab.INFORMACION,
            onClick: () => {
              setTab(Tab.INFORMACION);
              navigate(`/clientes/boosts/${boostID}#informacion`);
            },
          },
          {
            icon: BiDirections,
            title: 'Hoja de ruta',
            isActive: tab === Tab.RUTA,
            onClick: () => {
              setTab(Tab.RUTA);
              navigate(`/clientes/boosts/${boostID}#ruta`);
            },
          },
          {
            icon: BiListCheck,
            title: 'Requisitos',
            isActive: tab === Tab.REQUISITOS,
            onClick: () => {
              setTab(Tab.REQUISITOS);
              navigate(`/clientes/boosts/${boostID}#requisitos`);
            },
          },
          {
            icon: BiBookReader,
            title: 'Inscritos',
            isActive: tab === Tab.INSCRITOS,
            onClick: () => {
              setTab(Tab.INSCRITOS);
              navigate(`/clientes/boosts/${boostID}#inscritos`);
            },
          },
        ]}
      />

      <Flex direction="column" w="100%">
        <PageHeader
          head={{
            title: boost?.titulo || '-',
            image: `data:image/svg+xml;utf8,${boost?.icono}`,
          }}
          button={{
            text: 'Previsualizar boost',
            leftIcon: <Icon as={BiShow} boxSize="21px" />,
            isDisabled: true,
            onClick: () => {},
          }}
        />

        {!boost ? (
          <Center boxSize="100%">
            <Spinner boxSize="40px" />
          </Center>
        ) : tab === Tab.INFORMACION ? (
          <TabInformacion boost={boost} updateValue={updateValue} />
        ) : tab === Tab.RUTA ? (
          <TabRuta boost={boost} />
        ) : tab === Tab.REQUISITOS ? (
          <TabRequisitos boost={boost} updateValue={updateValue} />
        ) : (
          <TabInscritos boost={boost} />
        )}
      </Flex>
    </Flex>
  );
}
