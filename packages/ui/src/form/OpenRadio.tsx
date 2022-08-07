import { useState } from 'react';

import { Flex, Box, Radio, RadioGroup, Stack } from '@chakra-ui/react';

type OpenRadioProps = {
  name: string;
  label?: string;
  defaultValue?: any;
  isDisabled?: boolean;
  radios: { label: string; value: any }[];
  onChange?: (e?: any) => void;
};

export const OpenRadio = ({
  name,
  label,
  radios,
  isDisabled,
  defaultValue,
  onChange = () => {},
}: OpenRadioProps) => {
  const [value, setValue] = useState(defaultValue);

  const handleChange = (newValue: any) => {
    setValue(newValue);

    onChange({ [name]: newValue });
  };

  return (
    <Flex w="100%" direction="column">
      {label && (
        <Box fontSize="14px" fontWeight="bold" mb="10px">
          {label}
        </Box>
      )}

      <RadioGroup
        value={value}
        onChange={handleChange}
        defaultValue={defaultValue}
      >
        <Stack direction="row" spacing="24px">
          {radios?.map(
            (radio: { value: any; label: string }, index: number) => (
              <Radio
                value={radio.value}
                data-cy={`${label}_${radio.label}`}
                isDisabled={isDisabled}
                key={`radio-item-${index}`}
              >
                {radio.label}
              </Radio>
            )
          )}
        </Stack>
      </RadioGroup>
    </Flex>
  );
};
