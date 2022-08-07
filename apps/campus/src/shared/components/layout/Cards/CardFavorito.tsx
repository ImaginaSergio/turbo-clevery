import { useNavigate } from 'react-router-dom';

import { BiBadgeCheck, BiBarChartAlt2, BiBook, BiCodeBlock, BiListOl, BiTimeFive } from 'react-icons/bi';
import { AiFillStar } from 'react-icons/ai';
import { Flex, Box, Icon, Text } from '@chakra-ui/react';

import { ICurso, IModulo, ILeccion, IProyecto, ICertificacion, FavoritoTipoEnum } from 'data';
import { Avatar } from 'ui';
import { fmtMnts } from 'utils';

export type CardFavoritoProps = {
  contenido?: any;
  tipo: FavoritoTipoEnum;
  onDelete: (e?: any) => void;
};

export const CardFavorito = ({ onDelete, tipo, contenido }: CardFavoritoProps) => {
  return (
    <Flex w="100%">
      {tipo === 'curso'
        ? ContentCurso(contenido)
        : tipo === FavoritoTipoEnum.PROYECTO
        ? ContentProyecto(contenido)
        : tipo === FavoritoTipoEnum.MODULO
        ? ContentModulo(contenido)
        : tipo === FavoritoTipoEnum.CERTIFICACION
        ? ContentCertificacion(contenido)
        : ContentLeccion(contenido)}

      <Flex minW="fit-content" align="center">
        <Icon
          boxSize="21px"
          as={AiFillStar}
          color="gray_5"
          transition="all 0.2s ease"
          _hover={{ color: 'black' }}
          onClick={(e: any) => onDelete(e)}
        />
      </Flex>
    </Flex>
  );
};

const ContentProyecto = (proyecto: IProyecto) => {
  const navigate = useNavigate();

  return (
    <Flex
      w="100%"
      gap="18px"
      align="center"
      onClick={() => navigate(`/comunidad/${proyecto.id}`, { state: proyecto })}
      direction={{ base: 'column', sm: 'row' }}
      alignItems={{ base: 'left' }}
    >
      <Flex bg="#000" position="relative" boxSize="60px" rounded="10px" align="center" justify="center">
        <Flex opacity="0.5" position="absolute" boxSize="60px">
          <Avatar
            size="60px"
            name="Avatar"
            fontSize="50px"
            src={`https://api.microlink.io/?url=${proyecto?.enlaceDemo}&screenshot&embed=screenshot.url&apiKey=${process.env.REACT_APP_MICROLINK_APIKEY}`}
          />
        </Flex>

        <Icon as={BiCodeBlock} boxSize="28px" color="#fff" zIndex="20" />
      </Flex>

      <Flex direction="column" justify="space-between" gap="8px">
        <Flex direction={{ base: 'column', md: 'row' }}>
          Proyecto -<Box fontWeight="semibold">{proyecto?.titulo}</Box>
        </Flex>

        <Flex align="center" gap="5px">
          <Avatar
            size="24px"
            fontSize="12px"
            src={proyecto?.user?.avatar?.url}
            name={proyecto?.user?.username || 'Avatar del usuario'}
          />

          <Box fontSize="14px" color="gray_4">
            @{proyecto?.user?.username}
          </Box>
        </Flex>
      </Flex>
    </Flex>
  );
};

