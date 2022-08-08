import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  BiBookContent,
  BiGroup,
  BiPieChartAlt2,
  BiTask,
  BiPieChartAlt,
} from 'react-icons/bi';
import * as Locale from 'date-fns/esm/locale';
import { format, formatDistance } from 'date-fns/esm';
import { Flex, Box, useToast, useDisclosure } from '@chakra-ui/react';

import {
  getUsers,
  getCursos,
  IEntregable,
  UserRolEnum,
  useEntregables,
  LeccionTipoEnum,
  removeEntregable,
  EntregableEstadoEnum,
} from '@clevery/data';
import { OpenColumn, OpenTable } from '@clevery/ui';
import { isRoleAllowed, onFailure, onSuccess_Undo } from '@clevery/utils';

import {
  PageHeader,
  PageSidebar,
  DeleteModal,
  rowQuickActions,
  badgeRowTemplate,
} from '../../../../shared/components';
import { LoginContext } from '../../../../shared/context';

export default function EjerciciosTable() {
  const toast = useToast();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { user } = useContext(LoginContext);

  const [elementSelected, setElementSelected] = useState<IEntregable>();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [queryString, setQueryString] = useState<string>(
    `&page=${currentPage}`
  );

  const { data, isLoading } = useEntregables({
    client: 'admin',
    query: queryString
      ?.split('&')
      ?.map((item: any) => {
        const split = item.split('=');

        if (!split[0] && !split[1]) return undefined;
        else return { [split[0]]: split[1] };
      })
      ?.filter((v: any) => v),
  });

  const loadCursos = (value: string) =>
    getCursos({
      client: 'admin',
      treatData: false,
      query: [{ titulo: value }],
    }).then((res) =>
      res?.data?.map((curso: any) => ({ value: curso.id, label: curso.titulo }))
    );

  const onRowClick = async (e: any) =>
    navigate('/alumnado/ejercicios/' + e?.id || '');

  const loadUsers = (value: string) =>
    getUsers({ query: [{ nombre: value }], client: 'admin' }).then((res) =>
      res?.data?.map((user: any) => ({
        value: user.id,
        label: (user?.nombre || ' ') + ' ' + (user?.apellidos || ' '),
      }))
    );

  //?Columnas
  const columns: OpenColumn[] = [
    {
      key: 'user_id',
      field: 'user_id',
      header: 'Alumno',
      sortable: true,
      filterable: true,
      loadOptions: loadUsers,
      render: (rowData) => <Box>{rowData.user.fullName}</Box>,
    },
    {
      key: 'curso_id',
      field: 'curso_id',
      header: 'Curso',
      sortable: true,
      filterable: true,
      loadOptions: loadCursos,
      render: (rowData) => <Box>{rowData.leccion.modulo.curso.titulo}</Box>,
    },
    {
      key: 'fecha_entrega',
      field: 'fecha_entrega',
      header: 'Fecha de entrega',
      sortable: true,
      render: (rowData) => (
        <Box>{format(new Date(rowData.updatedAt), 'dd/MM/yyy')}</Box>
      ),
    },
    {
      key: 'tiempo_empleado',
      field: 'tiempo_empleado',
      header: 'Tiempo empleado',
      render: (rowData) => (
        <Box>
          {formatDistance(
            new Date(rowData.updatedAt),
            new Date(rowData.createdAt),
            { locale: Locale.es }
          )}
        </Box>
      ),
    },
    {
      key: 'tipo_leccion',
      field: 'tipo_leccion',
      header: 'Tipo ejercicio',
      sortable: false,
      filterable: true,
      options: [
        { label: 'Entrega', value: LeccionTipoEnum.ENTREGABLE },
        { label: 'Autocorreción', value: LeccionTipoEnum.AUTOCORREGIBLE },
      ],
      render: (rowData: any) =>
        badgeRowTemplate({
          badges: [
            {
              content: {
                text:
                  rowData?.leccion?.tipo === LeccionTipoEnum.ENTREGABLE
                    ? 'ENTREGABLE'
                    : 'AUTOCORRECION',
              },
              style: {
                background:
                  rowData?.leccion?.tipo === LeccionTipoEnum.ENTREGABLE
                    ? '#2EDDBE'
                    : '#DDB72E',
              },
            },
          ],
        }),
    },
    {
      key: 'estado',
      field: 'estado',
      header: 'Estado',
      sortable: false,
      filterable: true,
      options: [
        { label: 'Correcto', value: EntregableEstadoEnum.CORRECTO },
        { label: 'Error', value: EntregableEstadoEnum.ERROR },
        {
          label: 'Pendiente de entrega',
          value: EntregableEstadoEnum.PENDIENTE_ENTREGA,
        },
        {
          label: 'Pendiente de correción',
          value: EntregableEstadoEnum.PENDIENTE_CORRECCION,
        },
      ],
      render: (rowData: any) =>
        badgeRowTemplate({
          badges: [
            {
              content: {
                text:
                  rowData?.estado === EntregableEstadoEnum.CORRECTO ||
                  rowData?.estado === EntregableEstadoEnum.ERROR
                    ? 'CORREGIDO'
                    : rowData?.estado ===
                      EntregableEstadoEnum.PENDIENTE_CORRECCION
                    ? 'PENDIENTE DE CORRECCIÓN'
                    : 'PENDIENTE DE ENTREGA',
              },
              style: {
                background:
                  rowData?.estado === EntregableEstadoEnum.CORRECTO ||
                  rowData?.estado === EntregableEstadoEnum.ERROR
                    ? '#2EDDBE'
                    : rowData?.estado ===
                      EntregableEstadoEnum.PENDIENTE_CORRECCION
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
      sortable: true,
      filterable: true,
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
    {
      key: '',
      field: '',
      header: '',
      sortable: false,
      filterable: false,
      render: (rowData: any) =>
        rowQuickActions({
          remove: {
            title: 'Borrar entregable',
            onClick: () => {
              setElementSelected(rowData);
              onOpen();
            },
          },
        }),
    },
  ];

  //!Render
  return (
    <Flex h="100%" width="100%">
      <PageSidebar
        title="Alumnado"
        items={[
          {
            icon: BiBookContent,
            title: 'Alumnos',
            onClick: () => navigate('/alumnado/usuarios'),
          },
          {
            icon: BiGroup,
            title: 'Grupos',
            isDisabled: !isRoleAllowed([UserRolEnum.ADMIN], user?.rol),
            onClick: () => navigate('/alumnado/grupos'),
          },
          {
            isActive: true,
            icon: BiTask,
            title: 'Ejercicios',
            onClick: () => {},
          },
          {
            icon: BiPieChartAlt,
            title: 'Stats por habilidad',
            onClick: () => navigate('/alumnado/stats-habilidad'),
          },
          {
            icon: BiPieChartAlt2,
            title: 'Stats por curso',
            onClick: () => navigate('/alumnado/stats-curso'),
          },
        ]}
      />

      <Flex direction="column" width="100%">
        <PageHeader head={{ title: 'Todos los ejercicios' }} />

        <OpenTable
          data={data?.data}
          columns={columns}
          isLoading={isLoading}
          currentPage={currentPage}
          onRowClick={onRowClick}
          onPageChange={setCurrentPage}
          onQueryChange={setQueryString}
          total={data?.meta?.total || 1}
          maxPages={data?.meta?.last_page}
        />
      </Flex>

      <DeleteModal
        title={
          <div>
            ¿Estás seguro de que quieres eliminar el ejercicio de{' '}
            <strong>{elementSelected?.user?.nombre}</strong>?
          </div>
        }
        isOpen={isOpen}
        onClose={onClose}
        securityWord={'Ejercicio_' + elementSelected?.user?.nombre}
        onAccept={() => {
          const timeout: NodeJS.Timeout = setTimeout(
            () =>
              removeEntregable({ id: +(elementSelected?.id || 0) })
                //.then(() => tableRef?.current?.refreshData())
                .catch((error: any) =>
                  onFailure(toast, error.title, error.message)
                ),
            5000
          );

          onSuccess_Undo(
            toast,
            `Se va a eliminar el ejercicio ${elementSelected?.user?.nombre}`,
            timeout
          );

          onClose();
        }}
      />
    </Flex>
  );
}
