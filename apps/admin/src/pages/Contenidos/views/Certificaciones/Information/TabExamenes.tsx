import { useEffect, useState } from 'react';

import { Box, Flex, Tab, TabList, TabPanel, TabPanels, Tabs, useToast } from '@chakra-ui/react';

import { onFailure } from 'ui';
import { fmtMnts } from 'utils';

import {
  IExamen,
  IPregunta,
  IRespuesta,
  ICertificacion,
  addExamen,
  addPregunta,
  addRespuesta,
  getExamenes,
  getPreguntas,
  removeExamen,
  removePregunta,
  removeRespuesta,
  updateExamen,
  updatePregunta,
  updateRespuesta,
} from 'data';
import {
  ListItemProps,
  PreguntasItem,
  InformationInput,
  InformationTestList,
  InformationTextEditor,
  InformationFilepond,
  InformationDragDropList,
} from '../../../../../shared/components';

type TabExamenesProps = {
  certificacion: ICertificacion;
};

export const TabExamenes = ({ certificacion }: TabExamenesProps) => {
  const toast = useToast();

  const [examen, setExamen] = useState<IExamen>();
  const [examenes, setExamenes] = useState<IExamen[]>([]);

  useEffect(() => {
    refreshState();
  }, [certificacion]);

  const refreshState = async () => {
    const _examenes = await getExamenes({
      query: [{ certificacion_id: certificacion?.id }, { es_certificacion: true }],
      client: 'admin',
    });

    setExamenes(_examenes?.data || []);
  };

  const updateTestValue = (value: any) => {
    if (!examen?.id) return Promise.reject('examen_id es indefinido');

    return updateExamen({ id: examen.id, examen: value, client: 'admin' }).then(() => refreshState());
  };

  const onNewExamen = async () => {
    if (!certificacion?.id) {
      onFailure(toast, 'Error al crear el examen', 'certificacion_id es indefinido');
      return;
    }

    if ((certificacion.examenes?.length || 0) >= 1) {
      onFailure(toast, 'Error al crear el examen', 'Sólo puedes crear un examen por certificación');
      return;
    }

    return await addExamen({
      examen: {
        nombre: `Examen de ${certificacion.nombre}`,
        certificacionId: certificacion.id,
        esCertificacion: true,
        publicado: true,
        numIntentos: 0,
        numPreguntas: 0,
        descripcion: ' ',
        duracion: 0,
      },
    }).then(() => refreshState());
  };

  const onRemoveTest = (examen: IExamen) => {
    if (!examen.id) return Promise.reject('Módulo ID es indefinida');

    removeExamen({ id: examen.id, client: 'admin' }).then(() => refreshState());
  };

  const transformTestsToDnDItems = (examenes: IExamen[] = []): ListItemProps[] => {
    return examenes.map((examen: IExamen) => ({
      showIndex: false,
      title: examen.nombre,
      foot: fmtMnts(examen.duracion || 0),
      onClick: () => setExamen(examen),
      onDelete: () => onRemoveTest(examen),
    }));
  };

  return (
    <Flex direction={{ base: 'column', lg: 'row' }} p="30px" boxSize="100%" gap="30px" overflow="auto">
      <Flex direction="column" minW="400px" gap="30px">
        <Flex minH="fit-content" w="100%" direction="column" rowGap="8px">
          <Box fontSize="18px" fontWeight="semibold">
            Exámenes de la certificación
          </Box>

          <Box fontSize="14px" fontWeight="medium" color="#84889A">
            Añade los exámenes de la certificación en este apartado.
          </Box>
        </Flex>

        <InformationDragDropList
          allowOpen={false}
          onCreate={onNewExamen}
          label="Listado de exámenes"
          createTitle="Añadir examen"
          items={transformTestsToDnDItems(examenes)}
        />
      </Flex>

      <Flex direction="column" w="100%" gap="30px">
        <Flex minH="fit-content" w="100%" direction="column" rowGap="8px">
          <Box fontSize="18px" fontWeight="semibold">
            {examen ? `Contenido del examen - ${examen.nombre}` : 'Sin examen seleccionado'}
          </Box>

          <Box fontSize="14px" fontWeight="medium" color="#84889A">
            Revisa los ajustes y preguntas del examen seleccionado.
          </Box>
        </Flex>

        {!examen ? (
          <Box>Por favor, escoge un examen del listado.</Box>
        ) : (
          <Tabs>
            <TabList>
              <Tab
                fontSize="15px"
                fontWeight="bold"
                color="#878EA0"
                _selected={{
                  color: '#26C8AB',
                  borderBottom: '4px solid #26C8AB',
                }}
              >
                Detalles del examen
              </Tab>

              <Tab
                fontSize="15px"
                fontWeight="bold"
                color="#878EA0"
                _selected={{
                  color: '#26C8AB',
                  borderBottom: '4px solid #26C8AB',
                }}
              >
                Preguntas del examen ({examen?.meta?.total_preguntas || 0})
              </Tab>
            </TabList>

            <TabPanels>
              <TabPanel p="30px 0px">
                <TabTestDetalles examen={examen} updateValue={updateTestValue} />
              </TabPanel>

              <TabPanel p="30px 0px">
                <TabTestPreguntas examen={examen} />
              </TabPanel>
            </TabPanels>
          </Tabs>
        )}
      </Flex>
    </Flex>
  );
};

