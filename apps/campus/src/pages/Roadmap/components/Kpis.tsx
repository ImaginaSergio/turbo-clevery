import { useContext } from 'react';

import { Box, Flex } from '@chakra-ui/react';

import { IBoost, RutaItinerario, RutaItinerarioTipoEnum } from 'data';

import { LoginContext } from '../../../shared/context';

function Kpis({ boost, tipo }: { boost?: IBoost; tipo: 'progresoRuta' | 'progresoBoost' | 'ruta' | 'tiempo' | 'inscritos' }) {
  const { user } = useContext(LoginContext);

  const cursosRutaCompletados =
    user?.progresoGlobal?.meta?.cursosCompletados?.filter((cursoId: number) => {
      let aux = (user?.progresoGlobal?.rutaPro?.meta?.itinerario || user?.progresoGlobal?.ruta?.meta?.itinerario)?.filter(
        (cursoRuta: RutaItinerario) => cursoRuta.tipo === RutaItinerarioTipoEnum.CURSO && cursoRuta.id == cursoId
      );

      return (aux || [])?.length > 0;
    }).length || 0;

  const cursosRutaTotales =
    (user?.progresoGlobal?.rutaPro?.meta?.itinerario || user?.progresoGlobal?.ruta?.meta?.itinerario)?.length || 0;

  return (
    <>
      {(tipo === 'progresoRuta' || tipo === 'progresoBoost') && (
        <Flex direction="column" gap="5px" color="#fff">
          <Box fontSize="24px" fontWeight="bold" lineHeight="29px">
            {tipo === 'progresoRuta' && (user?.progresoGlobal?.meta?.progresoCampus || 0) + ' %'}

            {tipo === 'progresoBoost' && (user?.progresoGlobal?.meta?.progresoCampus || 0) + ' %'}
          </Box>

          <Box fontSize="16px" fontWeight="semibold" lineHeight="16px">
            Completo
          </Box>
        </Flex>
      )}

      {tipo === 'inscritos' && (
        <Flex direction="column" gap="5px" color="#fff">
          <Box fontSize="24px" fontWeight="bold" lineHeight="29px">
            {boost?.meta?.inscritos || 0}
          </Box>

          <Box fontSize="16px" fontWeight="semibold" lineHeight="16px">
            Alumnos inscritos
          </Box>
        </Flex>
      )}

      {tipo === 'ruta' && (
        <Flex direction="column" gap="5px" color="#fff">
          <Box fontSize="24px" fontWeight="bold" lineHeight="29px">
            {cursosRutaCompletados} / {cursosRutaTotales}
          </Box>

          <Box fontSize="16px" fontWeight="semibold" lineHeight="16px">
            Cursos Completados
          </Box>
        </Flex>
      )}

      {tipo === 'tiempo' && (
        <Flex direction="column" gap="5px" color="#fff">
          <Box fontSize="24px" fontWeight="bold" lineHeight="29px">
            {user?.progresoGlobal?.tiempoTotal || '0h'}
          </Box>

          <Box fontSize="16px" fontWeight="semibold" lineHeight="16px">
            Tiempo Invertido
          </Box>
        </Flex>
      )}
    </>
  );
}

export default Kpis;
