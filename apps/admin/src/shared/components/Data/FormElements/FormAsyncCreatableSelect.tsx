import { useCallback, useEffect, useState } from 'react';

import { useToast, FormLabel, FormControl, FormErrorMessage, Box } from '@chakra-ui/react';
import { Field } from 'formik';
import { debounce } from 'lodash';
import AsyncCreatableSelect from 'react-select/async-creatable';

import { onFailure } from 'ui';

type FormAsyncCreatableSelectProps = {
  name: string;
  label: string;
  placeholder?: string;
  defaultValue?: any;
  closeMenuOnSelect?: boolean;
  isSearchable?: boolean;
  isRequired?: boolean;
  isDisabled?: boolean;
  isClearable?: boolean;
  controlStyle?: React.CSSProperties;
  onCreateOption?: (e: any) => any;
  loadOptions: (value: string) => any;
};

export const FormAsyncCreatableSelect = ({
  name,
  label,
  loadOptions,
  placeholder = 'Escribe para buscar',
  defaultValue,
  closeMenuOnSelect = true,
  isSearchable = true,
  isClearable = false,
  isDisabled = false,
  isRequired = false,
  onCreateOption = (e: any) => {},
  controlStyle = {},
}: FormAsyncCreatableSelectProps) => {
  const toast = useToast();

  const [value, setValue] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>('');

  useEffect(() => {
    setValue(defaultValue);
  }, []);

  const onChange = (e: any, form: any) => {
    setLoading(true);

    setValue(e);
    form.setFieldValue(name, e !== null ? e.value : null);

    setLoading(false);
  };

  const handleCreate = (nombre: string, form: any) => {
    setLoading(true);

    onCreateOption(nombre)
      .then((e: any) => onChange(e, form))
      .catch((error: any) => onFailure(toast, error.title, error.message));
  };

  const _loadOptions = useCallback(
    debounce((inputValue, callback) => {
      loadOptions(inputValue).then((options: any) => callback(options));
    }, 350),
    []
  );

  return (
    <Field name={name}>
      {({ form }: { field: any; form: any }) => (
        <FormControl style={controlStyle} isInvalid={form.errors[name] && form.touched[name]}>
          <FormLabel className="form-label" htmlFor={name}>
            {label}
            {isRequired && <Box color="cancel"> *</Box>}
          </FormLabel>

          <AsyncCreatableSelect
            value={value}
            isLoading={loading}
            styles={selectStyles}
            isDisabled={isDisabled}
            placeholder={placeholder}
            isClearable={isClearable}
            loadOptions={_loadOptions}
            isSearchable={isSearchable}
            onInputChange={setInputValue}
            onChange={(e) => onChange(e, form)}
            closeMenuOnSelect={closeMenuOnSelect}
            formatCreateLabel={(inputValue) => `Crear "${inputValue}"`}
            noOptionsMessage={() => (inputValue !== '' ? 'No se encuentran resultados' : 'Escribe para mostrar opciones...')}
            onCreateOption={(nombre) => handleCreate(nombre, form)}
          />

          <FormErrorMessage>{form.errors[name]}</FormErrorMessage>
        </FormControl>
      )}
    </Field>
  );
};

const selectStyles = {
  noOptionsMessage: (styles: any) => ({
    ...styles,
    fontSize: '16px',
    textAlign: 'left',
  }),
  singleValue: (styles: any) => ({
    ...styles,
    color: '#131340',
    fontWeight: 'normal',
  }),
  indicatorSeparator: (styles: any) => ({ display: 'none' }),
  control: (styles: any, { isDisabled }: any) => ({
    ...styles,
    cursor: isDisabled ? 'not-allowed' : 'default',
    border: '1px solid #EBE8F0',
    borderRadius: '4px',
  }),
};
