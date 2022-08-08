import { useCallback } from 'react';

import {
  BiCode,
  BiUndo,
  BiRedo,
  BiBold,
  BiLink,
  BiListOl,
  BiListUl,
  BiItalic,
  BiHeading,
  BiCodeBlock,
  BiParagraph,
  BiStrikethrough,
} from 'react-icons/bi';
import { Flex, Icon, IconButton } from '@chakra-ui/react';

type EditorMenuProps = {
  editor: any;
  isDisabled?: boolean;
};

export const EditorMenu = ({ editor, isDisabled = false }: EditorMenuProps) => {
  if (!editor) return null;

  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);

    // cancelled
    if (url === null) return;

    // empty
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();

      return;
    }

    // update link
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  return (
    <Flex wrap="wrap" w="100%" bg="gray_1" h="fit-content" roundedTop="xl" align="center" justify="flex-end" pr="10px">
      <IconButton
        p="0px"
        bg="transparent"
        aria-label="Titulo"
        isDisabled={isDisabled}
        icon={<Icon as={BiHeading} boxSize="20px" color={editor.isActive('heading') ? 'primary' : 'black'} />}
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
      />

      <IconButton
        p="0px"
        className="icon"
        bg="transparent"
        aria-label="Párrafo"
        isDisabled={isDisabled}
        onClick={() => editor.chain().focus().setParagraph().run()}
        icon={<Icon as={BiParagraph} boxSize="20px" color={editor.isActive('paragraph') ? 'primary' : 'black'} />}
      />

      <IconButton
        p="0px"
        className="icon"
        bg="transparent"
        aria-label="Negrita"
        isDisabled={isDisabled}
        onClick={() => editor.chain().focus().toggleBold().run()}
        icon={<Icon as={BiBold} boxSize="20px" color={editor.isActive('bold') ? 'primary' : 'black'} />}
      />

      <IconButton
        p="0px"
        className="icon"
        bg="transparent"
        aria-label="Cursiva"
        isDisabled={isDisabled}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        icon={<Icon as={BiItalic} boxSize="20px" color={editor.isActive('italic') ? 'primary' : 'black'} />}
      />

      <IconButton
        p="0px"
        className="icon"
        bg="transparent"
        aria-label="Tachado"
        isDisabled={isDisabled}
        onClick={() => editor.chain().focus().toggleStrike().run()}
        icon={<Icon as={BiStrikethrough} boxSize="20px" color={editor.isActive('strike') ? 'primary' : 'black'} />}
      />

      <IconButton
        p="0px"
        className="icon"
        bg="transparent"
        aria-label="Código"
        isDisabled={isDisabled}
        onClick={() => editor.chain().focus().toggleCode().run()}
        icon={<Icon as={BiCode} boxSize="20px" color={editor.isActive('code') ? 'primary' : 'black'} />}
      />

      <IconButton
        p="0px"
        className="icon"
        bg="transparent"
        aria-label="Enlace"
        isDisabled={isDisabled}
        icon={<Icon as={BiLink} boxSize="20px" color={editor.isActive('link') ? 'primary' : 'black'} />}
        onClick={setLink}
      />

      <IconButton
        p="0px"
        className="icon"
        bg="transparent"
        isDisabled={isDisabled}
        aria-label="Lista ordenada"
        icon={<Icon as={BiListOl} boxSize="20px" color={editor.isActive('orderedList') ? 'primary' : 'black'} />}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      />

      <IconButton
        p="0px"
        className="icon"
        bg="transparent"
        isDisabled={isDisabled}
        aria-label="Lista desordenada"
        icon={<Icon as={BiListUl} boxSize="20px" color={editor.isActive('bulletList') ? 'primary' : 'black'} />}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      />

      <IconButton
        p="0px"
        className="icon"
        bg="transparent"
        isDisabled={isDisabled}
        aria-label="Bloque código"
        icon={<Icon as={BiCodeBlock} boxSize="20px" color={editor.isActive('codeBlock') ? 'primary' : 'black'} />}
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
      />

      <IconButton
        p="0px"
        className="icon"
        bg="transparent"
        isDisabled={isDisabled}
        aria-label="Deshacer"
        icon={<Icon as={BiUndo} boxSize="20px" color={editor.isActive('undo') ? 'primary' : 'black'} />}
        onClick={() => editor.chain().focus().undo().run()}
      />

      <IconButton
        p="0px"
        bg="transparent"
        className="icon"
        isDisabled={isDisabled}
        aria-label="Rehacer"
        icon={<Icon as={BiRedo} boxSize="20px" color={editor.isActive('redo') ? 'primary' : 'black'} />}
        onClick={() => editor.chain().focus().redo().run()}
      />
    </Flex>
  );
};
