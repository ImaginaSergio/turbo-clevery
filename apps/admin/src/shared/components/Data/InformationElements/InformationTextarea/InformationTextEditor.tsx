import { useState, useEffect } from 'react';

import { BiClipboard } from 'react-icons/bi';
import { Spinner, Icon, useToast, Flex } from '@chakra-ui/react';
import { AiOutlineFileSync, AiOutlineCloudSync } from 'react-icons/ai';

import { OpenEditor } from 'ui';
import { onFailure, onSuccess } from 'ui';

type InformationTextEditorProps = {
  name: string;
  label?: string;
  placeholder?: string;
  allowCopy?: boolean;
  dataToSync?: any;
  defaultValue?: string;
  isDisabled?: boolean;
  style?: React.CSSProperties;
  updateValue: (e?: any) => void | any;
};

export const InformationTextEditor = ({
  name,
  label,
  style,
  isDisabled,
  placeholder,
  dataToSync = '',
  defaultValue = '',
  allowCopy = false,
  updateValue,
}: InformationTextEditorProps) => {
  const toast = useToast();

  const [value, setValue] = useState<string>(defaultValue);
  const [valueToSync, setValueToSync] = useState<string>(dataToSync);

  const [update, setUpdate] = useState<'idle' | 'editing' | 'loading'>('idle');

  useEffect(() => {
    setValueToSync(dataToSync);
  }, [dataToSync]);

  const onFocus = () => {
    setUpdate('editing');
  };

  const onChange = (e: string) => {
    setValue(e);
    setUpdate('loading');

    updateValue({ [name]: e }).then((res: any) => {
      setUpdate('idle');
    });
  };

  const syncData = () => {
    if (value) {
      onFailure(toast, 'Error al sincronizar', '¡Borra toda la información actual para sincronizar!');
    } else {
      setUpdate('loading');

      if (updateValue)
        updateValue({ [name]: valueToSync }).then((res: any) => {
          setUpdate('idle');
        });
    }
  };

  return (
    <Flex direction="column" fontSize="14px" style={style}>
      {label && (
        <label className="information-block-label">
          {label}

          <Flex w="fit-content" align="center" gap="4px">
            {update === 'editing' ? (
              <Icon ml="2" as={AiOutlineCloudSync} color={value === defaultValue ? 'gray_5' : 'primary'} />
            ) : update === 'loading' ? (
              <Spinner ml="2" boxSize="14px" />
            ) : null}

            {allowCopy && value && update === 'idle' && (
              <Icon
                as={BiClipboard}
                title="Pulsa para copiar"
                className="clipboard-button"
                data-clipboard-text={value}
                onClick={() => onSuccess(toast, 'Texto copiado')}
              />
            )}

            {valueToSync && (
              <Icon
                as={AiOutlineFileSync}
                ml="8px"
                boxSize="22px"
                cursor="pointer"
                onClick={syncData}
                title="Pulsa para sincronizar la información"
              />
            )}
          </Flex>
        </label>
      )}

      <OpenEditor
        onFocus={onFocus}
        onChange={onChange}
        value={defaultValue}
        isDisabled={isDisabled}
        placeholder={placeholder}
      />
    </Flex>
  );
};
