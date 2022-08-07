import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { es } from 'date-fns/locale';
import { formatDistance } from 'date-fns';
import { AiFillStar } from 'react-icons/ai';

import { BiArrowBack, BiLeftArrowAlt, BiRightArrowAlt, BiStar, BiEdit, BiTrash } from 'react-icons/bi';
import {
  Box,
  Flex,
  Icon,
  IconButton,
  Stack,
  Tag,
  Text,
  Button,
  Modal,
  ModalBody,
  Image,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useToast,
  useDisclosure,
} from '@chakra-ui/react';

import { LoginContext, LayoutContext, FavoritosContext } from '../../../shared/context';
import { OpenParser, Avatar } from 'ui';
import { removeProyecto } from 'data';
import { onFailure, onSuccess } from 'ui';
import { DeleteModal } from '../../../shared/components';
import { FavoritoTipoEnum, IFavorito, IProyecto } from 'data';

interface ProyectoModalProps {
  isOpen: boolean;
  proyecto?: IProyecto;
  onClose: () => void;
  onClickNext?: () => void;
  onClickPrev?: () => void;
}

export const ProyectoModal = ({ proyecto, onClickNext, onClickPrev, isOpen = false, onClose }: ProyectoModalProps) => {
  const { user } = useContext(LoginContext);
  const { favoritos, addFavorito, removeFavorito } = useContext(FavoritosContext);
  const { isMobile } = useContext(LayoutContext);

  const [proyectoFavorito, setProyectoFavorito] = useState<IFavorito>();

  const toast = useToast();
  const { isOpen: isOpenDelete, onOpen: onOpenDelete, onClose: onCloseDelete } = useDisclosure();

  const navigate = useNavigate();

  useEffect(() => {
    if (favoritos?.length > 0 && proyecto?.id)
      setProyectoFavorito(favoritos?.find((f) => f.tipo === FavoritoTipoEnum.PROYECTO && f.objetoId === proyecto?.id));
  }, [favoritos, proyecto?.id]);

  const handleDelete = (id: number, userId: number) => {
    if (userId !== user?.id) return;
    else
      removeProyecto({ id })
        .then((e: any) => {
          onSuccess(toast, e.message);
          onCloseDelete();
          onClose();
        })
        .catch((error: any) => {
          onFailure(toast, 'Error inesperado', 'Error al borrar tu proyecto. Por favor, contacte con soporte.');
        });
  };

  return (
    <Modal size="full" isOpen={isOpen} onClose={onClose} closeOnOverlayClick={true}>
      <ModalOverlay bg={isMobile ? 'rgba(25, 25, 25, 1)' : 'rgba(0, 0, 0, 0.8)'}>
        <ModalContent rounded="0px" bg="transparent">
          <ModalHeader>
            <Button
              color="#FFF"
              bg="#383839"
              onClick={onClose}
              pr={{ base: '', sm: '18px' }}
              pl={{ base: '22px', sm: '' }}
              leftIcon={<Icon as={BiArrowBack} />}
              _hover={{ backgroundColor: '#000' }}
            >
              <Text display={{ base: 'none', sm: 'flex' }} color="#FFF">
                {' '}
                Volver
              </Text>
            </Button>
          </ModalHeader>

          <ModalBody>
            <Flex w="100%" justify="center" align="center" position="relative">
              <Flex w="100%" direction="column" gap="40px" align="center">
                <Flex align="center" justify="space-between" w={{ base: '100%', sm: '60vw' }} gap={isMobile ? '20px' : '30px'}>
                  <Flex gap={isMobile ? '20px' : '30px'} align="center">
                    <Avatar
                      size="60px"
                      src={proyecto?.user?.avatar?.url}
                      name={proyecto?.user?.username || 'Avatar del usuario'}
                      colorVariant={(proyecto?.user?.id || 0) % 2 == 1 ? 'hot' : 'cold'}
                    />

                    <Flex direction="column" gap="10px">
                      <Box color="#FFF" fontSize={{ base: '18px', sm: '24px' }} fontWeight="extrabold">
                        {proyecto?.titulo}
                      </Box>

                      <Box color="#FFF" fontSize="14px" fontWeight="bold">
                        {proyecto?.user?.username}
                      </Box>
                    </Flex>
                  </Flex>

                  {proyecto && proyecto.publico && (
                    <Button
                      h="42px"
                      border="none"
                      rounded="10px"
                      w="fit-content"
                      pr={{ base: '10px', sm: '' }}
                      mt={{ base: '20px', sm: '0px' }}
                      color={proyectoFavorito ? 'primary' : undefined}
                      bg={proyectoFavorito ? 'primary_light' : 'gray_3'}
                      onClick={
                        proyectoFavorito
                          ? () => removeFavorito(proyectoFavorito)
                          : () => {
                              if (proyecto?.id && user?.id)
                                addFavorito({
                                  userId: user?.id,
                                  objeto: proyecto,
                                  objetoId: proyecto?.id,
                                  tipo: FavoritoTipoEnum.PROYECTO,
                                });
                            }
                      }
                      _hover={{ bg: 'gray_2' }}
                      leftIcon={
                        <Icon
                          as={proyectoFavorito ? AiFillStar : BiStar}
                          color={proyectoFavorito ? 'primary' : undefined}
                          boxSize="21px"
                        />
                      }
                    >
                      <Box lineHeight="18px" display={{ base: 'none', sm: 'flex' }}>
                        {proyectoFavorito ? 'Favorito' : 'Añadir favorito'}
                      </Box>
                    </Button>
                  )}
                </Flex>

                <Flex w="100%" maxH="auto" pt={{ base: '0px', sm: '40px' }} align="center">
                  <IconButton
                    bg="rgba(230, 230, 234, 0.15)"
                    icon={<BiLeftArrowAlt size="20px" color="#FFF" />}
                    aria-label="Anterior"
                    onClick={onClickPrev}
                    mx={{ base: '05px', sm: '65px' }}
                    display={{ base: 'none', sm: 'flex' }}
                  />

                  <Flex position="relative" w="100%" align="center" direction="column">
                    <Image
                      w="100%"
                      rounded="15px"
                      objectFit="contain"
                      objectPosition="top"
                      border="2px solid"
                      borderColor="gray_6"
                      src={`https://api.microlink.io/?url=${proyecto?.enlaceDemo}&screenshot&embed=screenshot.url&apiKey=${process.env.REACT_APP_MICROLINK_APIKEY}`}
                    />

                    <Stack position="absolute" left="20px" bottom="20px" display={{ base: 'none', sm: 'flex' }}>
                      {proyecto?.enlaceDemo && (
                        <a href={proyecto.enlaceDemo}>
                          <Button bg="white" color="black">
                            Ver demo
                          </Button>
                        </a>
                      )}

                      {proyecto?.enlaceGithub && (
                        <a href={proyecto.enlaceGithub}>
                          <Button bg="white" color="black">
                            Ir a Github
                          </Button>
                        </a>
                      )}
                    </Stack>
                  </Flex>

                  <IconButton
                    mx={{ base: '5px', sm: '65px' }}
                    aria-label="Anterior"
                    onClick={onClickNext}
                    bg="rgba(230, 230, 234, 0.15)"
                    _hover={{ backgroundColor: '#000' }}
                    icon={<BiRightArrowAlt size="20px" color="#FFF" />}
                    display={{ base: 'none', sm: 'flex' }}
                  />
                </Flex>
                <Flex direction="column" gap="40px" marginBottom="40px" w={{ base: '100%', sm: '70vw' }}>
                  {proyecto?.contenido && (
                    <Stack color="#FFFFFF">
                      <Box fontSize="18px" fontWeight="bold">
                        Descripción del proyecto
                      </Box>

                      <Box fontSize="18px">
                        <OpenParser value={proyecto?.contenido} />
                      </Box>
                    </Stack>
                  )}

                  <Flex w="100%" gap="10px" display={{ base: 'flex', sm: 'none' }}>
                    {proyecto?.enlaceDemo && (
                      <a href={proyecto.enlaceDemo}>
                        <Button bg="white" color="black">
                          Ver demo
                        </Button>
                      </a>
                    )}
                    {proyecto?.enlaceGithub && (
                      <a href={proyecto.enlaceGithub}>
                        <Button bg="white" color="black">
                          Ir a Github
                        </Button>
                      </a>
                    )}
                  </Flex>

                  {proyecto?.habilidades && proyecto.habilidades.length > 0 && (
                    <Stack color="#FFFFFF">
                      <Box fontSize="18px" fontWeight="bold">
                        Habilidades
                      </Box>

                      <Flex gap="10px">
                        {proyecto.habilidades.map((habilidad) => (
                          <Tag bg="#383839" color="primary">
                            {habilidad.nombre}
                          </Tag>
                        ))}
                      </Flex>
                    </Stack>
                  )}

                  <Box bg="gray_5" w="100%" h="1px" />

                  <Flex align="center" gap="15px" justify="space-between">
                    {proyecto?.createdAt && (
                      <Box color="gray_3" fontSize="18px">
                        Creado hace {formatDistance(new Date(proyecto?.createdAt), new Date(), { locale: es })}
                      </Box>
                    )}

                    {proyecto?.userId === user?.id && (
                      <Flex>
                        <IconButton
                          icon={<BiEdit size="18px" />}
                          aria-label="Editar proyecto"
                          onClick={() =>
                            navigate(`/comunidad/edit/${proyecto?.id}`, {
                              state: { proyecto: proyecto?.id },
                            })
                          }
                          mr="10px"
                        />
                        <IconButton icon={<BiTrash size="18px" />} aria-label="Eliminar proyecto" onClick={onOpenDelete} />
                      </Flex>
                    )}

                    {proyecto?.meta?.totalFavoritos && (
                      <>
                        <Box bg="gray_5" h="22px" w="1px" />

                        <Flex gap="8px" align="center" color="gray_3" fontSize="18px">
                          <Icon color="#F2D25F" as={AiFillStar} />
                          {proyecto?.meta?.totalFavoritos} favoritos
                        </Flex>
                      </>
                    )}
                  </Flex>
                </Flex>
              </Flex>

              <DeleteModal
                isOpen={isOpenDelete}
                onClose={onCloseDelete}
                label={proyecto?.titulo}
                onClick={() => user?.id && proyecto?.id && handleDelete(proyecto?.id, user?.id)}
              />
            </Flex>
          </ModalBody>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
};
