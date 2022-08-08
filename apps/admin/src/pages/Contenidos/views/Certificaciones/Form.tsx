import { useNavigate } from 'react-router-dom';

import * as Yup from 'yup';
import { Form as FormikForm, Formik } from 'formik';
import { Button, useToast, Flex } from '@chakra-ui/react';

import {
  getCursos,
  addHabilidad,
  getHabilidades,
  addCertificacion,
} from '@clevery/data';
import { FormTextEditor } from '@clevery/ui';
import { onFailure, onSuccess } from '@clevery/utils';

import {
  FormInput,
  FormSelect,
  FormAsyncSelect,
  FormAsyncCreatableSelect,
} from '../../../../shared/components';

const CertificacionesForm = () => {
  const toast = useToast();
  const navigate = useNavigate();

  const formSteps = [{ step: 1, body: <Step1 /> }];

  const initialValues: any = {
    step: 1,
    nombre: '',
    descripcion: '',
    publicado: true,
    habilidadId: null,
    nivel: null,
  };

  const validationSchema = Yup.object().shape({
    step: Yup.number().oneOf([1, 2, 3]).required(),
    nombre: Yup.string()
      .required('¡El título es obligatorio!')
      .typeError('El título es obligatorio.'),
    descripcion: Yup.string()
      .required('La descripción es obligatoria.')
      .typeError('La descripción es obligatoria.'),
    habilidadId: Yup.number()
      .required('La habilidad asociada es obligatoria.')
      .typeError('La habilidad asociada es obligatoria.'),
    cursoId: Yup.number()
      .required('El curso asociado es obligatorio.')
      .typeError('El curso asociado es obligatorio.'),
    nivel: Yup.number()
      .required('El nivel es obligatorio.')
      .typeError('El nivel es obligatorio.'),
    publicado: Yup.boolean().notRequired(),
  });

  const submitForm = async (values: any) => {
    const certificacion = {
      disponible: false,
      nivel: values.nivel,
      nombre: values.nombre,
      cursoId: values.cursoId,
      publicado: values.publicado,
      descripcion: values.descripcion,
      habilidadId: values.habilidadId,
    };

    await addCertificacion({ certificacion, client: 'admin' })
      .then(async (response) => {
        onSuccess(toast, `Certificación creada correctamente.`);
        navigate(
          `/contenidos/certificaciones/${response.value?.data?.id || ''}`
        );
      })
      .catch((error) => {
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
                  py="6"
                  type="submit"
                  w="fit-content"
                  color="#fff"
                  bgColor="#3182FC"
                  isDisabled={values.step !== formSteps.length}
                >
                  Crear nueva certificación
                </Button>
              </Flex>
            </FormikForm>
          );
        }}
      </Formik>
    </Flex>
  );
};

export default CertificacionesForm;

const Step1 = () => {
  const toast = useToast();

  const loadCursos = async (value: string) => {
    const _cursos = await getCursos({
      client: 'admin',
      treatData: false,
      query: [{ titulo: value }],
    });

    return _cursos?.data?.map((curso: any) => ({
      value: curso.id,
      label: curso.titulo,
    }));
  };

  const loadHabilidades = async (value: string) => {
    const _habilidades = await getHabilidades({
      client: 'admin',
      query: [{ nombre: value }],
    });

    return _habilidades?.data?.map((hab: any) => ({
      value: hab.id,
      label: hab.nombre,
    }));
  };

  const onCreateHabilidad = (e: any) => {
    return addHabilidad({ habilidad: { nombre: e?.nombre, publicado: true } })
      .then((response: any) => ({
        value: response.value?.data?.id,
        label: response.value?.data?.nombre,
      }))
      .catch((error: any) => {
        console.error('❌ Algo ha fallado al crear...', { error });
        onFailure(toast, error.title, error.message);

        return undefined;
      });
  };

  return (
    <Flex bg="#fff" boxSize="100%" p="30px">
      <Flex direction="column" w="20%" mr="30px" rowGap="20px">
        <FormInput
          isRequired
          name="nombre"
          label="Nombre de la certificación"
        />

        <FormAsyncSelect
          isRequired
          name="cursoId"
          label="Curso relacionado"
          placeholder="Escribe para buscar"
          loadOptions={loadCursos}
        />

        <FormAsyncCreatableSelect
          isRequired
          isClearable
          name="habilidadId"
          label="Habilidad relacionada"
          placeholder="Escribe para buscar"
          loadOptions={loadHabilidades}
          onCreateOption={(nombre: any) =>
            onCreateHabilidad({ nombre: nombre })
          }
        />

        <FormSelect
          isRequired
          name="nivel"
          label="Nivel de la certificación"
          placeholder="Selecciona una opción"
          options={[
            { label: 'Nivel Inicial (1)', value: 1 },
            { label: 'Nivel Intermedio (2)', value: 2 },
            { label: 'Nivel Avanzado (3)', value: 3 },
          ]}
        />

        <FormSelect
          name="publicado"
          label="Certificación publicada"
          placeholder="Selecciona una opción"
          options={[
            { label: 'Publicado', value: true },
            { label: 'Oculto', value: false },
          ]}
        />
      </Flex>

      <Flex direction="column" h="100%" w="80%" rowGap="20px">
        <FormTextEditor
          isRequired
          name="descripcion"
          label="Descripción de la certificación"
        />
      </Flex>
    </Flex>
  );
};
