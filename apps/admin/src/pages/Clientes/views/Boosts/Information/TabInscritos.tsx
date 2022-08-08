import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Flex, Box } from '@chakra-ui/react';

import { Avatar } from '@clevery/ui';
import { getRutas, IBoost } from '@clevery/data';

import {
  textRowTemplate,
  InformationTable,
  progressRowTemplate,
} from '../../../../../shared/components';

type TabInscritosProps = {
  boost: IBoost;
};

export const TabInscritos = ({ boost }: TabInscritosProps) => {
  const loadRutas = async (search: string) => {
    const _rutas = await getRutas({ query: [{ nombre: search }] });

    return _rutas?.data?.map((ruta: any) => ({
      value: ruta.id,
      label: ruta.nombre,
    }));
  };

  return (
    <Flex p="30px" gap="30px" boxSize="100%" overflow="auto" direction="column">
      <Flex minH="fit-content" w="100%" direction="column" rowGap="8px">
        <Box fontSize="18px" fontWeight="semibold">
          Alumnos inscritos
        </Box>

        <Box fontSize="14px" fontWeight="medium" color="#84889A">
          Información sobre los {boost?.users?.length || 0} alumnos inscritos en
          el Boost.
        </Box>
      </Flex>

      <InformationTable
        isLoading={!boost?.id}
        data={boost?.users || []}
        style={{ width: '100%' }}
        columns={[
          {
            key: 'email',
            field: 'email',
            header: 'Alumno inscrito',
            render: (rowData: any) =>
              textRowTemplate({
                content: { text: rowData?.fullName, subtext: rowData?.email },
                prefix: {
                  content: (
                    <Avatar
                      size="40px"
                      name={rowData.fullName || 'Avatar del usuario'}
                      src={rowData.avatar?.url}
                      colorVariant={
                        (rowData?.id || 0) % 2 == 1 ? 'hot' : 'cold'
                      }
                    />
                  ),
                },
              }),
          },
          {
            key: 'fecha_inscripcion',
            field: 'fecha_inscripcion',
            header: 'Fecha de inscripción',
            render: (rowData: any) =>
              textRowTemplate({
                content: {
                  text: rowData?.meta?.fechaInscripcion
                    ? format(
                        new Date(rowData?.meta?.fechaInscripcion),
                        'dd LLL yyyy',
                        { locale: es }
                      )
                    : '-',
                },
              }),
          },

          {
            key: 'ruta_id',
            field: 'ruta_id',
            header: 'Hoja de ruta',
            sortable: true,
            filterable: true,
            loadOptions: loadRutas,
            render: (rowData: any) =>
              progressRowTemplate({
                content: {
                  value: Math.min(
                    100,
                    (rowData?.meta?.porcentajeCompletadoRutaPro || 0) * 100
                  ),
                  label: rowData?.progresoGlobal?.ruta?.nombre || '-',
                },
              }),
          },
          {
            key: 'estado_entrevista',
            field: 'estado_entrevista',
            header: 'Estado entrevista',
            render: (rowData: any) =>
              textRowTemplate({
                content: { text: rowData?.estado_entrevista || '-' },
              }),
          },
        ]}
      />
    </Flex>
  );
};
