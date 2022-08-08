import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { BiBookContent } from 'react-icons/bi';
import { Flex, useToast, Spinner, Center } from '@chakra-ui/react';

import { IPlantilla } from 'data';
import { onFailure } from 'ui';
import { getPlantilla, updatePlantilla } from 'data';
import { PageHeader, PageSidebar } from '../../../../../shared/components';

import { TabInformacion } from './TabInformacion';

enum Tab {
  INFORMACION = 'informacion',
}

export default function PlantillasInformation() {
  const { plantillaID } = useParams<any>();

  const toast = useToast();
  const navigate = useNavigate();

  const [plantilla, setPlantilla] = useState<IPlantilla>();
  const [tab, setTab] = useState<any>(Tab.INFORMACION);

  useEffect(() => {
    setTab(Tab.INFORMACION);
  }, []);

  useEffect(() => {
    refreshState();
  }, [plantillaID]);

  const refreshState = async () => {
    if (!plantillaID) return;
    else {
      const _plantilla = await getPlantilla({
        id: +plantillaID,
        client: 'admin',
      });

      setPlantilla(_plantilla);
    }
  };

  const updateValue = (value: any) => {
    if (!plantillaID) return;

    return updatePlantilla({
      id: +plantillaID,
      plantilla: value,
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
        title="Ficha de la Plantilla"
        items={[
          {
            icon: BiBookContent,
            title: 'Información',
            isActive: tab === Tab.INFORMACION,
            onClick: () => {
              setTab(Tab.INFORMACION);
              navigate(`/miscelanea/plantillas/${plantillaID}#${Tab.INFORMACION}`);
            },
          },
        ]}
      />

      <Flex direction="column" w="100%">
        <PageHeader
          head={{
            title: plantilla?.titulo || '-',
            image: `data:image/svg+xml;utf8,${plantilla?.icono}`,
          }}
        />

        {!plantilla ? (
          <Center boxSize="100%">
            <Spinner boxSize="40px" />
          </Center>
        ) : (
          <TabInformacion plantilla={plantilla} updateValue={updateValue} />
        )}
      </Flex>
    </Flex>
  );
}
