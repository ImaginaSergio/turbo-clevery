import { useEffect, useState } from 'react';

import { Tab, Tabs, useToast, TabList, TabPanel, TabPanels } from '@chakra-ui/react';

import { ILeccion, ILivecoder, addLivecoder, getLivecoders } from 'data';
import { onFailure } from 'ui';

import { TabTests } from './TabTests';
import { TabDetalles } from './TabDetalles';
import { TabLivecoder } from './TabLivecoder';

export const LeccionLivecoder = ({ leccion, updateValue }: { leccion: ILeccion; updateValue: (e?: any) => any }) => {
  const toast = useToast();
  const [livecoder, setLivecoder] = useState<ILivecoder>();

  useEffect(() => {
    refreshState();
  }, [leccion?.id]);

  const refreshState = async () => {
    if (!leccion.id) return;

    const livecodersData = await getLivecoders({
      client: 'admin',
      query: [{ leccion_id: leccion?.id }],
    });

    let _livecoder = livecodersData?.data ? livecodersData?.data[0] : undefined;

    if (!_livecoder?.id) {
      addLivecoder({
        livecoder: {
          lenguajeId: 2,
          puntuacionMinima: 80,
          leccionId: leccion?.id,
          codigo: `console.log("¡Hola mundo!")`,
        },
      })
        .then(async (res: any) => {
          setLivecoder(res.value);
        })
        .catch((error: any) => {
          console.error('Todo fue mal D:', { error });
          onFailure(toast, error.title, error.message);

          return error;
        });
    } else {
      setLivecoder(_livecoder);
    }
  };

  return (
    <Tabs h="100%">
      <TabList>
        <Tab
          fontSize="15px"
          fontWeight="bold"
          color="#878EA0"
          _selected={{
            color: '#26C8AB',
            borderBottom: '4px solid #26C8AB',
          }}
        >
          Detalles de la Lección
        </Tab>

        <Tab
          fontSize="15px"
          fontWeight="bold"
          color="#878EA0"
          _selected={{
            color: '#26C8AB',
            borderBottom: '4px solid #26C8AB',
          }}
        >
          Contenido del Livecoder
        </Tab>

        <Tab
          fontSize="15px"
          fontWeight="bold"
          color="#878EA0"
          _selected={{
            color: '#26C8AB',
            borderBottom: '4px solid #26C8AB',
          }}
        >
          Tests del Livecoder
        </Tab>
      </TabList>

      <TabPanels h="100%">
        <TabPanel p="30px 0px">
          <TabDetalles leccion={leccion} updateValue={updateValue} />
        </TabPanel>

        <TabPanel p="30px 0px" h="100%">
          <TabLivecoder livecoder={livecoder} refreshState={refreshState} />
        </TabPanel>

        <TabPanel p="30px 0px" h="100%">
          <TabTests livecoder={livecoder} refreshState={refreshState} />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};
