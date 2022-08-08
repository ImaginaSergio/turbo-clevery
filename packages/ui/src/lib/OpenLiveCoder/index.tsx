import { useEffect, useState } from 'react';

import Editor from '@monaco-editor/react';
import { Spinner, useColorMode, Flex } from '@chakra-ui/react';

import { LenguajeMonacoLang } from 'data';

import { brillianceDull } from './themes/brilliance-dull';
import { slushAndPoppies } from './themes/slush-and-poppies';

import './OpenLiveCoder.css';

type OpenLiveCoderProps = {
  // Value por defecto del editor, también lo usamos como placeholder.
  defaultValue: string;

  // Manejo del evento onChange del editor.
  onChange?: (e?: any) => void | any;

  // Durante el estado de carga, desactivaremos el estado editable.
  isLoading?: boolean;

  // Lenguaje del editor.
  language: LenguajeMonacoLang | string;

  // Modo readonly o editable.
  readOnly?: boolean;

  // Marcamos si está o no en pantalla completa
  isFullScreen?: boolean;
};

export const OpenLiveCoder = ({
  language,
  defaultValue = '',
  isLoading = false,
  readOnly = false,
  onChange = (e?: any) => {},
}: OpenLiveCoderProps) => {
  const { colorMode } = useColorMode();

  const [_editor, _setEditor] = useState();
  const [value, setValue] = useState(defaultValue);

  function handleEditorDidMount(editor: any, monaco: any) {
    monaco?.editor?.defineTheme('brilliance-dull', brillianceDull);
    monaco?.editor?.defineTheme('slush-and-poppies', slushAndPoppies);

    monaco?.editor?.setTheme(colorMode === 'light' ? 'slush-and-poppies' : 'brilliance-dull');
  }

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  const handleOnChange = (e?: any) => {
    setValue(e);
    onChange(e);
  };

  return (
    <Flex h="100%" w="100%" position="relative" overflow="hidden">
      {isLoading && <Spinner position="absolute" zIndex={100} left="50%" top="50%" />}

      <Editor
        value={value}
        width="100%"
        height="calc(100% - 0.5px)"
        language={language}
        onChange={handleOnChange}
        onMount={handleEditorDidMount}
        theme={colorMode === 'light' ? 'slush-and-poppies' : 'brilliance-dull'}
        options={{
          padding: { top: 10 },
          readOnly: readOnly || isLoading,
          wordWrap: 'on',
          autoClosingQuotes: 'always',
          autoClosingBrackets: 'always',
          extraEditorClassName: 'open_code_editor',
          codeLens: true,
          showUnused: true,
          dragAndDrop: true,
          contextmenu: false,
          formatOnPaste: true,
          showDeprecated: true,
          minimap: { enabled: false },
          inlineSuggest: { enabled: true },
          bracketPairColorization: { enabled: true },
        }}
      />
    </Flex>
  );
};
