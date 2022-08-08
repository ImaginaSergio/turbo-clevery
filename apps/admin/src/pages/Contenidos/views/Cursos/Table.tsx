import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { BiPlus, BiBrain, BiDirections, BiBadgeCheck, BiBookContent } from 'react-icons/bi';
import { format } from 'date-fns';
import { Flex, Icon, Box, Badge, Image, toast } from '@chakra-ui/react';

import { onFailure } from 'ui';
import { Avatar, OpenColumn, OpenTable } from 'ui';
import { getUsers, useCursos, UserRolEnum, getCursos } from 'data';
import { PageHeader, PageSidebar } from '../../../../shared/components';
import { descargarTemarioCurso } from '../../../../shared/utils/temaryGenerator';

export default function CursosTable() {
  const navigate = useNavigate();
  const [loadingDowload, setLoadingDowload] = useState<boolean>(false);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [queryString, setQueryString] = useState<string>('&page=' + currentPage);

  const { cursos, isLoading } = useCursos({
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

  const onRowClick = async (e: any) => navigate('/contenidos/cursos/' + e?.id || '');

  const loadProfesores = (value: string) =>
    getUsers({
      query: [{ nombre: value }, { rol: UserRolEnum.PROFESOR }],
    }).then((res) =>
      res?.data?.map((user: any) => ({
        value: user.id,
        label: (user?.nombre || ' ') + ' ' + (user?.apellidos || ' '),
      }))
    );

  const generarTemarios = async () => {
    setLoadingDowload(true);

    const cursos = await getCursos({
      client: 'admin',
      treatData: false,
      query: [{ limit: 100, publicado: true }],
    });

    for (const curso of cursos?.data || []) {
      console.log(`🔄 Descargando temario de ${curso?.titulo}`);

      await descargarTemarioCurso(curso?.id, `Formacion en ${curso?.titulo} - OpenBootcamp`, false)
        .then((url: string) => {
          console.log(`✅ Temario de ${curso?.titulo} descargado`, { url });

          var link: HTMLAnchorElement = document.createElement('a');

          link.target = '_blank';
          link.href = url;
          link.click();
        })
        .catch((error: any) => {
          console.error({ error });
          onFailure(toast, error.title, error.message);
        });
    }
    setLoadingDowload(false);
  };

  const columns: OpenColumn[] = [
    {
      header: 'Título',
      field: 'titulo',
      key: 'titulo',
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
      header: 'Profesor',
      field: 'profesor_id',
      key: 'profesor_id',
      sortable: true,
      filterable: true,
      loadOptions: loadProfesores,
      render: (rowData) => (
        <Flex gap="15px" align="center">
          <Avatar
            size="50px"
            variant="bauhaus"
            colorVariant={(rowData?.profesor?.id || 0) % 2 == 1 ? 'hot' : 'cold'}
            src={rowData.profesor.avatar?.url}
            name={rowData.profesor?.fullName || 'Avatar del profesor'}
          />

          <Box as="a" href={'/contenidos/cursos/' + rowData?.id || ''}>
            {(rowData.profesor?.nombre || '') + ' ' + (rowData.profesor?.apellidos || '')}
          </Box>
        </Flex>
      ),
    },
    {
      header: 'Nº de módulos',
      field: 'modulos',
      key: 'modulos',
      render: (rowData) => <Box>{rowData.modulos.length}</Box>,
    },
    {
      key: 'publicado',
      field: 'publicado',
      header: 'Publicado',
      sortable: true,
      filterable: true,
      options: [
        { label: 'Publicado', value: 'true' },
        { label: 'No publicado', value: 'false' },
      ],
      render: (rowData) => (
        <Badge rounded="7px" color={rowData.publicado ? 'white' : 'black'} bg={rowData.publicado ? 'primary' : '#D9DBE3'}>
          {rowData.publicado ? 'Publicado' : 'No publicado'}
        </Badge>
      ),
    },
    {
      key: 'createdAt',
      field: 'createdAt',
      header: 'Fecha de creación',
      sortable: true,
      render: (rowData) => <Flex>{format(new Date(rowData.createdAt), 'dd/MM/yyy')}</Flex>,
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
            isActive: true,
            onClick: () => {},
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
            icon: BiBrain,
            title: 'Habilidades',
            onClick: () => navigate('/contenidos/habilidades'),
          },
        ]}
      />

      <Flex direction="column" w="100%">
        <PageHeader
          head={{ title: 'Todas las Formaciones' }}
          buttonGroup={[
            {
              text: 'Descargar temarios',
              leftIcon: <Icon as={BiPlus} boxSize="21px" />,
              onClick: generarTemarios,
              isLoading: loadingDowload,
              loadingText: 'Descargando...',
            },
            {
              text: 'Crear nuevo curso',
              leftIcon: <Icon as={BiPlus} boxSize="21px" />,
              onClick: () => navigate('/contenidos/cursos/new'),
            },
          ]}
        />

        <OpenTable
          data={cursos?.data || []}
          columns={columns}
          isLoading={isLoading}
          currentPage={currentPage}
          onRowClick={onRowClick}
          onPageChange={setCurrentPage}
          onQueryChange={setQueryString}
          total={cursos?.meta?.total || 1}
          maxPages={cursos?.meta?.last_page}
        />
      </Flex>
    </Flex>
  );
}
