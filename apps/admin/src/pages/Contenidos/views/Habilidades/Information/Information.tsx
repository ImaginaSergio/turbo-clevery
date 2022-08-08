import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { BiBookContent } from 'react-icons/bi';
import { Flex, useToast, Spinner, Center } from '@chakra-ui/react';

import { onFailure } from '@clevery/utils';
import { getHabilidadByID, IHabilidad, updateHabilidad } from '@clevery/data';

import { PageHeader, PageSidebar } from '../../../../../shared/components';

import { TabInformacion } from './TabInformacion';

enum Tab {
  INFORMACION = 'informacion',
}

export default function HabilidadesInformation() {
  const { habilidadID } = useParams<any>();

  const toast = useToast();
  const navigate = useNavigate();

  const [habilidad, setHabilidad] = useState<IHabilidad>();
  const [tab, setTab] = useState<any>(Tab.INFORMACION);

  useEffect(() => {
    setTab(Tab.INFORMACION);
  }, []);

  useEffect(() => {
    refreshState();
  }, [habilidadID]);

  const refreshState = async () => {
    if (!habilidadID) return;
    else {
      const _habilidad = await getHabilidadByID({
        id: +habilidadID,
        client: 'admin',
      });

      setHabilidad(_habilidad);
    }
  };

  const updateValue = (value: any) => {
    if (!habilidadID) return;

    return updateHabilidad({
      id: +habilidadID,
      habilidad: value,
      client: 'admin',
    })
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
        title="Ficha de la Habilidad"
        items={[
          {
            icon: BiBookContent,
            title: 'Información',
            isActive: tab === Tab.INFORMACION,
            onClick: () => {
              setTab(Tab.INFORMACION);
              navigate(
                `/contenidos/habilidades/${habilidadID}#${Tab.INFORMACION}`
              );
            },
          },
        ]}
      />

      <Flex direction="column" w="100%">
        <PageHeader
          head={{
            title: habilidad?.nombre || '-',
            image: `data:image/svg+xml;utf8,${habilidad?.icono}`,
          }}
        />

        {!habilidad ? (
          <Center boxSize="100%">
            <Spinner boxSize="40px" />
          </Center>
        ) : (
          <TabInformacion habilidad={habilidad} updateValue={updateValue} />
        )}
      </Flex>
    </Flex>
  );
}
