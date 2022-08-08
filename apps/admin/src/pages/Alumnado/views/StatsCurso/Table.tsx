import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { Box, Flex } from '@chakra-ui/react';
import { BiBookContent, BiGroup, BiPieChartAlt, BiPieChartAlt2, BiTask } from 'react-icons/bi';

import { isRoleAllowed } from 'utils';
import { getStatsByCurso, UserRolEnum } from 'data';

import { LoginContext } from '../../../../shared/context';
import { HBarChart, PageHeader, PageSidebar } from '../../../../shared/components';

export default function CursosTable() {
  const navigate = useNavigate();

  const { user } = useContext(LoginContext);

  const [cursosStats, setCursosStats] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const stats = await getStatsByCurso({ query: [{ empresa_id: 1 }] });

      setCursosStats(
        stats?.data?.map((s: any) => {
          const totalUsers = (s.meta?.usersNoEmpezados?.length || 0) + (s.meta?.progresosUsers?.length || 0);
          const totalNoEmpezados = s.meta?.usersNoEmpezados?.length || 0;
          const totalCompletos = +(s.meta?.totalUsers || 0);
          const totalEnCurso = totalUsers - totalCompletos - totalNoEmpezados;

          const getPercent = (n = 0) => Math.floor((n * 100) / totalUsers);

          return {
            id: s.id,
            title: s.titulo,
            image: s.imagen?.url,
            data: [getPercent(totalCompletos), getPercent(totalEnCurso), getPercent(totalNoEmpezados)],
          };
        }) || []
      );
    })();
  }, []);

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
            icon: BiGroup,
            title: 'Grupos',
            isDisabled: !isRoleAllowed([UserRolEnum.ADMIN], user?.rol),
            onClick: () => navigate('/alumnado/grupos'),
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
            isActive: true,
            icon: BiPieChartAlt2,
            title: 'Stats por curso',
            onClick: () => {},
          },
        ]}
      />

      <Flex boxSize="100%" direction="column" gap="30px" p="30px">
        <PageHeader head={{ title: 'Stats por cursos' }} />

        <Flex w="100%" direction="column" gap="30px">
          <Flex minH="fit-content" w="100%" direction="column" gap="8px" p="0px 30px">
            <Box fontSize="18px" fontWeight="semibold">
              Progreso de Cursos
            </Box>

            <Box fontSize="14px" fontWeight="medium" color="#84889A">
              En este gráfico se muestra el progreso general del grupo respecto a los cursos.
            </Box>
          </Flex>

          <Flex direction="column" gap="30px" w="100%">
            {cursosStats?.length > 0 ? (
              <HBarChart showLegend datasets={cursosStats} onItemClick={(e) => navigate(`/alumnado/stats-cursos/${e?.id}`)} />
            ) : (
              <Box>No hay cursos asociados al grupo</Box>
            )}
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
}
