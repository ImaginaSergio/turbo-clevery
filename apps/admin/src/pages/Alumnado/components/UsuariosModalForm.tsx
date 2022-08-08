import * as Yup from 'yup';
import { Form as FormikForm, Formik } from 'formik';
import { BiX, BiUser, BiGroup } from 'react-icons/bi';
import { Box, Icon, Flex, Modal, Button, useToast, ModalBody, ModalHeader, ModalContent, ModalOverlay } from '@chakra-ui/react';

import { IEmpresa, getGrupos, getEmpresas, updateProgresoGlobal } from 'data';

import { FormInput, FormTextarea, FormAsyncSelect, FormAsyncMultiSelect } from '../../../shared/components';
import { onFailure, onSuccess } from 'ui';
import { addUser, getRutas, getUserByID } from 'data';

export default function UsuariosModalForm({ state }: { state: { isOpen: boolean; onOpen: () => void; onClose: () => void } }) {
  const toast = useToast();

  const validationSchema = Yup.object().shape({
    tipo: Yup.string().oneOf(['en_masa', 'individual']).required(),

    username: Yup.string().when('tipo', {
      is: 'en_masa',
      then: Yup.string().notRequired().nullable(),
      otherwise: Yup.string()
        .min(2, '¡Nombre de usuario demasiado corto!')
        .required('El nombre de usuario es obligatorio.')
        .typeError('El nombre de usuario es obligatorio.'),
    }),
    nombre: Yup.string().when('tipo', {
      is: 'en_masa',
      then: Yup.string().notRequired().nullable(),
      otherwise: Yup.string()
        .min(2, '¡Nombre demasiado corto!')
        .required('El nombre es obligatorio.')
        .typeError('El nombre es obligatorio.'),
    }),
    dni: Yup.string().notRequired().nullable(),
    apellidos: Yup.string().when('tipo', {
      is: 'en_masa',
      then: Yup.string().notRequired().nullable(),
      otherwise: Yup.string()
        .min(2, 'Apellidos demasiado cortos!')
        .required('Los apellidos son obligatorios.')
        .typeError('Los apellidos son obligatorios.'),
    }),
    email: Yup.string().when('tipo', {
      is: 'en_masa',
      then: Yup.string().notRequired().nullable(),
      otherwise: Yup.string().email().required('El email es obligatorio.').typeError('El email es obligatorio.'),
    }),
    users: Yup.string().when('tipo', {
      is: 'individual',
      then: Yup.string().notRequired().nullable(),
      otherwise: Yup.string()
        .required('El listado de usuarios es obligatorio.')
        .typeError('El listado de usuarios es obligatorio.'),
    }),
    grupos: Yup.array()
      .of(
        Yup.object().shape({
          label: Yup.string().required(),
          value: Yup.number().required(),
        })
      )
      .min(1, 'Debes seleccionar como mínimo un grupo')
      .required('El campo de grupos es obligatorio'),
    rutaId: Yup.number().notRequired().nullable(),
    empresaId: Yup.number().required(),
  });

  const initialValues = {
    tipo: 'en_masa',
    username: '',
    nombre: '',
    apellidos: '',
    dni: '',
    email: '',
    users: '',
    grupos: [],
    rutaId: undefined,
    empresaId: process.env.REACT_APP_ORIGEN_CAMPUS === 'OPENBOOTCAMP' ? 1 : undefined,
  };

  const submitForm = async (values: any) => {
    if (values.tipo === 'individual') {
      const pass = 'OpenBootcampEsGenial' + Math.floor(Math.random() * (3000 - 0 + 1) + 0);

      const user = {
        email: values.email,
        username: values.username,
        nombre: values.nombre,
        dni: values.dni,
        apellidos: values.apellidos,
        empresaId: values.empresaId,
        grupos: values.grupos?.map((g: any) => g.value),
        password: pass,
        password_confirmation: pass,
      };

      addUser({ user })
        .then(async (e) => {
          onSuccess(toast, e.message);

          if (values.rutaId) {
            const _user = await getUserByID({
              id: e.value?.id,
              client: 'admin',
            });

            updateProgresoGlobal({
              id: _user.progresoGlobal.id,
              progresoGlobal: { rutaId: values.rutaId },
              client: 'admin',
            });
          }

          state.onClose();
        })
        .catch((error: any) => {
          console.error('❌ Algo ha fallado...', error);
          onFailure(toast, error.title, error.message);
        });
    } else {
      const userPromises = [];

      const users: {
        nombre: string;
        apellidos: string;
        username: string;
        email: string;
        dni: string;
        password: string;
        grupos: number[];
        empresaId: number;
        password_confirmation: string;
      }[] = [];

      values.users.split('\n').map((userRaw: string) => {
        const user = userRaw.split(',');

        if (user?.length > 0) {
          const pass = 'OpenBootcampEsGenial' + Math.floor(Math.random() * (3000 - 0 + 1) + 0);

          users.push({
            email: user[0]?.trimStart(),
            username: user[1]?.trimStart(),
            nombre: user[2]?.trimStart(),
            apellidos: user[3]?.trimStart(),
            dni: user[4]?.trimStart(),
            empresaId: values.empresaId,
            password: pass,
            password_confirmation: pass,
            grupos: values.grupos?.map((g: any) => g.value),
          });
        }
      });

      for (const user of users) {
        userPromises.push(
          addUser({ user })
            .then(async (e) => {
              if (values.rutaId) {
                const _user = await getUserByID({
                  id: e.value?.id,
                  client: 'admin',
                });

                updateProgresoGlobal({
                  id: _user.progresoGlobal.id,
                  progresoGlobal: { rutaId: values.rutaId },
                  client: 'admin',
                });
              }
            })
            .catch((error: any) => {
              console.error('❌ Algo ha fallado...', { error });
              onFailure(toast, 'Error al subir: ' + user.nombre + user.apellidos, error.message);
            })
        );
      }

      Promise.all([...userPromises]).then(() => state.onClose());
    }
  };

  function onKeyDown(keyEvent: any) {
    if ((keyEvent.charCode || keyEvent.keyCode) === 13) keyEvent.stopPropagation();
  }

  const loadGrupos = async (value: string) => {
    const _grupos = await getGrupos({
      query: [{ nombre: value }, { limit: 1000 }],
      client: 'admin',
    });

    return _grupos?.data?.map((user: any) => ({
      value: user.id,
      label: user.nombre,
    }));
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

  const loadEmpresas = async (value: string) => {
    const _empresa = await getEmpresas({
      query: [{ nombre: value }, { limit: 1000 }],
      client: 'admin',
    });

    return _empresa?.data?.map((emp: IEmpresa) => ({
      value: emp.id,
      label: emp.nombre,
    }));
  };

  return (
    <Modal onClose={state.onClose} isOpen={state.isOpen} isCentered>
      <ModalOverlay />

      <ModalContent maxW="56em">
        <ModalHeader p="30px 30px 0px">
          <Flex justify="space-between" align="center">
            <Box fontSize="19px">Añadir alumnos</Box>

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
                    <Flex p="4px" bg="#F0F1F5" rounded="8px" fontWeight="semibold">
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
                      <>
                        <FormTextarea
                          name="users"
                          label="Usuarios"
                          placeholder={`username1@ejemplo.com, Username, Nombre, Apellido Apellido, DNI\nusername2@ejemplo.com, Username, Nombre, Apellido Apellido, DNI\nusername3@ejemplo.com, Username, Nombre, Apellido Apellido, DNI\n...`}
                        />

                        <FormAsyncMultiSelect
                          name="grupos"
                          label="Grupos"
                          placeholder="Escribe para buscar"
                          loadOptions={loadGrupos}
                        />

                        <FormAsyncSelect
                          name="rutaId"
                          label="Hoja de ruta"
                          loadOptions={loadRutas}
                          placeholder="Escribe para buscar"
                        />

                        <FormAsyncSelect
                          name="empresaId"
                          label="Empresa asociada"
                          isRequired
                          loadOptions={loadEmpresas}
                          placeholder="Escribe para buscar"
                        />
                      </>
                    ) : (
                      <>
                        <FormInput
                          isRequired
                          name="username"
                          label="Nombre de usuario"
                          placeholder="Introduce un nombre de usuario"
                        />

                        <Flex gap="20px">
                          <FormInput isRequired name="nombre" label="Nombre" placeholder="Introduce un nombre" />

                          <FormInput isRequired name="apellidos" label="Apellidos" placeholder="Introduce los apellidos" />
                        </Flex>

                        <FormInput isRequired type="email" name="email" label="Email" placeholder="Introduce un email" />

                        <FormInput name="dni" label="DNI" placeholder="Introduce un dni" />

                        <FormAsyncMultiSelect
                          isRequired
                          name="grupos"
                          label="Grupos"
                          loadOptions={loadGrupos}
                          placeholder="Escribe para buscar"
                        />

                        <FormAsyncSelect
                          isRequired
                          name="rutaId"
                          label="Hoja de ruta"
                          loadOptions={loadRutas}
                          placeholder="Escribe para buscar"
                        />

                        <FormAsyncSelect
                          isRequired
                          name="empresaId"
                          label="Empresa asociada"
                          loadOptions={loadEmpresas}
                          placeholder="Escribe para buscar"
                        />
                      </>
                    )}

                    <Button w="100%" bg="primary" color="white" type="submit" rounded="12px">
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
