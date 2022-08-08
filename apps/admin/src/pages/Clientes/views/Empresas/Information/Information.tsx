import { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';

import { Flex, Icon, useToast, Spinner, Center } from '@chakra-ui/react';
import { BiBookContent, BiBookReader, BiCog, BiShow } from 'react-icons/bi';

import { IEmpresa } from 'data';
import { onFailure } from 'ui';
import { getEmpresa, updateEmpresa } from 'data';
import { PageHeader, PageSidebar } from '../../../../../shared/components';

import { TabVacantes } from './TabVacantes';
import { TabInformacion } from './TabInformacion';
import { TabConfiguracion } from './TabConfiguracion';

enum Tab {
  INFORMACION = 'informacion',
  VACANTES = 'vacantes',
  CONFIGURACION = 'configuracion',
}

export default function EmpresasInformation() {
  const { empresaID } = useParams<any>();

  const [empresa, setEmpresa] = useState<IEmpresa>();
  const [tab, setTab] = useState<any>(Tab.INFORMACION);

  const toast = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const hash = (location?.hash || '')?.replaceAll('#', '');

    if (hash === 'vacantes') setTab(Tab.VACANTES);
    else if (hash === 'configuracion') setTab(Tab.CONFIGURACION);
    else setTab(Tab.INFORMACION);
  }, []);

  useEffect(() => {
    refreshState();
  }, [empresaID]);

  const refreshState = async () => {
    if (!empresaID) return;

    const _empresa = await getEmpresa({ id: +empresaID, client: 'admin' });
    setEmpresa(_empresa);
  };

  const updateValue = (value: any) => {
    if (!empresaID) return;

    return updateEmpresa({ id: +empresaID, empresa: value, client: 'admin' })
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
        title="Ficha de la empresa"
        items={[
          {
            icon: BiBookContent,
            title: 'Información',
            isActive: tab === Tab.INFORMACION,
            onClick: () => {
              setTab(Tab.INFORMACION);
              navigate(`/clientes/empresas/${empresaID}#informacion`);
            },
          },
          {
            icon: BiBookReader,
            title: 'Vacantes',
            isDisabled: true,
            isActive: tab === Tab.VACANTES,
            onClick: () => {
              setTab(Tab.VACANTES);
              navigate(`/clientes/empresas/${empresaID}#vacantes`);
            },
          },
          {
            icon: BiCog,
            title: 'Configuración',
            isActive: tab === Tab.CONFIGURACION,
            onClick: () => {
              setTab(Tab.CONFIGURACION);
              navigate(`/clientes/empresas/${empresaID}#configuracion`);
            },
          },
        ]}
      />

      <Flex direction="column" w="100%">
        <PageHeader
          head={{
            title: empresa?.nombre || '-',
            image: empresa?.imagen?.url,
          }}
        />

        {!empresa ? (
          <Center boxSize="100%">
            <Spinner boxSize="40px" />
          </Center>
        ) : tab === Tab.INFORMACION ? (
          <TabInformacion empresa={empresa} updateValue={updateValue} />
        ) : tab === Tab.VACANTES ? (
          <TabVacantes empresa={empresa} updateValue={updateValue} />
        ) : (
          <TabConfiguracion empresa={empresa} updateValue={updateValue} />
        )}
      </Flex>
    </Flex>
  );
}
