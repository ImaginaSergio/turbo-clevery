import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Box, Flex } from '@chakra-ui/react';
import { BiBook, BiBrain, BiListUl } from 'react-icons/bi';

import { getStatsByCurso } from '@clevery/data';
import { PageHeader, PageSidebar } from '../../../../shared/components';
import { PieChart } from '../../../../shared/components/Data/Charts/PieChart/PieChart';

export default function CursosCover() {
  const navigate = useNavigate();
  const { cursoId } = useParams();

  const [cursosStats, setCursosStats] = useState<any>();

  useEffect(() => {
    (async () => {
      if (cursoId) {
        const stats: any = await getStatsByCurso({
          query: [{ curso_id: cursoId }],
        });

        if (stats?.length > 0) {
          const s = stats[0];

          const totalUsers =
            (s.meta?.usersNoEmpezados?.length || 0) +
            (s.meta?.progresosUsers?.length || 0);
          const totalNoEmpezados = s.meta?.usersNoEmpezados?.length || 0;
          const totalCompletos = +(s.meta?.totalUsers || 0);
          const totalEnCurso = totalUsers - totalCompletos - totalNoEmpezados;

          const getPercent = (n = 0) => Math.floor((n * 100) / totalUsers);

          setCursosStats({
            title: s.titulo,
            image: s.imagen?.url,
            data: [
              getPercent(totalCompletos),
              getPercent(totalEnCurso),
              getPercent(totalNoEmpezados),
            ],
            ...s,
          });
        }
      }
    })();
  }, [cursoId]);

  return (
    <Flex boxSize="100%">
      <PageSidebar
        title="Estadísticas"
        items={[
          {
            icon: BiBook,
            title: 'Cursos',
            isActive: true,
            onClick: () => navigate('/alumnado/stats-cursos'),
          },
          {
            icon: BiBrain,
            title: 'Habilidades',
            onClick: () => navigate('/alumnado/stats-habilidades'),
          },
        ]}
      />

      <Flex boxSize="100%" direction="column" gap="30px">
        <PageHeader head={{ title: 'Stats por cursos' }} />

        <Flex w="100%" gap="30px" align="center" justify="center">
          {/* <Flex w="100%" direction="column" gap="30px">
            <Flex minH="fit-content" w="100%" direction="column" gap="8px" px="30px">
              <Box fontSize="18px" fontWeight="semibold">
                Progreso de Cursos
              </Box>

              <Box fontSize="14px" fontWeight="medium" color="#84889A">
                En este gráfico se muestra el progreso general del grupo respecto a los cursos.
              </Box>
            </Flex>

            <Flex direction="column" gap="30px" w="100%" px="30px">
              {cursosStats ? (
                <Flex
                  direction="column"
                  p="15px"
                  h="100%"
                  gap="25px"
                  bg="gray_7"
                  minW="485px"
                  rounded="12px"
                  border="1px solid"
                  borderColor="gray_5"
                >
                  <Tabs>
                    <TabList>
                      <Tab
                        fontSize="15px"
                        fontWeight="bold"
                        color="#878EA0"
                        _selected={{ color: '#26C8AB', borderBottom: '4px solid #26C8AB' }}
                      >
                        En Curso{' '}
                        <Box ml="10px">
                          {(cursosStats?.meta?.progresosUsers?.length || 0) - +(cursosStats?.meta?.totalUsers || 0)}
                        </Box>
                      </Tab>

                      <Tab
                        fontSize="15px"
                        fontWeight="bold"
                        color="#878EA0"
                        _selected={{ color: '#26C8AB', borderBottom: '4px solid #26C8AB' }}
                      >
                        Completados <Box ml="10px">{cursosStats?.meta?.totalUsers || 0}</Box>
                      </Tab>

                      <Tab
                        fontSize="15px"
                        fontWeight="bold"
                        color="#878EA0"
                        _selected={{ color: '#26C8AB', borderBottom: '4px solid #26C8AB' }}
                      >
                        Sin empezar <Box ml="10px">{cursosStats?.meta?.usersNoEmpezados?.length || 0}</Box>
                      </Tab>
                    </TabList>

                    <TabPanels>
                      <TabPanel p="30px 0px">Hola</TabPanel>

                      <TabPanel p="30px 0px">mundo</TabPanel>

                      <TabPanel p="30px 0px">!</TabPanel>
                    </TabPanels>
                  </Tabs>
                </Flex>
              ) : (
                <Box>No hay cursos asociados al grupo</Box>
              )}
            </Flex>
          </Flex>

          <Box w="1px" bg="gray_3" /> */}

          <Flex
            direction="column"
            p="15px"
            h="100%"
            gap="25px"
            bg="gray_7"
            minW="485px"
            rounded="12px"
            border="1px solid"
            borderColor="gray_5"
          >
            <Flex
              direction="column"
              gap="15px"
              w="100%"
              fontWeight="semibold"
              fontSize="16px"
              lineHeight="19px"
            >
              Progreso general
              <Box h="1px" w="100%" bg="gray_5" />
            </Flex>

            <PieChart
              labels={['Completados', 'En Curso', 'Sin Empezar']}
              dataset={{
                label: 'Cursos',
                data: cursosStats?.data || [],
                borderColor: ['#37ECCB', '#6A7FF1', '#E6E8EE'],
                backgroundColor: ['#37ECCB', '#6A7FF1', '#E6E8EE'],
              }}
            />
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
}
