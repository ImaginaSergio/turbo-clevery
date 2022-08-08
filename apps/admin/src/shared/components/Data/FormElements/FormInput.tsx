import React, { useState } from 'react';

import { Field } from 'formik';
import {
  FormLabel,
  FormControl,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  FormErrorMessage,
  Box,
} from '@chakra-ui/react';
import { BiHide, BiShow } from 'react-icons/bi';

export const FormInput = ({
  name,
  label,
  placeholder,
  min,
  max,
  step,
  type = 'text',
  style = {},
  controlStyle = {},
  onBlur = () => {},
  isDisabled = false,
  isRequired = false,
}: any) => {
  const [show, setShow] = useState(false);

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

          <InputGroup>
            <Input
              {...field}
              style={style}
              min={min}
              max={max}
              step={step}
              color="black"
              onBlur={onBlur}
              isDisabled={isDisabled}
              placeholder={placeholder}
              value={field.value || ''}
              type={type === 'password' ? (show ? 'text' : 'password') : type}
              _placeholder={{
                color: 'gray_4',
                fontSize: '16px',
                fontWeight: 'medium',
              }}
            />

            {type === 'password' && (
              <InputRightElement>
                <Icon
                  as={show ? BiHide : BiShow}
                  boxSize="24px"
                  cursor="pointer"
                  onClick={() => setShow(!show)}
                  title={show ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                />
              </InputRightElement>
            )}
          </InputGroup>

          <FormErrorMessage>{form.errors[name]}</FormErrorMessage>
        </FormControl>
      )}
    </Field>
  );
};