const ContentCurso = (curso: ICurso) => {
  const navigate = useNavigate();

  return (
    <Flex
      w="100%"
      gap="18px"
      align="center"
      onClick={() => navigate(`/cursos/${curso.id}`)}
      direction={{ base: 'column', sm: 'row' }}
      alignItems={{ base: 'left' }}
    >
      <Flex bg="#000" position="relative" boxSize="60px" rounded="10px" align="center" justify="center">
        <Flex opacity="0.5" position="absolute" boxSize="60px">
          <Avatar
            size="60px"
            fontSize="50px"
            variant="marble"
            src={curso?.imagen?.url}
            name={curso?.titulo || 'Imagen curso'}
          />
        </Flex>

        <Icon as={BiBook} boxSize="28px" color="#fff" zIndex="20" />
      </Flex>

      <Flex direction="column" gap="8px">
        <Flex gap="5px" direction={{ base: 'column', md: 'row' }}>
          Curso -<Box fontWeight="semibold">{curso?.titulo}</Box>
        </Flex>

        <Flex align="center" gap="12px">
          <Flex align="center" fontSize="14px" color="gray_4" gap="5px">
            <Icon as={BiListOl} boxSize="20px" color="gray_6" zIndex="20" />
            {curso?.modulos?.length || 0} módulos
          </Flex>

          <Flex align="center" fontSize="14px" color="gray_4" gap="5px">
            <Icon as={BiTimeFive} boxSize="20px" color="gray_6" zIndex="20" />
            {fmtMnts(curso?.meta?.duracionTotal || 0)}
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

const ContentModulo = (modulo: IModulo) => {
  const navigate = useNavigate();

  return (
    <Flex
      w="100%"
      gap="18px"
      align="center"
      onClick={() =>
        navigate(`/cursos/${modulo?.cursoId}`, {
          state: { moduloId: modulo?.id },
        })
      }
      direction={{ base: 'column', sm: 'row' }}
      alignItems={{ base: 'left' }}
    >
      <Flex bg="#000" position="relative" boxSize="60px" rounded="10px" align="center" justify="center" mr="18px">
        <Flex opacity="0.5" position="absolute" boxSize="60px">
          <Avatar
            size="60px"
            fontSize="50px"
            variant="marble"
            src={modulo?.curso?.imagen?.url}
            name={modulo?.titulo || 'Imagen módulo'}
          />
        </Flex>

        <Icon as={BiBook} boxSize="28px" color="#fff" zIndex="20" />
      </Flex>

      <Flex direction="column" justify="space-between">
        <Flex gap="5px" align="center" direction={{ base: 'column', md: 'row' }}>
          Módulo -<Box fontWeight="semibold">{modulo?.titulo}</Box>
        </Flex>

        <Flex align="center" gap="12px">
          <Flex align="center" fontSize="14px" color="gray_4" gap="5px">
            <Icon as={BiListOl} boxSize="20px" color="gray_6" zIndex="20" />
            {modulo?.lecciones?.length || 0} lecciones
          </Flex>

          <Flex align="center" fontSize="14px" color="gray_4" gap="5px">
            <Icon as={BiTimeFive} boxSize="20px" color="gray_6" zIndex="20" />
            {fmtMnts(modulo?.meta?.duracionTotal || 0)}
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

const ContentLeccion = (leccion: ILeccion) => {
  const navigate = useNavigate();

  return (
    <Flex
      w="100%"
      gap="18px"
      align={{ base: 'left', sm: 'center' }}
      direction={{ base: 'column', sm: 'row' }}
      onClick={() => navigate(`/cursos/${leccion?.modulo?.cursoId}/leccion/${leccion?.id}`)}
    >
      <Flex bg="#000" boxSize="60px" rounded="10px" align="center" justify="center" position="relative">
        <Flex opacity="0.5" position="absolute" boxSize="60px">
          <Avatar
            size="60px"
            fontSize="50px"
            variant="marble"
            src={leccion?.modulo?.curso?.imagen?.url}
            name={leccion?.titulo || 'Imagen lección'}
          />
        </Flex>

        <Icon as={BiBook} boxSize="28px" color="#fff" zIndex="20" />
      </Flex>

      <Flex direction="column" gap="8px">
        <Flex gap="5px" direction={{ base: 'column', md: 'row' }}>
          Lección -<Box fontWeight="semibold">{leccion?.titulo}</Box>
        </Flex>

        <Flex gap="12px">
          <Flex fontSize="14px" color="gray_4" gap="5px">
            <Icon as={BiListOl} zIndex="20" color="gray_6" boxSize="20px" textTransform="capitalize" />

            <Text textTransform="capitalize" color="gray_4">
              {leccion?.tipo}
            </Text>
          </Flex>

          <Flex fontSize="14px" color="gray_4" gap="5px">
            <Icon as={BiTimeFive} boxSize="20px" color="gray_6" zIndex="20" />
            {leccion?.duracion || '-'}h
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

const ContentCertificacion = (certificacion: ICertificacion) => {
  const navigate = useNavigate();

  return (
    <Flex
      w="100%"
      gap="18px"
      align="center"
      onClick={() => navigate(`/certificaciones/${certificacion.id}`)}
      direction={{ base: 'column', sm: 'row' }}
      alignItems={{ base: 'left' }}
    >
      <Flex bg="#000" position="relative" boxSize="60px" rounded="10px" align="center" justify="center">
        <Flex opacity="0.5" position="absolute" boxSize="60px">
          <Avatar
            size="60px"
            fontSize="50px"
            variant="marble"
            src={certificacion?.imagen?.url}
            name={certificacion?.nombre || 'Imagen certificación'}
          />
        </Flex>

        <Icon as={BiBadgeCheck} boxSize="28px" color="#fff" zIndex="20" />
      </Flex>

      <Flex direction="column" gap="8px">
        <Flex align="center" gap="5px" direction={{ base: 'column', md: 'row' }}>
          Certificación -<Box fontWeight="semibold">{certificacion?.nombre}</Box>
        </Flex>

        <Flex align="center" gap="12px">
          <Flex align="center" fontSize="14px" color="gray_4" gap="5px">
            <Icon as={BiBarChartAlt2} boxSize="28px" color="gray_6" zIndex="20" textTransform="capitalize" />
            {certificacion?.nivel}
          </Flex>

          <Flex align="center" fontSize="14px" color="gray_4" gap="5px">
            <Icon as={BiTimeFive} boxSize="28px" color="gray_6" zIndex="20" />
            {fmtMnts(certificacion?.meta?.duracionExamenes || 0)}
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};
