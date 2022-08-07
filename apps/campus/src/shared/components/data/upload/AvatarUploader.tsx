import { useCallback } from 'react';

import { Box, Flex, Icon, Button, Center, Spinner, IconButton } from '@chakra-ui/react';
import { useDropzone } from 'react-dropzone';
import { BiCloudUpload, BiTrash } from 'react-icons/bi';

import { Avatar } from 'ui';

export interface AvatarUploaderProps {
  size: string;
  name: string;
  src?: string;
  allowGif?: boolean;
  isUploading?: boolean;
  onUpload: (...args: any[]) => any;
  onDelete?: (e?: any) => any;
}

export const OpenAvatarUploader = ({ size, name, src, allowGif, isUploading, onUpload, onDelete }: AvatarUploaderProps) => {
  const onDrop = useCallback((file) => {
    onUpload(file);
  }, []);

  const acceptedFormats = allowGif ? ['.png', '.jpg', '.jpeg', '.gif'] : ['.png', '.jpg', '.jpeg'];

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: acceptedFormats,
  });

  return (
    <Flex gap="24px" pos="relative" overflow="hidden" direction={{ base: 'column', md: 'row' }}>
      {isUploading ? (
        <Center bg="black" minW={size} minH={size} boxSize={size} rounded="50%">
          <Spinner color="white" />
        </Center>
      ) : (
        <Avatar src={src} name={name} size={size} />
      )}

      <Flex gap="6px" w="fit-content" justify="center" direction="column" align="flex-start">
        <Box color="gray_5" fontSize="13px" lineHeight="16px" fontWeight="medium">
          JPG, PNG o GIF. Peso máximo de 1Mb
        </Box>

        <Flex align="center" gap="8px">
          <Flex {...getRootProps()}>
            <input {...getInputProps()} />

            <Button
              bg="black"
              color="white"
              p="0px 16px"
              fontSize="16px"
              fontWeight="bold"
              lineHeight="22px"
              isDisabled={isUploading}
              rightIcon={<Icon boxSize="20px" color="white" as={BiCloudUpload} />}
            >
              Subir foto nueva
            </Button>
          </Flex>

          {onDelete && (
            <IconButton
              w="40px"
              bg="white"
              border="none"
              onClick={onDelete}
              isDisabled={isUploading}
              aria-label="Borrar avatar"
              icon={<Icon boxSize="20px" color="dark" as={BiTrash} />}
            />
          )}
        </Flex>
      </Flex>
    </Flex>
  );
};
