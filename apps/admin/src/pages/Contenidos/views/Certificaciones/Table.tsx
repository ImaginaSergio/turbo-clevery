import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { format } from 'date-fns/esm';
import { BiBookContent, BiPlus, BiBadgeCheck, BiBrain, BiDirections } from 'react-icons/bi';
import { useToast, useDisclosure, Image, Flex, Icon, Box, Badge } from '@chakra-ui/react';

import { OpenColumn, OpenTable, onFailure, onSuccess_Undo } from 'ui';
import { getHabilidades, useCertificaciones, removeCertificacion } from 'data';
import { PageHeader, DeleteModal, PageSidebar, badgeRowTemplate } from '../../../../shared/components';

export default function CertificacionesTable() {
  const [elementSelected] = useState<any>(undefined);

  const toast = useToast();
  const navigate = useNavigate();
  const tableRef = useRef<any>();

  const { isOpen, onClose } = useDisclosure();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [queryString, setQueryString] = useState<string>('&page=' + currentPage);

  const { certificaciones, isLoading, isError } = useCertificaciones({
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

  const loadHabilidades = (value: string) =>
    getHabilidades({ query: [{ nombre: value }] }).then((res) =>
      res?.data?.map((hab: any) => ({ value: hab.id, label: hab.nombre }))
    );

  const onRowClick = async (e: any) => navigate('/contenidos/certificaciones/' + e?.id || '');

  //?Columnas
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

          <Box as="a" href={'/contenidos/certificaciones/' + rowData?.id || ''}>
            {rowData.nombre}
          </Box>
        </Flex>
      ),
    },
    {
      key: 'nivel',
      field: 'nivel',
      header: 'Nivel',
      sortable: true,
      filterable: true,
      options: [
        { label: '1', value: '1' },
        { label: '2', value: '2' },
        { label: '3', value: '3' },
      ],
      render: (rowData: any) =>
        badgeRowTemplate({
          badges: [
            {
              content: { text: rowData?.nivel || 0 },
              style: {
                color: 'white',
                fontSize: '12px',
                fontWeight: 'bold',
                lineHeight: '14px',
                padding: '4px 8px',
                borderRadius: '6px',
                backgroundColor:
                  rowData?.nivel === 1
                    ? '#26C8AB'
                    : rowData?.nivel === 2
                    ? '#338B7B'
                    : rowData?.nivel === 3
                    ? '#145448'
                    : '#D9DBE3',
              },
            },
          ],
        }),
    },
    {
      key: 'examenes',
      field: 'examenes',
      header: 'Num. Exámenes',
      sortable: false,
      render: (rowData: any) =>
        badgeRowTemplate({
          badges: [
            {
              content: { text: rowData?.meta?.examenesCount || 0 },
              style: {
                color: 'white',
                fontSize: '12px',
                fontWeight: 'bold',
                lineHeight: '14px',
                padding: '4px 8px',
                borderRadius: '6px',
                backgroundColor:
                  rowData?.meta?.examenesCount === 1
                    ? '#26C8AB'
                    : rowData?.meta?.examenesCount === 2
                    ? '#338B7B'
                    : rowData?.meta?.examenesCount === 3
                    ? '#145448'
                    : '#D9DBE3',
              },
            },
          ],
        }),
    },
    {
      key: 'publicado',
      field: 'publicado',
      header: 'Publicado',
      sortable: true,
      filterable: true,
      options: [
        { label: 'Publicada', value: 'true' },
        { label: 'No publicada', value: 'false' },
      ],
      render: (rowData) => (
        <Badge rounded="7px" color={rowData.publicado ? 'white' : 'black'} bg={rowData.publicado ? 'primary' : '#D9DBE3'}>
          {rowData.publicado ? 'Publicada' : 'No publicada'}
        </Badge>
      ),
    },
    {
      key: 'habilidad_id',
      field: 'habilidad_id',
      header: 'Habilidad',
      sortable: false,
      filterable: true,
      loadOptions: loadHabilidades,
      render: (rowData: any) =>
        badgeRowTemplate({
          badges: [
            {
              content: {
                text: rowData?.habilidad?.nombre || rowData?.habilidadId || '-',
              },
              style: {
                color: '#878EA0',
                fontSize: '12px',
                fontWeight: 'bold',
                lineHeight: '14px',
                padding: '4px 8px',
                borderRadius: '6px',
                backgroundColor: '#E6E8EE',
              },
            },
          ],
        }),
    },
    {
      key: 'createdAt',
      field: 'createdAt',
      header: 'Fecha creación',
      sortable: true,
      render: (rowData) => <Flex>{format(new Date(rowData.createdAt), 'dd/MM/yyy')}</Flex>,
    },
  ];

  //!Render
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
            isActive: true,
            icon: BiBadgeCheck,
            title: 'Certificaciones',
            onClick: () => {},
          },
          {
            icon: BiDirections,
            title: 'Hojas de ruta',
            onClick: () => navigate('/contenidos/rutas'),
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
          head={{ title: 'Todas las Certificaciones' }}
          button={{
            text: 'Crear nueva certificación',
            leftIcon: <Icon as={BiPlus} boxSize="21px" />,
            onClick: () => navigate('/contenidos/certificaciones/new'),
          }}
        />

        <OpenTable
          onQueryChange={setQueryString}
          columns={columns}
          isLoading={isLoading}
          data={certificaciones?.data}
          onPageChange={setCurrentPage}
          currentPage={currentPage}
          total={certificaciones?.meta?.total || 1}
          maxPages={certificaciones?.meta?.last_page}
          onRowClick={onRowClick}
        />
      </Flex>

      <DeleteModal
        title={
          <div>
            ¿Estás seguro de que quieres eliminar la certificación <strong>{elementSelected?.nombre}</strong>?
          </div>
        }
        isOpen={isOpen}
        onClose={onClose}
        securityWord={elementSelected?.nombre}
        onAccept={() => {
          const timeout: NodeJS.Timeout = setTimeout(
            () =>
              removeCertificacion({ id: elementSelected?.id })
                .then(() => tableRef?.current?.refreshData())
                .catch((error: any) => onFailure(toast, error.title, error.message)),
            5000
          );

          onSuccess_Undo(toast, `Se va a eliminar la certificación ${elementSelected?.nombre}`, timeout);

          onClose();
        }}
      />
    </Flex>
  );
}
