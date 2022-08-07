import { useContext } from 'react';
import { Box, Divider, Flex, Skeleton } from '@chakra-ui/react';

import { INoticia } from 'data';
import { OpenParser } from 'ui';

import { NoticiaBadge } from './Badge';
import { LayoutContext } from '../../../shared/context';

function Listado({
  noticias = [],
  setNoticia,
  setNoticiaModal,
  isLoading,
  filterSelected,
}: {
  noticias: any[];
  setNoticia: any;
  setNoticiaModal: any;
  isLoading?: boolean;
  filterSelected: string;
}) {
  return (
    <Flex direction="column" gap="30px" w={{ base: '100%', md: '475px' }}>
      <Flex direction="column" gap="18px">
        {' '}
        <Box fontSize="20px" fontWeight="700" lineHeight="24px">
          Novedades Destacadas
        </Box>
        <Flex direction="column" gap="8px" data-cy="novedades_destacadas">
          {isLoading
            ? [1, 2].map(() => <Skeleton h="144px" minW="475px" rounded="20px" />)
            : noticias
                ?.slice(0, 2)
                ?.map((noticia: any, i: number) => (
                  <CardNoticia
                    esDestacado
                    index={i}
                    noticia={noticia}
                    setNoticia={setNoticia}
                    setNoticiaModal={setNoticiaModal}
                  />
                ))}
        </Flex>
      </Flex>
      <Divider borderColor="gray_2" />
      <Flex direction="column" gap="18px">
        <Box fontSize="20px" fontWeight="700" lineHeight="24px">
          Novedades Anteriores
        </Box>

        <Flex direction="column" gap="8px" data-cy="novedades_anteriores">
          {isLoading
            ? [1, 2, 3, 4].map(() => <Skeleton h="144px" minW="475px" rounded="20px" />)
            : noticias
                ?.slice(2)
                ?.filter((noticia: any) => {
                  if (filterSelected === 'todos') return true;
                  else if (filterSelected === 'cursos') return noticia?.cursoId !== undefined;
                  else return noticia?.cursoId === undefined;
                })
                ?.map((noticia: any, i: number) => (
                  <CardNoticia index={i} noticia={noticia} setNoticia={setNoticia} setNoticiaModal={setNoticiaModal} />
                ))}
        </Flex>
      </Flex>
    </Flex>
  );
}

export default Listado;

const CardNoticia = ({
  index,
  noticia,
  esDestacado,
  setNoticia = (n?: INoticia) => {},
  setNoticiaModal = (n?: INoticia) => {},
}: {
  index: number;
  noticia?: INoticia;
  esDestacado?: boolean;
  setNoticia: (noticia?: INoticia) => void | any;
  setNoticiaModal: (noticia?: INoticia) => void | any;
}) => {
  const { isMobile } = useContext(LayoutContext);
  return (
    <Flex
      p="20px"
      h="100%"
      gap="13px"
      w="100%"
      rounded="20px"
      cursor="pointer"
      direction={isMobile ? 'column-reverse' : 'column'}
      transition="all 0.3 ease"
      _hover={{ opacity: 0.7 }}
      onClick={() => {
        setNoticia(noticia);
        setNoticiaModal(noticia);
      }}
      bg={index === 0 && esDestacado ? 'secondary_dark' : 'gray_2'}
    >
      <Flex gap="8px" mt="3px" align="center" wrap="wrap">
        {esDestacado && (
          <NoticiaBadge
            label="Destacado"
            bg={index === 0 && esDestacado ? '#FFFFFF' : 'black'}
            color={index === 0 && esDestacado ? '#000000' : 'white'}
          />
        )}

        {noticia?.curso?.id && (
          <NoticiaBadge
            label="Cursos"
            bg={index === 0 && esDestacado ? '#FFFFFF1A' : '#7B61FF1A'}
            color={index === 0 && esDestacado ? '#FFFFFF' : '#7B61FF'}
          />
        )}

        {noticia?.curso?.id && (
          <NoticiaBadge
            label={noticia?.curso?.titulo}
            color={index === 0 && esDestacado ? '#FFFFFF' : '#0C97C2'}
            bg={index === 0 && esDestacado ? '#FFFFFF1A' : '#0C97C21A'}
          />
        )}

        {!noticia?.curso?.id && (
          <NoticiaBadge
            label="General"
            color={index === 0 && esDestacado ? 'white' : '#0C97C2'}
            bg={index === 0 && esDestacado ? '#FFFFFF1A' : '#0C97C21A'}
          />
        )}
      </Flex>

      <Flex direction="column" gap="4px">
        <Box
          maxW="498px"
          fontSize="15px"
          fontWeight="bold"
          lineHeight="18px"
          color={index === 0 && esDestacado ? '#FFFFFF' : 'black'}
          data-cy={esDestacado ? 'titulo_noticia_destacada' : 'titulo_noticia_anterior'}
        >
          {noticia?.titulo}
        </Box>

        <Box
          maxW="498px"
          fontSize="14px"
          fontWeight="400"
          lineHeight="17px"
          color={index === 0 && esDestacado ? '#FFFFFF' : 'black'}
        >
          <OpenParser maxChars={100} value={noticia?.descripcionCorta || noticia?.contenido} />
        </Box>
      </Flex>
    </Flex>
  );
};
