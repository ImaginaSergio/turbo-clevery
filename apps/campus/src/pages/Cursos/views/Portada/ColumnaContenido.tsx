import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  BiLock,
  BiPlay,
  BiTask,
  BiCheck,
  BiListOl,
  BiTrophy,
  BiBookOpen,
  BiTimeFive,
  BiChevronUp,
  BiPlayCircle,
  BiChevronDown,
} from 'react-icons/bi';
import { Box, Flex, Icon, Text, Button, Progress, CircularProgress, CircularProgressLabel } from '@chakra-ui/react';
import { AnimatePresence, motion } from 'framer-motion';

import { fmtMnts } from 'utils';
import { IModulo, ILeccion, LeccionTipoEnum, ICurso } from 'data';

import { LayoutContext } from '../../../../shared/context';

export const ColumnaContenido = ({ modulos = [], curso }: { modulos: IModulo[]; curso: ICurso }) => {
  const [inTop, setInTop] = useState<boolean>(false);
  const [isModuloSelected, setIsModuloSelected] = useState<any>('');

  const handleScroll = (e: any) => {
    const element = e.target.scrollTop;

    if (element > 0) setInTop(true);
    else setInTop(false);
  };

  return (
    <Flex
      bg="white"
      boxSize="100%"
      overflow="hidden"
      direction="column"
      minW={{ base: '100%', sm: '400px' }}
      rounded={{ base: 'unset', lg: '20px' }}
      marginRight={{ base: 'unset', lg: '40px' }}
    >
      {/* CURSO SIN INICIAR */}
      {(!curso?.meta?.progreso_count || curso?.meta?.progreso_count === 0) && (
        <Text
          fontSize="14px"
          fontWeight="bold"
          color="gray_4"
          lineHeight="14px"
          textTransform="uppercase"
          p="32px 32px 18px"
          transition="box-shadow 0.3s"
          boxShadow={inTop ? '0px 4px 18px rgba(18, 22, 37, 0.1)' : 'unset'}
        >
          Contenido Del Curso
        </Text>
      )}

      {/* CURSO INICIADO/COMPLETADO */}
      {(curso?.meta?.progreso_count || 0) > 0 && (
        <Flex
          w="100%"
          bg="white"
          gap="8px"
          top="0px"
          maxW="100%"
          direction="column"
          transition="box-shadow 0.3s"
          roundedTop="20px"
          position="sticky"
          p="32px 32px 18px"
          boxShadow={inTop ? '0px 4px 18px rgba(18, 22, 37, 0.1)' : 'unset'}
        >
          <Flex justify="space-between" align="center" w="100%">
            <Flex gap="4px" align="center">
              <Box fontWeight="bold" fontSize={{ base: '14px', sm: '21px' }}>
                {curso?.meta?.progreso_count}%
              </Box>

              <Box color="gray_5" fontWeight="bold" textTransform="uppercase" fontSize={{ base: '10px', sm: '13px' }}>
                Del curso completado
              </Box>
            </Flex>

            <Icon
              as={BiTrophy}
              boxSize={{ base: '15px', sm: '20px' }}
              color={curso?.meta?.isCompleted ? 'primary' : 'gray_5'}
            />
          </Flex>

          <Progress
            w="100%"
            bg="gray_2"
            maxW="100%"
            rounded="full"
            h={{ base: '6px', sm: '8px' }}
            value={curso?.meta?.progreso_count || 0}
            sx={{ '& > div': { background: 'var(--chakra-colors-primary)' } }}
          />
        </Flex>
      )}

      {/* MODULOS */}
      <Flex
        w="100%"
        px="32px"
        pb="32px"
        direction="column"
        onScroll={handleScroll}
        overflow={{ base: 'unset', lg: 'auto' }}
        maxH={{ base: 'fit-content', lg: '72vh' }}
      >
        {modulos?.map((modulo: IModulo, index: number) => (
          <DesplegableModulo
            index={index}
            modulo={modulo}
            key={`curso-modulo-${index}`}
            isModuloSelected={isModuloSelected}
            setIsModuloSelected={setIsModuloSelected}
          />
        ))}

        {modulos?.length === 0 && (
          <Box fontSize="14px" fontWeight="medium" color="#84889A">
            Estamos preparando el contenido de este curso y estará disponible próximamente.
          </Box>
        )}
      </Flex>
    </Flex>
  );
};

