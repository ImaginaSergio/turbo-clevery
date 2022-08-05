import { useEffect, useState } from 'react';

import AsyncSelect from 'react-select/async';
import Select, { components } from 'react-select';
import { Flex, Box, InputGroup } from '@chakra-ui/react';

type OpenSelectProps = {
  name: string;
  label: string;
  options: any[];
  defaultValue?: any;
  isDisabled?: boolean;
  placeholder?: string;
  onChange: (e?: any) => void;
};

export const OpenSelect = ({
  name,
  label,
  options,
  onChange,
  placeholder,
  defaultValue,
  isDisabled = false,
}: OpenSelectProps) => {
  function handleOnChange(event: any) {
    onChange(event.value);
  }

  return (
    <Flex w="100%" direction="column">
      <Box fontSize="14px" fontWeight="bold" mb="10px">
        {label}
      </Box>

      <InputGroup h="fit-content" w="100%" data-cy={`${label}_select`}>
        <Select
          name={name}
          options={options}
          styles={selectStyles}
          isDisabled={isDisabled}
          placeholder={placeholder}
          onChange={handleOnChange}
          defaultValue={defaultValue}
          components={{ Option: CustomOption }}
        />
      </InputGroup>
    </Flex>
  );
};

const CustomOption = (props: any) =>
  components.Option && (
    <components.Option
      {...props}
      innerProps={Object.assign(
        {},
        props?.innerProps,
        props?.data['data-cy'] ? { 'data-cy': props?.data['data-cy'] } : {}
      )}
    />
  );

export const OpenAsyncSelect = ({
  isDisabled,
  name,
  loadOptions,
  onChange,
  defaultValue = null,
  placeholder,
  label,
  defaultOptions,
}: any) => {
  const [value, setValue] = useState(defaultValue);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    setValue(defaultValue ? { ...defaultValue } : null);
  }, [defaultValue]);

  function handleOnChange(event: any) {
    setValue(event);
    onChange(event.value);
  }

  return (
    <Flex w="100%" direction="column">
      <Box fontSize="14px" fontWeight="bold" mb="10px">
        {label}
      </Box>

      <InputGroup h="fit-content">
        <AsyncSelect
          name={name}
          value={value}
          isSearchable
          isClearable
          closeMenuOnSelect
          styles={selectStyles}
          isDisabled={isDisabled}
          onChange={handleOnChange}
          placeholder={placeholder}
          loadOptions={loadOptions}
          onInputChange={setInputValue}
          defaultOptions={defaultOptions}
          loadingMessage={() => 'Buscando información...'}
          noOptionsMessage={() =>
            inputValue !== ''
              ? 'No se encuentran resultados'
              : 'Escribe para mostrar opciones...'
          }
        />
      </InputGroup>
    </Flex>
  );
};

const selectStyles = {
  indicatorSeparator: (styles: any) => ({ ...styles, display: 'none' }),
  control: (styles: any, { isDisabled }: any) => ({
    ...styles,
    cursor: isDisabled ? 'not-allowed' : 'default',
    border: '1px solid var(--chakra-colors-gray_3)',
    backgroundColor: 'var(--chakra-colors-gray_2)',
    borderRadius: '12px',
    padding: '0px 12px',
    textAlign: 'left',
    height: '40px',
    width: '100%',
  }),
  dropdownIndicator: (styles: any) => ({
    ...styles,
    color: 'var(--chakra-colors-black)',
  }),
  container: (styles: any) => ({ ...styles, width: '100%' }),
  menu: (styles: any) => ({
    ...styles,
    backgroundColor: 'var(--chakra-colors-white)',
  }),
  valueContainer: (styles: any) => ({ ...styles, padding: '0px' }),
  option: (styles: any, { isFocused }: any) => ({
    ...styles,
    cursor: 'pointer',
    textAlign: 'left',
    fontWeight: 'medium',
    color: 'var(--chakra-colors-black)',
    backgroundColor: isFocused
      ? 'var(--chakra-colors-primary_light)'
      : 'var(--chakra-colors-white)',
  }),
  singleValue: (styles: any) => ({
    ...styles,
    color: 'var(--chakra-colors-black)',
    fontWeight: 'medium',
  }),
};
