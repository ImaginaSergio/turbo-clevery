import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Box, Flex, Drawer, DrawerContent, DrawerBody, DrawerCloseButton } from '@chakra-ui/react';
import { es } from 'date-fns/locale';
import { format, isToday, isSameDay, addMonths } from 'date-fns';

import { Calendar } from './Calendar';
import { LayoutContext } from '../../../context';
import { getLeccionesCalendario } from 'data';

type CalendarDrawerProps = {
  state: { isOpen: boolean; onClose: () => void };
};

export const CalendarDrawer = ({ state }: CalendarDrawerProps) => {
  const navigate = useNavigate();
  const [date, setDate] = useState<Date>(new Date());
  const { isMobile } = useContext(LayoutContext);

  const [events, setEvents] = useState<any[]>([]);
  const [dateEvents, setDateEvents] = useState<any[]>([]);

  useEffect(() => {
    if (state.isOpen) refreshEventos();
  }, [state.isOpen, date]);

  const refreshEventos = async () => {
    let fechaInicio = format(addMonths(date, -1), 'yyyy-MM-dd', { locale: es });
    let fechaFin = format(addMonths(date, 1), 'yyyy-MM-dd', { locale: es });

    let eventos = await getLeccionesCalendario({
      strategy: 'invalidate-on-undefined',
      query: [{ limit: 777 }, { fecha_inicio: fechaInicio }, { fecha_fin: fechaFin }],
    });

    setEvents(eventos?.data || []);
    setDateEvents((eventos?.data || [])?.filter((e: any) => isSameDay(date, new Date(e.fechaPublicacion))));
  };

  const onDateChange = (newDate: Date) => {
    setDate(newDate);
  };

  return (
    <Drawer placement="right" isOpen={state.isOpen} onClose={state.onClose} size={isMobile ? 'full' : 'md'}>
      <DrawerContent
        w="200px"
        bg="white"
        overflow="auto"
        p={isMobile ? '34px 20px' : '34px'}
        boxShadow="0px 4px 24px rgba(0, 0, 0, 0.25)"
        borderLeft="1px solid var(--chakra-colors-gray_3)"
      >
        <DrawerBody p="0px">
          {isMobile && <DrawerCloseButton mt="10px" />}

          <Flex align="center" justify="center" rowGap="34px" direction="column">
            <Flex w="100%" direction="column" rowGap="30px">
              <Flex direction="column" rowGap="15px">
                <Flex fontSize="15px" lineHeight="75%">
                  {isToday(date) && (
                    <Box mr="3px" fontWeight="bold">
                      Hoy,
                    </Box>
                  )}

                  <Box textTransform="capitalize">{format(date, 'EEEE', { locale: es })}</Box>
                </Flex>

                <Flex fontSize="36px" lineHeight="75%">
                  <Box mr="3px" fontWeight="bold">
                    {format(date, 'dd', { locale: es })}
                  </Box>

                  <Box textTransform="capitalize" fontWeight="semibold">
                    {format(date, 'MMMM', { locale: es })}
                  </Box>
                </Flex>
              </Flex>

              <Calendar
                date={date}
                daysDisabled={[0, 6]}
                onDateChange={onDateChange}
                events={events?.map((e: any) => ({
                  id: e?.id,
                  date: new Date(e.fechaPublicacion),
                  ...e,
                }))}
              />
            </Flex>

            <Box w="100%" h="1px" bg="gray_2" />

            <Flex w="100%" direction="column" rowGap="30px">
              <Box fontWeight="bold" fontSize="19px">
                Eventos del día
              </Box>

              {dateEvents?.length > 0 ? (
                <Flex direction="column" w="100%" rowGap="20px">
                  {dateEvents?.map((ev: any) => (
                    <Flex
                      h="60px"
                      w="100%"
                      p="15px"
                      bg="white"
                      rounded="5px"
                      align="center"
                      cursor="pointer"
                      transition="all 0.2s ease"
                      key={`calendar-event-${ev.id}`}
                      borderLeft="3px solid var(--chakra-colors-primary)"
                      _hover={{ background: 'rgba(38, 200, 171, 0.15)' }}
                      onClick={() => navigate(`/cursos/${ev.modulo?.cursoId}/leccion/${ev.id}`)}
                    >
                      <Flex w="100%" columnGap="40px" justify="space-between">
                        {!isMobile ? (
                          <Flex fontWeight="medium" fontSize="17px">
                            {ev?.modulo?.curso?.titulo && (
                              <Box fontWeight="bold" mr="4px">
                                {ev.modulo?.curso?.titulo} -
                              </Box>
                            )}

                            {ev.titulo}
                          </Flex>
                        ) : (
                          <Flex fontSize="12px" direction="column" fontWeight="medium">
                            {ev?.modulo?.curso?.titulo && (
                              <Box fontWeight="bold" mr="4px">
                                {ev.modulo?.curso?.titulo}
                              </Box>
                            )}
                            <Box>{ev.titulo}</Box>
                          </Flex>
                        )}

                        <Flex align="center" fontSize="15px" fontWeight="medium">
                          {format(new Date(ev.fechaPublicacion), "HH:mm'h'")}
                        </Flex>
                      </Flex>
                    </Flex>
                  ))}
                </Flex>
              ) : (
                <Box color="gray_4" fontSize="14px" lineHeight="100%" fontWeight="semibold">
                  No hay eventos programados para esta fecha
                </Box>
              )}
            </Flex>
          </Flex>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};
