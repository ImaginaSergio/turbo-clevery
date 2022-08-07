import { useState, useEffect } from 'react';

import { Box, Button } from '@chakra-ui/react';

import { OpenSelect } from 'ui';
import { addCookie, IEstado, IPais, getPaises, getEstados } from 'data';

import { ModalVariant } from '../types';
import { OpenModalHeader, OpenModalBody, OpenModalFooter } from './_template';

export const LocalizacionModal = ({
  onClose,
  variant,
  onUpdate,
  defaultValue,
}: {
  variant: ModalVariant;
  onClose: () => any;
  onUpdate: (e?: any) => any;
  defaultValue?: { pais?: IPais; estado?: IEstado };
}) => {
  const [pais, setPais] = useState<IPais | null>(defaultValue?.pais || null);
  const [estado, setEstado] = useState<IEstado | null>(defaultValue?.estado || null);

  const [paises, setPaises] = useState([]);
  const [estados, setEstados] = useState([]);

  useEffect(() => {
    getAllpaises();
  }, []);

  useEffect(() => {
    if (pais) getAllEstados();
  }, [pais]);

  const getAllpaises = async () => {
    let _paises: any = await getPaises({});

    setPaises(
      _paises.map((c: IPais) => ({
        label: `${c.bandera} ${c.nombre}`,
        value: { label: c.nombre, value: c },
      }))
    );
  };

  const getAllEstados = async () => {
    let estados: any = await getEstados({ query: [{ pais_id: pais?.id }] });

    setEstados(
      estados.map((estado: IEstado) => ({
        label: estado.nombre,
        value: { label: estado.nombre, value: estado },
      }))
    );
  };

  const handleSubmit = () => {
    onUpdate({ newUser: { paisId: pais?.id, estadoId: estado?.id } });
    onClose();
  };

  const handleOnClose = () => {
    addCookie({
      key: 'localizacion',
      value: 'no-interest',
      expirationMinutes: 30,
    });

    onClose();
  };

  return (
    <>
      <OpenModalHeader>
        <Box w="100%" fontSize="18px" lineHeight="27px">
          Necesitamos que respondas una pregunta para mejorar tu experiencia en OB 🙏
        </Box>
      </OpenModalHeader>

      <OpenModalBody>
        <OpenSelect
          label="País"
          name="pais"
          placeholder="Elige un país del listado"
          options={paises}
          defaultValue={pais ? { label: `${pais.bandera} ${pais.nombre}`, value: pais } : undefined}
          onChange={(e: any) => {
            setPais(e.value);
          }}
        />

        <OpenSelect
          label="Localidad"
          name="estado"
          placeholder="Elige una región del listado"
          options={estados}
          isDisabled={!pais || !pais?.nombre}
          defaultValue={estado ? { label: estado.nombre, value: estado } : estado}
          onChange={(e: any) => {
            setEstado(e.value);
          }}
        />
      </OpenModalBody>

      <OpenModalFooter>
        <Button bg="gray_3" onClick={handleOnClose}>
          No me interesa ahora
        </Button>

        <Button bg="black" color="white" onClick={handleSubmit}>
          Enviar respuesta
        </Button>
      </OpenModalFooter>
    </>
  );
};
