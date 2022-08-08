import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { format } from 'date-fns/esm';
import { Box, Flex, Icon, Image } from '@chakra-ui/react';
import { BiBookContent, BiPlus, BiBuildings, BiRocket } from 'react-icons/bi';

import { useEmpresas } from 'data';
import { OpenColumn, OpenTable } from 'ui';
import { PageSidebar, PageHeader } from '../../../../shared/components';

export default function EmpresasTable() {
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [queryString, setQueryString] = useState<string>('&page=' + currentPage);

  const { empresas, isLoading, isError } = useEmpresas({
    query: queryString
      ?.split('&')
      ?.map((item: any) => {
        const split = item.split('=');

        if (!split[0] && !split[1]) return undefined;
        else return { [split[0]]: split[1] };
      })
      ?.filter((v: any) => v),
    client: 'admin',
  });

  const onRowClick = async (e: any) => navigate('/clientes/empresas/' + e?.id || '');

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

          <Box>{rowData.nombre}</Box>
        </Flex>
      ),
    },
    {
      key: 'cif',
      field: 'cif',
      header: 'CIF',
      sortable: true,
      filterable: true,
    },
    {
      key: 'personaContacto',
      field: 'personaContacto',
      header: 'Persona de Contacto',
      sortable: true,
      filterable: true,
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
        title="Clientes"
        items={[
          {
            icon: BiBuildings,
            title: 'Empresas',
            isActive: true,
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
            onClick: () => navigate('/clientes/vacantes'),
          },
        ]}
      />

      <Flex direction="column" w="100%">
        <PageHeader
          head={{ title: 'Todas las Empresas' }}
          button={{
            text: 'Crear nueva empresa',
            leftIcon: <Icon as={BiPlus} boxSize="21px" />,
            onClick: () => navigate('/clientes/empresas/new'),
          }}
        />

        <OpenTable
          onQueryChange={setQueryString}
          columns={columns}
          isLoading={isLoading}
          data={empresas?.data}
          onPageChange={setCurrentPage}
          currentPage={currentPage}
          total={empresas?.meta?.total || 1}
          maxPages={empresas?.meta?.last_page}
          onRowClick={onRowClick}
        />
      </Flex>
    </Flex>
  );
}
