import { useContext, useEffect, useState } from 'react';

import {
  Box,
  Flex,
  Icon,
  Input,
  Center,
  Spinner,
  useToast,
  InputGroup,
  InputLeftElement,
  InputRightElement,
} from '@chakra-ui/react';
import { BiPlus, BiBook, BiTrash, BiSearch, BiGridAlt, BiDotsVerticalRounded } from 'react-icons/bi';

import { onFailure } from 'utils';
import { ILeccion, INota } from 'data';
import { OpenDnDModal, OpenParser } from 'ui';
import { addNota, deleteNota, getNotas, updateNota } from 'data';

import { NotasEditor } from './NotasEditor';
import { Menu } from '../../../../../shared/components';
import { LoginContext } from '../../../../../shared/context';

import './quill.snow.css';

export const NotasDnd = ({ leccion, state }: { leccion?: ILeccion; state: { isOpen: boolean; onClose: () => void } }) => {
  const toast = useToast();
  const { user } = useContext(LoginContext);

  const [nota, setNota] = useState<INota>();
  const [notas, setNotas] = useState<INota[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [uploadingNota, setUploadingNota] = useState<INota>();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isNewNota, setIsNewNota] = useState<boolean>(false);

  useEffect(() => {
    refreshStateNotas();
  }, [leccion?.id]);

  const refreshStateNotas = async () => {
    if (!leccion?.id) return;

    const notasData = await getNotas({
      query: [{ user_id: user?.id }, { leccion_id: leccion?.id }, { sort_by: 'updatedAt' }, { order: 'desc' }],
    });

    await setNotas(notasData?.data || []);
    await setUploadingNota(undefined);
  };

  const onDeleteNota = async (nota?: INota) => {
    if (!nota?.id) return;

    await setUploadingNota(nota);
    await deleteNota({ id: nota.id }).then(() => refreshStateNotas());
    await setUploadingNota(undefined);
  };

  const guardarNota = (nota: INota) => {
    setUploadingNota(nota);

    if (isNewNota) {
      addNota({
        nota: {
          leccionId: nota.leccionId,
          titulo: nota.titulo,
          contenido: nota.contenido,
        },
      })
        .then(() => refreshStateNotas())
        .catch((e) => onFailure(toast, 'Error inesperado', 'No se ha podido crear la nota. Inténtalo de nuevo más tarde.'));
    } else if (nota?.id) {
      updateNota({ id: nota.id, nota })
        .then(() => refreshStateNotas())
        .catch((e) =>
          onFailure(toast, 'Error inesperado', 'No se ha podido actualizar la nota. Inténtalo de nuevo más tarde.')
        );
    } else {
      onFailure(toast, 'Error inesperado', 'Por favor, actualize la página y contacte con soporte si el error persiste.');
      return;
    }

    setIsOpen(false);
  };

  const crearNota = async () => {
    if (!leccion?.id) {
      onFailure(toast, 'Error inesperado', 'Por favor, actualize la página y contacte con soporte si el error persiste.');
      return;
    }

    await setIsNewNota(true);
    await setNota({
      titulo: 'Nueva nota',
      contenido: ' ',
      leccionId: leccion?.id,
    });

    await setIsOpen(true);
  };

  const editarNota = async (nota: INota) => {
    await setIsNewNota(false);
    await setNota(nota);
    await setIsOpen(true);
  };

  return (
    <OpenDnDModal state={state} head={{ title: 'Notas', icon: BiGridAlt, allowFullScreen: true }}>
      {!isOpen && (
        <>
          <Flex align="center" h="70px" p="15px">
            <InputGroup p="0px">
              <InputLeftElement children={<Icon as={BiSearch} color="gray_4" boxSize="24px" />} />

              <Input
                border="none"
                value={searchQuery}
                placeholder="Buscar notas"
                _focus={{ border: 'none' }}
                onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
                _placeholder={{
                  color: 'gray_4',
                  fontWeight: 'bold',
                  fontSize: '14px',
                }}
              />

              <InputRightElement
                children={
                  <Icon
                    as={BiPlus}
                    data-cy="crear_nota_button"
                    color="gray_4"
                    cursor="pointer"
                    boxSize="28px"
                    onClick={() => crearNota()}
                  />
                }
              />
            </InputGroup>
          </Flex>

          <Box w="100%" h="1px" bg="gray_3" />
        </>
      )}

      <Flex overflowY="scroll" direction="column">
        {!isOpen &&
          notas?.length > 0 &&
          notas
            ?.filter(
              (n: INota) => n.contenido.toLowerCase().includes(searchQuery) || n.titulo.toLowerCase().includes(searchQuery)
            )
            ?.map((nota: INota, i) => (
              <Flex
                data-cy="nota_container"
                key={`nota-${i}`}
                cursor="pointer"
                bg="white"
                position="relative"
                pb="10px"
                m="10px 30px"
                direction="column"
                borderBottom="solid 1px #E6E6EA;"
                onClick={() => editarNota(nota)}
                _hover={{ filter: 'brightness(80%)' }}
              >
                <Flex justify="space-between">
                  <Flex gap="10px" align="center" color="gray_4" fontSize="13px">
                    <Icon as={BiBook} boxSize="17px" />

                    <Box>
                      Módulo {leccion?.modulo?.orden} / Lección {leccion?.orden}
                    </Box>
                  </Flex>

                  <Menu
                    icon={BiDotsVerticalRounded}
                    items={[
                      {
                        icon: BiTrash,
                        label: 'Borrar',
                        onClick: () => onDeleteNota(nota),
                      },
                    ]}
                  />
                </Flex>

                <Box fontSize="14px" fontWeight="bold" data-cy={`nota_titulo_${i}`}>
                  {nota.titulo}
                </Box>

                <Box fontSize="14px" data-cy={`nota_contenido_${i}`}>
                  <OpenParser value={nota.contenido} />
                </Box>

                {uploadingNota?.id === nota.id && (
                  <Center boxSize="100%" position="absolute" style={{ backdropFilter: 'blur(2px)' }}>
                    <Spinner />
                  </Center>
                )}
              </Flex>
            ))}

        {isOpen && (
          <NotasEditor
            nota={nota}
            onClose={() => setIsOpen(false)}
            onSave={(n) => guardarNota(n)}
            title={`${leccion?.modulo?.titulo} ${leccion?.titulo}`}
          />
        )}
      </Flex>
    </OpenDnDModal>
  );
};
