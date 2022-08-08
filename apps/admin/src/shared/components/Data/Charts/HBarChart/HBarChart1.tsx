import { Box, Flex, Progress, Text } from '@chakra-ui/react';

import { Avatar } from 'ui';

// TODO: HAY QUE JUNTARLO EN UN UNICO COMPONENTE HBARCHART
// TODO: ESTO LO HE HECHO PARA LA PÁGINA DE METRICAS, SUBPAGINA CURSOS

type HBarChartProps = {
  legend?: { value: string; color?: string }[];
  datasets: { id: any; image: string; title: string; data: number[] }[];
  showLegend?: boolean;

  onItemClick?: (e?: any) => void | any;
};

export const HBarChart = ({
  datasets,
  showLegend,
  onItemClick = (e?: any) => {},
  legend = [
    { value: 'Completados', color: '#31E0A1' },
    { value: 'En curso', color: '#3767E3' },
    // { value: 'Estancados', color: '#FEB547' },
    { value: 'Sin empezar', color: '#E6E8EE' },
  ],
}: HBarChartProps) => {
  return (
    <Flex direction="column" bg="gray_7" p="24px" gap="20px">
      <Flex direction="column" gap="12px">
        {datasets?.map(({ id, image, title, data }, index) => {
          const dataLength: number = data.length || 0;

          return (
            <Flex align="center" gap="20px" key={`hbar-item-${index}`} onClick={() => onItemClick({ id })}>
              <Flex align="center" border="1px solid" borderColor="gray_5" p="10px" gap="15px" minW="250px" w="300px">
                <Avatar name=" " size="24px" src={image} colorVariant={'cold'} />

                <Text fontSize="15px" fontWeight="medium" lineHeight="18px" isTruncated>
                  {title}
                </Text>
              </Flex>

              <Progress
                w="100%"
                h="14px"
                rounded="4px"
                value={100}
                sx={{
                  '& > div': {
                    background:
                      dataLength === 0
                        ? '#E6E8EE'
                        : `linear-gradient(90deg, #31E0A1 0%, #31E0A1 ${data[0] + '%'}, #3767E3 ${data[0] + '%'}, #3767E3 ${
                            data[1] + '%'
                          }, #E6E8EE ${data[1] + '%'}, #E6E8EE ${data[2] + '%'})`,
                  },
                }}
              />
            </Flex>
          );
        })}
      </Flex>

      {showLegend && (
        <>
          <Box h="1px" bg="gray_5" />

          <Flex>
            {legend?.map((l, i) => (
              <Flex
                gap="8px"
                rounded="68px"
                border="1px solid"
                borderColor="gray_5"
                p="6px 10px 6px 6px"
                key={`hbar-legend-${i}`}
              >
                <Box boxSize="12px" rounded="50%" bg={l.color || 'gray_3'} />

                <Box fontWeight="semibold" fontSize="11px" lineHeight="13px">
                  {l.value}
                </Box>
              </Flex>
            ))}
          </Flex>
        </>
      )}
    </Flex>
  );
};
