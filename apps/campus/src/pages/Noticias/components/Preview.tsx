import { Box, Button, Flex, Image, Skeleton, SkeletonText } from '@chakra-ui/react';
import { INoticia } from 'data';
import { OpenParser } from 'ui';
import { useNavigate } from 'react-router-dom';
import { NoticiaBadge } from './Badge';

function Preview({ noticia, isLoading }: { noticia?: INoticia; isLoading?: boolean }) {
  const navigate = useNavigate();

  return (
    <Flex w="100%" p="60px" bg="white" h="fit-content" rounded="40px" direction="column">
      <Skeleton rounded="20px" mb={noticia?.imagen?.url ? '41px' : 'unset'} isLoaded={!isLoading}>
        {!isLoading && noticia?.imagen?.url && <Image src={noticia?.imagen?.url} boxSize="100%" rounded="20px" />}
      </Skeleton>

      <Flex gap="8px">
        {!noticia?.curso?.id && <NoticiaBadge label="General" bg="#2834BA1A" color="secondary_dark" />}

        {noticia?.cursoId && (
          <>
            <NoticiaBadge label="Cursos" bg="#7B61FF1A" color="#7B61FF" />

            <NoticiaBadge label={noticia?.curso?.titulo} bg="#0C97C21A" color="#0C97C2" />
          </>
        )}
      </Flex>

      <SkeletonText noOfLines={1} isLoaded={!isLoading}>
        <Box mt="22px" fontSize="32px" fontWeight="bold" lineHeight="39px" color="black" data-cy="preview_titulo">
          {noticia?.titulo}
        </Box>
      </SkeletonText>

      <SkeletonText noOfLines={20} isLoaded={!isLoading}>
        <OpenParser value={noticia?.contenido} style={{ marginTop: '28px', fontSize: '18px', lineHeight: '30px' }} />
      </SkeletonText>

      <Button
        mt="28px"
        bg="black"
        p="18px 31px"
        color="white"
        isDisabled={isLoading}
        onClick={() => navigate('/cursos')}
        data-cy="cursos_button"
      >
        Ver todos los cursos
      </Button>

      {/* <Flex direction="column" mt="59px">
        <Box fontWeight="700" fontSize="20px">
          Noticias Relacionadas
        </Box>

        <Flex></Flex>
      </Flex> */}
    </Flex>
  );
}

export default Preview;
