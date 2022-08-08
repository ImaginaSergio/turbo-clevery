import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Box,
  Flex,
  Icon,
  Image,
  Badge,
  useToast,
  useDisclosure,
} from '@chakra-ui/react';
import {
  BiPlus,
  BiBrain,
  BiDirections,
  BiBadgeCheck,
  BiBookContent,
} from 'react-icons/bi';

import {
  PageHeader,
  DeleteModal,
  PageSidebar,
  dateRowTemplate,
  rowQuickActions,
  badgeRowTemplate,
} from '../../../../shared/components';
import { onFailure, onSuccess_Undo } from '@clevery/utils';
import { IRuta, useRutas, removeRuta } from '@clevery/data';
import { OpenColumn, OpenParser, OpenTable } from '@clevery/ui';

export default function RutasTable() {
  const [elementSelected, setElementSelected] = useState<any>(undefined);

  const toast = useToast();
  const navigate = useNavigate();
  const tableRef = useRef<any>();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [queryString, setQueryString] = useState<string>(
    '&page=' + currentPage
  );

  const { data, isLoading } = useRutas({
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
    navigate('/contenidos/rutas/' + e?.id || '');

  const columns: OpenColumn[] = [
    {
      key: 'nombre',
      field: 'nombre',
      header: 'Nombre',
      sortable: true,
      filterable: true,
      render: (rowData: IRuta) => (
        <Flex align="center" gap="15px">
          <Image
            minW="50px"
            boxSize="50px"
            src={`data:image/svg+xml;utf8,${rowData.icono}`}
          />

          <Box as="a" href={'/contenidos/rutas/' + rowData?.id || ''}>
            {rowData.nombre}
          </Box>
        </Flex>
      ),
    },
    {
      key: 'descripcion',
      field: 'descripcion',
      header: 'Descripción ',
      sortable: true,
      filterable: true,
      render: (rowData: IRuta) => (
        <Flex
          gap="15px"
          align="center"
          overflow="hidden"
          whiteSpace="nowrap"
          textOverflow="ellipsis"
        >
          <OpenParser value={rowData.descripcion} />
        </Flex>
      ),
    },
    {
      key: 'itinerario',
      field: 'itinerario',
      header: 'Num. Cursos',
      sortable: false,
      render: (rowData: IRuta) =>
        badgeRowTemplate({
          badges: [
            {
              content: { text: rowData?.meta?.itinerario?.length || 0 },
              style: {
                color: 'white',
                fontSize: '12px',
                fontWeight: 'bold',
                lineHeight: '14px',
                padding: '4px 8px',
                borderRadius: '6px',
                backgroundColor: 'var(--chakra-colors-primary)',
              },
            },
          ],
        }),
    },
    {
      key: 'privada',
      field: 'privada',
      header: 'Ruta privada',
      sortable: true,
      filterable: true,
      options: [
        { label: 'Privada', value: 'true' },
        { label: 'Pública', value: 'false' },
      ],
      render: (rowData: IRuta) => (
        <Badge
          rounded="7px"
          color={!rowData.privada ? 'white' : 'black'}
          bg={!rowData.privada ? 'primary' : '#D9DBE3'}
        >
          {rowData.privada ? 'Privada' : 'Pública'}
        </Badge>
      ),
    },
    {
      key: 'createdAt',
      field: 'createdAt',
      header: 'Fecha de creación',
      sortable: true,
      filterable: true,
      render: (rowData: IRuta) =>
        dateRowTemplate({ content: { date: rowData?.createdAt } }),
    },
    {
      key: '',
      field: '',
      header: '',
      render: (rowData: IRuta) =>
        rowQuickActions({
          remove: {
            title: 'Borrar ruta',
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
            isActive: true,
            icon: BiDirections,
            title: 'Hojas de ruta',
            onClick: () => {},
          },
          {
            icon: BiBrain,
            title: 'Habilidades',
            onClick: () => navigate('/contenidos/habilidades'),
          },
        ]}
      />

      <Flex direction="column" w="100%">
        <PageHeader
          head={{ title: 'Todas las Hojas de ruta' }}
          button={{
            text: 'Crear nueva hoja de ruta',
            leftIcon: <Icon as={BiPlus} boxSize="21px" />,
            onClick: () => navigate('/contenidos/rutas/new'),
          }}
        />

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
            ¿Estás seguro de que quieres eliminar la ruta{' '}
            <strong>{elementSelected?.nombre}</strong>?
          </div>
        }
        isOpen={isOpen}
        onClose={onClose}
        securityWord={elementSelected?.nombre}
        onAccept={() => {
          const timeout: NodeJS.Timeout = setTimeout(
            () =>
              removeRuta(elementSelected?.id)
                .then((e) => tableRef?.current?.refreshData())
                .catch((error: any) =>
                  onFailure(toast, error.title, error.message)
                ),
            5000
          );

          onSuccess_Undo(
            toast,
            `Se va a eliminar la ruta ${elementSelected?.nombre}`,
            timeout
          );

          onClose();
        }}
      />
    </Flex>
  );
}
