import { Field } from 'formik';
import { FormControl, FormErrorMessage, Checkbox, Box } from '@chakra-ui/react';

export const FormCheckbox = ({
  name,
  label,
  style = {},
  controlStyle = {},
  onBlur = () => {},
  isDisabled = false,
}: any) => {
  return (
    <Field name={name}>
      {({ field, form }: { field: any; form: any }) => (
        <FormControl
          style={controlStyle}
          isInvalid={form.errors[name] && form.touched[name]}
        >
          <Checkbox
            {...field}
            id={name}
            style={style}
            onBlur={onBlur}
            isDisabled={isDisabled}
          >
            {label}
          </Checkbox>

          <FormErrorMessage>{form.errors[name]}</FormErrorMessage>
        </FormControl>
      )}
    </Field>
  );
};
