import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { es } from 'date-fns/locale';
import { BiBookContent, BiShow } from 'react-icons/bi';
import { format, intervalToDuration } from 'date-fns';
import { Flex, Icon, useToast, Spinner, Center } from '@chakra-ui/react';

import { TabDetalles } from './TabDetalles';
import { onFailure } from 'ui';
import { PageHeader, PageSidebar } from '../../../../../shared/components';
import { IEntregable, getEntregableByID, updateEntregable } from 'data';

enum Tab {
  DETALLES = 'detalles',
}

export default function EjerciciosCorreccion() {
  const { ejercicioId } = useParams();

  const [entregable, setEntregable] = useState<IEntregable>();
  const [tab, setTab] = useState<any>(Tab.DETALLES);

  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    refreshState();
  }, [ejercicioId]);

  const refreshState = async () => {
    if (!ejercicioId) return;

    const _entregable = await getEntregableByID({
      id: +ejercicioId,
      client: 'admin',
    });
    setEntregable(_entregable);
  };

  const updateValue = (value: any) => {
    if (!ejercicioId) return;

    return updateEntregable({
      id: +ejercicioId,
      entregable: value,
      client: 'admin',
    })
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

  return (
    <Flex boxSize="100%">
      <PageSidebar
        title={'Ficha del entregable'}
        items={[
          {
            icon: BiBookContent,
            title: 'Detalles',
            isActive: tab === Tab.DETALLES,
            onClick: () => {
              setTab(Tab.DETALLES);
              navigate(`/alumnado/ejercicios/${ejercicioId}#detalles`);
            },
          },
        ]}
      />
      <Flex direction="column" w="100%">
        <PageHeader
          head={{
            title: entregable?.leccion?.titulo || 'Entregable',
            subtitle: `Curso: ${entregable?.leccion?.modulo?.curso?.titulo}  |  Entregado por: ${
              entregable?.user?.nombre + ' ' + (entregable?.user?.apellidos || ' ')
            }  |  Fecha de Entrega: ${
              entregable?.createdAt
                ? format(new Date(entregable?.createdAt), 'dd LLL yyyy, HH:mm', { locale: es })
                : 'Sin entregar'
            }  |  Tiempo utilizado:
             ${
               entregable?.fechaEntrega
                 ? intervalToDuration({
                     start: new Date(entregable?.createdAt) || new Date(),
                     end: new Date(entregable?.fechaEntrega) || new Date(),
                   })
                 : 'No disponible'
             }`,
          }}
          button={{
            text: 'Ir a lección del ejercicio',
            leftIcon: <Icon as={BiShow} boxSize="21px" />,
            isDisabled: true,
            onClick: () => {
              navigate(`/contenidos/cursos/${entregable?.cursoId}#contenido`);
            },
          }}
        />

        {!entregable ? (
          <Center boxSize="100%">
            <Spinner boxSize="40px" />
          </Center>
        ) : tab === Tab.DETALLES ? (
          <TabDetalles entregable={entregable} updateValue={updateValue} />
        ) : null}
      </Flex>
    </Flex>
  );
}
