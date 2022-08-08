import { useNavigate } from 'react-router-dom';

import * as Yup from 'yup';
import { Form as FormikForm, Formik } from 'formik';
import { Button, useToast, Flex, Box, Center } from '@chakra-ui/react';

import { addNoticia } from '@clevery/data';
import { onFailure, onSuccess } from '@clevery/utils';

import Step1 from './Step1';

const NoticiasForm = () => {
  const toast = useToast();
  const navigate = useNavigate();

  const formSteps = [{ step: 1, body: <Step1 /> }];

  const initialValues: any = {
    step: 1,
    titulo: '',
    contenido: null,
    publicado: true,
    descripcionCorta: null,
    autorId: null,
    cursoId: null,
  };

  const validationSchema = Yup.object().shape({
    step: Yup.number().oneOf([1, 2, 3]).required(),
    titulo: Yup.string()
      .required('¡El título es obligatorio!')
      .typeError('El título es obligatorio.'),
    descripcionCorta: Yup.string()
      .required('El contenido es obligatorio!')
      .typeError('El contenido es obligatorio.'),
    contenido: Yup.string()
      .required('¡La descripción es obligatoria!')
      .typeError('El descripción es obligatoria.'),
    publicado: Yup.boolean().notRequired(),
    cursoId: Yup.number().notRequired().nullable(),
  });

  const submitForm = async (values: any) => {
    await addNoticia({ noticia: values })
      .then(async (response: any) => {
        onSuccess(toast, `Noticia creada correctamente.`);
        navigate(`/miscelanea/noticias/${response.value?.data?.id || ''}`);
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
              <Box h="100%" overflow="auto">
                {formSteps[values.step - 1].body}
              </Box>

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
                        <Center
                          bg="#3182FC"
                          rounded="50%"
                          boxSize="32px"
                          color="#E4EFFF"
                        >
                          {step}
                        </Center>
                      ) : (
                        <Center
                          bg="#E4EFFF"
                          rounded="50%"
                          boxSize="32px"
                          color="#3182FC"
                        >
                          {step}
                        </Center>
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
                  Crear nueva Noticia
                </Button>
              </Flex>
            </FormikForm>
          );
        }}
      </Formik>
    </Flex>
  );
};

export default NoticiasForm;
