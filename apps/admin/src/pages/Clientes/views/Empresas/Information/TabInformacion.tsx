import { useContext, useEffect, useState } from 'react';

import { Box, Flex } from '@chakra-ui/react';

import { getEstados, getPaises, IEmpresa, IEstado, IPais, UserRolEnum } from 'data';
import { isRoleAllowed } from 'utils';

import {
  InformationFilepond,
  InformationInput,
  InformationMde,
  InformationSelect,
  InformationTextEditor,
} from '../../../../../shared/components';
import { LoginContext } from '../../../../../shared/context';

type TabInformacionProps = {
  empresa: IEmpresa;
  updateValue: (value: any) => void;
};

export const TabInformacion = ({ empresa, updateValue }: TabInformacionProps) => {
  const { user } = useContext(LoginContext);

  const [paises, setPaises] = useState([]);
  const [estados, setEstados] = useState([]);

  useEffect(() => {
    getAllPaises();
  }, []);

  useEffect(() => {
    if (empresa?.pais) getAllEstados();
  }, [empresa?.pais]);

  const getAllPaises = async () => {
    let paises: any = await getPaises({});

    setPaises(
      paises.map((c: IPais) => ({
        label: `${c.bandera} ${c.nombre}`,
        value: { label: c.nombre, value: c },
      }))
    );
  };

  const getAllEstados = async () => {
    let estados: any = await getEstados({
      query: [{ pais_id: empresa?.pais?.id }],
      strategy: 'invalidate-on-undefined',
    });

    setEstados(
      estados.map((e: IEstado) => ({
        label: e.nombre,
        value: { label: e.nombre, value: e },
      }))
    );
  };

  return (
    <Flex p="30px" gap="30px" boxSize="100%" overflow="auto" direction="column">
      <Flex minH="fit-content" w="100%" direction="column" rowGap="8px">
        <Box fontSize="18px" fontWeight="semibold">
          Información General
        </Box>

        <Box fontSize="14px" fontWeight="medium" color="#84889A">
          Información sobre la empresa, como el nombre del misma, su cif, sector y datos de contacto
        </Box>
      </Flex>

      <Flex direction={{ base: 'column', lg: 'row' }} gap="30px" w="100%">
        <Flex direction="column" w="100%" gap="30px">
          <InformationInput name="cif" label="CIF" defaultValue={empresa?.cif} updateValue={updateValue} />

          <InformationInput name="sector" label="Sector" defaultValue={empresa?.sector} updateValue={updateValue} />

          <InformationInput name="web" label="Enlace a la web" defaultValue={empresa?.web} updateValue={updateValue} />

          <Flex direction={{ base: 'column', lg: 'row' }} gap="30px" w="100%">
            <InformationSelect
              label="País"
              name="pais"
              placeholder="Selecciona una opción"
              defaultValue={
                empresa?.pais
                  ? {
                      label: `${empresa?.pais?.bandera} ${empresa?.pais?.nombre}`,
                      value: empresa?.pais,
                    }
                  : undefined
              }
              options={paises}
              updateValue={(v: any) => updateValue({ paisId: v.pais.value?.id })}
              isDisabled={!isRoleAllowed([UserRolEnum.ADMIN], user?.rol)}
              style={{ width: '100%' }}
            />

            <InformationSelect
              label="Región"
              name="estado"
              options={estados}
              placeholder="Selecciona una opción"
              updateValue={(v: any) => updateValue({ estadoId: v.estado.value?.id })}
              isDisabled={!isRoleAllowed([UserRolEnum.ADMIN], user?.rol) || !empresa?.pais}
              defaultValue={empresa?.estado ? { label: empresa?.estado?.nombre, value: empresa?.estado } : undefined}
              style={{ width: '100%' }}
            />
          </Flex>

          <InformationInput
            name="personaContacto"
            label="Persona de contacto"
            updateValue={updateValue}
            defaultValue={empresa?.personaContacto}
          />

          <InformationInput name="email" label="Email de contacto" defaultValue={empresa?.email} updateValue={updateValue} />

          <InformationInput
            name="telefono"
            label="Teléfono de contacto"
            defaultValue={empresa?.telefono}
            updateValue={updateValue}
          />
        </Flex>

        <Flex direction="column" gap="30px" w="100%">
          <InformationFilepond
            name="imagen"
            label="Portada"
            putEP={'/godAPI/empresas/' + empresa?.id}
            isDisabled={!empresa?.id}
          />

          <InformationTextEditor
            name="descripcion"
            label="Descripción de la empresa"
            placeholder="Introduce el texto"
            updateValue={updateValue}
            isDisabled={!empresa?.id}
            defaultValue={empresa?.descripcion}
          />

          <InformationMde
            allowCopy
            name="icono"
            label="Icono de la empresa"
            placeholder="Introduce el texto"
            updateValue={updateValue}
            isDisabled={!empresa?.id}
            defaultValue={empresa?.icono}
          />
        </Flex>
      </Flex>
    </Flex>
  );
};
