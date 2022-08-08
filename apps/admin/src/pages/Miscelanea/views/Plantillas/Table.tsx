import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useToast, useDisclosure, Flex, Icon, Image, Box } from '@chakra-ui/react';
import { BiShow, BiHide, BiPlus, BiEnvelope, BiNews } from 'react-icons/bi';

import {
  badgeRowTemplate,
  dateRowTemplate,
  rowQuickActions,
  DeleteModal,
  PageHeader,
  PageSidebar,
} from '../../../../shared/components';
import { OpenColumn, OpenTable } from 'ui';
import { onFailure, onSuccess_Undo } from 'ui';
import { removePlantilla, usePlantillas } from 'data';

export default function PlantillasTable() {
  const [elementSelected, setElementSelected] = useState<any>(undefined);

  const toast = useToast();
  const navigate = useNavigate();
  const tableRef = useRef<any>();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [queryString, setQueryString] = useState<string>('&page=' + currentPage);

  const { data, isLoading } = usePlantillas({
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
  const onRowClick = async (e: any) => navigate('/miscelanea/plantillas/' + e?.id || '');

  const columns: OpenColumn[] = [
    {
      key: 'titulo',
      field: 'titulo',
      header: 'Título',
      sortable: true,
      filterable: true,
      render: (rowData) => (
        <Flex align="center" gap="15px">
          <Image minW="50px" boxSize="50px" src={`data:image/svg+xml;utf8,${rowData.icono}`} />

          <Box>{rowData.titulo}</Box>
        </Flex>
      ),
    },
    {
      key: 'publicado',
      field: 'publicado',
      header: 'Publicado',
      sortable: true,
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
      header: 'Fecha de creación',
      sortable: true,
      filterable: true,
      render: (rowData: any) => dateRowTemplate({ content: { date: rowData?.createdAt } }),
    },
    {
      key: '',
      field: '',
      header: '',
      render: (rowData: any) =>
        rowQuickActions({
          remove: {
            title: 'Borrar plantilla',
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
        title="Miscelánea"
        items={[
          {
            isActive: true,
            icon: BiEnvelope,
            title: 'Plantillas',
            onClick: () => navigate('/miscelanea/plantillas'),
          },
          {
            icon: BiNews,
            title: 'Noticias',
            onClick: () => navigate('/miscelanea/noticias'),
          },
        ]}
      />

      <Flex direction="column" w="100%">
        <PageHeader
          head={{ title: 'Todas las Plantillas' }}
          button={{
            text: 'Crear nueva plantilla',
            leftIcon: <Icon as={BiPlus} boxSize="21px" />,
            onClick: () => navigate('/miscelanea/plantillas/new'),
          }}
        />

        <OpenTable
          data={data?.data}
          columns={columns}
          isLoading={isLoading}
          onRowClick={onRowClick}
          onQueryChange={setQueryString}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          total={data?.meta?.total || 1}
          maxPages={data?.meta?.last_page}
        />
      </Flex>

      <DeleteModal
        title={
          <div>
            ¿Estás seguro de que quieres eliminar la plantilla <strong>{elementSelected?.titulo}</strong>?
          </div>
        }
        isOpen={isOpen}
        onClose={onClose}
        securityWord={elementSelected?.titulo}
        onAccept={() => {
          const timeout: NodeJS.Timeout = setTimeout(
            () =>
              removePlantilla(elementSelected?.id)
                .then((e) => tableRef?.current?.refreshData())
                .catch((error: any) => onFailure(toast, error.title, error.message)),
            5000
          );

          onSuccess_Undo(toast, `Se va a eliminar la plantilla ${elementSelected?.titulo}`, timeout);

          onClose();
        }}
      />
    </Flex>
  );
}
