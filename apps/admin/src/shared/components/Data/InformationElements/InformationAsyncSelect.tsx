import { useCallback, useEffect, useState } from 'react';

import { debounce } from 'lodash';
import AsyncSelect from 'react-select/async';
import { AiOutlineCloudSync } from 'react-icons/ai';
import { Flex, Icon, Spinner } from '@chakra-ui/react';

export type InformationAsyncSelectProps = {
  name: string;
  label: string;
  isMulti?: boolean;
  defaultValue?: any;
  isClearable?: boolean;
  isSearchable?: boolean;
  isDisabled?: boolean;
  placeholder?: string;
  disableMultiClose?: boolean;
  closeMenuOnSelect?: boolean;
  loadOptions: (e: any) => any;
  updateValue: (e?: any) => any;
  style?: React.CSSProperties;
};

export const InformationAsyncSelect = ({
  name,
  label,
  style,
  loadOptions,
  updateValue,
  placeholder = 'Escribe para buscar',
  isMulti = false,
  defaultValue = null,
  isSearchable = true,
  isClearable = false,
  isDisabled = false,
  closeMenuOnSelect = true,
  disableMultiClose = false,
}: InformationAsyncSelectProps) => {
  const [value, setValue] = useState(defaultValue);
  const [inputValue, setInputValue] = useState('');

  const [update, setUpdate] = useState<'idle' | 'editing' | 'loading'>('idle');

  useEffect(() => {
    if (isMulti) setValue(defaultValue);
    else setValue({ label: defaultValue?.label, value: defaultValue?.value });
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

  const _loadOptions = useCallback(
    debounce((inputValue, callback) => {
      loadOptions(inputValue).then((options: any) => callback(options));
    }, 350),
    []
  );

  const disableMultiCloseStyles = {
    multiValueRemove: (base: any) => ({ ...base, display: 'none' }),
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

      <AsyncSelect
        defaultOptions
        value={value}
        isMulti={isMulti}
        onChange={onChange}
        isClearable={isClearable}
        loadOptions={_loadOptions}
        isSearchable={isSearchable}
        onInputChange={setInputValue}
        closeMenuOnSelect={closeMenuOnSelect}
        loadingMessage={() => 'Buscando información...'}
        isDisabled={update === 'loading' || isDisabled}
        noOptionsMessage={() =>
          inputValue !== ''
            ? 'No se encuentran resultados'
            : 'Escribe para mostrar opciones...'
        }
        placeholder={placeholder}
        styles={
          disableMultiClose
            ? { ...selectStyles, ...disableMultiCloseStyles }
            : selectStyles
        }
      />
    </Flex>
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
  control: (styles: any) => ({
    ...styles,
    border: '1px solid #E6E8EE',
    borderRadius: '7px',
  }),
};
