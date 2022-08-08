import { useNavigate } from 'react-router-dom';

import * as Yup from 'yup';
import { Form as FormikForm, Formik } from 'formik';
import { Button, useToast, Flex, Box } from '@chakra-ui/react';

import Step1 from './Step1';
import { onFailure, onSuccess } from 'ui';
import { addRuta, addProceso, ProcesoRemotoEnum, updateProceso } from 'data';

const VacantesForm = () => {
  const toast = useToast();
  const navigate = useNavigate();

  const formSteps = [{ step: 1, body: <Step1 /> }];

  const initialValues: any = {
    step: 1,
    titulo: '',
    descripcion: null,
    numPlazas: null,
    tipoPuesto: null,
    tipoContrato: null,
    salarioMin: null,
    salarioMax: null,
    localidad: '',
    remoto: null,
    bonificaciones: null,
    habilidades: [],
    ruta_id: null,
    publicado: true,
  };

  const validationSchema = Yup.object().shape({
    step: Yup.number().oneOf([1, 2, 3]).required(),
    titulo: Yup.string().required('¡El nombre es obligatorio!').typeError('El nombre es obligatorio.'),
    descripcion: Yup.string().required('¡La descripción es obligatoria!').typeError('El descripción es obligatoria.'),

    publicado: Yup.boolean().notRequired(),
    habilidades: Yup.array().of(Yup.number()).notRequired(),
    remoto: Yup.string()
      .oneOf([...Object.values(ProcesoRemotoEnum), null])
      .typeError('¡Selecciona un valor del listado!')
      .notRequired()
      .nullable(),

    numPlazas: Yup.number().required('¡El número de plazas es obligatorio!').typeError('El número de plazas es obligatorio.'),
    tipoPuesto: Yup.string().required('¡El tipo de puesto es obligatorio!').typeError('El tipo de puesto es obligatorio.'),
    tipoContrato: Yup.string()
      .required('¡El tipo de contrato es obligatorio!')
      .typeError('El tipo de puecontratosto es obligatorio.'),
    salarioMin: Yup.number().required('¡El salario mínimo es obligatorio!').typeError('El salario mínimo es obligatorio.'),
    salarioMax: Yup.number().required('¡El salario máximo es obligatorio!').typeError('El salario máximo es obligatorio.'),
    localidad: Yup.string().required('¡La localidad es obligatoria!').typeError('La localidad es obligatoria.'),
    bonificaciones: Yup.string()
      .required('¡Las bonificaciones son obligatorias!')
      .typeError('Las bonificaciones son obligatorias.'),
  });

  const submitForm = async (values: any) => {
    await addProceso({ proceso: values })
      .then(async (response: any) => {
        onSuccess(toast, `Proceso creado correctamente.`);

        await addRuta({
          ruta: {
            nombre: 'Hoja de ruta - ' + values.titulo,
            itinerario: '[]',
            privada: true,
          },
        }).then((res) => {
          const rutaId = res.value.data.id;

          updateProceso({
            id: response.value?.id,
            proceso: { rutaId: rutaId },
            client: 'admin',
          });
        });

        navigate(`/clientes/vacantes/${response.value?.data?.id || ''}`);
      })
      .catch((error: any) => {
        console.error('❌ Algo ha fallado...', { error });
        onFailure(toast, error.title, error.message);
      });
  };

  function onKeyDown(keyEvent: any) {
    if ((keyEvent.charCode || keyEvent.keyCode) === 13) keyEvent.stopPropagation();
  }

  return (
    <Flex boxSize="100%">
      <Formik onSubmit={submitForm} enableReinitialize initialValues={initialValues} validationSchema={validationSchema}>
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
              <Box h="100%" overflow="auto">
                {formSteps[values.step - 1].body}
              </Box>

              <Flex bg="#f4f5f6" align="center" justify="space-between" p="15px 30px" h="90px">
                <div />

                <Flex gap="16px" fontSize="16px" fontWeight="semibold">
                  {formSteps.map(({ step }) => (
                    <Flex key={'form-step-' + step} align="center" cursor="pointer" onClick={() => setFieldValue('step', step)}>
                      {values.step === step ? (
                        <Flex bg="#3182FC" color="#E4EFFF" rounded="50%" boxSize="32px" align="center" justify="center">
                          {step}
                        </Flex>
                      ) : (
                        <Flex color="#3182FC" bg="#E4EFFF" rounded="50%" boxSize="32px" align="center" justify="center">
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
                  Crear nuevo proceso
                </Button>
              </Flex>
            </FormikForm>
          );
        }}
      </Formik>
    </Flex>
  );
};

export default VacantesForm;
