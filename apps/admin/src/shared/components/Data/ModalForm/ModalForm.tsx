import { Form as FormikForm, Formik } from 'formik';
import {
  Icon,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from '@chakra-ui/react';

import { BiX, BiRightArrowAlt } from 'react-icons/bi';

import './ModalForm.scss';

type ModalFormProps = {
  title: string;
  state: {
    isOpen: boolean;
    onOpen: () => any | void;
    onClose: () => any | void;
  };
  form: {
    initialValues: any;
    validationSchema?: any;
    submitForm: (e?: any) => any | void;
    body: { row: React.ReactNode[] }[];
    buttonTitle?: string;
  };
};

const ModalForm = ({ state, title, form }: ModalFormProps) => {
  function onKeyDown(keyEvent: any) {
    if ((keyEvent.charCode || keyEvent.keyCode) === 13)
      keyEvent.stopPropagation();
  }

  return (
    <Modal onClose={state.onClose} isOpen={state.isOpen}>
      <ModalOverlay />

      <ModalContent maxW="56em" maxH="56em" mt="149px" right="auto">
        <ModalHeader bg="#011434" p="20px 30px" color="#fff">
          <Flex justify="space-between" align="center">
            {title}

            <Icon
              as={BiX}
              w="32px"
              h="32px"
              cursor="pointer"
              onClick={state.onClose}
            />
          </Flex>
        </ModalHeader>

        <Formik onSubmit={form.submitForm} initialValues={form.initialValues}>
          {(formik) => {
            const { handleSubmit } = formik;

            return (
              <FormikForm onSubmit={handleSubmit} onKeyDown={onKeyDown}>
                <ModalBody p="30px">
                  {form.body.map(
                    ({ row }: { row: React.ReactNode[] }, index) => (
                      <Flex key={index} mb="20px" _last={{ mb: '0px' }}>
                        {row.map((block: React.ReactNode) => (
                          <Flex w="100%" mr="30px" _last={{ mr: '0px' }}>
                            {block}
                          </Flex>
                        ))}
                      </Flex>
                    )
                  )}
                </ModalBody>

                <ModalFooter bg="#F4F6F9">
                  <Button onClick={state.onClose}>Cancelar</Button>

                  <Button
                    ml="20px"
                    bg="#3182FC"
                    color="#fff"
                    type="submit"
                    rightIcon={
                      <Icon as={BiRightArrowAlt} boxSize="17px" color="#fff" />
                    }
                  >
                    {form.buttonTitle}
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

export { ModalForm };
