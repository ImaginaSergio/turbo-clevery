import { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { Flex, Icon, useToast, Spinner, Center } from '@chakra-ui/react';
import { BiBookContent, BiDownload, BiListUl, BiTask } from 'react-icons/bi';

import { onFailure } from 'ui';
import { ICurso, getCurso, updateCurso, getCursos } from 'data';
import { PageHeader, PageSidebar } from '../../../../../shared/components';
import { descargarTemarioCurso } from '../../../../../shared/utils/temaryGenerator';

import { TabTests } from './TabTests';
import { TabInformacion } from './TabInformacion';
import { TabContenido } from './TabContenido/TabContenido';

enum Tab {
  INFORMACION = 'informacion',
  CONTENIDO = 'contenido',
  TESTS = 'tests',
}

export default function CursosInformation() {
  const { cursoID } = useParams<any>();

  const [curso, setCurso] = useState<ICurso>();
  const [tab, setTab] = useState<Tab>(Tab.INFORMACION);
  const [loadingDowload, setLoadingDowload] = useState<boolean>(false);

  const toast = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const hash = (location?.hash || '')?.replaceAll('#', '');

    if (hash === 'contenido') setTab(Tab.CONTENIDO);
    else if (hash === 'tests') setTab(Tab.TESTS);
    else setTab(Tab.INFORMACION);
  }, []);

  useEffect(() => {
    refreshState();
  }, [cursoID]);

  const refreshState = async () => {
    if (!cursoID) return;

    const _curso = await getCurso({ id: +cursoID, client: 'admin' });
    setCurso(_curso);
  };

  const updateValue = (value: any) => {
    if (!cursoID) return;

    return updateCurso({ id: +cursoID, curso: value, client: 'admin' })
      .then(async (msg: any) => {
        await refreshState();

        return msg;
      })
      .catch((error: any) => {
        console.error('Todo fue mal D:', { error });
        onFailure(toast, error.title, error.message);

        return error;
      });
  };

  const generarTemario = async () => {
    setLoadingDowload(true);

    console.log(`🔄 Descargando temario de ${curso?.titulo}`);

    await descargarTemarioCurso(curso?.id, `Formacion en ${curso?.titulo} - OpenBootcamp`, false)
      .then((url: string) => {
        console.log(`✅ Temario de ${curso?.titulo} descargado`, { url });

        var link: HTMLAnchorElement = document.createElement('a');

        link.target = '_blank';
        link.href = url;
        link.click();
      })
      .catch((error: any) => {
        console.error({ error });
        onFailure(toast, error.title, error.message);
      });

    setLoadingDowload(false);
  };

  return (
    <Flex boxSize="100%">
      <PageSidebar
        title="Ficha del curso"
        items={[
          {
            icon: BiBookContent,
            title: 'Información',
            isActive: tab === Tab.INFORMACION,
            onClick: () => {
              setTab(Tab.INFORMACION);
              navigate(`/contenidos/cursos/${cursoID}#informacion`);
            },
          },
          {
            icon: BiListUl,
            title: 'Contenido',
            isActive: tab === Tab.CONTENIDO,
            onClick: () => {
              setTab(Tab.CONTENIDO);
              navigate(`/contenidos/cursos/${cursoID}#contenido`);
            },
          },
          {
            icon: BiTask,
            title: 'Tests',
            isActive: tab === Tab.TESTS,
            onClick: () => {
              setTab(Tab.TESTS);
              navigate(`/contenidos/cursos/${cursoID}#tests`);
            },
          },
        ]}
      />

      <Flex direction="column" w="100%">
        <PageHeader
          head={{ title: curso?.titulo || '-', image: curso?.imagen?.url }}
          buttonGroup={
            process.env.REACT_APP_ORIGEN_CAMPUS === 'OPENBOOTCAMP'
              ? [
                  {
                    text: 'Generar temario',
                    onClick: generarTemario,
                    isLoading: loadingDowload,
                    leftIcon: <Icon as={BiDownload} boxSize="21px" />,
                  },
                ]
              : []
          }
        />

        {!curso ? (
          <Center boxSize="100%">
            <Spinner boxSize="40px" />
          </Center>
        ) : tab === Tab.INFORMACION ? (
          <TabInformacion curso={curso} updateValue={updateValue} />
        ) : tab === Tab.CONTENIDO ? (
          <TabContenido curso={curso} refreshState={refreshState} />
        ) : (
          <TabTests curso={curso} />
        )}
      </Flex>
    </Flex>
  );
}
