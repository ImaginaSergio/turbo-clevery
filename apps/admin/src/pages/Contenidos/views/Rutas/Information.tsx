import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { useToast } from '@chakra-ui/react';

import {
  ITab,
  ITabPanel,
  Information,
  ItinerarioList,
  InformationHead,
  InformationLastupdate,
  InformationSelect,
  InformationMde,
  InformationTextEditor,
} from '../../../../shared/components';
import { onFailure } from '@clevery/utils';
import { getRutaByID, IRuta, updateRuta } from '@clevery/data';

export default function RutasInformation() {
  const { rutaID } = useParams<any>();

  const [ruta, setRuta] = useState<IRuta>();

  const toast = useToast();

  useEffect(() => {
    refreshState();
  }, [rutaID]);

  const refreshState = async () => {
    if (!rutaID) return;

    const _ruta = await getRutaByID({ id: +rutaID, client: 'admin' });
    setRuta(_ruta);
  };

  const updateValue = (value: any) => {
    if (!rutaID) return;

    return updateRuta({ id: +rutaID, ruta: value, client: 'admin' })
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

  const tabList: ITab[] = [
    { title: 'Datos generales', isDisabled: false },
    { title: 'Itinerario', isDisabled: false },
  ];

  const tabPanels: ITabPanel[] = [
    /** Datos generales panel */
    {
      rows: [
        {
          blocks: [
            <InformationSelect
              name="privada"
              label="Visibilidad"
              updateValue={updateValue}
              placeholder="Elige una opción del listado"
              defaultValue={{
                label: ruta?.privada ? 'Privada' : 'Pública',
                value: ruta?.privada,
              }}
              options={[
                { label: 'Pública', value: false },
                { label: 'Privada', value: true },
              ]}
            />,
          ],
        },
        {
          blocks: [
            <InformationTextEditor
              name="descripcion"
              label="Descripción de la hoja de ruta"
              placeholder="Introduce la descripción"
              defaultValue={ruta?.descripcion}
              updateValue={updateValue}
            />,
            <InformationMde
              allowCopy
              name="icono"
              label="Icono de la hoja de ruta"
              placeholder="Introduce el icono en svg (texto)"
              updateValue={updateValue}
              isDisabled={!ruta?.id}
              defaultValue={ruta?.icono}
            />,
          ],
        },
      ],
    },
    /** Itinerario panel */
    {
      rows: [
        { blocks: [<ItinerarioList ruta={ruta} updateRuta={updateValue} />] },
      ],
    },
  ];

  const header = [
    <InformationHead
      picture={ruta?.icono}
      title={ruta?.nombre}
      subtitle=""
      nameTitle="nombre"
      updateValueTitle={updateValue}
    />,
    <InformationLastupdate
      created={ruta?.createdAt}
      updated={ruta?.updatedAt}
    />,
  ];

  return (
    <Information header={header} tabList={tabList} tabPanels={tabPanels} />
  );
}