const TabTestDetalles = ({ examen, updateValue }: { examen?: IExamen; updateValue: (value: any) => void }) => {
  return (
    <Flex w="100%" gap="30px" direction={{ md: 'column', xl: 'row' }}>
      <Flex direction="column" w="100%" gap="30px">
        <Flex w="100%" gap="30px" direction={{ lg: 'column', xl: 'row' }}>
          <InformationInput
            name="nombre"
            label="Nombre del examen"
            defaultValue={examen?.nombre}
            updateValue={updateValue}
            isDisabled={!examen?.id}
            style={{ width: '100%' }}
          />

          <InformationInput
            name="duracion"
            label="Duración del Test"
            defaultValue={examen?.duracion}
            updateValue={updateValue}
            isDisabled={!examen?.id}
            style={{ width: '100%' }}
          />
        </Flex>

        <Flex w="100%" gap="30px" direction={{ lg: 'column', xl: 'row' }}>
          <InformationInput
            type="number"
            name="numIntentos"
            label="Nº de intentos"
            defaultValue={examen?.numIntentos}
            updateValue={updateValue}
            isDisabled={!examen?.id}
            style={{ width: '100%' }}
          />

          <InformationInput
            type="number"
            name="numPreguntas"
            label="Nº de preguntas"
            defaultValue={examen?.numPreguntas}
            updateValue={updateValue}
            isDisabled={!examen?.id}
            style={{ width: '100%' }}
          />
        </Flex>

        <InformationTextEditor
          name="descripcion"
          label="Descripción"
          updateValue={updateValue}
          defaultValue={examen?.descripcion}
          isDisabled={!examen?.id}
          style={{ width: '100%' }}
        />

        <InformationFilepond
          name="imagen"
          label="Portada"
          putEP={'/godAPI/examenes/' + examen?.id}
          isDisabled={!examen?.id}
          style={{ width: '100%' }}
        />
      </Flex>
    </Flex>
  );
};

const TabTestPreguntas = ({ examen }: { examen?: IExamen }) => {
  const [preguntas, setPreguntas] = useState<IPregunta[]>([]);

  useEffect(() => {
    refreshState();
  }, [examen]);

  const refreshState = async () => {
    const _preguntas = await getPreguntas({
      query: [{ examen_id: examen?.id }, { limit: 300 }],
      client: 'admin',
    });
    const res = _preguntas?.data || [];

    setPreguntas([...res]);
  };

  const onNewPregunta = async () => {
    if (!examen?.id) return Promise.reject('curso_id es indefinido');

    return await addPregunta({
      pregunta: {
        contenido: 'Pregunta nueva',
        examenId: examen.id,
        publicado: true,
      },
    }).then(() => refreshState());
  };

  const onNewRespuesta = async (preguntaId?: number) => {
    if (!preguntaId) return Promise.reject('preguntaId es indefinido');

    return await addRespuesta({
      respuesta: {
        contenido: 'Introduce tu texto...',
        correcta: false,
        preguntaId: preguntaId,
        publicado: true,
      },
    }).then(() => refreshState());
  };

  const onRemovePregunta = (preguntaId?: number) => {
    if (!preguntaId) return Promise.reject('preguntaId es indefinido');

    removePregunta({ id: preguntaId, client: 'admin' }).then(() => refreshState());
  };

  const onRemoveRespuesta = (respuestaId?: number) => {
    if (!respuestaId) return Promise.reject('respuestaId es indefinido');

    removeRespuesta({ id: respuestaId, client: 'admin' }).then(() => refreshState());
  };

  const onUpdatePregunta = (preguntaId?: number, value?: any) => {
    if (!preguntaId) return Promise.reject('preguntaId es indefinido');

    updatePregunta({ id: preguntaId, pregunta: value, client: 'admin' }).then(() => refreshState());
  };

  const onUpdateRespuesta = (respuestaId?: number, value?: any) => {
    if (!respuestaId) return Promise.reject('respuestaId es indefinido');

    updateRespuesta({
      id: respuestaId,
      respuesta: value,
      client: 'admin',
    }).then(() => refreshState());
  };

  const transformData = (preguntas: IPregunta[] = []): PreguntasItem[] => {
    return preguntas.map((pr: IPregunta) => ({
      title: pr.contenido,
      pretitle: 'Respuesta única',
      createTitle: 'Añadir respuesta',
      onCreateRespuesta: () => onNewRespuesta(pr.id),
      onDeletePregunta: () => onRemovePregunta(pr.id),
      onEditPregunta: (value: any) => onUpdatePregunta(pr.id, value),
      respuestas:
        pr.respuestas
          ?.sort((a, b) => +(a.id || 0) - +(b.id || 0)) // Si no ordenamos, cambian de orden por cada cambio.
          ?.map((resp: IRespuesta) => ({
            title: resp.contenido,
            isCheck: resp.correcta,
            onDeleteRespuesta: () => onRemoveRespuesta(resp.id),
            onEditRespuesta: (value: any) => onUpdateRespuesta(resp.id, value),
            onCheckRespuesta: () => onUpdateRespuesta(resp.id, { correcta: !resp.correcta }),
          })) || [],
    }));
  };

  return (
    <Flex direction="column" w="100%" gap="30px">
      <Flex w="100%" gap="30px" direction={{ lg: 'column', xl: 'row' }}>
        <InformationTestList
          onCreatePregunta={onNewPregunta}
          createTitle="Añadir Pregunta"
          preguntas={transformData(preguntas)}
          isDisabled={!examen}
        />
      </Flex>
    </Flex>
  );
};
