import { useState, useEffect } from 'react';

import Select from 'react-select';
import { AiOutlineCloudSync } from 'react-icons/ai';
import { Flex, Icon, Spinner } from '@chakra-ui/react';

type InformationSelectProps = {
  name: string;
  label?: string;
  options: { label: string; value: any }[];
  style?: React.CSSProperties;
  isMulti?: boolean;
  isDisabled?: boolean;
  placeholder?: string;
  isClearable?: boolean;
  isSearchable?: boolean;
  closeMenuOnSelect?: boolean;
  defaultValue?: { label: string; value: any };
  updateValue: (e?: any) => any;
};

export const InformationSelect = ({
  name,
  label,
  options,
  style,
  isMulti = false,
  defaultValue,
  closeMenuOnSelect = true,
  isSearchable = true,
  isClearable = false,
  placeholder = 'Escribe para buscar',
  isDisabled = false,
  updateValue,
}: InformationSelectProps) => {
  const [value, setValue] = useState<{ label: string; value: any } | undefined>(
    defaultValue
  );

  const [update, setUpdate] = useState<'idle' | 'editing' | 'loading'>('idle');

  useEffect(() => {
    if (defaultValue) setValue({ ...defaultValue });
  }, [defaultValue]);

  const onChange = (e: any) => {
    setUpdate('loading');

    if (isMulti)
      updateValue({ [name]: [...e.map((item: any) => item.value)] }).then(
        (res: any) => {
          setUpdate('idle');
        }
      );
    else if (e !== null)
      updateValue({ [name]: e.value }).then((res: any) => {
        setUpdate('idle');
      });
    else
      updateValue({ [name]: null }).then((res: any) => {
        setUpdate('idle');
      });
  };

  return (
    <Flex direction="column" fontSize="14px" style={style}>
      <label className="information-block-label">
        {label}

        {update === 'editing' ? (
          <Icon as={AiOutlineCloudSync} ml="2" boxSize="14px" />
        ) : update === 'loading' ? (
          <Spinner ml="2" boxSize="14px" />
        ) : null}
      </label>

      <Select
        value={value}
        isMulti={isMulti}
        options={options}
        onChange={onChange}
        styles={selectStyles}
        placeholder={placeholder}
        isClearable={isClearable}
        isSearchable={isSearchable}
        closeMenuOnSelect={closeMenuOnSelect}
        isDisabled={isDisabled || update === 'loading'}
      />
    </Flex>
  );
};

const selectStyles = {
  container: (styles: any, { isDisabled }: any) => ({
    ...styles,
    cursor: isDisabled ? 'not-allowed' : 'default',
  }),
  singleValue: (styles: any) => ({
    ...styles,
    color: '#131340',
    fontWeight: 'normal',
  }),
  indicatorSeparator: (styles: any) => ({ display: 'none' }),
  control: (styles: any) => ({
    ...styles,
    borderRadius: '7px',
    border: '1px solid #E6E8EE',
  }),
  option: (styles: any, { isFocused }: any) => ({
    ...styles,
    cursor: 'pointer',
    textAlign: 'left',
    fontWeight: 'medium',
    color: 'var(--chakra-colors-black)',
    backgroundColor: isFocused
      ? 'var(--chakra-colors-primary_light)'
      : 'var(--chakra-colors-white)',
  }),
};
