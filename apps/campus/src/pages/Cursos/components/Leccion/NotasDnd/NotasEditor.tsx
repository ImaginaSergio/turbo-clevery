import { Flex, Button, Icon, Input, Box } from '@chakra-ui/react';
import { INota } from 'data';
import { OpenEditor } from 'ui';
import { useRef, useEffect, useState } from 'react';
import { BiChevronLeft, BiBook } from 'react-icons/bi';

export const NotasEditor = ({
  nota,
  title,
  onSave,
  onClose,
}: {
  nota?: INota;
  title: string;
  onClose: () => void;
  onSave: (nota: any) => void;
}) => {
  const quillRef = useRef<any>(null);

  useEffect(() => {
    quillRef?.current?.getEditor().focus();
  }, []);

  const [titulo, setTitulo] = useState(nota?.titulo || '');
  const [contenido, setContenido] = useState(nota?.contenido || '');

  useEffect(() => {
    setTitulo(nota?.titulo || '');
    setContenido(nota?.contenido || '');
  }, [nota]);

  return (
    <Flex direction="column" m="2px" h="100%" minH="500px">
      <Button w="100px" background="transparent" onClick={onClose} leftIcon={<Icon boxSize="25px" as={BiChevronLeft} />}>
        Volver
      </Button>

      <Flex direction="column">
        <Input
          m="0px"
          border="none"
          fontSize="21px"
          fontWeight="bold"
          background="transparent"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
        />

        <Flex mt="5px" color="gray_4" align="center">
          <Icon ml="16px" mr="10px" as={BiBook} />

          <Box fontSize="15px">{title}</Box>
        </Flex>

        <Flex p="10px">
          <OpenEditor value={contenido} onChange={setContenido} placeholder="Escribe tu nota" />
        </Flex>

        <Button
          onClick={() =>
            onSave({
              id: nota?.id,
              leccionId: nota?.leccionId,
              titulo: titulo,
              contenido: contenido,
            })
          }
          color="white"
          mx="10px"
          data-cy="guardar_nota_button"
          mt="70px"
          bg="primary"
        >
          Guardar
        </Button>
      </Flex>
    </Flex>
  );
};
