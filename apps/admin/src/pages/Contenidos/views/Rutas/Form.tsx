import { useNavigate } from 'react-router-dom';

import * as Yup from 'yup';
import { Form as FormikForm, Formik } from 'formik';
import { Button, useToast, Flex } from '@chakra-ui/react';

import { addRuta } from '@clevery/data';
import { FormTextEditor } from '@clevery/ui';
import { onFailure, onSuccess } from '@clevery/utils';

import {
  FormInput,
  FormSelect,
  FormTextarea,
} from '../../../../shared/components';

const RutasForm = () => {
  const toast = useToast();
  const navigate = useNavigate();

  const formSteps = [{ step: 1, body: <Step1 /> }];

  const initialValues: any = {
    step: 1,
    nombre: '',
    icono: '',
    description: '',
    privada: true,
  };

  const validationSchema = Yup.object().shape({
    step: Yup.number().oneOf([1, 2, 3]).required(),
    nombre: Yup.string()
      .required('¡El nombre es obligatorio!')
      .typeError('El nombre es obligatorio.'),
    icono: Yup.string().notRequired(),
    descripcion: Yup.string()
      .required('La descripción es obligatoria!')
      .typeError('La descripción es obligatoria.'),
    privada: Yup.boolean().notRequired(),
  });

  const submitForm = async (values: any) => {
    const ruta = {
      icono: values.icono,
      nombre: values.nombre,
      privada: values.privada,
      descripcion: values.descripcion,
      itinerario: '[]',
    };

    await addRuta({ ruta })
      .then((response: any) => {
        onSuccess(toast, `Ruta creada correctamente.`);
        navigate(`/contenidos/rutas/${response.value?.data?.id || ''}`);
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
              {formSteps[values.step - 1].body}

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
                  Crear nueva ruta
                </Button>
              </Flex>
            </FormikForm>
          );
        }}
      </Formik>
    </Flex>
  );
};

export default RutasForm;

const Step1 = () => {
  return (
    <Flex bg="#fff" boxSize="100%" p="30px">
      <Flex direction="column" w="20%" mr="30px" gap="20px">
        <FormInput
          name="nombre"
          label="Nombre"
          isRequired
          placeholder="Escribe un nombre"
        />

        <FormSelect
          name="privada"
          label="Visibilidad"
          isRequired
          placeholder="Elige una opción del listado"
          defaultValue={{ label: 'Privada', value: true }}
          options={[
            { label: 'Pública', value: false },
            { label: 'Privada', value: true },
          ]}
        />
      </Flex>

      <Flex direction="column" h="100%" w="80%" rowGap="20px">
        <FormTextEditor
          name="descripcion"
          label="Descripción"
          isRequired
          placeholder="Introduce una descripción."
        />

        <FormTextarea
          name="icono"
          label="Icono"
          placeholder="Introduce un icono como svg."
        />
      </Flex>
    </Flex>
  );
};
