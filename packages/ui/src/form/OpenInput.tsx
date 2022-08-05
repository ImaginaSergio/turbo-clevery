import { useState, useEffect } from 'react';

import {
  Text,
  Flex,
  Box,
  InputGroup,
  Input,
  Icon,
  InputRightElement,
} from '@chakra-ui/react';
import { BiX } from 'react-icons/bi';

type OpenInputProps = {
  type?: any;
  name: string;
  label: string;
  isDisabled?: boolean;
  isClearable?: boolean;
  onChange?: (e?: any) => void;
  defaultValue?: any;
  placeholder?: string;
  onValidate?: (e?: any) => Promise<string>;
};

export const OpenInput = ({
  name,
  label,
  type,
  isDisabled,
  isClearable,
  placeholder = '',
  defaultValue = '',
  onValidate,
  onChange,
}: OpenInputProps) => {
  const [value, setValue] = useState<string>('');
  const [errors, setErrors] = useState<string>();

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  function handleInput(event: any) {
    setValue(event.target.value);
    if (errors) setErrors('');
  }

  async function handleBlur(event: any) {
    let _errors;
    if (onValidate) _errors = await onValidate(value);

    if (onChange && !_errors) onChange({ [name]: value });
    else if (_errors) setErrors(_errors);
  }

  function handleRemove() {
    setValue('');

    if (onChange) onChange({ [name]: '' });
  }

  return (
    <Flex w="100%" direction="column">
      <Box fontSize="14px" fontWeight="bold" mb="10px">
        {label}
      </Box>

      <InputGroup id={`perfil-input-${name}`} h="fit-content">
        <Input
          data-cy={`${label}_input`}
          type={type}
          name={name}
          value={value}
          isDisabled={isDisabled}
          placeholder={placeholder}
          onBlur={handleBlur}
          onChange={handleInput}
          h="40px"
          bg="gray_2"
          p="0px 12px"
          rounded="8px"
          fontSize="16px"
          fontWeight="medium"
          border="1px solid var(--chakra-colors-gray_3)"
          _placeholder={{ color: 'gray_4' }}
        />

        {isClearable && (
          <InputRightElement
            onClick={handleRemove}
            children={
              <Icon
                as={BiX}
                opacity="0"
                color="black"
                boxSize="24px"
                cursor="pointer"
                transition="0.2s all ease"
                sx={{
                  [`#perfil-input-${name}:hover &`]: {
                    opacity: '1',
                  },
                }}
              />
            }
          />
        )}
      </InputGroup>

      {errors && (
        <Text color="cancel" fontSize="14px" mt="8px">
          {errors}
        </Text>
      )}
    </Flex>
  );
};
