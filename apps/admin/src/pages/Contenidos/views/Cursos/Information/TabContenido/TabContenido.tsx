import { useState } from 'react';

import { BiBookOpen, BiCodeBlock, BiFolder, BiNews, BiPlayCircle, BiWebcam } from 'react-icons/bi';
import { Box, Flex, Icon, useDisclosure } from '@chakra-ui/react';

import { addLeccion, addModulo, removeLeccion, removeModulo, updateLeccion, updateModulo } from 'data';
import { ListItemProps, InformationDragDropList } from '../../../../../../shared/components';
import { fmtMnts } from 'utils';
import ModuloModalForm from '../../../../components/ModuloModalForm';
import { ICurso, ILeccion, IModulo, LeccionTipoEnum } from 'data';

import { LeccionZoom } from './LeccionZoom';
import { LeccionVideo } from './LeccionVideo';
import { LeccionSlides } from './LeccionSlides';
import { LeccionRecurso } from './LeccionRecurso';
import { LeccionMarkdown } from './LeccionMarkdown';
import { LeccionLivecoder } from './LeccionLivecoder';
import { LeccionEntregable } from './LeccionEntregable';
import { LeccionAutocorrecion } from './LeccionAutocorrecion';

type TabContenidoProps = {
  curso: ICurso;
  refreshState: () => void;
};

