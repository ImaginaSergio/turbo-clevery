import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { es } from 'date-fns/locale';
import { Box, Center, Flex } from '@chakra-ui/react';
import { formatDuration, intervalToDuration } from 'date-fns';

import { EntregableEstadoEnum, IUser, UserRolEnum, useEntregables } from 'data';
import { badgeRowTemplate, dateRowTemplate, textRowTemplate } from '../../../../../shared/components';
import { isRoleAllowed } from 'utils';
import { OpenTable } from 'ui';

type TabEjerciciosProps = {
  user: IUser;
  refreshState: () => void;
  updateValue: (value: any) => void;
};

export const TabEjercicios = ({ user, updateValue, refreshState }: TabEjerciciosProps) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [query, setQuery] = useState<string>(`&user_id=${user?.id}&page=${currentPage}`);

  const { data: entregables, isLoading } = useEntregables({
    query: query
      .split('&')
      .map((item: any) => {
        const split = item.split('=');

        if (!split[0] && !split[1]) return undefined;
        else return { [split[0]]: split[1] };
      })
      .filter((v: any) => v),
    client: 'admin',
    strategy: 'invalidate-on-undefined',
  });

  useEffect(() => {
    setQuery(`&user_id=${user?.id}&page=${currentPage}`);
  }, [user?.id, currentPage]);

  return (
    <Flex direction="column" boxSize="100%" overflow="auto">
      <Flex w="100%" p="30px" rowGap="8px" minH="fit-content" direction="column">
        <Box fontSize="18px" fontWeight="semibold">
          Información General
        </Box>

        <Box fontSize="14px" fontWeight="medium" color="#84889A">
          Listado de ejercicios entregados por el alumno
        </Box>
      </Flex>

      {(entregables?.data?.length || 0) === 0 && !isLoading ? (
        <Center boxSize="100%">
          <Box fontWeight="semibold" fontSize="14px">
            El alumno aún no ha entregado ningún ejercicio
          </Box>
        </Center>
      ) : (
        <OpenTable
          isLoading={isLoading}
          data={entregables?.data}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          total={entregables?.meta?.total || 1}
          maxPages={entregables?.meta?.last_page}
          onRowClick={(item) => navigate(`/alumnado/ejercicios/${item?.id}`)}
          columns={[
            {
              key: 'curso',
              field: 'curso',
              header: 'Título ejercicio / curso',
              render: (rowData: any) =>
                textRowTemplate({
                  content: {
                    text: rowData?.titulo || `Entregable nº ${rowData.id}`,
                    subtext: 'Curso de ' + rowData?.meta?.curso?.titulo,
                    link: `/ejercicios/${rowData.id}`,
                    isDisabled: !isRoleAllowed([UserRolEnum.ADMIN], user?.rol),
                  },
                }),
            },
            {
              key: 'fechaEntrega',
              field: 'fechaEntrega',
              header: 'Fecha de Entrega',
              render: (rowData: any) =>
                dateRowTemplate({
                  content: {
                    date: rowData?.fechaEntrega,
                    format: 'dd LLL yyyy',
                    isDistance: true,
                    maxDistanceInDays: 9,
                  },
                }),
            },
            {
              key: 'tiempoEmpleado',
              field: 'tiempoEmpleado',
              header: 'Tiempo empleado',
              render: (rowData: any) =>
                textRowTemplate({
                  content: {
                    text: rowData.fechaEntrega
                      ? formatDuration(
                          intervalToDuration({
                            start: new Date(rowData.createdAt),
                            end: new Date(rowData.fechaEntrega),
                          }),
                          {
                            locale: es,
                            format: ['months', 'days', 'hours', 'minutes'],
                          }
                        )
                      : undefined,
                  },
                }),
            },
            {
              key: 'estado',
              field: 'estado',
              header: 'Estado ejercicio',
              render: (rowData: any) =>
                badgeRowTemplate({
                  badges: [
                    {
                      content: {
                        text:
                          rowData?.estado === EntregableEstadoEnum.CORRECTO || rowData?.estado === EntregableEstadoEnum.ERROR
                            ? 'CORREGIDO'
                            : rowData?.estado === EntregableEstadoEnum.PENDIENTE_CORRECCION
                            ? 'PENDIENTE DE CORRECCIÓN'
                            : 'PENDIENTE DE ENTREGA',
                      },
                      style: {
                        background:
                          rowData?.estado === EntregableEstadoEnum.CORRECTO || rowData?.estado === EntregableEstadoEnum.ERROR
                            ? '#2EDDBE'
                            : rowData?.estado === EntregableEstadoEnum.PENDIENTE_CORRECCION
                            ? '#DDB72E'
                            : 'var(--chakra-colors-gray_4)',
                      },
                    },
                  ],
                }),
            },
            {
              key: 'puntuacion',
              field: 'puntuacion',
              header: 'Puntuación',
              render: (rowData: any) =>
                badgeRowTemplate({
                  badges: [
                    {
                      content: { text: rowData?.puntuacion || '-' },
                      style: {
                        height: '40px',
                        minWidth: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '16px',
                        lineHeight: '19px',
                        borderRadius: '56px',
                        background: !rowData?.puntuacion
                          ? 'var(--chakra-colors-gray_4)'
                          : rowData?.puntuacion > 50
                          ? '#2EDDBE'
                          : '#D8335B', // #DDB72E
                      },
                    },
                  ],
                }),
            },
          ]}
        />
      )}
    </Flex>
  );
};
