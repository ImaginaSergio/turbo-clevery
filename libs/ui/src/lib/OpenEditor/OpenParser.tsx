import { useEffect } from 'react';
import { Flex } from '@chakra-ui/react';
import { textParserMd } from 'utils';

import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import StarterKit from '@tiptap/starter-kit';
import { lowlight } from 'lowlight/lib/all.js';
import { useEditor, EditorContent } from '@tiptap/react';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';

import './OpenEditor.css';
import './CodeStyles.css';

interface OpenParserProps {
  /** Texto a parsear en html */
  value?: string;
  /** Número máximo de carácteres permitidos, a partir de los cuales haremos elipsis. */
  maxChars?: number;
  /** Estilos del contendor del texto parseado */
  style?: React.CSSProperties;
}

export const OpenParser = ({ value = '', maxChars = 0, style = {} }: OpenParserProps) => {
  const substringText = () => (value?.length >= maxChars + 3 ? value.substring(0, maxChars)?.trimEnd() + '...' : value || '');

  const editor = useEditor({
    editable: false,
    content: textParserMd(maxChars > 0 ? substringText() : value),
    extensions: [
      Link,
      StarterKit.configure({ codeBlock: false }),
      Image.configure({ inline: true }),
      CodeBlockLowlight.configure({ lowlight }),
    ],
  });

  useEffect(() => {
    editor?.commands.setContent(textParserMd(value));
  }, [value]);

  return (
    <Flex w="100%" maxW="100%" bg="transparent" className="editor-container" style={style}>
      <EditorContent editor={editor} id="open-parser" data-cy="editor_content_father" />
    </Flex>
  );
};
