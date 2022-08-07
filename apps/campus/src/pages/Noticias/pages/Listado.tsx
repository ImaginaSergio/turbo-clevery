import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Flex, useMediaQuery, useToast } from '@chakra-ui/react';

import { onFailure } from 'utils';
import { INoticia, useNoticias } from 'data';
import { LayoutContext } from '../../../shared/context';

import Preview from '../components/Preview';
import Listado from '../components/Listado';
import PageHeader from '../components/PageHeader';
import { NoticiaModal } from '../components/Modal';

function ListadoNoticias() {
  const toast = useToast();
  const navigate = useNavigate();

  const { isMobile } = useContext(LayoutContext);

  const [aux, setAux] = useState<boolean>(false);
  const [noticia, setNoticia] = useState<INoticia>();
  const [noticiaModal, setNoticiaModal] = useState<INoticia | undefined>(undefined);
  const [filterSelected, setFilterSelected] = useState('todos');

  const [isLargerThan1050] = useMediaQuery('(min-width: 1050px)');

  const { noticias, isLoading, isError } = useNoticias({
    query: [{ limit: 1000 }],
  });

  useEffect(() => {
    if (!aux && (noticias?.data?.length || 0) > 0) {
      setNoticia(noticias?.data[0]);
      setAux(true);
    }
  }, [noticias?.data]);

  useEffect(() => {
    if (isError) {
      onFailure(
        toast,
        'Error al cargar noticias',
        'No se pueden cargar las noticias en estos momentos. Disculpe las molestias.'
      );

      navigate('/');
    }
  }, [isError]);

  return (
    <Flex w="100%">
      {!isLargerThan1050 && (
        <NoticiaModal noticia={noticiaModal} isOpen={!!noticiaModal} onClose={() => setNoticiaModal(undefined)} />
      )}
      <Flex
        w="100%"
        p={{ base: '12px', sm: '40px' }}
        gap={{ base: '22px', md: '40px' }}
        align="center"
        direction="column"
        justify="flex-start"
      >
        <PageHeader filterSelected={filterSelected} setFilterSelected={setFilterSelected} />

        <Flex boxSize="100%" gap="80px">
          <Listado
            isLoading={isLoading}
            setNoticia={setNoticia}
            setNoticiaModal={setNoticiaModal}
            noticias={noticias?.data}
            filterSelected={filterSelected}
          />

          <Flex w="100%" display={{ base: 'none', md: 'flex' }}>
            <Preview isLoading={isLoading} noticia={noticia} />
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
}
export default ListadoNoticias;
