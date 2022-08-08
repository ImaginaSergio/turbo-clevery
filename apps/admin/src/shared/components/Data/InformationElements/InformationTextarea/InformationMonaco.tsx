import { useState, useEffect } from 'react';

import { BiClipboard } from 'react-icons/bi';
import { Spinner, Icon, useToast, Flex } from '@chakra-ui/react';
import { AiOutlineFileSync, AiOutlineCloudSync } from 'react-icons/ai';

import { OpenLiveCoder } from 'ui';
import { LenguajeMonacoLang } from 'data';
import { onFailure, onSuccess } from 'ui';

type InformationMonacoProps = {
  name: string;
  label?: string;
  dataToSync?: any;
  placeholder?: string;
  allowCopy?: boolean;
  isDisabled?: boolean;
  defaultValue?: string;
  language: LenguajeMonacoLang;
  style?: React.CSSProperties;
  updateValue: (e?: any) => void | any;
};

export const InformationMonaco = ({
  name,
  label,
  style,
  isDisabled,
  placeholder,
  dataToSync = '',
  defaultValue = '',
  language,
  allowCopy = false,
  updateValue,
}: InformationMonacoProps) => {
  const toast = useToast();

  const [value, setValue] = useState<string>(defaultValue);
  const [valueToSync, setValueToSync] = useState<string>(dataToSync);

  const [update, setUpdate] = useState<'idle' | 'editing' | 'loading'>('idle');

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  useEffect(() => {
    setValueToSync(dataToSync);
  }, [dataToSync]);

  const onFocus = () => {
    setUpdate('editing');
  };

  const onChange = (e: string) => {
    setValue(e);
  };

  const onBlur = () => {
    setUpdate('loading');

    updateValue({ [name]: value })
      .then((res: any) => {
        setUpdate('idle');
      })
      .catch((err: any) => {
        setUpdate('idle');

        onFailure(toast, 'Error al actualizar', err.message);
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
    <Flex h="100%" maxH="360px" fontSize="14px" direction="column" style={style}>
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

      <Flex rounded="8px" boxSize="100%" border="1px solid" borderColor="gray_2" onBlur={onBlur} onFocus={onFocus}>
        <OpenLiveCoder defaultValue={value} language={language} onChange={onChange} readOnly={isDisabled} />
      </Flex>
    </Flex>
  );
};
