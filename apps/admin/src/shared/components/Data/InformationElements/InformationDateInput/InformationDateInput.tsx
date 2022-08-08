import { useContext, useEffect, useState } from 'react';

import es from 'date-fns/locale/es';
import { format } from 'date-fns';
import DatePicker, { registerLocale } from 'react-datepicker';
import { Flex, Spinner, Icon } from '@chakra-ui/react';

import { AiOutlineCloudSync } from 'react-icons/ai';
import { LoginContext } from '../../../../context';

import './InformationDateInput.scss';
import 'react-datepicker/dist/react-datepicker.css';

registerLocale('es', es);

export interface InformationDateInputProps {
  name: string;
  label: string;
  isDisabled?: boolean;
  defaultValue?: any;
  type?: 'datetime' | 'date';

  style?: React.CSSProperties;

  updateValue: (e?: any) => any;
}

export const InformationDateInput = ({
  type = 'datetime',
  name,
  label,
  isDisabled,
  defaultValue,
  style,
  updateValue,
}: InformationDateInputProps) => {
  const { user } = useContext(LoginContext);

  const [value, setValue] = useState(
    typeof defaultValue === 'string' ? new Date(defaultValue) : defaultValue
  );
  const [update, setUpdate] = useState<'idle' | 'editing' | 'loading'>('idle');

  useEffect(() => {
    if (typeof defaultValue === 'string') setValue(new Date(defaultValue));
    else setValue(defaultValue);
  }, [defaultValue]);

  useEffect(() => {
    if (update === 'editing') {
      setUpdate('loading');

      let dateFormatted = value;
      if (type === 'date') dateFormatted = format(new Date(value), 'P');

      if (dateFormatted === '01/01/1970') dateFormatted = null;

      updateValue({ [name]: dateFormatted }).then((res: any) => {
        setUpdate('idle');
      });
    }
  }, [value]);

  function onChange(date: any) {
    if (update === 'idle') setUpdate('editing');

    setValue(date);
  }

  return (
    <Flex fontSize="14px" direction="column" style={style}>
      <label className="information-block-label">
        {label}

        {update === 'editing' ? (
          <Icon as={AiOutlineCloudSync} ml="2" boxSize="14px" />
        ) : update === 'loading' ? (
          <Spinner ml="2" boxSize="14px" />
        ) : null}
      </label>

      <DatePicker
        locale="es"
        selected={value}
        onChange={onChange}
        showTimeSelect={type === 'datetime'}
        className={'dateinput-container'}
        placeholderText="Sin especificar"
        dateFormat={type === 'datetime' ? 'dd/MM/yyyy HH:mm' : 'dd/MM/yyyy'}
        timeFormat={'HH:mm'}
        timeIntervals={15}
        // minDate={new Date()}
        onChangeRaw={(e) => e.preventDefault()}
        isClearable={isDisabled}
        disabled={isDisabled || update === 'loading'}
      />
    </Flex>
  );
};
