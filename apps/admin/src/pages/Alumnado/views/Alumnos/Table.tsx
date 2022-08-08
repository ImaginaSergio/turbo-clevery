import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  BiBookContent,
  BiPlus,
  BiGroup,
  BiUserVoice,
  BiPieChartAlt2,
  BiTask,
  BiPieChartAlt,
} from 'react-icons/bi';
import {
  Box,
  Flex,
  Icon,
  Image,
  Progress,
  useDisclosure,
} from '@chakra-ui/react';

import {
  LineChart,
  PageHeader,
  PageSidebar,
  textRowTemplate,
  progressRowTemplate,
  dateRowTemplate,
} from '../../../../shared/components';
import { LoginContext } from '../../../../shared/context';
import { Avatar, OpenColumn, OpenTable } from '@clevery/ui';
import { fmtTiempoTotal, isRoleAllowed } from '@clevery/utils';
import { UserRolEnum, getRutas, useUsersStats, IUser } from '@clevery/data';

import UsuariosModalForm from '../../components/UsuariosModalForm';
import UsuariosInactivosModal from '../../components/UsuariosInactivosModal';

export default function UsuariosTable() {
  const navigate = useNavigate();
  const { user } = useContext(LoginContext);

  const addState = useDisclosure();
  const inactiveState = useDisclosure();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [queryString, setQueryString] = useState<string>(
    '&page=' + (currentPage || 1)
  );

  const { data, isLoading } = useUsersStats({
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

  const onRowClick = async (e: any) =>
    navigate('/alumnado/usuarios/' + e?.id || '');

  const loadRutas = async (search: string) => {
    const _rutas = await getRutas({ query: [{ nombre: search }] });

    return _rutas?.data?.map((ruta: any) => ({
      value: ruta.id,
      label: ruta.nombre,
    }));
  };

  const columns: OpenColumn[] = [
    {
      key: 'nombre',
      field: 'nombre',
      header: 'Nombre / Email',
      sortable: true,
      filterable: true,
      render: (rowData: IUser) =>
        textRowTemplate({
          prefix: {
            content: (
              <Avatar
                size="40px"
                src={rowData.avatar?.url}
                name={rowData.fullName || 'Avatar del usuario'}
                colorVariant={(rowData?.id || 0) % 2 == 1 ? 'hot' : 'cold'}
              />
            ),
          },
          content: {
            text: (rowData.nombre || '') + ' ' + (rowData.apellidos || ''),
            subtext: rowData?.email,
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
              (rowData?.porcentajeCompletadoRuta || 0) * 100
            ),
            label: rowData?.progresoGlobal?.ruta?.nombre || '-',
          },
        }),
    },
    {
      key: 'pais',
      field: 'pais',
      header: 'Localización',
      filterable: true,
      render: (rowData: IUser) =>
        textRowTemplate({
          content: {
            text: rowData.pais?.nombre || '-',
            subtext: rowData.estado?.nombre || '-',
          },
        }),
    },
    {
      key: 'ultima_sesion',
      field: 'ultima_sesion',
      header: 'Última sesión',
      filterable: true,
      render: (rowData: any) =>
        dateRowTemplate({
          content: {
            date: rowData?.meta?.ultimaSesion?.updatedAt,
            format: 'dd LLL yyyy',
            isDistance: true,
            maxDistanceInDays: 9,
          },
        }),
    },
  ];

  return (
    <Flex boxSize="100%">
      <PageSidebar
        title="Alumnado"
        items={[
          {
            isActive: true,
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
            icon: BiTask,
            title: 'Ejercicios',
            onClick: () => navigate('/alumnado/ejercicios'),
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

      <Flex direction="column" w="100%">
        <PageHeader
          head={{ title: 'Alumnos' }}
          buttonGroup={[
            {
              text: 'Alumnos inactivos',
              leftIcon: <Icon as={BiUserVoice} boxSize="21px" />,
              onClick: inactiveState.onOpen,
              isDisabled: !isRoleAllowed(
                [UserRolEnum.ADMIN, UserRolEnum.SUPERVISOR],
                user?.rol
              ),
            },
            {
              text: 'Agregar alumnos',
              leftIcon: <Icon as={BiPlus} boxSize="21px" />,
              onClick: addState.onOpen,
              isDisabled: !isRoleAllowed([UserRolEnum.ADMIN], user?.rol),
            },
          ]}
        />

        <OpenTable
          isExpandable
          data={data?.data}
          columns={columns}
          isLoading={isLoading}
          currentPage={currentPage}
          onRowClick={onRowClick}
          onPageChange={setCurrentPage}
          onQueryChange={setQueryString}
          total={data?.meta?.total || 1}
          maxPages={data?.meta?.last_page}
          rowExpansionTemplate={rowExpansionTemplate}
        />
      </Flex>

      <UsuariosModalForm state={addState} />
      <UsuariosInactivosModal state={inactiveState} />
    </Flex>
  );
}

const rowExpansionTemplate = (rowData: any) => {
  return (
    <Flex direction={{ base: 'column', lg: 'row' }} py="15px" gap="15px">
      <Flex direction="column" gap="5px" w="100%">
        <Flex p="10px 15px" bg="white" rounded="8px">
          <Box
            minW="190px"
            color="#84889A"
            fontSize="15px"
            fontWeight="semibold"
          >
            Tiempo total dedicado
          </Box>

          <Box w="100%" fontSize="15px" fontWeight="medium">
            {fmtTiempoTotal(rowData?.progresoGlobal?.tiempoTotal)}
          </Box>
        </Flex>

        <Flex p="10px 15px" bg="white" rounded="8px">
          <Box
            minW="190px"
            color="#84889A"
            fontSize="15px"
            fontWeight="semibold"
          >
            Proyectos subidos
          </Box>

          <Box w="100%" fontSize="15px" fontWeight="medium">
            {rowData?.meta?.total_proyectos || '0'}
          </Box>
        </Flex>

        {/* <Flex p="10px 15px" bg="white" rounded="8px">
          <Box minW="190px" color="#84889A" fontSize="15px" fontWeight="semibold">
            Asistencia
          </Box>

          <Box w="100%" fontSize="15px" fontWeight="medium">
            0% de asistencia
          </Box>
        </Flex> */}

        <Flex p="10px 15px" bg="white" rounded="8px">
          <Box
            minW="190px"
            color="#84889A"
            fontSize="15px"
            fontWeight="semibold"
          >
            Cursos actuales
          </Box>

          <Flex
            w="100%"
            gap="10px"
            fontSize="15px"
            direction="column"
            fontWeight="medium"
          >
            {rowData?.meta?.cursosIniciados?.map((c: any) => {
              const progressValue =
                c.meta?.progresos_count && c.meta?.total_lecciones
                  ? Math.floor(
                      ((c.meta?.progresos_count || 0) /
                        (c.meta?.total_lecciones || 0)) *
                        100
                    )
                  : 0;

              return (
                <Flex
                  gap="12px"
                  rounded="12px"
                  align="center"
                  p="10px 15px 10px"
                  border="1px solid #E6E8EE"
                >
                  <Image
                    minW="40px"
                    boxSize="40px"
                    src={`data:image/svg+xml;utf8,${c.icono}`}
                  />

                  <Flex direction="column" w="100%" gap="4px">
                    <Box fontSize="15px" lineHeight="18px" fontWeight="medium">
                      {c.titulo}
                    </Box>

                    <Progress
                      w="100%"
                      h="10px"
                      rounded="58px"
                      value={100}
                      sx={{
                        '& > div': {
                          background: `linear-gradient(90deg, #25CBAB 0%, #0FFFA9 ${
                            progressValue + '%'
                          }, #E6E8EE ${progressValue + '%'}, #E6E8EE 100%)`,
                        },
                      }}
                    />
                  </Flex>

                  <Box
                    alignSelf="end"
                    color="#12BE94"
                    fontSize="15px"
                    lineHeight="15px"
                    fontWeight="bold"
                    minW="fit-content"
                  >
                    {progressValue}%
                  </Box>
                </Flex>
              );
            })}
          </Flex>
        </Flex>
      </Flex>

      <Flex direction="column" gap="5px" w="100%">
        <Flex
          p="10px 15px"
          bg="white"
          rounded="8px"
          direction="column"
          h="100%"
        >
          <Box
            minW="190px"
            color="#84889A"
            fontSize="15px"
            fontWeight="semibold"
          >
            Actividad del último mes
          </Box>

          <LineChart
            labels={rowData?.sesiones?.map((s: any) =>
              format(new Date(s.dia), 'dd LLL', { locale: es })
            )}
            dataset={{
              label: 'Total de sesiones',
              data: rowData?.sesiones?.map((s: any) => s.count),
              fill: true,
              borderColor: '#0BDEAC',
              backgroundColor: 'rgba(11, 222, 172, 0.17)',
            }}
          />
        </Flex>
      </Flex>
    </Flex>
  );
};
