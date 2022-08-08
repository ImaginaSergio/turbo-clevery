import { useNavigate } from 'react-router-dom';

import * as Yup from 'yup';
import { Form as FormikForm, Formik } from 'formik';
import { Box, Button, useToast, Flex } from '@chakra-ui/react';

import { FormInput, FormSelect, FormAsyncSelect, FormTextarea } from '../../../../shared/components';
import { FormTextEditor } from 'ui';
import { onFailure, onSuccess } from 'ui';
import { CursoNivelEnum, addCurso, getUsers } from 'data';

const CursosForm = () => {
  const toast = useToast();
  const navigate = useNavigate();

  const formSteps = [{ step: 1, body: <Step1 /> }];

  const initialValues: any = {
    step: 1,
    titulo: '',
    descripcion: '',
    publicado: true,
    icono: null,
    profesorId: null,
    nivel: null,
    extra: false,
  };

  const validationSchema = Yup.object().shape({
    step: Yup.number().oneOf([1, 2, 3]).required(),
    titulo: Yup.string().required('¡El título del curso es obligatorio!').typeError('¡El título del curso es obligatorio.'),
    descripcion: Yup.string()
      .required('¡La descripción del curso es obligatoria!')
      .typeError('¡La descripción del curso es obligatoria!'),
    publicado: Yup.boolean().notRequired(),
    extra: Yup.boolean().notRequired(),
    icono: Yup.string().required('El icono del curso es obligatorio.').typeError('El icono del curso es obligatorio.'),
    profesorId: Yup.number().notRequired().nullable(),
    nivel: Yup.string()
      .oneOf(Object.values(CursoNivelEnum))
      .required('El nivel del curso es obligatorio.')
      .typeError('El nivel del curso es obligatorio.'),
  });

  const submitForm = async (values: any) => {
    const curso = {
      titulo: values.titulo,
      descripcion: values.descripcion,
      publicado: values.publicado,
      disponible: false,
      icono: values.icono,
      profesorId: values.profesorId,
      nivel: values.nivel,
      extra: values.extra,
    };

    await addCurso({ curso })
      .then(async (response: any) => {
        onSuccess(toast, `Curso creado correctamente.`);
        navigate(`/contenidos/cursos/${response.value?.data?.id || ''}`);
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
                overflow: 'hidden',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <Box h="100%" overflow="auto">
                {formSteps[values.step - 1].body}
              </Box>

              <Flex h="90px" bg="#f4f5f6" p="15px 30px" align="center" justify="space-between">
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
                  Crear nuevo curso
                </Button>
              </Flex>
            </FormikForm>
          );
        }}
      </Formik>
    </Flex>
  );
};

export default CursosForm;

const Step1 = () => {
  const loadProfesores = async (value: string) => {
    if (value.includes('@')) {
      const _usuarios = await getUsers({
        query: [{ email: value }],
        client: 'admin',
      });

      return _usuarios?.data?.map((user: any) => ({
        value: user.id,
        label: user.email,
      }));
    } else {
      const _usuarios = await getUsers({
        query: [{ nombre: value }],
        client: 'admin',
      });

      return _usuarios?.data?.map((user: any) => ({
        value: user.id,
        label: (user?.nombre || ' ') + ' ' + (user?.apellidos || ' '),
      }));
    }
  };

  return (
    <Flex bg="#fff" boxSize="100%" p="30px">
      <Flex direction="column" w="20%" mr="30px" gap="20px">
        <FormInput name="titulo" label="Título del curso" isRequired placeholder="Introduce el título del curso" />

        <FormAsyncSelect
          name="profesorId"
          label="Profesor del curso"
          isRequired
          placeholder="Escribe para buscar"
          loadOptions={loadProfesores}
        />

        <FormSelect
          name="nivel"
          label="Nivel del curso"
          isRequired
          placeholder="Selecciona una opción"
          options={Object.values(CursoNivelEnum)
            .filter((v) => v !== 'extra')
            .map((v) => ({ label: v, value: v }))}
        />

        <FormSelect
          name="publicado"
          label="Curso publicado"
          placeholder="Selecciona una opción"
          options={[
            { label: 'Publicado', value: true },
            { label: 'Oculto', value: false },
          ]}
        />

        <FormSelect
          name="extra"
          label="Curso extra"
          placeholder="Selecciona una opción"
          options={[
            { label: 'Sí', value: true },
            { label: 'No', value: false },
          ]}
        />
      </Flex>

      <Flex direction="column" h="100%" w="80%" rowGap="20px">
        <FormTextEditor name="descripcion" label="Descripción del curso" isRequired placeholder="Introduce una descripción" />

        <FormTextarea name="icono" label="Icono del curso" isRequired placeholder="Introduce un icono como svg" />
      </Flex>
    </Flex>
  );
};
