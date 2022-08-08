import { useState, useEffect, useContext } from 'react';

import { Box, Flex } from '@chakra-ui/react';

import {
  InformationMde,
  InformationInput,
  InformationSelect,
  InformationTextEditor,
  InformationAsyncSelect,
  InformationMultiSelect,
} from '../../../../../shared/components';
import {
  BoostJornadaEnum,
  getEmpresas,
  getEstados,
  getHabilidades,
  getPaises,
  IEstado,
  IPais,
  UserRolEnum,
} from '@clevery/data';
import { IBoost, BoostRemotoEnum } from '@clevery/data';
import { capitalizeFirst, isRoleAllowed } from '@clevery/utils';
import { LoginContext } from 'apps/admin/src/shared/context';

type TabInformacionProps = {
  boost: IBoost;
  updateValue: (value: any) => void;
};

export const TabInformacion = ({ boost, updateValue }: TabInformacionProps) => {
  const { user } = useContext(LoginContext);

  const [paises, setPaises] = useState([]);
  const [estados, setEstados] = useState([]);

  const loadHabilidadesByNombre = async (value: string) => {
    const _habilidades = await getHabilidades({
      client: 'admin',
      query: [{ nombre: value }],
    });

    return _habilidades?.data?.map((hab: any) => ({
      ...hab,
      value: hab.id,
      label: hab.nombre,
    }));
  };

  useEffect(() => {
    getAllCountries();
  }, []);

  useEffect(() => {
    if (boost?.pais) getAllEstados();
  }, [boost?.pais]);

  const getAllCountries = async () => {
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
      query: [{ pais_id: boost?.pais?.id }],
      strategy: 'invalidate-on-undefined',
    });

    setEstados(
      estados.map((e: IEstado) => ({
        label: e.nombre,
        value: { label: e.nombre, value: e },
      }))
    );
  };

  const loadEmpresas = async (value: string) => {
    const _empresas = await getEmpresas({
      client: 'admin',
      query: [{ nombre: value }],
    });

    return _empresas?.data?.map((emp: any) => ({
      value: emp.id,
      label: emp.nombre,
    }));
  };

  return (
    <Flex p="30px" gap="30px" boxSize="100%" direction="column" overflow="auto">
      <Flex minH="fit-content" w="100%" direction="column" rowGap="8px">
        <Box fontSize="18px" fontWeight="semibold">
          Información General
        </Box>

        <Box fontSize="14px" fontWeight="medium" color="#84889A">
          Información sobre el Boost, como el título del mismo, descripción,
          logotipo, etc...
        </Box>
      </Flex>

      <Flex direction={{ base: 'column', lg: 'row' }} gap="30px" w="100%">
        <Flex direction="column" w="100%" gap="30px">
          <InformationInput
            name="titulo"
            label="Titulo del boost"
            defaultValue={boost?.titulo}
            isDisabled={!isRoleAllowed([UserRolEnum.ADMIN], user?.rol)}
            updateValue={updateValue}
          />

          <InformationAsyncSelect
            name="empresaId"
            label="Empresa"
            placeholder="Escribe para buscar"
            updateValue={updateValue}
            loadOptions={loadEmpresas}
            defaultValue={
              boost?.empresaId
                ? {
                    label: boost?.empresa?.nombre,
                    value: boost?.empresaId,
                  }
                : undefined
            }
          />

          <InformationSelect
            name="publicado"
            label="Estado"
            placeholder="Selecciona una opción"
            options={[
              { label: 'Publicado', value: true },
              { label: 'Oculto', value: false },
            ]}
            defaultValue={{
              label: boost?.publicado ? 'Publicado' : 'Oculto',
              value: boost?.publicado,
            }}
            updateValue={updateValue}
            isDisabled={
              !isRoleAllowed([UserRolEnum.ADMIN], user?.rol) ||
              boost?.ruta?.itinerario === '[]'
            }
            style={{ width: '100%' }}
          />

          <Flex direction={{ base: 'column', lg: 'row' }} gap="30px" w="100%">
            <InformationSelect
              label="País"
              name="pais"
              placeholder="Selecciona una opción"
              defaultValue={
                boost?.pais
                  ? {
                      label: `${boost?.pais?.bandera} ${boost?.pais?.nombre}`,
                      value: boost?.pais,
                    }
                  : undefined
              }
              options={paises}
              updateValue={(v: any) =>
                updateValue({ paisId: v.pais.value?.id })
              }
              isDisabled={!isRoleAllowed([UserRolEnum.ADMIN], user?.rol)}
              style={{ width: '100%' }}
            />

            <InformationSelect
              label="Región"
              name="estado"
              options={estados}
              placeholder="Selecciona una opción"
              updateValue={(v: any) =>
                updateValue({ estadoId: v.estado.value?.id })
              }
              isDisabled={
                !isRoleAllowed([UserRolEnum.ADMIN], user?.rol) || !boost.pais
              }
              defaultValue={
                boost?.estado
                  ? { label: boost?.estado?.nombre, value: boost?.estado }
                  : undefined
              }
              style={{ width: '100%' }}
            />
          </Flex>

          <Flex direction={{ base: 'column', lg: 'row' }} gap="30px" w="100%">
            <InformationSelect
              name="jornada"
              label="Tipo de jornada"
              updateValue={updateValue}
              style={{ width: '100%' }}
              defaultValue={{
                label: capitalizeFirst(boost?.jornada),
                value: boost?.jornada,
              }}
              options={Object.values(BoostJornadaEnum).map((v) => ({
                label: capitalizeFirst(v),
                value: v,
              }))}
              isDisabled={!isRoleAllowed([UserRolEnum.ADMIN], user?.rol)}
            />

            <InformationSelect
              name="remoto"
              label="¿Posibilidad de remoto?"
              placeholder="Escribe para buscar"
              updateValue={updateValue}
              style={{ width: '100%' }}
              defaultValue={{
                label: capitalizeFirst(boost?.remoto),
                value: boost?.remoto,
              }}
              options={Object.values(BoostRemotoEnum).map((v) => ({
                label: capitalizeFirst(v),
                value: v,
              }))}
              isDisabled={!isRoleAllowed([UserRolEnum.ADMIN], user?.rol)}
            />
          </Flex>

          <Flex direction={{ base: 'column', lg: 'row' }} gap="30px" w="100%">
            <InformationInput
              type="number"
              name="salarioMin"
              label="Salario mínimo"
              defaultValue={boost?.salarioMin}
              updateValue={updateValue}
              isDisabled={!isRoleAllowed([UserRolEnum.ADMIN], user?.rol)}
              style={{ width: '100%' }}
            />

            <InformationInput
              type="number"
              name="salarioMax"
              label="Salario máximo"
              defaultValue={boost?.salarioMax}
              updateValue={updateValue}
              isDisabled={!isRoleAllowed([UserRolEnum.ADMIN], user?.rol)}
              style={{ width: '100%' }}
            />
          </Flex>

          <InformationMultiSelect
            name="habilidades"
            label="Habilidades del boost"
            placeholder="Escribe para buscar"
            updateValue={updateValue}
            loadOptions={loadHabilidadesByNombre}
            isDisabled={!isRoleAllowed([UserRolEnum.ADMIN], user?.rol)}
            defaultValue={(boost?.habilidades || [])?.map((h) => ({
              label: h.nombre,
              value: h.id,
            }))}
            style={{ width: '100%' }}
          />
        </Flex>

        <Flex direction="column" w="100%" gap="30px">
          <InformationTextEditor
            name="descripcion"
            label="Descripción del boost"
            placeholder="Introduce el texto"
            defaultValue={boost?.descripcion}
            updateValue={updateValue}
            isDisabled={!isRoleAllowed([UserRolEnum.ADMIN], user?.rol)}
          />

          <InformationMde
            allowCopy
            name="icono"
            label="Icono del boost"
            placeholder="Introduce el texto"
            updateValue={updateValue}
            defaultValue={boost?.icono}
            isDisabled={!isRoleAllowed([UserRolEnum.ADMIN], user?.rol)}
          />
        </Flex>
      </Flex>
    </Flex>
  );
};
