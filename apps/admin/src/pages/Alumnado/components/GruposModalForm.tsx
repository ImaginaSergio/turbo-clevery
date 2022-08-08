import * as Yup from 'yup';
import { Form as FormikForm, Formik } from 'formik';
import { BiX, BiUser, BiGroup } from 'react-icons/bi';
import { useToast, Icon, Flex, Modal, Button, ModalBody, ModalHeader, ModalContent, ModalOverlay, Box } from '@chakra-ui/react';

import { addGrupo, getRutas } from 'data';
import { onFailure, onSuccess } from 'ui';
import { FormAsyncSelect, FormInput, FormTextarea } from '../../../shared/components';

export default function GruposModalForm({ state }: { state: { isOpen: boolean; onClose: () => void } }) {
  const toast = useToast();

  const validationSchema = Yup.object().shape({
    tipo: Yup.string().oneOf(['en_masa', 'individual']).required(),
    nombre: Yup.string().when('tipo', {
      is: 'en_masa',
      then: Yup.string().notRequired().nullable(),
      otherwise: Yup.string()
        .min(2, '¡El nombre del grupo es demasiado corto!')
        .required('El nombre de grupo es obligatorio.')
        .typeError('El nombre de grupo es obligatorio.'),
    }),
    descripcion: Yup.string().when('tipo', {
      is: 'en_masa',
      then: Yup.string().notRequired().nullable(),
      otherwise: Yup.string()
        .min(2, '¡La descripción del grupo es demasiado corta!')
        .required('La descripción del grupo es obligatoria.')
        .typeError('La descripción del grupo es obligatoria.'),
    }),
    grupos: Yup.string().when('tipo', {
      is: 'individual',
      then: Yup.string().notRequired().nullable(),
      otherwise: Yup.string()
        .required('El listado de grupos es obligatorio.')
        .typeError('El listado de grupos es obligatorio.'),
    }),
    rutaId: Yup.number().required(),
  });

  const initialValues = {
    tipo: 'en_masa',
    nombre: '',
    descripcion: '',
    grupos: '',
    rutaId: 1,
  };

  const loadRutas = async (value: string) => {
    const _rutas = await getRutas({
      query: [{ nombre: value }, { limit: 1000 }],
      client: 'admin',
    });

    return _rutas?.data?.map((ruta: any) => ({
      value: ruta.id,
      label: ruta.nombre,
    }));
  };

  const submitForm = async (values: any) => {
    if (values.tipo === 'individual') {
      const grupo = {
        nombre: values.nombre,
        descripcion: values.descripcion,
        rutaId: values.rutaId,
      };

      addGrupo({ grupo })
        .then((e) => {
          onSuccess(toast, e.message);
          state.onClose();
        })
        .catch((error: any) => {
          console.error('❌ Algo ha fallado...', error);
          onFailure(toast, error.title, error.message);
        });
    } else {
      const userPromises = [];
      const grupos: { descripcion: string; nombre: string; rutaId: number }[] = [];

      values.grupos.split('\n').map((groupRaw: string) => {
        const user = groupRaw.split(',');

        if (user?.length > 0) {
          grupos.push({
            nombre: user[0]?.trimStart(),
            descripcion: user[1]?.trimStart(),
            rutaId: values.rutaId,
          });
        }
      });

      for (const grupo of grupos) {
        userPromises.push(
          addGrupo({ grupo }).catch((error: any) => {
            console.error('❌ Algo ha fallado...', { error });
            onFailure(toast, 'Error al subir: ' + grupo.nombre, error.message);
          })
        );
      }

      Promise.all([...userPromises]).then(() => {
        state.onClose();
      });
    }
  };

  function onKeyDown(keyEvent: any) {
    if ((keyEvent.charCode || keyEvent.keyCode) === 13) keyEvent.stopPropagation();
  }

  return (
    <Modal onClose={state.onClose} isOpen={state.isOpen} isCentered>
      <ModalOverlay />

      <ModalContent maxW="56em" maxH="56em">
        <ModalHeader p="30px 30px 0px">
          <Flex justify="space-between" align="center">
            <Box fontSize="19px">Añadir grupos</Box>

            <Icon as={BiX} boxSize="32px" cursor="pointer" onClick={state.onClose} />
          </Flex>
        </ModalHeader>

        <Formik onSubmit={submitForm} initialValues={initialValues} validationSchema={validationSchema}>
          {(formik) => {
            const { values, handleSubmit, setFieldValue } = formik;

            return (
              <FormikForm onSubmit={handleSubmit} onKeyDown={onKeyDown}>
                <ModalBody p="30px">
                  <Flex direction="column" gap="30px">
                    <Flex bg="#F0F1F5" p="4px" rounded="8px" fontWeight="semibold">
                      <Button
                        w="100%"
                        rounded="6px"
                        _focus={{ boxShadow: 'none' }}
                        onClick={() => setFieldValue('tipo', 'en_masa')}
                        bg={values.tipo === 'en_masa' ? 'primary' : 'white'}
                        color={values.tipo === 'en_masa' ? 'white' : 'dark'}
                        leftIcon={<Icon as={BiGroup} boxSize="22px" />}
                      >
                        En masa
                      </Button>

                      <Button
                        w="100%"
                        rounded="6px"
                        _focus={{ boxShadow: 'none' }}
                        onClick={() => setFieldValue('tipo', 'individual')}
                        bg={values.tipo === 'individual' ? 'primary' : 'white'}
                        color={values.tipo === 'individual' ? 'white' : 'dark'}
                        leftIcon={<Icon as={BiUser} boxSize="22px" />}
                      >
                        Individual
                      </Button>
                    </Flex>

                    {values.tipo === 'en_masa' ? (
                      <FormTextarea
                        name="grupos"
                        label="Grupos"
                        placeholder={`Nombre del grupo 1, Descripción del grupo 1\nNombre del grupo 2, Descripción del grupo 2\nNombre del grupo 3, Descripción del grupo 3\n...`}
                      />
                    ) : (
                      <>
                        <FormInput isRequired name="nombre" label="Nombre" placeholder="Introduce un nombre" />

                        <FormTextarea name="descripcion" label="Descripción" placeholder="Introduce la descripción" />
                      </>
                    )}

                    <FormAsyncSelect
                      isRequired
                      name="rutaId"
                      label="Selecciona la hoja de ruta"
                      loadOptions={loadRutas}
                      placeholder="Escribe para buscar"
                    />

                    <Button w="100%" bg="primary" rounded="12px" color="white" type="submit">
                      Subir
                    </Button>
                  </Flex>
                </ModalBody>
              </FormikForm>
            );
          }}
        </Formik>
      </ModalContent>
    </Modal>
  );
}
