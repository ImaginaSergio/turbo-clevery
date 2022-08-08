import { useCallback, useState } from 'react';

import {
  Box,
  Flex,
  Icon,
  Badge,
  FormLabel,
  FormControl,
  FormErrorMessage,
} from '@chakra-ui/react';
import { Field } from 'formik';
import { debounce } from 'lodash';
import { BiX } from 'react-icons/bi';
import AsyncSelect from 'react-select/async';

export type FormAsyncMultiSelectProps = {
  name: string;
  label?: string;
  loadOptions: any;
  placeholder?: string;
  defaultValue?: any[];
  isDisabled?: boolean;
  isRequired?: boolean;
};

export const FormAsyncMultiSelect = ({
  name,
  label,
  loadOptions,
  placeholder,
  defaultValue,
  isDisabled = false,
  isRequired = false,
}: FormAsyncMultiSelectProps) => {
  const [inputValue, setInputValue] = useState<string>('');

  const onChange = (event: any, form: any) => {
    form.setFieldValue(name, [...event]);
  };

  const removeTag = (index: number, current: any, form: any) => {
    form.setFieldValue(
      name,
      [...current]?.filter((t, i) => i !== index)
    );
  };

  const _loadOptions = useCallback(
    debounce((inputValue, callback) => {
      loadOptions(inputValue).then((options: any) => callback(options));
    }, 350),
    []
  );

  return (
    <Field name={name}>
      {({ form, field }: { field: any; form: any }) => (
        <FormControl isInvalid={form.errors[name] && form.touched[name]}>
          <FormLabel className="form-label" htmlFor={name}>
            {label}
            {isRequired && <Box color="cancel"> *</Box>}
          </FormLabel>

          <AsyncSelect
            isMulti
            defaultOptions
            isDisabled={isDisabled}
            placeholder={placeholder}
            loadOptions={_loadOptions}
            defaultValue={defaultValue}
            onInputChange={setInputValue}
            loadingMessage={() => 'Buscando información...'}
            onChange={(e) => onChange(e, form)}
            styles={{
              ...selectStyles,
              multiValue: (styles: any) => ({ ...styles, display: 'none' }),
            }}
            noOptionsMessage={() =>
              inputValue !== ''
                ? 'No se encuentran resultados'
                : 'Escribe para mostrar opciones...'
            }
          />

          <Flex wrap="wrap" pt="10px" gap="10px">
            {field?.value?.map(
              (
                item: { label: string; value: any; meta: any },
                index: number
              ) => (
                <Badge
                  key={`info-item-${index}`}
                  gap="8px"
                  bg="#e8e8e8"
                  p="7px 12px"
                  display="flex"
                  rounded="10px"
                  color="#a5a5a5"
                >
                  <Box fontSize="14px" fontWeight="medium">
                    {item.label}
                  </Box>

                  <Icon
                    as={BiX}
                    boxSize="21px"
                    cursor="pointer"
                    onClick={(e) => removeTag(index, field.value, form)}
                  />
                </Badge>
              )
            )}
          </Flex>

          <FormErrorMessage>{form.errors[name]}</FormErrorMessage>
        </FormControl>
      )}
    </Field>
  );
};

const selectStyles = {
  indicatorSeparator: (styles: any) => ({ display: 'none' }),
  singleValue: (styles: any) => ({
    ...styles,
    color: '#131340',
    fontWeight: 'normal',
  }),
  noOptionsMessage: (styles: any) => ({
    ...styles,
    fontSize: '14px',
    fontWeight: 'medium',
    textAlign: 'left',
  }),
  dropdownIndicator: (styles: any) => ({ ...styles, color: 'gray_6' }),
  control: (styles: any, { isDisabled }: any) => ({
    ...styles,
    cursor: isDisabled ? 'not-allowed' : 'default',
    border: '1px solid #EBE8F0',
    borderRadius: '4px',
    backgroundColor: 'var(--chakra-colors-gray_1)',
  }),
};
