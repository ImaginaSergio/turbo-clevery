import { useEffect, useState } from 'react';

import { AiOutlineCloudSync } from 'react-icons/ai';
import { Flex, Input, Spinner, Icon, Box } from '@chakra-ui/react';

export interface InformationInputProps {
  name: string;
  label?: string;
  type?: string;
  noHead?: boolean;
  isDisabled?: boolean;
  defaultValue?: any;
  placeholder?: string;
  validator?: string;
  style?: React.CSSProperties;
  autoComplete?: 'on' | 'off';

  min?: number;
  max?: number;
  step?: number;

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
  min,
  max,
  step,
  validator,
  autoComplete,
  style,
  updateValue,
  onNullValue,
}: InformationInputProps) => {
  const [value, setValue] = useState<any>(defaultValue);
  const [isInvalid, setIsInvalid] = useState(false);

  const [update, setUpdate] = useState<'idle' | 'editing' | 'loading'>('idle');
  const [timeoutkey, setTimeoutkey] = useState<any>();

  useEffect(() => {
    if (timeoutkey) {
      clearTimeout(timeoutkey);
      setTimeoutkey(undefined);
    }

    setValue(defaultValue);
  }, [defaultValue]);

  function onChange(event: any) {
    const value = event.target.value;
    if (update === 'idle') setUpdate('editing');

    setIsInvalid(false);
    setValue(value);
  }

  function onBlur() {
    setUpdate('loading');

    function treatValue(_value: string) {
      if ((!_value || _value === '') && onNullValue) return onNullValue();
      else return _value;
    }

    if (validator && !value?.startsWith(validator)) {
      setIsInvalid(true);
      setUpdate('idle');

      return;
    }

    updateValue({ [name]: treatValue(value) })
      .then((res: any) => setUpdate('idle'))
      .catch((error: any) => {
        console.error({ error });
        setUpdate('idle');
      });
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
        isInvalid={isInvalid}
        rounded="7px"
        color="#131340"
        value={value}
        type={type}
        step={step}
        min={min}
        max={max}
        onBlur={onBlur}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        border="1px solid #E6E8EE"
        isDisabled={isDisabled || update === 'loading'}
      />

      {isInvalid && (
        <Box mt="4px" color="crimson">
          El texto debe empezar por: <i>{validator}</i>
        </Box>
      )}
    </Flex>
  );
};