const DesplegableModulo = ({
  modulo,
  index,
  isModuloSelected,
  setIsModuloSelected,
  ...rest
}: {
  index: number;
  modulo: IModulo;
  'data-cy'?: string;
  isModuloSelected?: boolean;
  setIsModuloSelected?: any;
}) => {
  const [isUnfolded, setIsUnfolded] = useState<boolean>(false);

  const navigate = useNavigate();
  const { isMobile } = useContext(LayoutContext);

  useEffect(() => {
    if (isModuloSelected !== modulo.id) setIsUnfolded(false);
  }, [isModuloSelected]);

  return (
    <Flex
      mb="10px"
      maxW="100%"
      direction="column"
      rounded="20px"
      bg={isUnfolded ? 'gray_2' : 'gray_1'}
      data-cy={`cursos_landing_modulo-${modulo.titulo}`}
    >
      <motion.header
        initial={false}
        onClick={() => {
          setIsModuloSelected(modulo.id);
          setIsUnfolded(!isUnfolded);
        }}
      >
        <Flex
          maxW="100%"
          align="center"
          direction="column"
          p={{ base: '14px', sm: '20px' }}
          minH={!isUnfolded ? '85px' : 'unset'}
          maxH={!isUnfolded ? '85px' : 'unset'}
        >
          <Flex w="100%" maxW="100%" align="center" cursor="pointer" justify="space-between">
            <Flex gap={{ base: '10px', sm: '20px' }} align="center">
              <CircularProgress
                h="fit-content"
                bg={modulo?.meta && modulo?.meta?.progresos_count > 0 ? 'primary_light' : 'gray_2'}
                rounded="full"
                color="primary"
                trackColor={modulo?.meta && modulo?.meta?.progresos_count > 0 ? 'white' : 'gray_2'}
                size={isMobile ? '30px' : '45px'}
                value={((modulo.meta?.progresos_count || 0) / (modulo.meta?.leccionesCount || 0)) * 100}
              >
                <CircularProgressLabel
                  fontWeight="extrabold"
                  fontSize={{ base: '16px', sm: '18px' }}
                  color={
                    isUnfolded
                      ? 'primary'
                      : modulo.meta && modulo.meta?.progresos_count >= modulo.meta?.leccionesCount
                      ? 'primary'
                      : 'gray_4'
                  }
                >
                  {modulo.orden}
                </CircularProgressLabel>
              </CircularProgress>

              <Flex direction="column" w="100%">
                <Flex
                  wrap="wrap"
                  maxW="100%"
                  noOfLines={1}
                  fontWeight="bold"
                  textOverflow="ellipsis"
                  fontSize={{ base: '14px', sm: '16px' }}
                >
                  {modulo.titulo}
                </Flex>

                <Box fontWeight="bold" fontSize="16px">
                  <Flex
                    color="gray_4"
                    fontSize="13px"
                    fontWeight="normal"
                    gap={{ base: '0px', sm: '14px' }}
                    direction={{ base: 'column', sm: 'row' }}
                  >
                    <Flex align="center" gap="4px">
                      <Icon as={BiListOl} />
                      {modulo?.lecciones?.length || 0} lecciones
                    </Flex>

                    <Flex align="center" gap="4px">
                      <Icon as={BiTimeFive} />
                      {fmtMnts(modulo?.meta?.duracionTotal || 0)}
                    </Flex>
                  </Flex>
                </Box>
              </Flex>
            </Flex>

            <Flex align="center" gap={{ base: '5px', sm: '20px' }}>
              {modulo.meta && modulo.meta?.progresos_count >= modulo.meta?.leccionesCount && (
                <Icon color="#fff" bg="primary" boxSize="20px" rounded="full" as={BiCheck} />
              )}

              <Button
                px="2px"
                maxW="20px"
                minW="20px"
                boxSize="20px"
                bg="transparent"
                _hover={{ backgroundColor: 'transparent' }}
              >
                <Icon
                  color="gray_4"
                  boxSize="22px"
                  _hover={{ color: 'primary' }}
                  as={isUnfolded ? BiChevronUp : BiChevronDown}
                />
              </Button>
            </Flex>
          </Flex>
        </Flex>
      </motion.header>

      <Flex direction="column" gap="8px" w="100%" overflow="hidden" px="20px">
        <AnimatePresence initial={false}>
          {isUnfolded && (
            <motion.section
              key="content"
              animate="open"
              exit="collapsed"
              initial="collapsed"
              variants={{
                open: { height: 'auto' },
                collapsed: { height: 0 },
              }}
              transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
            >
              <motion.section
                key="content"
                animate="open"
                exit="collapsed"
                initial="collapsed"
                variants={{ open: { opacity: 1 }, collapsed: { opacity: 0 } }}
                transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
              >
                {modulo.lecciones?.map((leccion: ILeccion, i: number) => (
                  <Flex
                    w="100%"
                    mb={modulo?.lecciones?.length && modulo?.lecciones?.length - 1 === i ? '20px' : '5px'}
                    gap={5}
                    align="center"
                    justify="space-between"
                    p={{ base: '8px', sm: '12px' }}
                    key={`curso-modulo-${index}-leccion-${leccion.id}`}
                    data-cy={`cursos_landing_modulo-leccion-${leccion.id}`}
                    cursor={modulo.meta?.isBlocked ? 'not-allowed' : 'pointer'}
                    _hover={
                      modulo.meta?.isBlocked
                        ? {}
                        : {
                            filter: 'brightness(90%)',
                            background: '#E6E6EA',
                            borderRadius: '12px',
                          }
                    }
                    onClick={
                      modulo.meta?.isBlocked ? undefined : () => navigate(`/cursos/${modulo.cursoId}/leccion/${leccion.id}`)
                    }
                  >
                    <Flex align="center" gap="14px">
                      <Icon
                        boxSize="20px"
                        color="gray_5"
                        as={
                          leccion.tipo === LeccionTipoEnum.VIDEO
                            ? BiPlayCircle
                            : leccion.tipo === LeccionTipoEnum.ENTREGABLE
                            ? BiTask
                            : BiBookOpen
                        }
                      />

                      <Box fontSize="14px">{leccion?.titulo}</Box>
                    </Flex>

                    <Flex align="center" gap="14px">
                      {leccion?.duracion && (
                        <>
                          {' '}
                          <Text color="gray_5" fontSize="14px" display={{ base: 'none', sm: 'flex' }}>
                            {fmtMnts(leccion?.duracion)}
                          </Text>
                          <Text color="gray_5" fontSize="12px" display={{ base: 'flex', sm: 'none' }}>
                            {fmtMnts(leccion?.duracion, false)}
                          </Text>
                        </>
                      )}

                      <Icon
                        boxSize="20px"
                        as={
                          !leccion.meta?.isBlocked && !leccion.meta?.isCompleted
                            ? BiPlay
                            : leccion.meta?.isCompleted
                            ? BiCheck
                            : BiLock
                        }
                      />
                    </Flex>
                  </Flex>
                ))}
              </motion.section>
            </motion.section>
          )}
        </AnimatePresence>
      </Flex>
    </Flex>
  );
};

export default ColumnaContenido;
