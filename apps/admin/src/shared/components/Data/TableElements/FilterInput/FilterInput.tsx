import { Input } from '@chakra-ui/react';

import './FilterInput.scss';

export const FilterInput = ({
  value,
  onChange,
  placeholder,
  type = 'text',
  min = undefined,
  max = undefined,
  step = undefined,
}: any) => {
  return (
    <Input
      min={min}
      max={max}
      type={type}
      step={step}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="table-filter-input"
    />
  );
};
