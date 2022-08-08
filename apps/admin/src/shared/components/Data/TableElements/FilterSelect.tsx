import Select from 'react-select';

export const FilterSelect = ({
  value,
  options,
  onChange,
  placeholder,
  defaultValue,
  isMulti = false,
  styles,
}: any) => {
  return (
    <Select
      isMulti={isMulti}
      value={value}
      options={options}
      defaultValue={defaultValue}
      onChange={onChange}
      placeholder={placeholder}
      styles={{ ...filterSelectStyles, ...styles }}
      closeMenuOnSelect={!isMulti}
    />
  );
};

const filterSelectStyles = {
  control: (styles: any, { isFocused }: any) => ({
    ...styles,
    backgroundColor: 'white',
    border: '1px solid #E7E7E7',
  }),
  singleValue: (styles: any) => ({
    ...styles,
    color: '#131340',
    fontSize: '16px',
    fontWeight: '500',
  }),
  placeholder: (styles: any) => ({
    ...styles,
    color: '#c7c8cd',
    fontSize: '16px',
    fontWeight: '500',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  }),
  indicatorSeparator: (styles: any) => ({ ...styles, display: 'none' }),
  dropdownIndicator: (styles: any) => ({ ...styles, color: '#A3A3B4' }),
  option: (styles: any, { isFocused }: any) => ({
    ...styles,
    cursor: 'pointer',
    textAlign: 'left',
    color: 'var(--chakra-colors-black)',
    backgroundColor: isFocused
      ? 'var(--chakra-colors-primary_light)'
      : 'var(--chakra-colors-white)',
    fontWeight: 'medium',
  }),
};
