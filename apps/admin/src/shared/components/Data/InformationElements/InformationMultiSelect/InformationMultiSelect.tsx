import { useCallback, useContext, useEffect, useState } from 'react';

import { debounce } from 'lodash';
import AsyncSelect from 'react-select/async';
import { BiX, BiCloudUpload } from 'react-icons/bi';
import { Flex, Badge, Icon, Spinner, useToast } from '@chakra-ui/react';

import { onFailure } from '@clevery/utils';
import { LoginContext } from '../../../../context';

import './InformationMultiSelect.scss';

export type InformationMultiSelectProps = {
  label: string;
  name: string;
  isDisabled?: boolean;
  placeholder?: string;
  style?: React.CSSProperties;
  loadOptions: (e?: any) => any;
  updateValue: (e?: any) => void | any;
  defaultValue?: { label: string; value: any }[];
};

export const InformationMultiSelect = ({
  label,
  name,
  style,
  isDisabled,
  placeholder = 'Escribe para buscar',
  loadOptions,
  updateValue,
  defaultValue = [],
}: InformationMultiSelectProps) => {
  const toast = useToast();

  const [value, setValue] = useState(defaultValue);
  const [update, setUpdate] = useState<'idle' | 'editing' | 'loading'>('idle');

  useEffect(() => {
    setValue([...defaultValue]);
  }, [defaultValue]);

  const onChange = (event: any) => {
    if (event.length < value.length) return;

    setUpdate('loading');

    setValue([...event]);
    updateValue({ [name]: event.map((tag: any) => tag.value) })
      .then((res: any) => setUpdate('idle'))
      .catch((error: any) => onFailure(toast, error.title, error.message));
  };

  const removeTag = (index: number) => {
    setUpdate('loading');
    const newValue = value.filter((e: any, i: number) => i !== index);

    setValue(newValue);
    updateValue({ [name]: newValue.map((tag: any) => tag.value) })
      .then((res: any) => setUpdate('idle'))
      .catch((error: any) => onFailure(toast, error.title, error.message));
  };

  const _loadOptions = useCallback(
    debounce((inputValue, callback) => {
      loadOptions(inputValue).then((options: any) => callback(options));
    }, 350),
    []
  );

  return (
    <Flex direction="column" fontSize="14px">
      <label className="information-block-label">
        {label}

        {update === 'editing' ? (
          <Icon as={BiCloudUpload} ml="2" boxSize="14px" />
        ) : update === 'loading' ? (
          <Spinner ml="2" boxSize="14px" />
        ) : null}
      </label>

      <AsyncSelect
        isMulti
        value={value}
        menuPlacement="top"
        isClearable={false}
        isSearchable
        onChange={onChange}
        loadOptions={_loadOptions}
        placeholder={placeholder}
        loadingMessage={() => 'Buscando información...'}
        isDisabled={update === 'loading' || isDisabled}
        styles={{
          ...reactSelectStyles,
          multiValue: (styles: any) => ({ ...styles, display: 'none' }),
        }}
      />

      <Flex wrap="wrap" mt="10px">
        {value?.map((tag: any, index: number) => (
          <Badge key={`selectmulti-badge-${index}`} className="etiquetas-badge">
            {tag.label}

            <Icon
              className="etiquetas-badge-close"
              as={BiX}
              cursor={isDisabled ? 'not-allowed' : 'pointer'}
              onClick={(e) => {
                if (!isDisabled) removeTag(index);
              }}
            />
          </Badge>
        ))}
      </Flex>
    </Flex>
  );
};

const reactSelectStyles = {
  control: (styles: any) => ({
    ...styles,
    backgroundColor: 'white',
    border: '1px solid #E7E7E7',
  }),
  singleValue: (styles: any) => ({ ...styles, color: '#273360' }),
  placeholder: (styles: any) => ({
    ...styles,
    color: '#DDDDDD',
    fontSize: '14px',
  }),
  indicatorSeparator: (styles: any) => ({ ...styles, display: 'none' }),
  dropdownIndicator: (styles: any) => ({ ...styles, color: '#DBDBDB' }),
  option: (styles: any, { isFocused }: any) => {
    return {
      ...styles,
      backgroundColor: isFocused ? '#E8EDFF' : 'white',
      color: '#131340',
      fontSize: '14px',
    };
  },
};
