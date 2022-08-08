import { useContext } from 'react';

import { Box, Flex } from '@chakra-ui/react';

import { isRoleAllowed } from 'utils';
import { getCertificaciones, IBoost, UserRolEnum } from 'data';

import { LoginContext } from '../../../../../shared/context';
import { InformationMultiSelect } from '../../../../../shared/components';

type TabRequisitosProps = {
  boost: IBoost;
  updateValue: (value: any) => void;
};

export const TabRequisitos = ({ boost, updateValue }: TabRequisitosProps) => {
  const { user } = useContext(LoginContext);

  const loadCertificacionesByNombre = async (value: string) => {
    const _certificaciones = await getCertificaciones({
      client: 'admin',
      query: [{ nombre: value }],
    });

    return _certificaciones?.data?.map((cert: any) => ({
      ...cert,
      value: cert.id,
      label: cert.nombre,
    }));
  };

  return (
    <Flex p="30px" boxSize="100%" overflow="auto" rowGap="30px" direction="column">
      <Flex minH="fit-content" w="100%" direction="column" rowGap="8px">
        <Box fontSize="18px" fontWeight="semibold">
          Requisitos
        </Box>

        <Box fontSize="14px" fontWeight="medium" color="#84889A">
          Listado de certificaciones requeridas para que los usuarios puedan inscribirse al Boost.
        </Box>
      </Flex>

      <Flex direction="column" gap="30px" w="100%">
        <InformationMultiSelect
          name="certificacionesRequeridas"
          label="Certificaciones requeridas del boost"
          placeholder="Escribe para buscar"
          updateValue={updateValue}
          loadOptions={loadCertificacionesByNombre}
          isDisabled={!isRoleAllowed([UserRolEnum.ADMIN], user?.rol)}
          defaultValue={(boost?.certificacionesRequeridas || [])?.map((c) => ({
            label: c.nombre,
            value: c.id,
          }))}
          style={{ width: '100%' }}
        />
      </Flex>
    </Flex>
  );
};
