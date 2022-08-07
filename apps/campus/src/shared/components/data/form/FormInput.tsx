import React, { useEffect, useState } from 'react';

import { Field } from 'formik';
import {
  FormLabel,
  FormControl,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  FormErrorMessage,
  Flex,
  Spinner,
  Box,
} from '@chakra-ui/react';
import { BiHide, BiShow } from 'react-icons/bi';
import { AiOutlineCloudSync } from 'react-icons/ai';

type FormInputProps = {
  inputRef?: any;
  name: string;
  label?: string;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  type?: string;
  controlStyle?: React.CSSProperties;
  groupStyle?: React.CSSProperties;
  onBlur?: (e?: any) => void | any;
  isDisabled?: boolean;
  isRequired?: boolean;
  color?: string;
  gradient?: any;
  background?: string;
  labelColor?: string;
  'data-cy'?: string;
};

export const FormInput = ({
  inputRef,
  name,
  label,
  placeholder,
  min,
  max,
  step,
  type = 'text',
  controlStyle = {},
  groupStyle,
  onBlur = () => {},
  isDisabled = false,
  color = 'black',
  gradient,
  background,
  labelColor = 'black',
  isRequired = false,
  ...props
}: FormInputProps) => {
  const [show, setShow] = useState(false);

  const treatValue = (value: any) => {
    if (!value) return '';

    return type === 'date'
      ? new Date(value).toISOString().substring(0, 10)
      : value;
  };

  return (
    <Field name={name}>
      {({ field, form }: { field: any; form: any }) => (
        <FormControl
          style={controlStyle}
          isInvalid={form.errors[name] && form.touched[name]}
        >
          <FormLabel htmlFor={name} className="form-label" color={labelColor}>
            {label}
            {isRequired && <Box color="cancel"> *</Box>}
          </FormLabel>

          <InputGroup style={groupStyle}>
            <Input
              {...field}
              focusBorderColor={
                process.env.NX_ORIGEN_CAMPUS === 'OPENBOOTCAMP'
                  ? '#09C598'
                  : '#7D55F1'
              }
              data-cy={props['data-cy']}
              ref={inputRef}
              id={name}
              min={min}
              max={max}
              step={step}
              color={color}
              bg={background}
              onBlur={onBlur}
              isDisabled={isDisabled}
              placeholder={placeholder}
              bgGradient={gradient}
              border="1px"
              borderColor="rgba(255, 255, 255, 0.4)"
              outline="none"
              fontSize="14px"
              fontWeight="medium"
              value={treatValue(field.value) || ''}
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
                  color={color}
                  title={show ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  onClick={() => setShow(!show)}
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

export interface InformationInputProps {
  name: string;
  label?: string;
  type?: string;
  noHead?: boolean;
  isDisabled?: boolean;
  defaultValue?: any;
  placeholder?: string;
  style?: React.CSSProperties;

  updateValue: (e?: any) => any;
  onNullValue?: (e?: any) => any;
}

export const InformationInput = ({
  noHead,
  name,
  label,
  isDisabled,
  defaultValue,
  type = 'text',
  placeholder = '',
  style,
  updateValue,
  onNullValue,
}: InformationInputProps) => {
  const [value, setValue] = useState<any>(defaultValue || '');

  const [update, setUpdate] = useState<'idle' | 'editing' | 'loading'>('idle');
  const [timeoutkey, setTimeoutkey] = useState<any>();

  useEffect(() => {
    if (timeoutkey) {
      clearTimeout(timeoutkey);
      setTimeoutkey(undefined);
    }

    setValue(defaultValue || '');
  }, [defaultValue]);

  function onChange(event: any) {
    const value = event.target.value;
    if (update === 'idle') setUpdate('editing');

    setValue(value);
  }

  function onBlur() {
    setUpdate('loading');

    function checkValue(_value: string) {
      if ((!_value || _value === '') && onNullValue) return onNullValue();
      else return _value;
    }

    updateValue({ [name]: checkValue(value) })
      .then((res: any) => setUpdate('idle'))
      .catch((error: any) => console.error({ error }));
  }

  return (
    <Flex fontSize="14px" direction="column" style={style}>
      {!noHead && (
        <label className="information-block-label">
          {label}

          {update === 'editing' ? (
            <Icon as={AiOutlineCloudSync} ml="2" boxSize="14px" />
          ) : update === 'loading' ? (
            <Spinner ml="2" boxSize="14px" />
          ) : null}
        </label>
      )}

      <Input
        value={value}
        rounded="7px"
        color="#131340"
        border="1px solid"
        borderColor="gray_5"
        type={type}
        onBlur={onBlur}
        onChange={onChange}
        placeholder={placeholder}
        isDisabled={isDisabled || update === 'loading'}
      />
    </Flex>
  );
};
