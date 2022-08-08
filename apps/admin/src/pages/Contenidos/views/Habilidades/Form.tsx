import { useNavigate } from 'react-router-dom';

import * as Yup from 'yup';
import { Form as FormikForm, Formik } from 'formik';
import { Button, useToast, Flex } from '@chakra-ui/react';

import { addHabilidad, getHabilidades } from '@clevery/data';
import { onFailure, onSuccess } from '@clevery/utils';
import {
  FormAsyncSelect,
  FormInput,
  FormSelect,
  FormTextarea,
} from '../../../../shared/components';

const HabilidadesForm = () => {
  const toast = useToast();
  const navigate = useNavigate();

  const formSteps = [{ step: 1, body: <Step1 /> }];

  const initialValues: any = {
    step: 1,
    icono: '',
    nombre: '',
    publicado: true,
    superiorId: null,
  };

  const validationSchema = Yup.object().shape({
    step: Yup.number().oneOf([1, 2, 3]).required(),
    nombre: Yup.string()
      .required('¡El nombre es obligatorio!')
      .typeError('El nombre es obligatorio.'),
    publicado: Yup.boolean().notRequired().nullable(),
    superiorId: Yup.number().notRequired().nullable(),
    icono: Yup.string().notRequired().nullable(),
  });

  const submitForm = async (values: any) => {
    const habilidad = {
      icono: values.icono,
      nombre: values.nombre,
      publicado: values.publicado,
      superiorId: values.superiorId,
    };

    await addHabilidad({ habilidad })
      .then((response: any) => {
        onSuccess(toast, `Habilidad creada correctamente.`);
        navigate(`/contenidos/habilidades/${response.value?.data?.id || ''}`);
      })
      .catch((error: any) => {
        console.error('❌ Algo ha fallado...', { error });
        onFailure(toast, error.title, error.message);
      });
  };

  function onKeyDown(keyEvent: any) {
    if ((keyEvent.charCode || keyEvent.keyCode) === 13)
      keyEvent.stopPropagation();
  }

  return (
    <Flex boxSize="100%">
      <Formik
        enableReinitialize
        onSubmit={submitForm}
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
              {formSteps[values.step - 1].body}

              <Flex
                bg="#f4f5f6"
                align="center"
                justify="space-between"
                p="15px 30px"
                h="90px"
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
                  Crear nueva habilidad
                </Button>
              </Flex>
            </FormikForm>
          );
        }}
      </Formik>
    </Flex>
  );
};

export default HabilidadesForm;

const Step1 = () => {
  const loadHabilidadesByNombre = async (value: any) => {
    const _habilidades = await getHabilidades({
      client: 'admin',
      query: [{ nombre: value }],
    });

    return _habilidades?.data?.map((hab: any) => ({
      value: hab.id,
      label: hab.nombre,
    }));
  };

  return (
    <Flex bg="#fff" boxSize="100%" p="30px">
      <Flex direction="column" w="100%" gap="20px">
        <FormInput name="nombre" label="Nombre de la habilidad" isRequired />

        <FormSelect
          name="publicado"
          label="Habilidad publicada"
          placeholder="Selecciona una de la lista"
          options={[
            { label: 'Publicado', value: true },
            { label: 'Oculto', value: false },
          ]}
        />

        <FormAsyncSelect
          name="superiorId"
          label="Habilidad superior"
          placeholder="Escribe para buscar"
          loadOptions={loadHabilidadesByNombre}
        />

        <FormTextarea
          name="icono"
          label="Icono de la habilidad"
          isRequired
          placeholder="Introduce un icono como svg"
        />
      </Flex>
    </Flex>
  );
};
