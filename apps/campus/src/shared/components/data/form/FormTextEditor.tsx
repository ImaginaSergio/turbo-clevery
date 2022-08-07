import {
  Box,
  FormLabel,
  FormControl,
  FormErrorMessage,
} from '@chakra-ui/react';
import { Field } from 'formik';
import ReactQuill from 'react-quill';

import 'react-quill/dist/quill.bubble.css';
import './Markdown.scss';

export const FormTextEditor = ({
  name,
  label,
  placeholder,
  controlStyle = {},
  onBlur = () => {},
  isDisabled = false,
  isRequired = false,
}: any) => {
  return (
    <Field name={name}>
      {({ field, form }: { field: any; form: any }) => (
        <FormControl
          style={controlStyle}
          isInvalid={form.errors[name] && form.touched[name]}
        >
          <FormLabel className="form-label" htmlFor={name} color="black">
            {label}
            {isRequired && <Box color="cancel"> *</Box>}
          </FormLabel>

          <ReactQuill
            theme="bubble"
            value={field.value}
            placeholder={placeholder}
            style={{
              minHeight: '140px',
              borderRadius: '7px',
              color: 'var(--chakra-colors-black)',
              backgroundColor: 'var(--chakra-colors-gray_2)',
              border: '1px solid var(--chakra-colors-gray_3)',
            }}
            onChange={(data: any) => form.setFieldValue(name, data)}
          />

          <FormErrorMessage>{form.errors[name]}</FormErrorMessage>
        </FormControl>
      )}
    </Field>
  );
};
