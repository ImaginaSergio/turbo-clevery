import {
  Text,
  Icon,
  Button,
  IconButton,
  useMediaQuery,
  useDisclosure,
  MenuItem,
} from '@chakra-ui/react';
import { BiSearchAlt } from 'react-icons/bi';

import { SearchbarModal } from './SearchbarModal';

export const Searchbar = ({ isMenu }: { isMenu?: boolean }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isMobileSm] = useMediaQuery('(min-width: 768px)');

  return (
    <>
      {isMenu ? (
        <MenuItem
          onClick={onOpen}
          display="flex"
          gap="12px"
          alignItems="center"
        >
          <Icon as={BiSearchAlt} boxSize="15px" color="gray_5" />
          <Text fontSize="13px" fontWeight="semibold">
            Buscar
          </Text>
        </MenuItem>
      ) : !isMobileSm ? (
        <IconButton
          onClick={onOpen}
          bg="transparent"
          _hover={{ opacity: 0.8 }}
          aria-label="Barra de búsqueda"
          icon={<Icon as={BiSearchAlt} color="gray_4" boxSize="20px" />}
        />
      ) : (
        <Button
          p="12px"
          minW="161px"
          bg="gray_2"
          rounded="48px"
          border="gray_3"
          onClick={onOpen}
          leftIcon={<Icon as={BiSearchAlt} color="gray_4" />}
          style={{ justifyContent: 'flex-start' }}
        >
          <Text variant="button_medium" fontSize="16px" color="gray_4">
            Buscar
          </Text>
        </Button>
      )}

      <SearchbarModal isOpen={isOpen} onClose={onClose} />
    </>
  );
};
