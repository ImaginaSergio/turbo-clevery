import React from 'react';

import { Field } from 'formik';
import { Box, Checkbox, FormLabel, FormControl, FormErrorMessage } from '@chakra-ui/react';

type FormCheckboxProps = {
  inputRef?: any;
  name: string;
  label?: string;
  isRequired?: boolean;
  isDisabled?: boolean;
  onBlur?: (e?: any) => void | any;
  labelColor?: string;
  controlStyle?: React.CSSProperties;
  'data-cy'?: string;
};

export const StepsFormCheckbox = ({
  name,
  label,
  controlStyle = {},
  labelColor,
  inputRef,
  onBlur,
  ...props
}: FormCheckboxProps) => {
  const onChange = (value: any, form: any) => {
    form.setFieldValue(name, value);
  };

  return (
    <Field name={name}>
      {({ field, form }: { field: any; form: any }) => (
        <FormControl style={controlStyle} isInvalid={form.errors[name] && form.touched[name]}>
          {label && (
            <FormLabel htmlFor={name} className="form-label" color={labelColor || 'black'}>
              {label}
              {props.isRequired && <Box color="cancel"> *</Box>}
            </FormLabel>
          )}

          <Checkbox
            {...field}
            isChecked={field.value || false}
            onChange={(e: any) => onChange(e.target.checked, form)}
            {...props}
          >
            Acepto los{' '}
            <Box
              as="a"
              target="_blank"
              textDecoration="underline"
              href={
                process.env.REACT_APP_ORIGEN_CAMPUS === 'OPENMARKETERS'
                  ? 'https://open-marketers.com/terminos-condiciones'
                  : process.env.REACT_APP_ORIGEN_CAMPUS === 'OPENBOOTCAMP'
                  ? 'https://open-bootcamp.com/terminos-condiciones'
                  : ''
              }
            >
              Términos y Condiciones
            </Box>
            .
          </Checkbox>

          <FormErrorMessage>{form.errors[name]}</FormErrorMessage>
        </FormControl>
      )}
    </Field>
  );
};
