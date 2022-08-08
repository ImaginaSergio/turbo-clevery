import { useState, useEffect } from 'react';

import ReactMde from 'react-mde';
import ReactMarkdown from 'react-markdown';
import { BiClipboard } from 'react-icons/bi';
import { Spinner, Icon, useToast, Flex } from '@chakra-ui/react';
import { AiOutlineFileSync, AiOutlineCloudSync } from 'react-icons/ai';

import { onFailure, onSuccess } from 'ui';

import 'react-mde/lib/styles/css/react-mde-all.css';

type Props = {
  name: string;
  label: string;
  placeholder?: string;
  allowCopy?: boolean;
  dataToSync?: any;
  defaultValue?: string;
  isDisabled?: boolean;
  style?: React.CSSProperties;
  updateValue: (e?: any) => void | any;
};

type TabMode = 'write' | 'preview';
type UpdateState = 'idle' | 'editing' | 'loading';

export const InformationMde = ({
  name,
  label,
  defaultValue = '',
  updateValue,
  placeholder,
  isDisabled,
  allowCopy = false,
  style,
  dataToSync,
}: Props) => {
  const toast = useToast();

  const [value, setValue] = useState<string>(defaultValue);
  const [update, setUpdate] = useState<UpdateState>('idle');
  const [selectedTab, setSelectedTab] = useState<TabMode>('preview');
  const [valueToSync, setValueToSync] = useState<string>(dataToSync || '');

  useEffect(() => {
    setValue(defaultValue || '');
  }, [defaultValue]);

  useEffect(() => {
    setValueToSync(dataToSync);
  }, [dataToSync]);

  const onChange = (e: string) => {
    if (update === 'idle') setUpdate('editing');

    setValue(e);
  };

  const onUpdate = (e: any) => {
    setUpdate('loading');

    updateValue({ [name]: e }).then((res: any) => {
      setUpdate('idle');
    });
  };

  const onBlur = (e: any) => {
    setUpdate('loading');

    updateValue({ [name]: e.target.value }).then((res: any) => {
      setUpdate('idle');
      setSelectedTab('preview');
    });
  };

  const syncData = () => {
    if (value) {
      onFailure(toast, 'Error al sincronizar', '¡Borra toda la información actual para sincronizar!');
    } else {
      setUpdate('loading');
      setValue(valueToSync);

      updateValue({ [name]: valueToSync }).then((res: any) => {
        setUpdate('idle');
        setSelectedTab('preview');
      });
    }
  };

  const generateMarkdownPreview = (markdown: any) => Promise.resolve(<ReactMarkdown children={markdown || ''} />);

  return (
    <Flex direction="column" fontSize="14px" style={style}>
      <label className="information-block-label">
        {label}

        <Flex w="fit-content" align="center" gap="4px">
          {update !== 'loading' ? (
            <Icon
              as={AiOutlineCloudSync}
              ml="2"
              boxSize="14px"
              cursor="pointer"
              onClick={() => onUpdate(value)}
              color={value === defaultValue ? 'gray_5' : 'primary'}
            />
          ) : (
            <Spinner ml="2" boxSize="14px" />
          )}

          {allowCopy && value && update === 'idle' && (
            <Icon
              as={BiClipboard}
              cursor="pointer"
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

      <ReactMde
        value={value}
        onChange={onChange}
        selectedTab={selectedTab}
        onTabChange={setSelectedTab}
        generateMarkdownPreview={generateMarkdownPreview}
        childProps={{
          previewButton: { style: buttonStyle(selectedTab === 'write') },
          writeButton: {
            tabIndex: -1,
            style: buttonStyle(selectedTab === 'preview'),
          },
          textArea: {
            onBlur: onBlur,
            placeholder: placeholder,
            disabled: isDisabled || update === 'loading',
          },
        }}
        toolbarCommands={[
          ['header', 'bold', 'italic', 'strikethrough'],
          ['link', 'unordered-list', 'ordered-list'],
        ]}
      />
    </Flex>
  );
};

const buttonStyle = (show: boolean): React.CSSProperties => {
  return {
    background: '#3182FC',
    borderRadius: '7px',
    color: 'white',
    fontWeight: 600,
    padding: '4px 8px',
    display: show ? 'block' : 'none',
  };
};
