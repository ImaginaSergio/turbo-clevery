import { useEffect, useState } from 'react';

import { BiX } from 'react-icons/bi';
import PhoneInput from 'react-phone-number-input';
import { Text, Flex, Box, InputGroup, Icon, InputRightElement } from '@chakra-ui/react';

import { localeEs } from './es';

import './OpenPhoneInput.css';
import 'react-phone-number-input/style.css';

type OpenPhoneInputtProps = {
  name: string;
  label: string;
  type?: any;
  isDisabled?: boolean;
  isClearable?: boolean;
  onChange: (e?: any) => void;
  defaultValue?: any;
  placeholder?: string;
  onValidate?: (e?: any) => Promise<any>;
};

export const OpenPhoneInput = ({
  name,
  label,
  isDisabled,
  isClearable,
  onChange,
  defaultValue,
  placeholder,
  onValidate,
}: OpenPhoneInputtProps) => {
  const [value, setValue] = useState<any>(defaultValue);
  const [errors, setErrors] = useState<string>();
  const [countryCode, setCountryCode] = useState<any>('ES');

  useEffect(() => {
    (async () => {
      await fetch(`https://api.ipdata.co?api-key=${process.env.NX_IPDATA_KEY}&fields=country_code`)
        .then((data) => data.json())
        .then((response: any) => setCountryCode(response?.data?.country_code || 'ES'))
        .catch((error) => console.error(error));
    })();
  }, []);

  function handleInput(value: any) {
    setValue(value);
    onChange({ [name]: value });
  }

  function handleRemove() {
    setValue('');

    if (onChange) onChange({ [name]: '' });
  }

  return (
    <Flex w="100%" direction="column">
      <Box fontSize="14px" fontWeight="bold" mb="10px">
        {label}
      </Box>

      <InputGroup id={`perfil-phoneinput-${name}`} h="fit-content">
        <PhoneInput
          value={value}
          labels={localeEs}
          onChange={handleInput}
          disabled={isDisabled}
          data-cy="phone_number_input"
          placeholder={placeholder}
          defaultCountry={countryCode}
          style={{
            color: 'var(--chakra-colors-black)',
            backgroundColor: 'var(--chakra-colors-gray_2)',
          }}
          countrySelectProps={{
            style: { backgroundColor: 'var(--chakra-colors-gray_2)' },
          }}
        />

        {isClearable && (
          <InputRightElement
            onClick={handleRemove}
            children={
              <Icon
                as={BiX}
                opacity="0"
                color="black"
                boxSize="24px"
                cursor="pointer"
                transition="0.2s all ease"
                sx={{
                  [`#perfil-phoneinput-${name}:hover &`]: {
                    opacity: '1',
                  },
                }}
              />
            }
          />
        )}
      </InputGroup>

      {errors && (
        <Text color="cancel" fontSize="14px" mt="8px">
          {errors}
        </Text>
      )}
    </Flex>
  );
};
