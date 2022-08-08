import { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';

import { BiShow, BiBookContent } from 'react-icons/bi';
import { Flex, Icon, useToast, Spinner, Center } from '@chakra-ui/react';

import { INoticia } from '@clevery/data';
import { onFailure } from '@clevery/utils';
import { getNoticia, updateNoticia } from '@clevery/data';
import { PageHeader, PageSidebar } from '../../../../../shared/components';

import { TabInformacion } from './TabInformacion';

enum Tab {
  INFORMACION = 'informacion',
}

export default function NoticiasInformation() {
  const { noticiaID } = useParams<any>();

  const toast = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  const [noticia, setNoticia] = useState<INoticia>();
  const [tab, setTab] = useState<any>(Tab.INFORMACION);

  useEffect(() => {
    const hash = (location?.hash || '')?.replaceAll('#', '');

    setTab(Tab.INFORMACION);
  }, []);

  useEffect(() => {
    refreshState();
  }, [noticiaID]);

  const refreshState = async () => {
    if (!noticiaID) return;
    else {
      const _Noticia = await getNoticia({ id: +noticiaID, client: 'admin' });
      setNoticia(_Noticia);
    }
  };

  const updateValue = (value: any) => {
    if (!noticiaID) return;

    return updateNoticia({ id: +noticiaID, noticia: value, client: 'admin' })
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
        title="Ficha de la Noticia"
        items={[
          {
            icon: BiBookContent,
            title: 'Información',
            isActive: tab === Tab.INFORMACION,
            onClick: () => {
              setTab(Tab.INFORMACION);
              navigate(`/miscelanea/noticias/${noticiaID}#${Tab.INFORMACION}`);
            },
          },
        ]}
      />

      <Flex direction="column" w="100%">
        <PageHeader
          head={{
            title: noticia?.titulo || '-',
            image: noticia?.imagen?.url,
          }}
          button={{
            text: 'Previsualizar Noticia',
            leftIcon: <Icon as={BiShow} boxSize="21px" />,
            isDisabled: true,
            onClick: () => {},
          }}
        />

        {!noticia ? (
          <Center boxSize="100%">
            <Spinner boxSize="40px" />
          </Center>
        ) : (
          <TabInformacion noticia={noticia} updateValue={updateValue} />
        )}
      </Flex>
    </Flex>
  );
}
