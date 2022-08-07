import { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { FaCommentSlash } from 'react-icons/fa';
import { Flex, Icon, toast } from '@chakra-ui/react';

import { ICurso, IForoTema, getCursos, useForoTemas, filterCursosByRuta, filterCursosOutsideRuta } from 'data';
import { onFailure } from 'ui';

import { PageHeader } from '../components/PageHeader';
import { PageSidebar } from '../components/PageSidebar';
import { LoginContext } from '../../../shared/context';
import { GlobalCard, GlobalCardType } from '../../../shared/components';

type LocationProps = {
  state: { cursoId: number | string };
};

const ForoList = () => {
  const navigate = useNavigate();
  const location = useLocation() as unknown as LocationProps;
  const { user } = useContext(LoginContext);

  const [cursos, setCursos] = useState([]);
  const [cursoInHash, setCursoInHash] = useState<ICurso>();

  const [queryTemas, setQueryTemas] = useState<any[]>([{ curso_id: 1 }, { limit: 1000 }]);

  const { data: temas, isLoading } = useForoTemas({ query: queryTemas });

  useEffect(() => {
    const lState: any = location.state;

    // Al entrar a la página de foros sin hash,
    // seleccionamos el primer curso de la hoja de ruta
    if (!lState?.cursoId) {
      let itinerario = user?.progresoGlobal?.rutaPro?.meta?.itinerario || user?.progresoGlobal?.ruta?.meta?.itinerario;

      navigate(`/foro`, {
        state: { isOpencursoId: itinerario ? itinerario[0].id : undefined },
      });
    } else if (cursos) refreshCursoInHash(cursos);
  }, [location.state]);

  useEffect(() => {
    if (user?.progresoGlobal?.ruta) {
      (async () => {
        const _cursos = await getCursos({
          query: [{ limit: 1000 }],
          treatData: false,
          strategy: 'invalidate-on-undefined',
        });

        if (_cursos?.data) {
          setCursos(_cursos.data);
          refreshCursoInHash(_cursos.data);
        } else {
          onFailure(toast, 'Error inesperado', 'Por favor, actualice la página y contacte con soporte si el error persiste.');
        }
      })();
    }
  }, [user?.progresoGlobal?.ruta]);

  useEffect(() => {
    // Si hay marcado un curso en el hash, y por tanto en
    // el page-sidebar, cargamos los temas de dicho curso
    if (cursoInHash?.id) setQueryTemas([{ curso_id: cursoInHash.id }, { limit: 1000 }]);
  }, [cursoInHash]);

  /** Actualizamos el curso que obtenemos del ID del hashcode de la página, para
   * mostrar correctamente los temas correspondientes del foro. */
  const refreshCursoInHash = (cursos: ICurso[]) => {
    const lState: any = location.state;

    const curso = cursos?.find((c: ICurso) => (lState?.cursoId || '') === +(c.id || 0));

    setCursoInHash(curso);
  };

  const onQuery = (order: string = 'asc', sort: string, search: string = '') => {
    if (cursoInHash?.id) {
      let filters: any[] = [{ curso_id: cursoInHash.id }, { limit: 1000 }, { sort_by: sort }, { order }];

      if (search) filters.push({ titulo: search });

      setQueryTemas([...filters]);
    }
  };

  return (
    <Flex gap="40px" boxSize="100%" p={{ base: '20px', sm: '34px' }} direction={{ base: 'column', md: 'row' }}>
      <PageSidebar
        itemsRuta={filterCursosByRuta(
          user?.progresoGlobal?.rutaPro?.meta?.itinerario || user?.progresoGlobal?.ruta?.meta?.itinerario,
          cursos
        )?.map((c: ICurso) => ({
          icono: c.icono,
          titulo: c.titulo,
          slug: `curso-${c.id}`,
          onClick: () => navigate('/foro', { state: { cursoId: c.id } }),
          isActive: (location.state?.cursoId || '') === +(c.id || 0),
        }))}
        itemsOtros={filterCursosOutsideRuta(
          user?.progresoGlobal?.rutaPro?.meta?.itinerario || user?.progresoGlobal?.ruta?.meta?.itinerario,
          cursos
        )?.map((c: ICurso) => ({
          icono: c.icono,
          titulo: c.titulo,
          slug: `curso-${c.id}`,
          isActive: (location.state?.cursoId || '') === +(c.id || 0),
          onClick: () => navigate('/foro', { state: { cursoId: c.id } }),
        }))}
      />

      <Flex direction="column" gap="20px" w="100%">
        <PageHeader onQuery={onQuery} curso={cursoInHash} icono={cursoInHash?.icono} titulo={cursoInHash?.titulo} />

        <Flex w="100%" pb="40px" wrap="wrap" gap="20px 15px" data-cy="modulos_container">
          {isLoading || !cursoInHash ? (
            [1, 2, 3, 4, 5, 6, 7, 8, 9]?.map((tema: number, index: number) => (
              <GlobalCard
                maxPerRow={5}
                gapBetween="15px"
                key={`tema-placeholder_item-${index}`}
                type={GlobalCardType.TEMA}
                props={{ tema, index, isLoading: true }}
              />
            ))
          ) : temas?.length > 0 ? (
            temas?.map((tema: IForoTema, index: number) => (
              <GlobalCard
                maxPerRow={5}
                gapBetween="15px"
                key={`tema-item-${index}`}
                type={GlobalCardType.TEMA}
                props={{ tema, index }}
                onClick={() => navigate(`/foro/${tema.id}`)}
              />
            ))
          ) : (
            <Flex
              w="100%"
              h="120px"
              p="20px"
              gap="12px"
              bg="gray_2"
              direction="column"
              justify="center"
              align="center"
              color="gray_6"
              rounded="20px"
              fontSize="16px"
              fontWeight="semibold"
            >
              <Icon as={FaCommentSlash} boxSize="40px" color="gray_5" />
              Este curso no tiene un foro habilitado
            </Flex>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default ForoList;
