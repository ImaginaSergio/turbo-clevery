import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Box,
  Flex,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
  Center,
  useToast,
  Modal,
  ModalContent,
  ModalOverlay,
} from '@chakra-ui/react';
import { BiChat, BiBook, BiBadgeCheck, BiSearchAlt, BiNavigation, BiBookBookmark } from 'react-icons/bi';
import parse from 'html-react-parser';

import { get } from 'data';
import { onFailure } from 'ui';
import { textParserMd } from 'utils';

enum SearchbarObjectType {
  CURSO = 'Curso',
  MODULO = 'Modulo',
  LECCION = 'leccion',
  CERTIFICACION = 'Certificacion',
  PUNTO_CLAVE = 'punto_clave',
  TEMA = 'Tema',
  PREGUNTA = 'Pregunta',
  RESPUESTA = 'Respuesta',
}

export const SearchbarModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const toast = useToast();
  const navigate = useNavigate();

  const [search, setSearch] = useState<string>('');
  const [typingTimeout, setTypingTimeout] = useState<any>();
  const [query, setQuery] = useState<
    {
      title: string;
      preTitle?: string;
      type: SearchbarObjectType;
      onClick: () => void;
    }[]
  >();

  useEffect(() => {
    // Reseteamos el estado al cerrar el modal de búsqueda
    if (!isOpen) {
      setSearch('');
      setQuery(undefined);
    }
  }, [isOpen]);

  const onSearch = async (text: string) => {
    const _query = await get('/openAPI/search?query=' + text + '&limit=7');

    setQuery(
      (_query?.data || [])?.map((item: any) => {
        const [type, id] = item?._id?.split('-'); // Curso-55/Leccion-1448

        const relacion = (item?._source?.relacion || '')?.split('/');

        const [typeRelacion1, idRelacion1] = relacion[0]?.split('-');
        const [typeRelacion2, idRelacion2] = relacion.length > 1 ? relacion[1]?.split('-') : [undefined, undefined];

        const getTitle = (
          queryText: string,
          titulohighlight: string[] = [],
          titulo: string = '',
          contenidoHightlight: string[] = [],
          contenido: string = ''
        ) => {
          let itemTitulohighlight = titulohighlight.find((item) =>
            item?.toLocaleLowerCase()?.includes(queryText?.toLocaleLowerCase())
          );

          if (itemTitulohighlight) return itemTitulohighlight;

          let itemContenidohighlight = contenidoHightlight.find((item) =>
            item?.toLocaleLowerCase()?.includes(queryText?.toLocaleLowerCase())
          );

          if (itemContenidohighlight) return itemContenidohighlight;

          if (contenido?.toLocaleLowerCase()?.includes(queryText?.toLocaleLowerCase())) return contenido;
          else return titulo;
        };

        const hl = getTitle(
          text,
          item?.highlight?.titulo,
          item?._source?.titulo,
          item?.highlight?.contenido,
          item?._source?.contenido
        );

        return {
          title: hl,
          type: type,
          preTitle:
            type === SearchbarObjectType.CURSO
              ? 'Curso'
              : type === SearchbarObjectType.CERTIFICACION
              ? 'Certificación'
              : type === SearchbarObjectType.LECCION
              ? 'Lección'
              : type === SearchbarObjectType.MODULO
              ? 'Módulo'
              : type === SearchbarObjectType.PUNTO_CLAVE
              ? 'Punto Clave'
              : type,
          onClick: () => {
            switch (type) {
              case SearchbarObjectType.CURSO:
                navigate(`/cursos/${id}`);
                break;
              case SearchbarObjectType.CERTIFICACION:
                navigate(`/certificaciones/${id}`);
                break;
              case SearchbarObjectType.LECCION:
                navigate(`/cursos/${idRelacion1}/leccion/${id}`);
                break;
              case SearchbarObjectType.TEMA:
                navigate(`/foro/${id}`);
                break;
              case SearchbarObjectType.PREGUNTA:
                navigate(`/foro/${idRelacion1}/${id}`);
                break;
              case SearchbarObjectType.RESPUESTA:
                navigate(`/foro/${idRelacion1}/${idRelacion2}`);
                break;
              case SearchbarObjectType.PUNTO_CLAVE:
                navigate(`/cursos/${idRelacion1}/leccion/${idRelacion2}`);
                break;
              case SearchbarObjectType.MODULO:
                navigate(`/cursos/${idRelacion1}`, { state: { moduloId: id } });
                break;
              default:
                onFailure(
                  toast,
                  'Error inesperado',
                  'Por favor, actualize la página y contacte con soporte si el error persiste.'
                );
            }

            onClose();
          },
        };
      })
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />

      <ModalContent maxW="674px" maxH="726px" bg="white">
        <Flex direction="column" p="16px" overflow="hidden">
          <InputGroup rounded="12px" bg="white">
            <InputLeftElement pointerEvents="none" children={<Icon as={BiSearchAlt} color="gray_4" />} />

            <Input
              value={search}
              onChange={async (event: any) => {
                const text = event.target.value;
                setSearch(text);

                if (text === '') setQuery(undefined);
                else {
                  if (typingTimeout) clearTimeout(typingTimeout);
                  setTypingTimeout(setTimeout(() => onSearch(text), 500));
                }
              }}
              placeholder="Escribe para buscar"
              border="none"
              _focus={{ border: 'none' }}
              _active={{ border: 'none' }}
              _placeholder={{
                fontSize: '15px',
                fontWeight: 'medium',
                color: 'gray_4',
              }}
            />
          </InputGroup>

          {query && (
            <Flex direction="column" gap="8px" align="center">
              <Box h="1px" w="100%" my="8px" bg="gray_3" />

              {query?.length > 0 ? (
                <Flex direction="column" gap="8px" w="100%" overflow="auto">
                  {query?.map((item) => (
                    <Flex
                      className="search-item"
                      p="12px"
                      gap="12px"
                      rounded="12px"
                      align="center"
                      cursor="pointer"
                      onClick={item?.onClick}
                      border="1px solid transparent"
                      _hover={{
                        bg: 'primary_dark',
                        border: '1px solid var(--chakra-colors-gray_3)',
                        color: 'white',
                      }}
                    >
                      <Center
                        bg="gray_2"
                        minW="40px"
                        boxSize="40px"
                        rounded="8px"
                        sx={{
                          '.search-item:hover &': { background: 'primary' },
                        }}
                      >
                        <Icon
                          minW="40px"
                          boxSize="20px"
                          color="gray_4"
                          sx={{ '.search-item:hover &': { color: '#fff' } }}
                          as={
                            item.type === SearchbarObjectType.CERTIFICACION
                              ? BiBadgeCheck
                              : item.type === SearchbarObjectType.TEMA ||
                                item.type === SearchbarObjectType.PREGUNTA ||
                                item.type === SearchbarObjectType.RESPUESTA
                              ? BiChat
                              : item.type === SearchbarObjectType.PUNTO_CLAVE
                              ? BiBookBookmark
                              : BiBook
                          }
                        />
                      </Center>

                      <Flex w="100%" gap="4px" overflow="hidden" direction="column">
                        <Text
                          variant="card_title"
                          fontSize="16px"
                          lineHeight="20px"
                          title={item?.title}
                          sx={{
                            '.search-item:hover &': { color: '#fff' },
                            '.search-item:hover & > em': { color: '#000' },
                            '& > em': {
                              color: 'primary',
                              fontStyle: 'normal',
                              textDecoration: 'underline',
                            },
                          }}
                        >
                          {parse(textParserMd(item?.title))}
                        </Text>

                        <Text
                          isTruncated
                          variant="card_details"
                          color="gray_5"
                          fontSize="13px"
                          lineHeight="16px"
                          fontWeight="bold"
                          sx={{ '.search-item:hover &': { color: '#fff' } }}
                        >
                          {item?.preTitle}
                        </Text>
                      </Flex>

                      <Icon
                        as={BiNavigation}
                        boxSize="20px"
                        color="#fff"
                        opacity="0"
                        sx={{ '.search-item:hover &': { opacity: 1 } }}
                      />
                    </Flex>
                  ))}
                </Flex>
              ) : (
                <Flex direction="column" align="center">
                  <Icon as={BiSearchAlt} boxSize="40px" mb="20px" />

                  <Box fontSize="15px" fontWeight="medium" mb="4px">
                    No hay resultados para
                  </Box>

                  <Box fontSize="15px" fontWeight="semibold">
                    {search}
                  </Box>
                </Flex>
              )}
            </Flex>
          )}
        </Flex>
      </ModalContent>
    </Modal>
  );
};
