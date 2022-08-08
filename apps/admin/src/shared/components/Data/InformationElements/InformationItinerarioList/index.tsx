import { useContext, useEffect, useState } from 'react';

import AsyncSelect from 'react-select/async';
import { BiBook, BiBox, BiPlusCircle } from 'react-icons/bi';
import { Icon, Box, Flex, Button, useDisclosure } from '@chakra-ui/react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import {
  IRuta,
  getCursos,
  IProyectoBoost,
  addProyectoBoost,
  getProyectosBoosts,
  updateProyectoBoost,
  RutaItinerarioLoaded,
  RutaItinerarioTipoEnum,
} from 'data';
import { sortByRoadmap } from 'utils';

import ItinerarioListItem from './ListItem';
import { ProyectoModal } from './ProyectoModal';
import { LoginContext } from '../../../../context';

export const ItinerarioList = ({ ruta, updateRuta }: { ruta?: IRuta; updateRuta: Function }) => {
  const proyectoModalState = useDisclosure();

  const { user } = useContext(LoginContext);

  const [open, setOpen] = useState<'idle' | 'curso'>('idle');
  const [proyectoToUpdate, setProyectoToUpdate] = useState<IProyectoBoost>();

  const [itinerario, setItinerario] = useState<RutaItinerarioLoaded[]>([]);

  useEffect(() => {
    refreshData();
  }, [ruta?.itinerario]);

  const refreshData = async () => {
    if (ruta?.meta?.itinerario) {
      let cursosRuta: number[] = ruta?.meta?.itinerario
        ?.filter((i: any) => i.tipo === RutaItinerarioTipoEnum.CURSO && !isNaN(i.id))
        ?.map((i) => i.id);

      let proyectosRuta: number[] = ruta?.meta?.itinerario
        ?.filter((i: any) => i.tipo === RutaItinerarioTipoEnum.PROYECTO && !isNaN(i.id))
        ?.map((i) => i.id);

      let cursosData = await getCursos({
        userId: user?.id,
        client: 'admin',
        treatData: false,
        query: [{ ruta: '[' + cursosRuta + ']' }, { limit: 1000 }],
      }).catch((error) => console.error({ error }));

      let proyectosData = await getProyectosBoosts({
        client: 'admin',
        query: [{ lista: '[' + proyectosRuta + ']' }, { limit: 1000 }],
      }).catch((error: any) => console.error({ error }));

      setItinerario(sortByRoadmap(cursosData?.data || [], proyectosData?.data || [], ruta?.meta?.itinerario));
    }
  };

  async function loadCursos(value: string) {
    const _cursos = await getCursos({
      userId: user?.id,
      client: 'admin',
      treatData: false,
      query: [{ titulo: value }],
    });

    return _cursos?.data?.map((c: any) => ({ value: c.id, label: c.titulo }));
  }

  function onAddCurso(event: any) {
    if (!ruta?.meta?.itinerario) return;

    if (event?.value) {
      let { itinerario } = ruta.meta;
      itinerario.push({ tipo: RutaItinerarioTipoEnum.CURSO, id: event.value });

      updateRuta({ itinerario: JSON.stringify(itinerario) });
    }

    setOpen('idle');
  }

  const onCreateProyectoBoost = async (proyectoBoost: any) => {
    if (!ruta?.meta?.itinerario) return;

    // Primero damos de alta el ProyectoBoost
    let pBoost = await addProyectoBoost({ proyectoBoost })
      .then((res) => res.value)
      .catch((error) => console.error({ error }));

    // Luego, lo añadimos a la hoja de ruta
    let { itinerario } = ruta.meta;

    itinerario.push({
      tipo: RutaItinerarioTipoEnum.PROYECTO,
      id: pBoost.id,
    });

    await updateRuta({ itinerario: JSON.stringify(itinerario) });

    setOpen('idle');
  };

  const onUpdateProyectoBoost = async (id: number, proyectoBoost: any) => {
    await updateProyectoBoost({ id, proyectoBoost }).catch((error) => console.error({ error }));
  };

  /** Controlador para el drag and drop del listado
   * (indiferente del tipo de elemento) */
  function handleOnDragEnd(result: any) {
    if (!result.destination || !ruta?.meta?.itinerario) return;

    const startIndex = result.source.index;
    const endIndex = result.destination.index;

    const { itinerario } = ruta.meta;

    const auxItem = itinerario[startIndex];
    itinerario[startIndex] = itinerario[endIndex];
    itinerario[endIndex] = auxItem;

    updateRuta({ itinerario: JSON.stringify(itinerario) });
  }

  /** Controlador para eliminar elementos del listado
   * (indiferente del tipo de elemento) */
  function onDelete(id?: number) {
    if (!id || !ruta?.meta?.itinerario) return;

    let { itinerario } = ruta.meta;

    // Filtramos el elemento con el ID a borrar.
    itinerario = itinerario.filter((i: any) => i.id !== id);

    updateRuta({
      itinerario: JSON.stringify(itinerario.filter((i: any) => i.id !== id)),
    });
  }

  return (
    <>
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="ruta">
          {(provided) => (
            <Flex gap="10px" direction="column" {...provided.droppableProps} ref={provided.innerRef}>
              {itinerario.map((item, index) => (
                <Draggable key={item.id} index={index} draggableId={'ruta-' + item.id}>
                  {(provided) => (
                    <Box ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                      <ItinerarioListItem
                        curso={item?.curso}
                        proyecto={item?.proyecto}
                        onDelete={() => onDelete(item.id)}
                        onSelect={() => {
                          if (item?.tipo === 'proyecto') setProyectoToUpdate(item?.proyecto);
                        }}
                      />
                    </Box>
                  )}
                </Draggable>
              ))}

              {open !== 'idle' ? (
                <AsyncSelect
                  isClearable
                  onChange={onAddCurso}
                  styles={selectStyles}
                  loadOptions={loadCursos}
                  placeholder="Escribe para buscar"
                  loadingMessage={() => 'Buscando información...'}
                />
              ) : (
                <Flex w="100%" align="center" gap="12px">
                  <Button
                    w="100%"
                    p="10px 12px"
                    rounded="12px"
                    color="#878EA0"
                    border="1px solid #E6E8EE"
                    onClick={() => setOpen('curso')}
                    leftIcon={<Icon as={BiBook} boxSize="21px" />}
                    rightIcon={<Icon as={BiPlusCircle} ml="8px" boxSize="21px" />}
                  >
                    <Box fontSize="15px" lineHeight="17px" fontWeight="semibold">
                      Añadir <strong>curso</strong>
                    </Box>
                  </Button>

                  <Button
                    isDisabled={process.env.NODE_ENV === 'production'}
                    w="100%"
                    p="10px 12px"
                    rounded="12px"
                    color="#878EA0"
                    border="1px solid #E6E8EE"
                    onClick={proyectoModalState.onOpen}
                    leftIcon={<Icon as={BiBox} boxSize="21px" />}
                    rightIcon={<Icon as={BiPlusCircle} ml="8px" boxSize="21px" />}
                  >
                    <Box fontSize="15px" lineHeight="17px" fontWeight="semibold">
                      Añadir <strong>proyecto</strong>
                    </Box>
                  </Button>
                </Flex>
              )}

              {provided.placeholder}
            </Flex>
          )}
        </Droppable>
      </DragDropContext>

      <ProyectoModal
        defaultValue={proyectoToUpdate}
        onCreate={onCreateProyectoBoost}
        onUpdate={onUpdateProyectoBoost}
        state={{
          ...proyectoModalState,
          onClose: () => {
            proyectoModalState.onClose();
            setProyectoToUpdate(undefined);
          },
        }}
      />
    </>
  );
};

const selectStyles = {
  noOptionsMessage: (styles: any) => ({
    ...styles,
    fontSize: '16px',
    textAlign: 'left',
  }),
  singleValue: (styles: any) => ({
    ...styles,
    color: '#131340',
    fontWeight: 'normal',
  }),
  indicatorSeparator: (styles: any) => ({ display: 'none' }),
  control: (styles: any) => ({
    ...styles,
    border: '1px solid #E6E8EE',
    borderRadius: '7px',
  }),
};
