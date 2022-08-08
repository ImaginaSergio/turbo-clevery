import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { BiBook, BiBox, BiMenu, BiTrash } from 'react-icons/bi';
import { Flex, Box, Image, Icon } from '@chakra-ui/react';

import { Avatar } from 'ui';
import { ICurso, IProyectoBoost } from 'data';

const ItinerarioListItem = ({
  curso,
  proyecto,
  onDelete = () => {},
  onSelect = () => {},
}: {
  curso?: ICurso;
  proyecto?: IProyectoBoost;
  onDelete: () => void;
  onSelect: () => void;
}) => {
  if (curso?.id) return <ListItem_Curso curso={curso} onDelete={onDelete} />;
  else if (proyecto?.id) return <ListItem_Proyecto proyecto={proyecto} onDelete={onDelete} />;
  else
    return (
      <Flex className="itinerario-list-item" gap="20px" bg="#FAFAFC" p="10px 12px" align="center" rounded="12px">
        ¿?
      </Flex>
    );
};

const ListItem_Curso = ({ curso, onDelete }: { curso: ICurso; onDelete: () => void }) => {
  return (
    <Flex className="itinerario-list-item" gap="20px" bg="#FAFAFC" p="10px 12px" align="center" rounded="12px">
      <Flex align="center" w="100%" minW="200px" gap="12px">
        <Icon as={BiBook} boxSize="18px" color="#878EA0" />

        <Image minW="40px" fit="cover" rounded="7px" boxSize="40px" src={`data:image/svg+xml;utf8,${curso?.icono}`} />

        <Flex direction="column" gap="2px">
          <Box fontWeight="semibold" fontSize="16px" lineHeight="19px">
            {curso.titulo}
          </Box>

          <Box
            color="#FFF"
            p="2px 7px"
            bg="#2EDDBE"
            rounded="7px"
            w="fit-content"
            fontSize="12px"
            lineHeight="14px"
            fontWeight="bold"
          >
            {curso?.publicado ? 'PUBLICADO' : 'OCULTO'}
          </Box>
        </Flex>
      </Flex>

      <Flex align="center" w="100%" gap="15px">
        <Avatar
          size="40px"
          variant="bauhaus"
          src={curso?.profesor?.avatar?.url}
          name={curso?.profesor?.fullName || 'Avatar del profesor'}
          colorVariant={(curso?.profesor?.id || 0) % 2 == 1 ? 'hot' : 'cold'}
        />

        <Flex direction="column" gap="2px">
          <Box fontWeight="semibold" fontSize="16px" lineHeight="19px">
            {curso?.profesor?.fullName}
          </Box>

          <Box color="#878EA0" fontSize="15px" lineHeight="18px">
            {curso?.profesor?.email}
          </Box>
        </Flex>
      </Flex>

      <Flex align="center" w="100%">
        <Box fontSize="15px" lineHeight="18px">
          {format(new Date(curso.createdAt), 'dd LLL yyyy', { locale: es })}
        </Box>
      </Flex>

      <Flex
        minW="fit-content"
        cursor="pointer"
        opacity={0}
        onClick={onDelete}
        transition="all 0.2s ease"
        sx={{ '.itinerario-list-item:hover &': { opacity: 1 } }}
      >
        <Icon as={BiTrash} boxSize="18px" color="#878EA0" />
      </Flex>
    </Flex>
  );
};

const ListItem_Proyecto = ({ proyecto, onDelete }: { proyecto: IProyectoBoost; onDelete: () => void }) => {
  return (
    <Flex className="itinerario-list-item" gap="20px" bg="#FAFAFC" p="10px 12px" align="center" rounded="12px">
      <Flex align="center" w="100%" minW="200px" gap="12px">
        <Icon as={BiBox} boxSize="18px" color="#878EA0" />

        <Image h="40px" minW="40px" fit="cover" rounded="7px" src={`data:image/svg+xml;utf8,${proyecto?.icono}`} />

        <Flex direction="column" gap="2px">
          <Box fontWeight="semibold" fontSize="16px" lineHeight="19px">
            {proyecto.titulo}
          </Box>

          <Box
            color="#FFF"
            p="2px 7px"
            bg="#2EDDBE"
            rounded="7px"
            w="fit-content"
            fontSize="12px"
            lineHeight="14px"
            fontWeight="bold"
          >
            {proyecto?.publicado ? 'PUBLICADO' : 'OCULTO'}
          </Box>
        </Flex>
      </Flex>

      <Flex align="center" w="100%" gap="15px">
        {proyecto?.descripcionCorta}
      </Flex>

      <Flex
        minW="fit-content"
        cursor="pointer"
        opacity={0}
        onClick={onDelete}
        transition="all 0.2s ease"
        sx={{ '.itinerario-list-item:hover &': { opacity: 1 } }}
      >
        <Icon as={BiTrash} boxSize="18px" color="#878EA0" />
      </Flex>
    </Flex>
  );
};

export default ItinerarioListItem;
