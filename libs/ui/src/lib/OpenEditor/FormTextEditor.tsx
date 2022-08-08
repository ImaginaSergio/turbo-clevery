import React from 'react';

import { Field } from 'formik';
import { FormLabel, FormControl, FormErrorMessage } from '@chakra-ui/react';

import { OpenEditor } from './OpenEditor';

type FormTextEditorProps = {
  name: string;
  label: string;
  placeholder?: string;
  isDisabled?: boolean;
  isRequired?: boolean;
  controlStyle?: React.CSSProperties;
};

export const FormTextEditor = ({
  name,
  label,
  placeholder,
  controlStyle = {},
  isDisabled = false,
  isRequired = false,
}: FormTextEditorProps) => {
  return (
    <Field name={name}>
      {({ field, form }: { field: any; form: any }) => (
        <FormControl style={controlStyle} isRequired={isRequired} isInvalid={form.errors[name] && form.touched[name]}>
          <FormLabel className="form-label" htmlFor={name} color="black">
            {label}
          </FormLabel>

          <OpenEditor
            value={field.value}
            isDisabled={isDisabled}
            placeholder={placeholder}
            onChange={(data: any) => form.setFieldValue(name, data)}
          />

          <FormErrorMessage>{form.errors[name]}</FormErrorMessage>
        </FormControl>
      )}
    </Field>
  );
};
