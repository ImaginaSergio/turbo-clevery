import { useContext } from 'react';
import { useParams } from 'react-router-dom';

import { Flex } from '@chakra-ui/react';

import { IBoost, useBoost } from 'data';

import { Ruta } from './Ruta';
import { Info } from './Info';
import { Header } from './Header';
import { Empresa } from './Empresa';
import { Progreso } from './Progreso';
import { Requisitos } from './Requisitos';

import { LoginContext } from '../../../../shared/context';

const BoostsCover = () => {
  const { boostId } = useParams();

  const { user } = useContext(LoginContext);
  const { boost, isLoading, isError } = useBoost({
    id: boostId || -1,
    query: [{ limit: 100 }],
    certificacionesCompletadas: user?.progresoGlobal?.meta?.certificacionesCompletadas || [],
  });

  const isInscribed = user?.boosts?.find((b: IBoost) => b.meta?.pivot_activo === true && b.id === boost?.id) !== undefined;

  return (
    <Flex
      w="100%"
      p={{ base: '0px', sm: '24px', md: '34px' }}
      gap={{ base: '40px', md: '80px' }}
      direction={{ base: 'column', lg: 'row' }}
    >
      <Flex w="100%" gap="40px" direction="column">
        <Header boost={boost} isLoading={isLoading} />
        <Flex display={{ base: 'flex', lg: 'none' }}>
          {isInscribed ? <Progreso isLoading={isLoading} /> : <Requisitos boost={boost} isLoading={isLoading} />}
        </Flex>
        <Info boost={boost} isLoading={isLoading} />

        <Ruta boost={boost} isLoading={isLoading} />
      </Flex>

      <Flex w={{ base: '100%', lg: 'fit-content' }} gap={{ base: '20px', lg: '40px' }} direction="column">
        <Flex display={{ base: 'none', lg: 'flex' }}>
          {isInscribed ? <Progreso isLoading={isLoading} /> : <Requisitos boost={boost} isLoading={isLoading} />}
        </Flex>

        <Empresa boost={boost} isLoading={isLoading} />
      </Flex>
    </Flex>
  );
};

export default BoostsCover;