export const TabContenido = ({ curso, refreshState }: TabContenidoProps) => {
  const [modulo, setModulo] = useState<IModulo>();
  const [leccion, setLeccion] = useState<ILeccion>();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const updateLeccionValue = (value: any) => {
    if (!leccion?.id) return Promise.reject('leccion_id es indefinido');

    return updateLeccion({
      id: leccion?.id,
      leccion: value,
      client: 'admin',
    }).then((res: any) => {
      setLeccion(undefined);
      setLeccion({ ...res.value.data });
      refreshState();
    });
  };

  const updateModuloValue = (value: any) => {
    if (!modulo?.id) return Promise.reject('modulo_id es indefinido');

    return updateModulo({
      id: modulo.id,
      modulo: value,
      client: 'admin',
    }).then((res: any) => {
      setModulo({ ...res.value.data });
      refreshState();
    });
  };

  const onNewModulo = async () => {
    if (!curso?.id) return Promise.reject('curso_id es indefinido');

    return await addModulo({
      modulo: {
        titulo: 'Módulo nuevo',
        cursoId: curso.id,
        publicado: false,
        orden: (curso?.modulos?.length || 0) + 1,
      },
    }).then(() => refreshState());
  };

  const onNewLeccion = async (mod: IModulo) => {
    if (!mod?.id) return Promise.reject('modulo_id es indefinido');
    if (!curso?.id) return Promise.reject('curso_id es indefinido');

    return await addLeccion({
      leccion: {
        titulo: 'Lección nueva',
        moduloId: mod.id,
        publicado: false,
        contenido: null,
        tiempoDisponible: 24,
        tipo: LeccionTipoEnum.VIDEO,
        orden: (mod.lecciones?.length || 0) + 1,
      },
    }).then(() => refreshState());
  };

  const onDeleteModulo = (mod: IModulo) => {
    if (!mod.id) return Promise.reject('Módulo ID es indefinida');
    if (mod.lecciones && mod.lecciones?.length > 0) return Promise.reject('¡El módulo tiene lecciones asociadas!');

    removeModulo({ id: mod.id, client: 'admin' }).then(() => refreshState());
  };

  const onSelectLeccion = (leccion: ILeccion) => {
    setLeccion(leccion);
  };

  const onRemoveLeccion = (id?: number) => {
    if (id) removeLeccion(id).then(() => refreshState());
  };

  const onEditModulo = (mod: IModulo) => {
    setModulo(mod);
    onOpen();
  };

  const transformModulosToDnDItems = (leccionId?: number, modulos: IModulo[] = []): ListItemProps[] =>
    modulos
      ?.sort((a, b) => a.orden - b.orden)
      ?.map((mod: IModulo) => ({
        id: mod.id,
        showIndex: true,
        orden: mod.orden,
        title: mod.titulo,
        createTitle: 'Añadir lección',
        onEdit: () => onEditModulo(mod),
        onCreate: () => onNewLeccion(mod),
        onDelete: () => onDeleteModulo(mod),
        foot: fmtMnts(mod.meta?.duracionTotal || 0),
        subitems: mod.lecciones
          ?.sort((a, b) => a.orden - b.orden)
          ?.map((lec: ILeccion) => ({
            title: lec.titulo,
            foot: fmtMnts(lec.duracion || 0),
            isSelected: lec.id === leccionId,
            onClick: () => onSelectLeccion(lec),
            onDelete: () => onRemoveLeccion(lec.id),
            icon: (
              <Icon
                boxSize="18px"
                as={
                  lec.tipo === LeccionTipoEnum.VIDEO
                    ? BiPlayCircle
                    : lec.tipo === LeccionTipoEnum.ZOOM
                    ? BiWebcam
                    : lec.tipo === LeccionTipoEnum.MARKDOWN
                    ? BiNews
                    : lec.tipo === LeccionTipoEnum.LIVECODER
                    ? BiCodeBlock
                    : lec.tipo === LeccionTipoEnum.RECURSO ||
                      lec.tipo === LeccionTipoEnum.ENTREGABLE ||
                      lec.tipo === LeccionTipoEnum.AUTOCORREGIBLE
                    ? BiFolder
                    : BiBookOpen
                }
              />
            ),
          })),
      }));

  return (
    <>
      <Flex p="30px" gap="30px" boxSize="100%" overflow="auto" direction={{ base: 'column', lg: 'row' }}>
        <Flex direction="column" minW="400px" gap="30px">
          <Flex minH="fit-content" w="100%" direction="column" rowGap="8px">
            <Box fontSize="18px" fontWeight="semibold">
              Contenido del curso
            </Box>

            <Box fontSize="14px" fontWeight="medium" color="#84889A">
              Desde aquí se añade todo el contenido del curso, tanto los módulos como las lecciones.
            </Box>
          </Flex>

          <InformationDragDropList
            refresh={refreshState}
            onCreate={onNewModulo}
            createTitle="Añadir módulo"
            label="Módulos y Lecciones"
            items={transformModulosToDnDItems(leccion?.id, curso.modulos)}
          />
        </Flex>

        <Flex direction="column" w="100%" gap="30px">
          <Flex minH="fit-content" w="100%" direction="column" rowGap="8px">
            <Box fontSize="18px" fontWeight="semibold">
              {leccion ? `Contenido de la lección - ${leccion.titulo}` : 'Sin lección seleccionada'}
            </Box>

            <Box fontSize="14px" fontWeight="medium" color="#84889A">
              Aquí se añaden los contenidos de las lecciones, como el material, documentos, el temario, etc...
            </Box>
          </Flex>

          {!leccion ? (
            <Box>Por favor, escoge una lección del listado.</Box>
          ) : leccion?.tipo === LeccionTipoEnum.VIDEO ? (
            <LeccionVideo leccion={leccion} updateValue={updateLeccionValue} />
          ) : leccion?.tipo === LeccionTipoEnum.ENTREGABLE ? (
            <LeccionEntregable leccion={leccion} updateValue={updateLeccionValue} />
          ) : leccion?.tipo === LeccionTipoEnum.ZOOM ? (
            <LeccionZoom leccion={leccion} updateValue={updateLeccionValue} />
          ) : leccion?.tipo === LeccionTipoEnum.DIAPOSITIVA ? (
            <LeccionSlides leccion={leccion} updateValue={updateLeccionValue} />
          ) : leccion?.tipo === LeccionTipoEnum.MARKDOWN ? (
            <LeccionMarkdown leccion={leccion} updateValue={updateLeccionValue} />
          ) : leccion?.tipo === LeccionTipoEnum.AUTOCORREGIBLE ? (
            <LeccionAutocorrecion leccion={leccion} updateValue={updateLeccionValue} />
          ) : leccion?.tipo === LeccionTipoEnum.LIVECODER ? (
            <LeccionLivecoder leccion={leccion} updateValue={updateLeccionValue} />
          ) : (
            <LeccionRecurso leccion={leccion} updateValue={updateLeccionValue} />
          )}
        </Flex>
      </Flex>

      <ModuloModalForm
        isOpen={isOpen}
        defaultValue={modulo}
        updateValue={updateModuloValue}
        onClose={() => {
          onClose();
          setModulo(undefined);
        }}
      />
    </>
  );
};
