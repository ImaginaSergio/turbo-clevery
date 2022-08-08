import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useToast, useDisclosure, Flex, Icon, Image, Box } from '@chakra-ui/react';
import { BiShow, BiHide, BiPlus, BiBrain, BiDirections, BiBookContent, BiBadgeCheck } from 'react-icons/bi';

import {
  DeleteModal,
  PageHeader,
  PageSidebar,
  dateRowTemplate,
  rowQuickActions,
  badgeRowTemplate,
} from '../../../../shared/components';
import { useHabilidades, removeHabilidad } from 'data';
import { OpenColumn, OpenTable, onFailure, onSuccess_Undo } from 'ui';

export default function HabilidadesTable() {
  const [elementSelected, setElementSelected] = useState<any>(undefined);

  const toast = useToast();
  const navigate = useNavigate();
  const tableRef = useRef<any>();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [queryString, setQueryString] = useState<string>('&page=' + currentPage);

  const { data, isLoading } = useHabilidades({
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

  const onRowClick = async (e: any) => navigate('/contenidos/habilidades/' + e?.id || '');

  const columns: OpenColumn[] = [
    {
      key: 'nombre',
      field: 'nombre',
      header: 'Nombre',
      sortable: true,
      filterable: true,
      render: (rowData) => (
        <Flex align="center" gap="15px">
          <Image minW="50px" boxSize="50px" src={`data:image/svg+xml;utf8,${rowData.icono}`} />

          <Box as="a" href={'/contenidos/habilidades/' + rowData?.id || ''}>
            {rowData.nombre}
          </Box>
        </Flex>
      ),
    },
    {
      key: 'publicado',
      field: 'publicado',
      header: 'Publicado ',
      sortable: false,
      filterable: true,
      options: [
        { label: 'Publicado', value: true },
        { label: 'Oculto', value: false },
      ],
      render: (rowData: any) =>
        badgeRowTemplate({
          badges: [
            {
              content: {
                text: (
                  <Flex color="#fff" align="center">
                    <Icon w="14px" h="14px" mr="8px" as={rowData?.publicado ? BiShow : BiHide} />
                    {rowData?.publicado ? 'Publicado' : 'Oculto'}
                  </Flex>
                ),
              },
              style: {
                padding: '6px 12px',
                borderRadius: '8px',
                backgroundColor: rowData?.publicado ? '#3182FC' : '#DBDDDF',
              },
            },
          ],
        }),
    },
    {
      key: 'createdAt',
      field: 'createdAt',
      header: 'Fecha de creación ',
      sortable: true,
      filterable: true,
      render: (rowData: any) => dateRowTemplate({ content: { date: rowData?.createdAt } }),
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
            title: 'Borrar habilidad',
            onClick: () => {
              setElementSelected(rowData);
              onOpen();
            },
          },
        }),
    },
  ];

  return (
    <Flex boxSize="100%">
      <PageSidebar
        title="Contenidos"
        items={[
          {
            icon: BiBookContent,
            title: 'Cursos',
            onClick: () => navigate('/contenidos/cursos'),
          },
          {
            icon: BiBadgeCheck,
            title: 'Certificaciones',
            onClick: () => navigate('/contenidos/certificaciones'),
          },
          {
            icon: BiDirections,
            title: 'Hojas de ruta',
            onClick: () => navigate('/contenidos/rutas'),
          },
          {
            isActive: true,
            icon: BiBrain,
            title: 'Habilidades',
            onClick: () => {},
          },
        ]}
      />

      <Flex direction="column" w="100%">
        <PageHeader
          head={{ title: 'Todas las Habilidades' }}
          button={{
            text: 'Crear nueva habilidad',
            leftIcon: <Icon as={BiPlus} boxSize="21px" />,
            onClick: () => navigate('/contenidos/habilidades/new'),
          }}
        />

        <OpenTable
          data={data?.data || []}
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
            ¿Estás seguro de que quieres eliminar la habilidad <strong>{elementSelected?.nombre}</strong>?
          </div>
        }
        isOpen={isOpen}
        onClose={onClose}
        securityWord={elementSelected?.nombre}
        onAccept={() => {
          const timeout: NodeJS.Timeout = setTimeout(
            () =>
              removeHabilidad({ id: elementSelected?.id, client: 'admin' })
                .then((e) => tableRef?.current?.refreshData())
                .catch((error: any) => onFailure(toast, error.title, error.message)),
            5000
          );

          onSuccess_Undo(toast, `Se va a eliminar la habilidad ${elementSelected?.nombre}`, timeout);

          onClose();
        }}
      />
    </Flex>
  );
}
