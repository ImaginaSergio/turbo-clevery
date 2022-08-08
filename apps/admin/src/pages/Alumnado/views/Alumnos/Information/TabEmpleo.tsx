import { useContext, useState } from 'react';

import { Box, Flex, Image } from '@chakra-ui/react';

import { isRoleAllowed } from '@clevery/utils';
import { LoginContext } from '../../../../../shared/context';
import {
  IUser,
  UserRolEnum,
  getGrupos,
  UserRemotoEnum,
  HabilidadTiemposEnum,
  HabilidadExperiencia,
} from '@clevery/data';
import {
  InformationInput,
  InformationSelect,
} from '../../../../../shared/components';

type TabEmpleoProps = {
  user: IUser;
  refreshState: () => void;
  updateValue: (value: any) => void;
};

export const TabEmpleo = ({
  user: alumno,
  updateValue,
  refreshState,
}: TabEmpleoProps) => {
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
          <InformationSelect
            name="actualmenteTrabajando"
            label="Trabajando como desarrollador"
            placeholder="Selecciona una opción"
            updateValue={updateValue}
            style={{ width: '100%' }}
            options={[
              { label: 'Sí', value: true },
              { label: 'No', value: false },
            ]}
            defaultValue={
              alumno.actualmenteTrabajando !== null
                ? {
                    label: alumno.actualmenteTrabajando ? 'Sí' : 'No',
                    value: alumno.actualmenteTrabajando,
                  }
                : undefined
            }
            isDisabled={!isRoleAllowed([UserRolEnum.ADMIN], user?.rol)}
          />

          <Flex direction={{ base: 'column', md: 'row' }} gap="30px" w="100%">
            <InformationInput
              name="expectativasSalarialesMin"
              label="Salario Mínimo"
              defaultValue={alumno.expectativasSalarialesMin}
              updateValue={updateValue}
              style={{ width: '100%' }}
              isDisabled={!isRoleAllowed([UserRolEnum.ADMIN], user?.rol)}
            />

            <InformationInput
              name="expectativasSalarialesMax"
              label="Salario Máximo"
              defaultValue={alumno.expectativasSalarialesMax}
              updateValue={updateValue}
              style={{ width: '100%' }}
              isDisabled={!isRoleAllowed([UserRolEnum.ADMIN], user?.rol)}
            />
          </Flex>

          <Flex direction={{ base: 'column', md: 'row' }} gap="30px" w="100%">
            <InformationSelect
              isDisabled={!isRoleAllowed([UserRolEnum.ADMIN], user?.rol)}
              name="trabajoRemoto"
              label="Presencialidad"
              placeholder="Selecciona una opción"
              options={[
                { label: 'Remoto', value: UserRemotoEnum.REMOTO },
                { label: 'Presencial', value: UserRemotoEnum.PRESENCIAL },
                { label: 'Híbrido', value: UserRemotoEnum.HIBRIDO },
                { label: 'Indiferente', value: UserRemotoEnum.INDIFERENTE },
              ]}
              defaultValue={{
                label: alumno.trabajoRemoto,
                value: alumno.trabajoRemoto,
              }}
              updateValue={updateValue}
              style={{ width: '100%' }}
            />

            <InformationSelect
              isDisabled={!isRoleAllowed([UserRolEnum.ADMIN], user?.rol)}
              name="posibilidadTraslado"
              label="Posibilidad de traslado"
              placeholder="Selecciona una opción"
              options={[
                { label: 'Sí', value: true },
                { label: 'No', value: false },
              ]}
              defaultValue={{
                label: alumno.posibilidadTraslado ? 'Sí' : 'No',
                value: alumno.posibilidadTraslado,
              }}
              updateValue={updateValue}
              style={{ width: '100%' }}
            />
          </Flex>
        </Flex>

        <Flex direction="column" w="100%" gap="30px">
          <Flex direction="column" gap="20px">
            <Box fontSize="14px" fontWeight="bold" mb="10px">
              Habilidades del alumno
            </Box>

            {(alumno?.habilidades?.length || 0) > 0 ? (
              alumno?.habilidades?.map(
                (hab: HabilidadExperiencia, index: number) => (
                  <Flex key={'habilidad-' + index} gap="15px" align="center">
                    <Image
                      minW="32px"
                      boxSize="32px"
                      src={`data:image/svg+xml;utf8,${hab.icono}`}
                    />

                    <Box
                      w="100%"
                      fontWeight="medium"
                      fontSize="16px"
                      lineHeight="26px"
                    >
                      {hab.nombre}
                    </Box>

                    <Flex>
                      {hab.meta.pivot_experiencia ===
                      HabilidadTiemposEnum.MENOS_DE_UNO
                        ? 'Menos de 1 año'
                        : hab.meta.pivot_experiencia ===
                          HabilidadTiemposEnum.UNO_A_TRES
                        ? '1-3 años'
                        : hab.meta.pivot_experiencia ===
                          HabilidadTiemposEnum.CUATRO_A_SIETE
                        ? '4-7 años'
                        : hab.meta.pivot_experiencia ===
                          HabilidadTiemposEnum.OCHO_A_DIEZ
                        ? '8-10 años'
                        : hab.meta.pivot_experiencia ===
                          HabilidadTiemposEnum.MAS_DE_DIEZ
                        ? 'Más de 10 años'
                        : 'Sin experiencia'}
                    </Flex>
                  </Flex>
                )
              )
            ) : (
              <Box>Sin habilidades seleccionadas</Box>
            )}
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};
