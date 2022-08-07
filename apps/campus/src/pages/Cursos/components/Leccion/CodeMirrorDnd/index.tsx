import { useContext, useEffect, useState } from 'react';

import { BiCodeBlock } from 'react-icons/bi';
import { Flex, useToast } from '@chakra-ui/react';

import { OpenDnDModal } from 'ui';
import { onFailure } from 'utils';
import { executeCode } from 'data';
import { LoginContext, PusherContext } from '../../../../../shared/context';

import OBCodeInput from './Input';
import OBCodeOutput from './Ouput';

type LanguageOptionType = {
  label: string;
  value: string;
};

const LANGUAGES: LanguageOptionType[] = [
  { label: 'Python', value: '71' },
  { label: 'JavaScript', value: '63' },
  { label: 'Java', value: '62' },
  { label: 'C#', value: '51' },
];

export const CodeMirrorDnd = ({
  state,
  languages = LANGUAGES,
}: {
  languages?: LanguageOptionType[];
  state: { isOpen: boolean; onClose: () => void };
}) => {
  const { user } = useContext(LoginContext);
  const { pusher } = useContext(PusherContext);

  const [value, setValue] = useState<string>();

  const toast = useToast();

  const [output, setOutput] = useState<any>();
  const [errorOutput, setErrorOutput] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);

  const [language, setLanguage] = useState<LanguageOptionType>({
    label: 'Python',
    value: '71',
  });

  useEffect(() => {
    if (!pusher) return;
    let isLocalhost = process.env.NODE_ENV !== 'production';

    if (state.isOpen) {
      let newChannel = pusher.subscribe(`${isLocalhost ? '' : 'private-encrypted-'}user-${user?.id}`);

      newChannel.bind(`livecoder-resultado`, recieveCodeMirrorResult);
    } else {
      pusher.unsubscribe(`${isLocalhost ? '' : 'private-encrypted-'}user-${user?.id}`);
    }

    return () => {
      pusher.unsubscribe(`${isLocalhost ? '' : 'private-encrypted-'}user-${user?.id}`);
    };
  }, [state.isOpen]);

  const recieveCodeMirrorResult = (data: any) => {
    setOutput(data?.message?.stdout + (data?.message?.stderr ? data?.message?.stderr : ''));

    setErrorOutput(data?.message?.stderr);
    setLoading(false);
  };

  const compileCode = async () => {
    setLoading(true);

    await executeCode({
      source_code: value,
      language_id: language?.value + '',
    })
      .then((res: any) => {
        let status = res.status || res.fullResponse.status;

        if (status !== 201 && status !== 200) {
          setLoading(false);
          onFailure(toast, 'Error al compilar', 'Pruebe de nuevo o contacte con soporte si el error persiste.');
        }
      })
      .catch((error) => {
        setLoading(false);
        onFailure(toast, 'Error al compilar', 'Pruebe de nuevo o contacte con soporte si el error persiste.');
      });
  };

  return (
    <OpenDnDModal state={state} minWidth={720} head={{ title: 'Live Code', icon: BiCodeBlock, allowFullScreen: true }}>
      {/** START CodeMirror */}
      <Flex boxSize="100%" bg="white" overflow="hidden">
        <OBCodeInput
          value={value}
          setValue={setValue}
          isLoading={loading}
          languages={languages}
          compileCode={compileCode}
          setLanguage={setLanguage}
          languageSelected={language}
        />

        <OBCodeOutput value={output} errorOutput={errorOutput} />
      </Flex>

      {/** END CodeMirror */}
    </OpenDnDModal>
  );
};
