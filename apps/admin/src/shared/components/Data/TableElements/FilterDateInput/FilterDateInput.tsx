import { useEffect, useState } from 'react';

import es from 'date-fns/locale/es';
import ReactDatePicker, { registerLocale } from 'react-datepicker';

import './FilterDateInput.scss';
import 'react-datepicker/dist/react-datepicker.css';

registerLocale('es', es);

export const FilterDateInput = ({ value, placeholder, onChange, selectsRange = false }: any) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    if (selectsRange && value) {
      const [start, end] = value;

      setStartDate(start);
      setEndDate(end);
    } else {
      setStartDate(value);
    }
  }, [selectsRange, value]);

  return (
    <ReactDatePicker
      locale="es"
      isClearable
      selected={startDate}
      startDate={startDate}
      endDate={endDate}
      onChange={onChange}
      selectsRange={selectsRange}
      placeholderText={placeholder}
      className="table-filter-dateinput"
      dateFormat={selectsRange ? 'dd MMM' : 'dd/MM/yyyy'}
    />
  );
};
