import { useContext, useState, useEffect } from 'react';

import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { BiPlus } from 'react-icons/bi';
import { Box, Button, Flex, Icon, useDisclosure } from '@chakra-ui/react';

import { InformationTable, textRowTemplate } from '../../../../../shared/components';
import { isRoleAllowed } from 'utils';
import { ICurso, IGrupo, UserRolEnum } from 'data';
import { LoginContext } from '../../../../../shared/context';
import { CursosGruposModal } from '../../../components/CursosGruposModal';

type TabCursosProps = {
  grupo: IGrupo;
  updateValue: (value: any) => void;
  refreshState: () => void;
};

export const TabCursos = ({ grupo, updateValue, refreshState }: TabCursosProps) => {
  const [cursoSelected, setCursoSelected] = useState<ICurso>();

  const { user } = useContext(LoginContext);
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Flex direction="column" p="30px" boxSize="100%" rowGap="30px" overflow="auto">
      <Flex minH="fit-content" w="100%" direction="column" rowGap="8px">
        <Box fontSize="18px" fontWeight="semibold">
          Listado de cursos
        </Box>

        <Box fontSize="14px" fontWeight="medium" color="#84889A">
          Listado de los cursos asociados al grupo, accesibles para todos los alumnos dentro de este.
        </Box>
      </Flex>

      <Flex direction="column" w="100%">
        <Flex w="100%" gap="8px" align="center" minH="fit-content" justify="space-between">
          <Box fontSize="15px" fontWeight="medium">
            Listado de cursos
          </Box>

          <Button
            leftIcon={<Icon as={BiPlus} boxSize="21px" />}
            onClick={onOpen}
            isDisabled={isRoleAllowed([UserRolEnum.SUPERVISOR], user?.rol)}
          >
            Añadir curso
          </Button>
        </Flex>

        <InformationTable
          isLoading={!grupo}
          data={grupo?.cursos}
          style={{ width: '100%' }}
          onRowClick={(row) => {
            setCursoSelected(row?.data);
            onOpen();
          }}
          columns={[
            {
              key: 'curso',
              field: 'curso',
              header: 'Curso asociado',
              render: (rowData: any) =>
                textRowTemplate({
                  content: {
                    text: rowData?.titulo,
                    subtext: 'Nivel ' + rowData?.nivel,
                  },
                  prefix: { svg: rowData?.icono },
                }),
            },
            {
              key: 'fecha_inicio',
              field: 'fecha_inicio',
              header: 'Fecha de subida',
              render: (rowData: any) =>
                textRowTemplate({
                  content: {
                    text: format(new Date(rowData?.meta?.pivot_fecha_inicio), 'dd LLL yyyy', { locale: es }),
                  },
                }),
            },
            {
              key: 'fecha_fin',
              field: 'fecha_fin',
              header: 'Fecha de subida',
              render: (rowData: any) =>
                textRowTemplate({
                  content: {
                    text: format(new Date(rowData?.meta?.pivot_fecha_fin), 'dd LLL yyyy', { locale: es }),
                  },
                }),
            },
          ]}
        />
      </Flex>

      <CursosGruposModal
        grupo={grupo}
        defaultValue={cursoSelected}
        state={{
          isOpen,
          onOpen,
          onClose: () => {
            onClose();
            refreshState();
            setCursoSelected(undefined);
          },
        }}
      />
    </Flex>
  );
};
