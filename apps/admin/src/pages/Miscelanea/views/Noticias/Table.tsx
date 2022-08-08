import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { BiPlus, BiEnvelope, BiNews } from 'react-icons/bi';
import { Flex, Icon, toast, useDisclosure } from '@chakra-ui/react';

import { DeleteModal, PageHeader, PageSidebar, rowQuickActions, textRowTemplate } from '../../../../shared/components';
import { onFailure, onSuccess_Undo } from 'ui';
import { Avatar, OpenColumn, OpenTable } from 'ui';
import { INoticia, useNoticias, removeNoticia } from 'data';

export default function NoticiasTable() {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [queryString, setQueryString] = useState<string>('&page=' + currentPage);
  const [elementSelected, setElementSelected] = useState<any>(undefined);

  const { noticias, isLoading } = useNoticias({
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

  const onRowClick = async (e: any) => navigate('/miscelanea/noticias/' + e?.id || '');

  //?Columnas
  const columns: OpenColumn[] = [
    {
      key: 'titulo',
      field: 'titulo',
      header: 'Título',
      sortable: true,
      filterable: true,
      render: (rowData: INoticia) =>
        textRowTemplate({
          prefix: {
            content: <Avatar size="40px" name={rowData?.titulo} src={rowData?.imagen?.url} />,
          },
          content: { text: rowData?.titulo || '' },
        }),
    },
    {
      key: 'curso',
      field: 'curso',
      header: 'Curso',
      sortable: true,
      filterable: true,
      render: (rowData: INoticia) => textRowTemplate({ content: { text: rowData?.curso?.titulo || '' } }),
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
            title: 'Borrar noticia',
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
    <Flex boxSize="100%">
      <PageSidebar
        title="Miscelanea"
        items={[
          {
            icon: BiEnvelope,
            title: 'Plantillas',
            onClick: () => navigate('/miscelanea/plantillas'),
          },
          {
            isActive: true,
            icon: BiNews,
            title: 'Noticias',
            onClick: () => navigate('/miscelanea/noticias'),
          },
        ]}
      />

      <Flex direction="column" w="100%">
        <PageHeader
          head={{ title: 'Todas las noticias' }}
          button={{
            text: 'Crear nueva noticia',
            leftIcon: <Icon as={BiPlus} boxSize="21px" />,
            onClick: () => navigate('/miscelanea/noticias/new'),
          }}
        />

        <OpenTable
          data={noticias?.data}
          columns={columns}
          isLoading={isLoading}
          onRowClick={onRowClick}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          onQueryChange={setQueryString}
          total={noticias?.meta?.total || 1}
          maxPages={noticias?.meta?.last_page}
        />
      </Flex>

      <DeleteModal
        title={
          <div>
            ¿Estás seguro de que quieres eliminar la noticia <strong>{elementSelected?.titulo}</strong>?
          </div>
        }
        isOpen={isOpen}
        onClose={onClose}
        securityWord={elementSelected?.titulo}
        onAccept={() => {
          const timeout: NodeJS.Timeout = setTimeout(
            () =>
              removeNoticia({ id: elementSelected?.id, client: 'admin' })
                .then((e) => {
                  window.location.reload();
                })
                .catch((error: any) => onFailure(toast, error.title, error.message)),
            5000
          );

          onSuccess_Undo(toast, `Se va a eliminar la noticia ${elementSelected?.titulo}`, timeout);

          onClose();
        }}
      />
    </Flex>
  );
}
