import { Field } from 'formik';
import { es } from 'date-fns/locale';
import DatePicker, { registerLocale } from 'react-datepicker';
import {
  FormLabel,
  FormControl,
  FormErrorMessage,
  Box,
} from '@chakra-ui/react';

import './FormDateInput.scss';
import 'react-datepicker/dist/react-datepicker.css';

registerLocale('es', es);

export const FormDateInput = ({
  name,
  label,
  style = {},
  placeholder,
  type = 'datetime',
  controlStyle = {},
  onBlur = () => {},
  isDisabled = false,
  minDate = new Date(),
  showMonthDropdown,
  showYearDropdown,
  isRequired = false,
}: any) => {
  return (
    <Field name={name}>
      {({ field, form }: { field: any; form: any }) => (
        <FormControl
          style={controlStyle}
          isInvalid={form.errors[name] && form.touched[name]}
        >
          <FormLabel className="form-label" htmlFor={name}>
            {label}
            {isRequired && <Box color="cancel"> *</Box>}
          </FormLabel>

          <DatePicker
            {...field}
            id={name}
            locale="es"
            onBlur={onBlur}
            timeIntervals={15}
            minDate={minDate}
            timeFormat={'HH:mm'}
            disabled={isDisabled}
            placeholderText={placeholder}
            className={'dateinput-container'}
            peekNextMonth
            showMonthDropdown={showMonthDropdown}
            showYearDropdown={showYearDropdown}
            dropdownMode="select"
            showTimeSelect={type === 'datetime'}
            selected={(field.value && new Date(field.value)) || null}
            dateFormat={type === 'datetime' ? 'dd/MM/yyyy HH:mm' : 'dd/MM/yyyy'}
            onChange={(val) => form.setFieldValue(field.name, val)}
            onChangeRaw={(e) => e.preventDefault()}
          />

          <FormErrorMessage>{form.errors[name]}</FormErrorMessage>
        </FormControl>
      )}
    </Field>
  );
};
