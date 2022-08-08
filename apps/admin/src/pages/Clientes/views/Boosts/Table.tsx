import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { BiPlus, BiBuildings, BiRocket, BiBookContent } from 'react-icons/bi';
import stc from 'string-to-color';
import { format } from 'date-fns';
import { Flex, Icon, Badge } from '@chakra-ui/react';

import { PageHeader, PageSidebar, textRowTemplate } from '../../../../shared/components';
import { capitalizeFirst } from 'utils';
import { Avatar, OpenColumn, OpenTable } from 'ui';
import { BoostRemotoEnum, IBoost, useBoosts } from 'data';

export default function BoostsTable() {
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [queryString, setQueryString] = useState<string>('&page=' + currentPage);

  const { boosts, isLoading } = useBoosts({
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

  const onRowClick = async (e: any) => navigate('/clientes/boosts/' + e?.id || '');

  //?Columnas
  const columns: OpenColumn[] = [
    {
      key: 'titulo',
      field: 'titulo',
      header: 'Título',
      sortable: true,
      filterable: true,
      render: (rowData: IBoost) =>
        textRowTemplate({
          prefix: {
            content: <Avatar size="40px" name={rowData?.titulo} src={`data:image/svg+xml;utf8,${rowData?.icono}`} />,
          },
          content: {
            text: rowData?.titulo || '',
            subtext: rowData?.empresa?.nombre,
          },
        }),
    },
    {
      key: 'empresaId',
      field: 'empresaId',
      header: 'Empresa',
      sortable: true,
      render: (rowData: IBoost) => <Flex>{rowData?.empresa?.nombre}</Flex>,
    },
    {
      key: 'remoto',
      field: 'remoto',
      header: 'Presencialidad',
      sortable: true,
      filterable: true,
      options: Object.values(BoostRemotoEnum)?.map((v) => ({
        label: capitalizeFirst(v),
        value: v,
      })),
      render: (rowData: IBoost) => (
        <Badge rounded="7px" bg="primary_light">
          {capitalizeFirst(rowData?.remoto || '')}
        </Badge>
      ),
    },
    {
      key: 'createdAt',
      field: 'createdAt',
      header: 'Fecha creación',
      sortable: true,
      render: (rowData: IBoost) => <Flex>{format(new Date(rowData?.createdAt), 'dd/MM/yyyy')}</Flex>,
    },
  ];

  //!Render
  return (
    <Flex boxSize="100%">
      <PageSidebar
        title="Clientes"
        items={[
          {
            icon: BiBuildings,
            title: 'Empresas',
            onClick: () => navigate('/clientes/empresas'),
          },
          {
            icon: BiRocket,
            title: 'Boosts',
            isActive: true,
            onClick: () => navigate('/clientes/boosts'),
          },
          {
            icon: BiBookContent,
            title: 'Vacantes',
            onClick: () => navigate('/clientes/vacantes'),
          },
        ]}
      />

      <Flex direction="column" w="100%">
        <PageHeader
          head={{ title: 'Todas las Boosts' }}
          button={{
            text: 'Crear nuevo boost',
            leftIcon: <Icon as={BiPlus} boxSize="21px" />,
            onClick: () => navigate('/clientes/boosts/new'),
          }}
        />

        <OpenTable
          data={boosts?.data}
          columns={columns}
          isLoading={isLoading}
          onRowClick={onRowClick}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          onQueryChange={setQueryString}
          total={boosts?.meta?.total || 1}
          maxPages={boosts?.meta?.last_page}
        />
      </Flex>
    </Flex>
  );
}
