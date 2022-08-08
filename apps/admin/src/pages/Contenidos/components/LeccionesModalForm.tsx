import { useState, useEffect } from 'react';

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

import { LeccionTipoEnum } from '@clevery/data';
import {
  FormInput,
  FormSelect,
  FormTextarea,
} from '../../../shared/components';

const LeccionesModalForm = ({
  isOpen,
  onClose,
  updateValue,
  createValue,
  defaultValue,
}: {
  isOpen: boolean;
  onClose: () => void;
  updateValue: (e: any) => void;
  createValue: (e: any) => void;
  defaultValue: any;
}) => {
  const [currentValue, setCurrentValue] = useState<any>(defaultValue);

  useEffect(() => {
    setCurrentValue(defaultValue);
  }, [defaultValue]);

  const validationSchema = Yup.object().shape({
    titulo: Yup.string()
      .required('¡El título es obligatorio!')
      .typeError('El título es obligatorio.'),
    duracion: Yup.number()
      .required('La duración es obligatoria')
      .typeError('La duración es obligatoria'),
    descripcion: Yup.string()
      .required('La descripción es obligatoria')
      .typeError('La descripción es obligatoria'),
    contenido: Yup.string()
      .required('El contenido es obligatorio')
      .typeError('El contenido es obligatorio'),
    tipo: Yup.string()
      .oneOf(Object.values(LeccionTipoEnum))
      .required('El tipo es obligatorio')
      .typeError('El tipo es obligatorio'),
  });

  const initialValues: any = {
    titulo: defaultValue?.titulo || 'Lección 1',
    duracion: defaultValue?.duracion || 0,
    contenido: defaultValue?.contenido || '',
    descripcion: defaultValue?.descripcion || '',
    publicado: defaultValue?.publicado || true,
  };

  const submitForm = async (values: any) => {
    if (currentValue) updateValue(values);
    else createValue(values);

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
            <div>
              {currentValue
                ? `Matrícula - ${currentValue.participante?.nombre}`
                : 'Nueva matrícula'}
            </div>

            <Icon as={BiX} w="20px" opacity="0.4" onClick={onClose} />
          </Flex>
        </ModalHeader>

        <Formik
          enableReinitialize
          onSubmit={submitForm}
          validationSchema={validationSchema}
          initialValues={initialValues}
        >
          {(formik) => {
            const { handleSubmit } = formik;

            return (
              <FormikForm onSubmit={handleSubmit} onKeyDown={onKeyDown}>
                <ModalBody
                  p="30px"
                  display="flex"
                  rowGap="20px"
                  flexDirection="column"
                >
                  <Flex columnGap="30px">
                    <FormInput name="titulo" label="Título" isRequired />

                    <FormInput
                      type="number"
                      label="Duración"
                      isRequired
                      name="duracion"
                    />

                    <FormSelect
                      label="Tipo"
                      isRequired
                      name="tipo"
                      placeholder="Selecciona una opción"
                      options={Object.values(LeccionTipoEnum).map((v) => ({
                        label: v,
                        value: v,
                      }))}
                    />
                  </Flex>

                  <FormTextarea
                    label="Descripción"
                    isRequired
                    name={`descripcion`}
                  />

                  <FormTextarea
                    label="Contenido"
                    isRequired
                    name={`contenido`}
                  />
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
                    {defaultValue ? 'Actualizar lección' : 'Crear lección'}
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

export default LeccionesModalForm;
