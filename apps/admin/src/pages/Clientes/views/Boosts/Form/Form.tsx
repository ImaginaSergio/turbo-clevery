import { useNavigate } from 'react-router-dom';

import * as Yup from 'yup';
import { Form as FormikForm, Formik } from 'formik';
import { Button, useToast, Flex, Box } from '@chakra-ui/react';

import Step1 from './Step1';
import { onFailure, onSuccess } from '@clevery/utils';
import {
  addRuta,
  addBoost,
  BoostRemotoEnum,
  updateBoost,
  BoostJornadaEnum,
} from '@clevery/data';

const BoostsForm = () => {
  const toast = useToast();
  const navigate = useNavigate();

  const formSteps = [{ step: 1, body: <Step1 /> }];

  const initialValues: any = {
    step: 1,
    titulo: '',
    descripcion: null,
    salarioMin: null,
    salarioMax: null,
    icono: null,
    pais: null,
    estado: null,
    empresaId: null,
    remoto: null,
    jornada: null,
    certificacionesRequeridas: [],
  };

  const validationSchema = Yup.object().shape({
    step: Yup.number().oneOf([1, 2, 3]).required(),
    titulo: Yup.string()
      .required('¡El título es obligatorio!')
      .typeError('El título es obligatorio.'),
    descripcion: Yup.string()
      .required('¡La descripción es obligatoria!')
      .typeError('El descripción es obligatoria.'),
    certificacionesRequeridas: Yup.array().of(Yup.number()).notRequired(),
    remoto: Yup.string()
      .oneOf([...Object.values(BoostRemotoEnum), null])
      .typeError('¡Selecciona un valor del listado!')
      .notRequired()
      .nullable(),
    jornada: Yup.string()
      .oneOf([...Object.values(BoostJornadaEnum), null])
      .typeError('¡Selecciona un valor del listado!')
      .notRequired()
      .nullable(),
    salarioMin: Yup.number()
      .required('¡El salario mínimo es obligatorio!')
      .typeError('El salario mínimo es obligatorio.'),
    salarioMax: Yup.number()
      .required('¡El salario máximo es obligatorio!')
      .typeError('El salario máximo es obligatorio.'),
    pais: Yup.object().notRequired().nullable(),
    estado: Yup.object().notRequired().nullable(),
    icono: Yup.string().notRequired().nullable(),
  });

  const submitForm = async ({ step, pais, estado, ...values }: any) => {
    let rutaBoost = await addRuta({
      ruta: {
        nombre: 'Hoja de ruta del Boost - ' + values.titulo,
        itinerario: '[]',
        privada: true,
      },
    }).then((res) => res.value.data);

    if (rutaBoost?.id)
      await addBoost({
        boost: {
          ...values,
          publicado: false,
          paisId: pais.id,
          estadoId: estado.id,
          rutaId: rutaBoost.id,
        },
      })
        .then(async (response: any) => {
          onSuccess(toast, `Boost creado correctamente.`);

          navigate(`/clientes/boosts/${response.value?.data?.id || ''}`);
        })
        .catch((error: any) => {
          console.error('❌ Algo ha fallado...', { error });
          onFailure(toast, error.title, error.message);
        });
    else
      onFailure(
        toast,
        'Error al crear el boost',
        'No se ha podido crear correctamente la hoja de ruta. Por favor, contacte con soporte.'
      );
  };

  function onKeyDown(keyEvent: any) {
    if ((keyEvent.charCode || keyEvent.keyCode) === 13)
      keyEvent.stopPropagation();
  }

  return (
    <Flex boxSize="100%">
      <Formik
        onSubmit={submitForm}
        enableReinitialize
        initialValues={initialValues}
        validationSchema={validationSchema}
      >
        {(formik) => {
          const { values, handleSubmit, setFieldValue } = formik;

          return (
            <FormikForm
              onSubmit={handleSubmit}
              onKeyDown={onKeyDown}
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <Box h="100%" overflow="auto">{formSteps[values.step - 1].body}</Box>

              <Flex
                h="90px"
                bg="#f4f5f6"
                p="15px 30px"
                align="center"
                justify="space-between"
              >
                <div />

                <Flex gap="16px" fontSize="16px" fontWeight="semibold">
                  {formSteps.map(({ step }) => (
                    <Flex
                      key={'form-step-' + step}
                      align="center"
                      cursor="pointer"
                      onClick={() => setFieldValue('step', step)}
                    >
                      {values.step === step ? (
                        <Flex
                          bg="#3182FC"
                          color="#E4EFFF"
                          rounded="50%"
                          boxSize="32px"
                          align="center"
                          justify="center"
                        >
                          {step}
                        </Flex>
                      ) : (
                        <Flex
                          color="#3182FC"
                          bg="#E4EFFF"
                          rounded="50%"
                          boxSize="32px"
                          align="center"
                          justify="center"
                        >
                          {step}
                        </Flex>
                      )}
                    </Flex>
                  ))}
                </Flex>

                <Button
                  isDisabled={values.step !== formSteps.length}
                  bgColor="#3182FC"
                  color="#fff"
                  py="6"
                  w="fit-content"
                  type="submit"
                >
                  Crear nuevo boost
                </Button>
              </Flex>
            </FormikForm>
          );
        }}
      </Formik>
    </Flex>
  );
};

export default BoostsForm;
