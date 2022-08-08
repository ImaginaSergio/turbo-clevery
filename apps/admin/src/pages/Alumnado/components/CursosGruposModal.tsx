import * as Yup from 'yup';
import { Form as FormikForm, Formik } from 'formik';
import { BiX } from 'react-icons/bi';
import {
  useToast,
  Icon,
  Flex,
  Modal,
  Button,
  ModalBody,
  ModalHeader,
  ModalContent,
  ModalOverlay,
  Box,
} from '@chakra-ui/react';

import { IGrupo } from '@clevery/data';
import { onFailure } from '@clevery/utils';
import { getCursos, updateGrupo } from '@clevery/data';
import { FormAsyncSelect, FormDateInput } from '../../../shared/components';

export function CursosGruposModal({
  grupo,
  state,
  defaultValue,
}: {
  grupo: IGrupo;
  defaultValue?: any;
  state: { isOpen: boolean; onOpen: () => void; onClose: () => void };
}) {
  const toast = useToast();

  const validationSchema = Yup.object().shape({
    cursoId: Yup.number().required(),
    fechaInicio: Yup.string().required(),
    fechaFin: Yup.string().required(),
  });

  const initialValues = {
    cursoId: defaultValue?.id || null,
    fechaInicio: defaultValue?.meta?.pivot_fecha_inicio || null,
    fechaFin: defaultValue?.meta?.pivot_fecha_fin || null,
  };

  const submitForm = async (values: any) => {
    if (!grupo.id) {
      onFailure(
        toast,
        'Error inesperado',
        'No se detecta el ID del grupo que tratas de modificar.'
      );
      return;
    }

    const cursosObj: any = {};

    grupo.cursos?.forEach((c: any) => {
      if (c.id === values.cursoId)
        cursosObj[values.cursoId] = {
          fecha_inicio: values.fechaInicio,
          fecha_fin: values.fechaFin,
        };
      else
        cursosObj[c.id] = {
          fecha_inicio: c.meta.pivot_fecha_inicio,
          fecha_fin: c.meta.pivot_fecha_fin,
        };
    });

    if (!defaultValue)
      cursosObj[values.cursoId] = {
        fecha_inicio: values.fechaInicio,
        fecha_fin: values.fechaFin,
      };

    updateGrupo({ id: grupo.id, grupo: { cursos: cursosObj }, client: 'admin' })
      .then(() => state.onClose())
      .catch((error) => onFailure(toast, error.title, error.message));
  };

  function onKeyDown(keyEvent: any) {
    if ((keyEvent.charCode || keyEvent.keyCode) === 13)
      keyEvent.stopPropagation();
  }

  const loadCursosByTitulo = async (value: any) => {
    const _cursos = await getCursos({
      client: 'admin',
      treatData: false,
      query: [{ titulo: value }],
    });

    return _cursos?.data?.map((exp: any) => ({
      value: exp.id,
      label: exp.titulo,
    }));
  };

  return (
    <Modal onClose={state.onClose} isOpen={state.isOpen} isCentered>
      <ModalOverlay />

      <ModalContent maxW="56em" maxH="56em">
        <ModalHeader p="30px 30px 0px">
          <Flex justify="space-between" align="center">
            <Box fontSize="19px">Añadir cursos</Box>

            <Icon
              as={BiX}
              boxSize="32px"
              cursor="pointer"
              onClick={state.onClose}
            />
          </Flex>
        </ModalHeader>

        <Formik
          enableReinitialize
          onSubmit={submitForm}
          initialValues={initialValues}
          validationSchema={validationSchema}
        >
          {(formik) => {
            const { handleSubmit } = formik;

            return (
              <FormikForm onSubmit={handleSubmit} onKeyDown={onKeyDown}>
                <ModalBody p="30px">
                  <Flex direction="column" gap="30px">
                    <FormAsyncSelect
                      isRequired
                      name="cursoId"
                      label="Curso asociado"
                      loadOptions={loadCursosByTitulo}
                      placeholder="Escribe para buscar"
                    />

                    <FormDateInput
                      isRequired
                      type="date"
                      name="fechaInicio"
                      label="Fecha de inicio"
                      placeholder="Elige una fecha"
                      minDate={null}
                      showMonthDropdown={true}
                      showYearDropdown={true}
                    />

                    <FormDateInput
                      type="date"
                      name="fechaFin"
                      label="Fecha fin"
                      isRequired
                      placeholder="Elige una fecha"
                      minDate={null}
                      showMonthDropdown={true}
                      showYearDropdown={true}
                    />

                    <Button
                      w="100%"
                      bg="primary"
                      rounded="12px"
                      color="white"
                      type="submit"
                    >
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
