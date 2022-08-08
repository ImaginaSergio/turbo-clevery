import { useEffect, useState } from 'react';

import {
  Flex,
  Modal,
  Button,
  ModalBody,
  ModalHeader,
  ModalFooter,
  ModalContent,
  ModalOverlay,
  ModalCloseButton,
} from '@chakra-ui/react';
import * as Yup from 'yup';
import { Form as FormikForm, Formik } from 'formik';

import { IProyectoBoost } from 'data';
import { FormInput, FormTextarea } from '../../FormElements';
import { FormTextEditor } from 'ui';

type ProyectoModalProps = {
  onCreate: (e?: any) => void;
  onUpdate: (id: number, proyectoBoost: any) => void;
  defaultValue?: IProyectoBoost;
  state: { isOpen: boolean; onOpen: () => void; onClose: () => void };
};

const ProyectoModal = ({ state, onUpdate, onCreate, defaultValue }: ProyectoModalProps) => {
  const validationSchema = Yup.object().shape({
    titulo: Yup.string().required('El titulo es obligatorio').typeError('Introduce un titulo.'),
  });

  const initialValues: any = {
    titulo: defaultValue?.titulo || '',
    icono: defaultValue?.icono || '',
    tiempoLimite: defaultValue?.tiempoLimite || '',
    duracionLectura: defaultValue?.duracionLectura || '',
    descripcionCorta: defaultValue?.descripcionCorta || '',
    descripcionLarga: defaultValue?.descripcionLarga || '',
  };

  const submitForm = (values: any) => {
    const proyectoBoost = { ...values };

    if (defaultValue?.id) onUpdate(defaultValue.id, proyectoBoost);
    else onCreate(proyectoBoost);

    state.onClose();
  };

  return (
    <Modal isCentered isOpen={state.isOpen} onClose={state.onClose} scrollBehavior="inside" closeOnOverlayClick={false}>
      <ModalOverlay />

      <ModalContent maxW="56em" overflow="auto">
        <ModalHeader>{defaultValue?.id ? 'Actualizar proyecto' : 'Nuevo proyecto'}</ModalHeader>

        <ModalCloseButton />

        <Formik enableReinitialize onSubmit={submitForm} initialValues={initialValues} validationSchema={validationSchema}>
          {(formik) => {
            const { handleSubmit } = formik;

            return (
              <FormikForm onSubmit={handleSubmit}>
                <ModalBody w="100%" gap="20px" display="flex" flexDirection="column">
                  <FormInput isRequired name="titulo" label="Título del proyecto" placeholder="Introducir texto" />

                  <Flex w="100%" gap="20px" align="center">
                    <FormInput
                      isRequired
                      type="number"
                      name="tiempoLimite"
                      label="Tiempo límite de entrega (h)"
                      placeholder="Introducir texto"
                    />

                    <FormInput
                      isRequired
                      type="number"
                      name="duracionLectura"
                      label="Duración de lectura (min)"
                      placeholder="Introducir texto"
                    />
                  </Flex>

                  <FormTextarea isRequired name="icono" label="Icono" />

                  <FormTextEditor isRequired name="descripcionCorta" label="Descripción corta" />

                  <FormTextEditor isRequired name="descripcionLarga" label="Descripción larga" />
                </ModalBody>

                <ModalFooter className="form-footer">
                  <Button py="6" w="100%" color="white" type="submit" bgColor="#3182FC">
                    {defaultValue?.id ? 'Actualizar información' : 'Crear nuevo curso'}
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

export { ProyectoModal };
