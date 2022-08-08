import { useState, useEffect } from 'react';

import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Flex, Box } from '@chakra-ui/react';

const InformationLastupdate = ({ created, updated }: any) => {
  const [_created, setCreated] = useState<any>(created);
  const [_updated, setUpdated] = useState<any>(updated);

  useEffect(() => {
    setCreated(created);
    setUpdated(updated);
  }, [created, updated]);

  const formatDate = (date: any) => {
    if (!date) return;

    return format(new Date(date), "dd LLL yyyy',' HH:mm", { locale: es });
  };

  return (
    <Flex justify="end" align="start" h="100%">
      <Box p="10px" textAlign="end">
        <Box color="#C7C8CD" fontSize="14px" fontWeight="semibold">
          Fecha creación
        </Box>

        <Box color="#797D8A" fontSize="16px" fontWeight="medium">
          {formatDate(_created)}
        </Box>
      </Box>

      <Box mt="10px" w="2px" h="40px" bg="#E2E3E9" mx="20px" />

      <Box p="10px" textAlign="end">
        <Box color="#C7C8CD" fontSize="14px" fontWeight="semibold">
          Último cambio
        </Box>

        <Box color="#797D8A" fontSize="16px" fontWeight="medium">
          {formatDate(_updated)}
        </Box>
      </Box>

      <Box mt="10px" w="2px" h="40px" bg="#E2E3E9" ml="20px" />
    </Flex>
  );
};

export { InformationLastupdate };
