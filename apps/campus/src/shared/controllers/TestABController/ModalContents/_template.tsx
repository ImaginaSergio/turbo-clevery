import { ModalBody, ModalFooter, ModalHeader } from '@chakra-ui/react';

export const OpenModalHeader = ({ children, ...props }: any) => (
  <ModalHeader p="0px">{children}</ModalHeader>
);

export const OpenModalBody = ({ children, ...props }: any) => (
  <ModalBody p="0px" w="100%">
    {children}
  </ModalBody>
);

export const OpenModalFooter = ({ children, ...props }: any) => (
  <ModalFooter p="0px" gap="15px">
    {children}
  </ModalFooter>
);
