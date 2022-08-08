import { Box, Flex, Progress, Text } from '@chakra-ui/react';

import { Avatar } from '@clevery/ui';

// TODO: HAY QUE JUNTARLO EN UN UNICO COMPONENTE HBARCHART
// TODO: ESTO LO HE HECHO PARA LA PÁGINA DE METRICAS, SUBPAGINA HABILIDADES

type HBarChart2Props = {
  legend?: { value: string; color?: string }[];
  datasets: {
    image: string;
    title: string;
    data: number[];
    total: number;
    num: number;
  }[];
  showLegend?: boolean;
};

export const HBarChart2 = ({
  datasets,
  showLegend,
  legend = [
    { value: 'Completados', color: '#31E0A1' },
    { value: 'Sin empezar', color: '#E6E8EE' },
  ],
}: HBarChart2Props) => {
  return (
    <Flex direction="column" bg="gray_7" p="24px" w="100%">
      <Flex direction="column" gap="12px">
        {datasets?.map(
          ({ image, title, data = [0, 0], total = 0, num = 0 }, index) => {
            const dataLength: number = data.length || 0;

            return (
              <Flex
                w="100%"
                align="center"
                gap="20px"
                key={`hbar-item-${index}`}
              >
                <Flex
                  align="center"
                  border="1px solid"
                  borderColor="gray_5"
                  p="10px"
                  gap="15px"
                  minW="250px"
                  w="300px"
                >
                  <Avatar
                    name=" "
                    size="24px"
                    src={image}
                    colorVariant={'hot'}
                  />

                  <Text
                    fontSize="15px"
                    fontWeight="medium"
                    lineHeight="18px"
                    isTruncated
                  >
                    {title}
                  </Text>
                </Flex>

                <Progress
                  w="100%"
                  h="14px"
                  minW="200px"
                  rounded="4px"
                  value={100}
                  sx={{
                    '& > div': {
                      background:
                        dataLength === 0
                          ? '#E6E8EE'
                          : `linear-gradient(90deg, #31E0A1 0%, #31E0A1 ${
                              data[0] + '%'
                            }, #E6E8EE ${data[0] + '%'}, #E6E8EE 100%)`,
                    },
                  }}
                />

                <Text
                  minW="fit-content"
                  fontSize="15px"
                  fontWeight="medium"
                  lineHeight="18px"
                >
                  {num} / {total}
                </Text>
              </Flex>
            );
          }
        )}
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
