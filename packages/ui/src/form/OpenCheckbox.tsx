import { ChangeEvent } from 'react';

import { Flex, Box, Checkbox } from '@chakra-ui/react';

type OpenCheckboxProps = {
  name: string;
  label?: string;
  title?: string;
  isDisabled?: boolean;
  defaultValue?: boolean;
  onChange?: (e?: any) => void;
};

export const OpenCheckbox = ({
  name,
  label,
  title,
  isDisabled,
  defaultValue,
  onChange = () => {},
}: OpenCheckboxProps) => {
  function handleInput(event: ChangeEvent<HTMLInputElement>) {
    onChange({ [name]: event.target.value });
  }

  return (
    <Flex w="100%" direction="column">
      {label && (
        <Box fontSize="14px" fontWeight="bold" mb="10px">
          {label}
        </Box>
      )}

      <Checkbox
        onChange={handleInput}
        isDisabled={isDisabled}
        defaultChecked={defaultValue}
      >
        {title}
      </Checkbox>
    </Flex>
  );
};
