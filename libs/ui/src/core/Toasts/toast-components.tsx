import { useEffect } from 'react';

import { FaRegCheckCircle } from 'react-icons/fa';
import { Flex, Box, Icon, toast } from '@chakra-ui/react';
import { BiErrorCircle, BiInfoCircle } from 'react-icons/bi';

export const SuccessToastComponent = (title: string | React.ReactNode, description?: string | React.ReactNode) => {
  return (
    <Flex
      p="16px"
      gap="6px"
      bg="primary"
      color="white"
      rounded="5px"
      align="center"
      fontSize="16px"
      direction="column"
      whiteSpace="pre-line"
    >
      <Flex w="100%" align="center">
        <Icon as={FaRegCheckCircle} mr="8px" h="100%" />

        <Box fontWeight="bold">{title}</Box>
      </Flex>

      {description && (
        <Box w="100%" whiteSpace="pre-line" fontWeight="semibold">
          {description}
        </Box>
      )}
    </Flex>
  );
};

export const FailureToastComponent = (title: string | React.ReactNode, description: string | React.ReactNode) => {
  return (
    <Flex
      p="16px"
      gap="6px"
      rounded="5px"
      bg="#E53E3E"
      color="white"
      align="center"
      fontSize="16px"
      direction="column"
      whiteSpace="pre-line"
    >
      <Flex w="100%" align="center">
        <Icon as={BiErrorCircle} mr="8px" h="100%" />

        <Box fontWeight="bold">{title}</Box>
      </Flex>

      {description && (
        <Box w="100%" whiteSpace="pre-line">
          {description}
        </Box>
      )}
    </Flex>
  );
};

export const WarningToastComponent = (title: string | React.ReactNode, description: string | React.ReactNode) => {
  return (
    <Flex
      w="100%"
      p="16px"
      gap="6px"
      bg="#55556A"
      color="white"
      rounded="5px"
      fontSize="16px"
      align="center"
      justify="start"
      direction="column"
      whiteSpace="pre-line"
    >
      <Flex w="100%" align="center">
        <Icon as={BiInfoCircle} mr="8px" h="100%" />

        <Box fontWeight="bold">{title}</Box>
      </Flex>

      {description && (
        <Box w="100%" whiteSpace="pre-line">
          {description}
        </Box>
      )}
    </Flex>
  );
};

export const SuccessToastComponent_Undo = (title: string | React.ReactNode, timeout: any) => {
  useEffect(() => {
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [timeout]);

  return (
    <Flex
      fontSize="16px"
      color="white"
      p="20px"
      bg="#55556A"
      rounded="5px"
      align="center"
      justify="center"
      whiteSpace="pre-line"
    >
      <Icon as={FaRegCheckCircle} mr="8px" h="100%" />

      <Box mr="64px">{title}</Box>

      <Box
        fontWeight="bold"
        textDecoration="underline"
        cursor="pointer"
        onClick={() => {
          clearTimeout(timeout);
          toast.closeAll();
        }}
      >
        Deshacer
      </Box>
    </Flex>
  );
};

