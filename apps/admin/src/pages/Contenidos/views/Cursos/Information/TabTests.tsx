import { useEffect, useState } from 'react';

import {
  Box,
  Flex,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react';

import { fmtMnts } from '@clevery/utils';
import { ICurso, IExamen, IPregunta, IRespuesta } from '@clevery/data';
import {
  InformationDragDropList,
  InformationInput,
  ListItemProps,
  InformationTestList,
  PreguntasItem,
  InformationTextEditor,
  InformationFilepond,
} from '../../../../../shared/components';

import {
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
} from '@clevery/data';

type TabTestsProps = {
  curso: ICurso;
};

export const TabTests = ({ curso }: TabTestsProps) => {
  const [test, setTest] = useState<IExamen>();
  const [tests, setTests] = useState<IExamen[]>([]);

  useEffect(() => {
    refreshState();
  }, [curso?.id]);

  const refreshState = async () => {
    const _tests = await getExamenes({
      client: 'admin',
      query: [
        { limit: 100 },
        { curso_id: curso?.id },
        { es_certificacion: false },
      ],
    });

    setTests(_tests?.data || []);
  };

  const updateTestValue = (value: any) => {
    if (!test?.id) return Promise.reject('test_id es indefinido');

    return updateExamen({ id: test.id, examen: value, client: 'admin' }).then(
      () => refreshState()
    );
  };

  const onNewTest = async () => {
    if (!curso?.id) return Promise.reject('curso_id es indefinido');

    return await addExamen({
      examen: {
        nombre: `Test de ${curso.titulo} - ${Math.floor(Math.random() * 100)}`,
        cursoId: curso.id,
        publicado: true,
        esCertificacion: false,
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

  const transformTestsToDnDItems = (tests: IExamen[] = []): ListItemProps[] => {
    return tests.map((examen: IExamen) => ({
      title: examen.nombre,
      showIndex: false,
      foot: fmtMnts(examen.duracion || 0),
      onClick: () => setTest(examen),
      onDelete: () => onRemoveTest(examen),
    }));
  };

  return (
    <Flex
      p="30px"
      gap="30px"
      boxSize="100%"
      overflow="auto"
      direction={{ base: 'column', lg: 'row' }}
    >
      <Flex direction="column" minW="400px" gap="30px">
        <Flex minH="fit-content" w="100%" direction="column" rowGap="8px">
          <Box fontSize="18px" fontWeight="semibold">
            Tests del curso
          </Box>

          <Box fontSize="14px" fontWeight="medium" color="#84889A">
            Añade los tests y exámenes del curso en este apartado.
          </Box>
        </Flex>

        <InformationDragDropList
          label="Listado de tests"
          onCreate={onNewTest}
          createTitle="Añadir test"
          allowOpen={false}
          items={transformTestsToDnDItems(tests)}
        />
      </Flex>

      <Flex direction="column" w="100%" gap="30px">
        <Flex minH="fit-content" w="100%" direction="column" rowGap="8px">
          <Box fontSize="18px" fontWeight="semibold">
            {test
              ? `Contenido del test - ${test.nombre}`
              : 'Sin test seleccionado'}
          </Box>

          <Box fontSize="14px" fontWeight="medium" color="#84889A">
            Revisa los ajustes y preguntas del test seleccionado.
          </Box>
        </Flex>

        {!test ? (
          <Box>Por favor, escoge un test del listado.</Box>
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
                Detalles del test
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
                Preguntas del test ({test?.meta?.total_preguntas || 0})
              </Tab>
            </TabList>

            <TabPanels>
              <TabPanel p="30px 0px">
                <TabTestDetalles test={test} updateValue={updateTestValue} />
              </TabPanel>

              <TabPanel p="30px 0px">
                <TabTestPreguntas test={test} />
              </TabPanel>
            </TabPanels>
          </Tabs>
        )}
      </Flex>
    </Flex>
  );
};

const TabTestDetalles = ({
  test,
  updateValue,
}: {
  test?: IExamen;
  updateValue: (value: any) => void;
}) => {
  return (
    <Flex w="100%" gap="30px" direction={{ md: 'column', xl: 'row' }}>
      <Flex direction="column" w="100%" gap="30px">
        <Flex w="100%" gap="30px" direction={{ lg: 'column', xl: 'row' }}>
          <InformationInput
            name="nombre"
            label="Nombre del test"
            defaultValue={test?.nombre}
            updateValue={updateValue}
            isDisabled={!test}
            style={{ width: '100%' }}
          />

          <InformationInput
            name="duracion"
            label="Duración del Test"
            defaultValue={test?.duracion}
            updateValue={updateValue}
            isDisabled={!test}
            style={{ width: '100%' }}
          />
        </Flex>

        <Flex w="100%" gap="30px" direction={{ lg: 'column', xl: 'row' }}>
          <InformationInput
            type="number"
            name="numIntentos"
            label="Nº de intentos"
            defaultValue={test?.numIntentos}
            updateValue={updateValue}
            isDisabled={!test}
            style={{ width: '100%' }}
          />

          <InformationInput
            type="number"
            name="numPreguntas"
            label="Nº de preguntas"
            defaultValue={test?.numPreguntas}
            updateValue={updateValue}
            isDisabled={!test}
            style={{ width: '100%' }}
          />
        </Flex>

        <Flex w="100%">
          <InformationTextEditor
            name="descripcion"
            label="Descripción"
            defaultValue={test?.descripcion}
            updateValue={updateValue}
            isDisabled={!test}
            style={{ width: '100%' }}
          />
        </Flex>
      </Flex>

      <Flex w="100%">
        <InformationFilepond
          name="imagen"
          label="Portada"
          putEP={'/godAPI/examenes/' + test?.id}
          isDisabled={!test?.id}
          style={{ width: '100%' }}
        />
      </Flex>
    </Flex>
  );
};

const TabTestPreguntas = ({ test }: { test?: IExamen }) => {
  const [preguntas, setPreguntas] = useState<IPregunta[]>([]);

  useEffect(() => {
    refreshState();
  }, [test]);

  const refreshState = async () => {
    const _preguntas = await getPreguntas({
      client: 'admin',
      query: [{ examen_id: test?.id }, { limit: 100 }],
    });

    setPreguntas([...(_preguntas?.data || [])]);
  };

  const onNewPregunta = async () => {
    if (!test?.id) return Promise.reject('curso_id es indefinido');

    return await addPregunta({
      pregunta: {
        contenido: 'Pregunta nueva',
        examenId: test.id,
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

    removePregunta({ id: preguntaId, client: 'admin' }).then(() =>
      refreshState()
    );
  };

  const onRemoveRespuesta = (respuestaId?: number) => {
    if (!respuestaId) return Promise.reject('respuestaId es indefinido');

    removeRespuesta({ id: respuestaId, client: 'admin' }).then(() =>
      refreshState()
    );
  };

  const onUpdatePregunta = (preguntaId?: number, value?: any) => {
    if (!preguntaId) return Promise.reject('preguntaId es indefinido');

    updatePregunta({ id: preguntaId, pregunta: value, client: 'admin' }).then(
      () => refreshState()
    );
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
            onCheckRespuesta: () =>
              onUpdateRespuesta(resp.id, { correcta: !resp.correcta }),
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
          isDisabled={!test}
        />
      </Flex>
    </Flex>
  );
};
