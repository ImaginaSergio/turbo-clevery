import { useContext } from 'react';

import { Box, Flex } from '@chakra-ui/react';

import { isRoleAllowed } from 'utils';
import { getHabilidades, IHabilidad, UserRolEnum } from 'data';

import { InformationMde, InformationSelect, InformationAsyncSelect } from '../../../../../shared/components';
import { LoginContext } from '../../../../../shared/context';

type TabInformacionProps = {
  habilidad: IHabilidad;
  updateValue: (value: any) => void;
};

export const TabInformacion = ({ habilidad, updateValue }: TabInformacionProps) => {
  const { user } = useContext(LoginContext);

  const loadHabilidadesByNombre = async (value: string) => {
    const _habilidades = await getHabilidades({
      client: 'admin',
      query: [{ nombre: value }],
    });

    return _habilidades?.data?.map((hab: any) => ({
      value: hab.id,
      label: hab.nombre,
    }));
  };

  return (
    <Flex p="30px" gap="30px" boxSize="100%" direction="column" overflow="auto">
      <Flex minH="fit-content" w="100%" direction="column" rowGap="8px">
        <Box fontSize="18px" fontWeight="semibold">
          Información General
        </Box>

        <Box fontSize="14px" fontWeight="medium" color="#84889A">
          Información sobre la habilidad, como su título, contenido y el icono de la misma.
        </Box>
      </Flex>

      <Flex direction="column" gap="30px" w="100%">
        <Flex direction={{ base: 'column', lg: 'row' }} gap="30px" w="100%">
          <InformationSelect
            name="publicado"
            label="Publicado"
            placeholder="Selecciona una opción"
            updateValue={updateValue}
            defaultValue={{
              label: habilidad?.publicado ? 'Publicado' : 'Sin publicar',
              value: habilidad?.publicado,
            }}
            options={[
              { label: 'Publicado', value: true },
              { label: 'Sin publicar', value: false },
            ]}
          />

          <InformationAsyncSelect
            name="superiorId"
            label="Habilidad superior"
            placeholder="Escribe para buscar"
            updateValue={updateValue}
            loadOptions={loadHabilidadesByNombre}
            defaultValue={{
              label: habilidad?.superior?.nombre,
              value: habilidad?.superiorId,
            }}
          />
        </Flex>

        <InformationMde
          allowCopy
          name="icono"
          label="Icono de la habilidad"
          placeholder="Introduce el texto"
          defaultValue={habilidad?.icono}
          updateValue={updateValue}
          isDisabled={!isRoleAllowed([UserRolEnum.ADMIN], user?.rol)}
          style={{ width: '100%' }}
        />
      </Flex>
    </Flex>
  );
};
