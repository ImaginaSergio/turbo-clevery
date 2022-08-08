import { useState } from 'react';

import {
  Flex,
  Box,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react';

type OpenRangeInputProps = {
  name: string;
  label: string;
  isDisabled?: boolean;
  onChange: (e?: any) => void;
  defaultValue?: [number | undefined, number | undefined];
};

export const OpenRangeInput = ({
  name,
  label,
  onChange,
  isDisabled,
  defaultValue = [undefined, undefined],
}: OpenRangeInputProps) => {
  const [valueMin, setValueMin] = useState<number | undefined>(defaultValue[0]);
  const [valueMax, setValueMax] = useState<number | undefined>(defaultValue[1]);

  function handleInputMin(event: any) {
    let value = event;

    setValueMin(value);
    onChange({ [name]: [value, valueMax] });
  }

  function handleInputMax(event: any) {
    let value = event;

    setValueMax(value);
    onChange({ [name]: [valueMin, value] });
  }

  return (
    <Flex w="100%" direction="column">
      <Box fontSize="14px" fontWeight="bold" mb="10px">
        {label}
      </Box>

      <Flex align="center" gap="15px">
        <NumberInput
          min={10000}
          max={valueMax}
          value={valueMin}
          defaultValue={valueMin}
          isDisabled={isDisabled}
          onChange={handleInputMin}
          data-cy="salario_min"
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>

        <Box fontSize="14px" fontWeight="bold">
          -
        </Box>

        <NumberInput
          max={100000}
          min={valueMin}
          value={valueMax}
          defaultValue={valueMax}
          isDisabled={isDisabled}
          onChange={handleInputMax}
          data-cy="salario_max"
        >
          <NumberInputField />

          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </Flex>
    </Flex>
  );
};
