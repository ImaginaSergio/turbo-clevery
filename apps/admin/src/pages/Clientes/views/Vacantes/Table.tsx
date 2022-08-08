import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import stc from 'string-to-color';
import { format } from 'date-fns';
import { Flex, Icon, Badge } from '@chakra-ui/react';
import { BiBookContent, BiPlus, BiBuildings, BiRocket } from 'react-icons/bi';

import { ProcesoRemotoEnum, useProcesos } from 'data';
import { OpenColumn, OpenTable } from 'ui';
import { PageHeader, PageSidebar } from '../../../../shared/components';

export default function VacantesTable() {
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [queryString, setQueryString] = useState<string>('&page=' + currentPage);

  const { procesos, isLoading } = useProcesos({
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

  const onRowClick = async (e: any) => navigate('/clientes/vacantes/' + e?.id || '');

  //?Columnas
  const columns: OpenColumn[] = [
    {
      key: 'titulo',
      field: 'titulo',
      header: 'Título',
      sortable: true,
      filterable: true,
    },
    {
      key: 'remoto',
      field: 'remoto',
      header: 'Presencialidad',
      sortable: true,
      filterable: true,
      options: [
        { label: 'Presencial', value: ProcesoRemotoEnum.PRESENCIAL },
        { label: 'Remoto', value: ProcesoRemotoEnum.REMOTO },
        { label: 'Híbrido', value: ProcesoRemotoEnum.HIBRIDO },
        { label: 'Indiferente', value: ProcesoRemotoEnum.INDIFERENTE },
      ],
      render: (rowData) => (
        <Badge rounded="7px" color={rowData.remoto ? 'white' : 'black'} bg={stc(rowData.remoto)}>
          {rowData.remoto}
        </Badge>
      ),
    },
    {
      key: 'createdAt',
      field: 'createdAt',
      header: 'Fecha creación',
      sortable: true,
      render: (rowData) => <Flex>{format(new Date(rowData.createdAt), 'dd/MM/yyyy')}</Flex>,
    },
  ];

  //!Render
  return (
    <Flex boxSize="100%">
      <PageSidebar
        title={'Clientes'}
        items={[
          {
            icon: BiBuildings,
            title: 'Empresas',
            onClick: () => navigate('/clientes/empresas'),
          },
          {
            icon: BiRocket,
            title: 'Boosts',
            onClick: () => navigate('/clientes/boosts'),
          },
          {
            icon: BiBookContent,
            title: 'Vacantes',
            isActive: true,
            onClick: () => navigate('/clientes/vacantes'),
          },
        ]}
      />

      <Flex direction="column" w="100%">
        <PageHeader
          head={{ title: 'Todas las Vacantes' }}
          button={{
            text: 'Crear nueva vacante',
            leftIcon: <Icon as={BiPlus} boxSize="21px" />,
            onClick: () => navigate('/clientes/vacantes/new'),
          }}
        />

        <OpenTable
          data={procesos?.data}
          columns={columns}
          isLoading={isLoading}
          onRowClick={onRowClick}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          onQueryChange={setQueryString}
          total={procesos?.meta?.total || 1}
          maxPages={procesos?.meta?.last_page}
        />
      </Flex>
    </Flex>
  );
}
