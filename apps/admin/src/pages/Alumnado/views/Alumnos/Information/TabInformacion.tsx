import { useContext, useEffect, useState } from 'react';

import { Box, Flex } from '@chakra-ui/react';

import { isRoleAllowed } from '@clevery/utils';
import { LoginContext } from '../../../../../shared/context';
import {
  IGrupo,
  IUser,
  UserRolEnum,
  getGrupos,
  getEstados,
  getPaises,
  IEstado,
  IPais,
  UserRemotoEnum,
} from '@clevery/data';
import {
  InformationMultiSelect,
  InformationInput,
  InformationSelect,
} from '../../../../../shared/components';

type TabInformacionProps = {
  user: IUser;
  refreshState: () => void;
  updateValue: (value: any) => void;
};

export const TabInformacion = ({
  user: alumno,
  updateValue,
  refreshState,
}: TabInformacionProps) => {
  const { user } = useContext(LoginContext);

  const [estados, setEstados] = useState([]);
  const [countries, setCountries] = useState([]);

  const loadGruposByName = async (value: string) => {
    const _grupos = await getGrupos({
      client: 'admin',
      query: [{ nombre: value }],
    });

    return _grupos?.data?.map((exp: any) => ({
      value: exp.id,
      label: exp.nombre,
    }));
  };

  useEffect(() => {
    getAllCountries();
  }, []);

  useEffect(() => {
    if (alumno?.pais) getAllEstados();
  }, [alumno?.pais]);

  const getAllCountries = async () => {
    let paises: any = await getPaises({});

    setCountries(
      paises.map((c: IPais) => ({
        label: `${c.bandera} ${c.nombre}`,
        value: { label: c.nombre, value: c },
      }))
    );
  };

  const getAllEstados = async () => {
    let estados: any = await getEstados({
      query: [{ pais_id: alumno?.pais?.id }],
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
    <Flex
      p="30px"
      boxSize="100%"
      rowGap="30px"
      overflow="auto"
      direction="column"
    >
      <Flex minH="fit-content" w="100%" direction="column" rowGap="8px">
        <Box fontSize="18px" fontWeight="semibold">
          Información General
        </Box>

        <Box fontSize="14px" fontWeight="medium" color="#84889A">
          Información sobre el alumno como su nombre, datos de contacto,
          ajustes...
        </Box>
      </Flex>

      <Flex direction={{ base: 'column', md: 'row' }} gap="30px" w="100%">
        <Flex direction="column" w="100%" gap="30px">
          <Flex direction={{ base: 'column', md: 'row' }} gap="20px">
            <InformationInput
              name="nombre"
              label="Nombre del Alumno"
              defaultValue={alumno?.nombre}
              updateValue={updateValue}
              isDisabled={!isRoleAllowed([UserRolEnum.ADMIN], user?.rol)}
              style={{ width: '100%' }}
            />

            <InformationInput
              name="apellidos"
              label="Apellidos del Alumno"
              updateValue={updateValue}
              defaultValue={alumno?.apellidos}
              isDisabled={!isRoleAllowed([UserRolEnum.ADMIN], user?.rol)}
              style={{ width: '100%' }}
            />
          </Flex>

          <InformationInput
            name="dni"
            label="DNI del Alumno"
            updateValue={updateValue}
            defaultValue={alumno?.dni}
            isDisabled={!isRoleAllowed([UserRolEnum.ADMIN], user?.rol)}
          />

          <InformationInput
            name="telefono"
            label="Teléfono del Alumno"
            updateValue={updateValue}
            defaultValue={alumno?.telefono}
            isDisabled={!isRoleAllowed([UserRolEnum.ADMIN], user?.rol)}
          />

          <Flex direction={{ base: 'column', md: 'row' }} gap="30px" w="100%">
            <InformationSelect
              label="País"
              name="pais"
              placeholder="Selecciona una opción"
              defaultValue={
                alumno?.pais
                  ? {
                      label: `${alumno?.pais?.bandera} ${alumno?.pais?.nombre}`,
                      value: alumno?.pais,
                    }
                  : undefined
              }
              options={countries}
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
                !isRoleAllowed([UserRolEnum.ADMIN], user?.rol) || !alumno.pais
              }
              defaultValue={
                alumno?.estado
                  ? { label: alumno?.estado?.nombre, value: alumno?.estado }
                  : undefined
              }
              style={{ width: '100%' }}
            />
          </Flex>
        </Flex>

        <Flex direction="column" w="100%" gap="30px">
          <InformationInput
            name="username"
            label="Nombre de usuario"
            defaultValue={alumno.username}
            updateValue={updateValue}
            isDisabled={!isRoleAllowed([UserRolEnum.ADMIN], user?.rol)}
          />

          <InformationInput
            name="email"
            label="Email del alumno"
            isDisabled
            defaultValue={alumno.email}
            updateValue={updateValue}
          />

          <InformationSelect
            name="activo"
            label="Acceso al campus"
            placeholder="Selecciona una opción"
            updateValue={updateValue}
            options={[
              { label: 'Usuario activo', value: true },
              { label: 'Usuario inactivo', value: false },
            ]}
            isDisabled={!isRoleAllowed([UserRolEnum.ADMIN], user?.rol)}
            defaultValue={{
              label: alumno.activo ? 'Usuario activo' : 'Usuario inactivo',
              value: alumno.activo,
            }}
          />

          <InformationInput
            type="number"
            min={0}
            step={1}
            name="intentosFallidos"
            label="Intentos fallidos"
            isDisabled={!isRoleAllowed([UserRolEnum.ADMIN], user?.rol)}
            defaultValue={alumno.intentosFallidos}
            updateValue={updateValue}
          />
        </Flex>
      </Flex>

      <InformationMultiSelect
        name="grupos"
        label="Grupos asociados"
        placeholder="Escribe para buscar"
        updateValue={updateValue}
        loadOptions={loadGruposByName}
        isDisabled={!isRoleAllowed([UserRolEnum.ADMIN], user?.rol)}
        defaultValue={
          alumno?.grupos?.map((gr: IGrupo) => ({
            label: gr.nombre,
            value: gr.id,
          })) || []
        }
      />
    </Flex>
  );
};
