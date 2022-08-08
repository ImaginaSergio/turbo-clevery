import * as Yup from 'yup';
import { Form as FormikForm, Formik } from 'formik';
import { BiX } from 'react-icons/bi';
import { useToast, Icon, Flex, Modal, Button, ModalBody, ModalHeader, ModalContent, ModalOverlay, Box } from '@chakra-ui/react';

import { onFailure } from 'ui';
import { getCertificaciones, IGrupo, updateGrupo } from 'data';
import { FormAsyncSelect, FormDateInput } from '../../../shared/components';

export function CertificacionesGruposModal({
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
    certificacionId: Yup.number().required(),
    fechaInicio: Yup.string().required(),
    fechaFin: Yup.string().required(),
  });

  const initialValues = {
    certificacionId: defaultValue?.id || null,
    fechaInicio: defaultValue?.meta?.pivot_fecha_inicio || null,
    fechaFin: defaultValue?.meta?.pivot_fecha_fin || null,
  };

  const submitForm = async (values: any) => {
    if (!grupo.id) {
      onFailure(toast, 'Error inesperado', 'No se detecta el ID del grupo que tratas de modificar.');
      return;
    }

    const certisObj: any = {};

    grupo.certificaciones?.forEach((c: any) => {
      if (c.id === values.certificacionId)
        certisObj[values.certificacionId] = {
          fecha_inicio: values.fechaInicio,
          fecha_fin: values.fechaFin,
        };
      else
        certisObj[c.id] = {
          fecha_inicio: c.meta.pivot_fecha_inicio,
          fecha_fin: c.meta.pivot_fecha_fin,
        };
    });

    if (!defaultValue)
      certisObj[values.certificacionId] = {
        fecha_inicio: values.fechaInicio,
        fecha_fin: values.fechaFin,
      };

    updateGrupo({
      id: grupo.id,
      grupo: { certificaciones: certisObj },
      client: 'admin',
    })
      .then(() => state.onClose())
      .catch((error) => onFailure(toast, error.title, error.message));
  };

  function onKeyDown(keyEvent: any) {
    if ((keyEvent.charCode || keyEvent.keyCode) === 13) keyEvent.stopPropagation();
  }

  const loadCertificacionesByNombre = async (value: any) => {
    const _certificaciones = await getCertificaciones({
      client: 'admin',
      query: [{ nombre: value }],
    });

    return _certificaciones?.data?.map((exp: any) => ({
      value: exp.id,
      label: exp.nombre,
    }));
  };

  return (
    <Modal onClose={state.onClose} isOpen={state.isOpen} isCentered>
      <ModalOverlay />

      <ModalContent maxW="56em" maxH="56em">
        <ModalHeader p="30px 30px 0px">
          <Flex justify="space-between" align="center">
            <Box fontSize="19px">Añadir certificaciones</Box>

            <Icon as={BiX} boxSize="32px" cursor="pointer" onClick={state.onClose} />
          </Flex>
        </ModalHeader>

        <Formik enableReinitialize onSubmit={submitForm} initialValues={initialValues} validationSchema={validationSchema}>
          {(formik) => {
            const { handleSubmit } = formik;

            return (
              <FormikForm onSubmit={handleSubmit} onKeyDown={onKeyDown}>
                <ModalBody p="30px">
                  <Flex direction="column" gap="30px">
                    <FormAsyncSelect
                      isRequired
                      name="certificacionId"
                      label="Certificacion asociado"
                      loadOptions={loadCertificacionesByNombre}
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
                      isRequired
                      type="date"
                      name="fechaFin"
                      label="Fecha fin"
                      placeholder="Elige una fecha"
                      minDate={null}
                      showMonthDropdown={true}
                      showYearDropdown={true}
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
