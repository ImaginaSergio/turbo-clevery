import * as Yup from 'yup';
import { Form as FormikForm, Formik } from 'formik';
import { BiX, BiRightArrowAlt } from 'react-icons/bi';
import {
  Icon,
  Flex,
  Modal,
  Button,
  ModalBody,
  ModalHeader,
  ModalFooter,
  ModalContent,
  ModalOverlay,
} from '@chakra-ui/react';

import { FormInput, FormSelect } from '../../../shared/components';

const ModuloModalForm = ({
  isOpen,
  onClose,
  updateValue,
  defaultValue,
}: {
  isOpen: boolean;
  onClose: () => void;
  updateValue: (e: any) => void;
  defaultValue: any;
}) => {
  const validationSchema = Yup.object().shape({
    titulo: Yup.string()
      .required('¡El título es obligatorio!')
      .typeError('El título es obligatorio.'),
    orden: Yup.number()
      .required('¡El orden es obligatorio!')
      .typeError('El orden es obligatorio.'),
    publicado: Yup.boolean().notRequired(),
  });

  const initialValues: any = {
    titulo: defaultValue?.titulo || 'Módulo 1',
    publicado: defaultValue?.publicado || true,
    orden: defaultValue?.orden || 1,
  };

  const submitForm = async (values: any) => {
    updateValue(values);

    onClose();
  };

  function onKeyDown(keyEvent: any) {
    if ((keyEvent.charCode || keyEvent.keyCode) === 13)
      keyEvent.stopPropagation();
  }

  return (
    <Modal onClose={onClose} isOpen={isOpen} isCentered>
      <ModalOverlay />

      <ModalContent maxW="56em" maxH="56em">
        <ModalHeader bg="#011434" p="20px 30px" color="#fff">
          <Flex justify="space-between" align="center">
            <div>Actualizar módulo</div>

            <Icon as={BiX} boxSize="20px" opacity="0.4" onClick={onClose} />
          </Flex>
        </ModalHeader>

        <Formik
          enableReinitialize
          onSubmit={submitForm}
          initialValues={initialValues}
          validationSchema={validationSchema}
        >
          {(formik) => {
            const { handleSubmit, values } = formik;

            return (
              <FormikForm onSubmit={handleSubmit} onKeyDown={onKeyDown}>
                <ModalBody
                  p="30px"
                  display="flex"
                  rowGap="20px"
                  flexDirection="column"
                >
                  <Flex direction="column" rowGap="30px">
                    <FormInput name="titulo" label="Título" isRequired />

                    <FormInput
                      name="orden"
                      type="number"
                      label="Orden"
                      isRequired
                    />

                    <FormSelect
                      name="publicado"
                      label="Publicado"
                      placeholder="Selecciona una opción"
                      defaultValue={{
                        label: values.publicado ? 'Publicado' : 'Oculto',
                      }}
                      options={[
                        { label: 'Publicado', value: true },
                        { label: 'Oculto', value: false },
                      ]}
                    />
                  </Flex>
                </ModalBody>

                <ModalFooter bg="#F4F6F9">
                  <Button onClick={onClose}>Cancelar</Button>

                  <Button
                    ml="20px"
                    bg="#3182FC"
                    color="#fff"
                    type="submit"
                    rightIcon={
                      <Icon as={BiRightArrowAlt} boxSize="17px" color="#fff" />
                    }
                  >
                    Actualizar módulo
                  </Button>
                </ModalFooter>
              </FormikForm>
            );
          }}
        </Formik>
      </ModalContent>
    </Modal>
  );
};

export default ModuloModalForm;
