import { useState, useEffect, useContext } from 'react';
import { Icon, Input, Tooltip, useToast } from '@chakra-ui/react';

import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { BiClipboard } from 'react-icons/bi';

import { onSuccess } from 'ui';
import { LoginContext } from '../../../../context';

import './InformationInputTooltip.scss';

export const InformationInputTooltip = ({
  value,
  onChange,
  isPassword = false,
  inputType = 'text',
  inputStyle,
  textStyle,
  textSuffix = '',

  allowCopy = false,
}: any) => {
  /**
   * -1: No se ha inicializado el valor
   * 0: Se deja de editar el input
   * 1: Se empieza a editar el input
   */
  const [isEditing, setEditing] = useState<-1 | 0 | 1>(-1);
  const [_value, setValue] = useState(value);

  const toast = useToast();
  const loginContext = useContext(LoginContext);

  useEffect(() => {
    setValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing === 0 && value !== undefined) onChange(_value);
  }, [isEditing]);

  const treatValue = () => {
    if (!_value) return;

    if (inputType === 'date') return new Date(_value).toISOString().substring(0, 10);
    else return _value;
  };

  const startEditing = () => setEditing(1);

  const inputRefCallback = (inputElement: any) => {
    if (inputElement) {
      inputElement.focus();
    }

    function handleClickOutside(event: any) {
      if (event.type === 'keypress' && event.key === 'Enter' && inputElement) setEditing(0);
    }

    document.addEventListener('keypress', handleClickOutside);

    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('keypress', handleClickOutside);
    };
  };

  const handleInputChange = (e: any) => {
    const value = e.target.value;
    setValue(value);
  };

  return (
    <>
      <Tooltip
        hasArrow
        className="inputtooltip-tooltip"
        label={isEditing === 1 ? '' : 'Haz click para editar'}
        aria-label="A tooltip"
      >
        {isEditing === 1 ? (
          <Input
            type={inputType}
            value={treatValue()}
            ref={inputRefCallback}
            onChange={handleInputChange}
            className="inputtooltip-input"
            style={inputStyle ? inputStyle : {}}
            onBlur={() => {
              setEditing(0);
            }}
          />
        ) : (
          <div style={{ ...textStyle }} onClick={startEditing}>
            {textSuffix}

            {_value
              ? inputType !== 'date'
                ? isPassword
                  ? '******'
                  : _value
                : format(new Date(_value), "dd 'de' LLLL", { locale: es })
              : 'Sin especificar'}
          </div>
        )}
      </Tooltip>

      {isPassword
        ? null
        : allowCopy &&
          _value &&
          isEditing !== 1 && (
            <Icon
              as={BiClipboard}
              title="Pulsa para copiar"
              className="clipboard-button"
              data-clipboard-text={_value}
              onClick={() => onSuccess(toast, 'Texto copiado')}
            />
          )}
    </>
  );
};
