import { Flex } from '@chakra-ui/react';

import { getLenguajes, ILivecoder, updateLiveCoder } from 'data';

import { InformationInput, InformationMonaco, InformationAsyncSelect } from '../../../../../../../shared/components';

export const TabLivecoder = ({ livecoder, refreshState }: { livecoder?: ILivecoder; refreshState: () => void }) => {
  const updateValue = (value: any) => {
    if (!livecoder?.id) return;

    return updateLiveCoder({
      id: +livecoder?.id,
      livecoder: value,
      client: 'admin',
    }).then(() => {
      refreshState();
    });
  };

  const loadLenguajes = async (value: string) =>
    getLenguajes({ query: [{ nombre: value }] })
      .then((res) =>
        res?.data?.map((lenguaje: any) => ({
          value: lenguaje.id,
          label: lenguaje?.nombre,
        }))
      )
      .catch((error: any) => console.log({ error }));

  return (
    <Flex direction="column" w="100%" gap="30px" h="100%">
      <Flex w="100%" gap="30px" direction={{ lg: 'column', xl: 'row' }}>
        <InformationInput
          name="puntuacionMinima"
          label="% Mínimo para aprobar"
          defaultValue={livecoder?.puntuacionMinima}
          updateValue={updateValue}
          isDisabled={!livecoder?.id}
          style={{ width: '100%' }}
        />

        <InformationAsyncSelect
          name="lenguajeId"
          label="Tipo de lenguaje"
          placeholder="Escribe para buscar"
          updateValue={updateValue}
          isDisabled={!livecoder?.id}
          loadOptions={loadLenguajes}
          defaultValue={
            livecoder?.lenguajeId
              ? {
                  label: livecoder?.lenguaje?.nombre,
                  value: livecoder?.lenguajeId,
                }
              : undefined
          }
          style={{ width: '100%' }}
        />
      </Flex>

      <InformationMonaco
        name="codigo"
        label="Plantilla de código del ejercicio"
        updateValue={updateValue}
        isDisabled={!livecoder?.id}
        style={{ width: '100%' }}
        defaultValue={livecoder?.codigo}
        language={livecoder?.lenguaje?.monacoLang || 'javascript'}
      />
    </Flex>
  );
};
