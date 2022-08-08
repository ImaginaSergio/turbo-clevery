import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { format } from 'date-fns/esm';
import { BiBookContent, BiPlus, BiGroup, BiPieChartAlt2, BiTask, BiPieChartAlt } from 'react-icons/bi';
import { useDisclosure, Flex, Icon } from '@chakra-ui/react';

import { isRoleAllowed } from 'utils';
import { OpenColumn, OpenTable } from 'ui';
import { useGrupos, UserRolEnum } from 'data';
import { LoginContext } from '../../../../shared/context';
import GruposModalForm from '../../components/GruposModalForm';
import { PageSidebar, PageHeader } from '../../../../shared/components';

export default function GruposTable() {
  const navigate = useNavigate();

  const { user } = useContext(LoginContext);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [queryString, setQueryString] = useState<string>('&page=' + currentPage);

  const { grupos, isLoading } = useGrupos({
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

  const onRowClick = async (e: any) => navigate('/alumnado/grupos/' + e?.id || '');

  //?Columnas
  const columns: OpenColumn[] = [
    {
      key: 'id',
      field: 'id',
      header: 'ID',
      sortable: true,
    },
    {
      key: 'nombre',
      field: 'nombre',
      header: 'Nombre',
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
        title="Alumnado"
        items={[
          {
            icon: BiBookContent,
            title: 'Alumnos',
            onClick: () => navigate('/alumnado/usuarios'),
          },
          {
            isActive: true,
            icon: BiGroup,
            title: 'Grupos',
            isDisabled: !isRoleAllowed([UserRolEnum.ADMIN], user?.rol),
            onClick: () => {},
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
          head={{ title: 'Todos los grupos' }}
          button={{
            text: 'Crear nuevo grupo',
            leftIcon: <Icon as={BiPlus} boxSize="21px" />,
            onClick: () => onOpen(),
          }}
        />

        <OpenTable
          data={grupos?.data}
          columns={columns}
          isLoading={isLoading}
          currentPage={currentPage}
          onRowClick={onRowClick}
          onPageChange={setCurrentPage}
          onQueryChange={setQueryString}
          total={grupos?.meta?.total || 1}
          maxPages={grupos?.meta?.last_page}
        />
      </Flex>

      <GruposModalForm state={{ isOpen, onClose }} />
    </Flex>
  );
}
