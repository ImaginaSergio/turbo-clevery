import { useEffect, useState, useCallback } from 'react';

import { debounce } from 'lodash';
import { AiOutlineCloudSync } from 'react-icons/ai';
import { Icon, Spinner, Flex } from '@chakra-ui/react';
import AsyncCreatableSelect from 'react-select/async-creatable';

export type InformationAsyncCreatableSelectProps = {
  name: string;
  label: string;
  loadOptions: (value?: string) => any;
  isMulti?: boolean;
  placeholder?: string;
  defaultValue?: any;
  closeMenuOnSelect?: boolean;
  onCreateOption?: (e?: any) => void | any;
  isSearchable?: boolean;
  isClearable?: boolean;
  isDisabled?: boolean;
  updateValue: (e?: any) => void | any;
};

export const InformationAsyncCreatableSelect = ({
  name,
  label,
  loadOptions,
  isMulti = false,
  defaultValue = null,
  closeMenuOnSelect = true,
  onCreateOption = (e: any) => {},
  isSearchable = true,
  isClearable = false,
  isDisabled = false,
  placeholder = 'Escribe para buscar',
  updateValue,
}: InformationAsyncCreatableSelectProps) => {
  const [value, setValue] = useState(defaultValue);
  const [inputValue, setInputValue] = useState('');

  const [update, setUpdate] = useState<'idle' | 'editing' | 'loading'>('idle');

  useEffect(() => {
    if (isMulti) {
      setValue(defaultValue);
    } else setValue({ label: defaultValue?.label, value: defaultValue?.value });
  }, [defaultValue]);

  const onChange = (e: any) => {
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

  return (
    <Flex direction="column" fontSize="14px" fontFamily="Inter">
      <label className="information-block-label">
        {label}

        {update === 'editing' ? (
          <Icon as={AiOutlineCloudSync} ml="2" boxSize="14px" />
        ) : update === 'loading' ? (
          <Spinner ml="2" boxSize="14px" />
        ) : null}
      </label>

      <div>
        <AsyncCreatableSelect
          value={value}
          isMulti={isMulti}
          onChange={onChange}
          styles={selectStyles}
          placeholder={placeholder}
          isClearable={isClearable}
          loadOptions={_loadOptions}
          isSearchable={isSearchable}
          onInputChange={setInputValue}
          onCreateOption={onCreateOption}
          closeMenuOnSelect={closeMenuOnSelect}
          isDisabled={update === 'loading' || isDisabled}
          formatCreateLabel={(inputValue) => `Crear "${inputValue}"`}
          noOptionsMessage={() =>
            inputValue !== ''
              ? 'No se encuentran resultados'
              : 'Escribe para mostrar opciones...'
          }
        />
      </div>
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
    border: '1px solid #EBE8F0',
    borderRadius: '4px',
  }),
};
