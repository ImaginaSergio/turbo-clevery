import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Box,
  Flex,
  Icon,
  Button,
  Modal,
  ModalBody,
  Image,
  ModalContent,
  ModalOverlay,
  Center,
  Progress,
  useMediaQuery,
} from '@chakra-ui/react';
import { BiArrowBack } from 'react-icons/bi';
import { AiFillCheckCircle } from 'react-icons/ai';

import { OpenParser } from 'ui';
import { fmtMnts } from 'utils';
import { sortByRoadmap, IRuta } from 'data';

import { LayoutContext, LoginContext } from '../../../context';

interface ProyectoModalProps {
  isOpen: boolean;
  ruta?: IRuta;
  proyectos?: any;
  cursos?: any;
  onClose: () => void;
}

export const ModalInfoResponsive = ({ ruta, proyectos, cursos, isOpen = false, onClose }: ProyectoModalProps) => {
  const { isMobile } = useContext(LayoutContext);
  const navigate = useNavigate();
  const { user } = useContext(LoginContext);
  const [isLargerThan450] = useMediaQuery('(min-width: 450px)');
  const [isLargerThan560] = useMediaQuery('(min-width: 560px)');

  return (
    <Modal size="full" isOpen={isOpen} onClose={onClose} closeOnOverlayClick={true}>
      <ModalOverlay boxSize="100%" bg="rgba(25, 25, 25, 1)">
        <ModalContent boxSize="100%" rounded="0px" background="transparent" overflow="auto">
          <ModalBody boxSize="100%" pt="20px" mb="20px">
            <Flex w="100%" h="100%" direction="column" justify="center" align="center">
              <Flex w="100%" color="#ffffff" h="100%" direction="column">
                <Button
                  color="#FFF"
                  bg="#383839"
                  alignItems="center"
                  onClick={onClose}
                  pr={isMobile ? '10px' : ''}
                  leftIcon={<Icon as={BiArrowBack} />}
                  _hover={{ backgroundColor: '#000' }}
                  position="absolute"
                  ml="10px"
                  mt="10px"
                >
                  {'Volver'}
                </Button>
                <Flex w="100%" h="100%" justify={isLargerThan560 ? 'center' : 'flex-start'}>
                  {ruta?.icono && (
                    <Image
                      src={`data:image/svg+xml;utf8,${ruta.icono}`}
                      boxSize="100%"
                      h="100%"
                      w="100%"
                      maxW={isLargerThan560 ? '300px' : '100%'}
                      maxH={isLargerThan560 ? '300px' : '100%'}
                      rounded="xl"
                    />
                  )}
                </Flex>

                <Box mt="22px" fontSize="32px" fontWeight="bold" lineHeight="39px" color="#ffffff" data-cy="preview_titulo">
                  {ruta?.nombre}
                </Box>

                {ruta?.id === user?.progresoGlobal?.ruta?.id && (
                  <Flex direction="column" gap="10px" mt="24px">
                    <Flex align="end">
                      <Box fontSize="21px" fontWeight="bold" color="#ffffff">
                        {user?.progresoGlobal?.meta?.progresoCampus}%{'  '}
                      </Box>

                      <Box fontSize="15px" color="#ffffff" pl="10px">
                        DE HOJA DE RUTA COMPLETADA
                      </Box>
                    </Flex>

                    <Center>
                      <Progress
                        w="100%"
                        size="sm"
                        rounded="20px"
                        value={100}
                        sx={{
                          '& > div': {
                            background: !+`${user?.progresoGlobal?.meta?.progresoCampus || 0}%`.replace('%', '')
                              ? 'white'
                              : `linear-gradient(90deg, var(--chakra-colors-primary) 0%, var(--chakra-colors-primary_dark) ${`${
                                  user?.progresoGlobal?.meta?.progresoCampus || 0
                                }%`}, var(--chakra-colors-gray_3) ${`${
                                  user?.progresoGlobal?.meta?.progresoCampus || 0
                                }%`}, var(--chakra-colors-gray_3) 100%)`,
                          },
                        }}
                      />
                    </Center>
                  </Flex>
                )}
                <OpenParser
                  value={ruta?.descripcion}
                  style={{
                    marginTop: '28px',
                    marginBottom: '28px',
                    fontSize: '18px',
                    lineHeight: '30px',
                  }}
                />

                <Flex p="7px" h="auto" gap="10px" bg="#323339" rounded="12px" direction="column">
                  {sortByRoadmap(cursos, proyectos, ruta?.meta?.itinerario).map((item, index) => (
                    <Flex
                      key={index}
                      w="100%"
                      p="10px"
                      gap="20px"
                      rounded="12px"
                      align="center"
                      cursor="pointer"
                      height="fit-content"
                      justify="space-between"
                      transition="all 0.5s ease"
                      bg={!item?.curso?.meta?.isCompleted ? '#242529' : '#1D1E22'}
                    >
                      <Flex align="center" gap="10px">
                        {item?.curso?.icono && <Image boxSize="40px" src={`data:image/svg+xml;utf8,${item?.curso?.icono}`} />}

                        <Flex gap="70px">
                          <Flex direction="column">
                            <Box fontSize="16px" fontWeight="bold">
                              {item?.curso?.titulo}
                            </Box>

                            <Flex gap="4px" color="gray_4" display="flex" fontSize="14px">
                              {item?.curso?.disponible ? (
                                <>
                                  <Box>{item?.curso?.modulos?.length || 0} módulos</Box>
                                  <Box>|</Box>
                                  <Box>{fmtMnts(item?.curso?.meta?.duracionTotal)}</Box>{' '}
                                </>
                              ) : (
                                <Box>Disponible próximamente...</Box>
                              )}
                            </Flex>
                          </Flex>
                        </Flex>
                      </Flex>

                      {item?.curso?.meta?.isCompleted && <Icon as={AiFillCheckCircle} boxSize="28px" color="primary" />}
                    </Flex>
                  ))}
                </Flex>
                <Box w="100%" height="24px" bg="#191919" />
              </Flex>
            </Flex>
          </ModalBody>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
};
