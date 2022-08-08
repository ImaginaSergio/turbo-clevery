import { useContext, useEffect, useState } from 'react';

import { BiDownload, BiFile } from 'react-icons/bi';
import { Box, Button, Flex, Icon, IconButton, Input } from '@chakra-ui/react';

import { getSoluciones } from 'data';
import { isRoleAllowed } from 'utils';
import { OpenEditor, OpenParser } from 'ui';
import { LoginContext } from '../../../../../shared/context';
import { EntregableEstadoEnum, IEntregable, UserRolEnum } from 'data';

type TabDetallesProps = {
  entregable: IEntregable;
  updateValue: (value: any) => void;
};

export const TabDetalles = ({ entregable, updateValue }: TabDetallesProps) => {
  const { user } = useContext(LoginContext);

  const [nota, setNota] = useState(entregable?.puntuacion);
  const [observaciones, setObservaciones] = useState(entregable?.observaciones);
  const [solucion, setSolucion] = useState<any>();
  const [entregarCorrecionDisabled, setEntregarCorrecionDisabled] = useState(true);

  useEffect(() => {
    setEntregarCorrecionDisabled(false);
    refreshState();
  }, [nota, observaciones]);

  const refreshState = async () => {
    if (!entregable?.leccionId) return;

    const _solucion = await getSoluciones({
      client: 'admin',
      query: [{ leccion_id: entregable?.leccionId }],
    });

    setSolucion(_solucion);
  };

  const corregirEntregable = () => {
    if (entregable?.id)
      updateValue({
        puntuacion: nota,
        observaciones: observaciones,
        fechaCorreccion: new Date().toISOString(),
        estado: (nota || 0) > 50 ? EntregableEstadoEnum.CORRECTO : EntregableEstadoEnum.ERROR,
      });

    setEntregarCorrecionDisabled(true);
  };

  const onAdjuntoDowload = () => {
    if (!entregable?.adjunto?.url) return;

    const link: HTMLAnchorElement = document.createElement('a');

    link.target = '_blank';
    link.href = entregable?.adjunto?.url;
    link.click();
  };

  return (
    <Flex p="30px" boxSize="100%" rowGap="30px" overflow="auto" direction="column">
      <Flex minH="fit-content" w="100%" direction="column" rowGap="8px">
        <Box fontSize="18px" fontWeight="semibold">
          Información General
        </Box>

        <Box fontSize="14px" fontWeight="medium" color="#84889A">
          Información sobre la certificación, como el título del mismo, descripción, logotipo, etc...
        </Box>
      </Flex>

      <Flex direction={{ base: 'column', lg: 'row' }} gap="30px" w="100%">
        <Flex direction="column" gap="20px" w="100%">
          <Box fontSize="15px" lineHeight="18px" fontWeight="bold">
            Descripción del ejercicio
          </Box>

          <Box fontSize="15px" whiteSpace="pre-line">
            <OpenParser value={entregable?.leccion?.contenido || ''} />
          </Box>

          <Box bg="gray_3" h="1px" />

          <Flex direction="column" gap="20px">
            <Box fontSize="15px" lineHeight="18px" fontWeight="bold">
              Corrección del ejercicio
            </Box>

            <Box fontSize="15px" whiteSpace="pre-line">
              {solucion?.data.length === 0 ? (
                'Este ejercicio no tiene correción disponible'
              ) : (
                <OpenParser value={solucion?.data?.contenido} />
              )}
            </Box>
          </Flex>
        </Flex>

        <Box bg="gray_5" w={{ base: '100%', lg: '1px' }} h={{ base: '1px', lg: '100%' }} />

        <Flex direction="column" gap="20px" minW="520px">
          <Box fontSize="15px" lineHeight="18px" fontWeight="bold">
            Ejercicio entregado por el alumno
          </Box>

          {entregable.adjunto ? (
            <Flex gap="10px" bg="#FAFAFC" rounded="12px" align="center" p="10px 10px 10px 15px" border="1px solid #E6E8EE">
              <Icon as={BiFile} boxSize="24px" color="#26C8AB" />

              <Flex w="100%" overflow="hidden" direction="column" textOverflow="ellipsis">
                <Box fontSize="13px" lineHeight="21px" overflow="hidden" fontWeight="medium">
                  {entregable?.adjunto?.name}
                </Box>

                <Box color="gray_4" fontSize="11px" lineHeight="18px" fontWeight="medium">
                  {(entregable?.adjunto?.size || 0) / 1000} KB
                </Box>
              </Flex>

              <IconButton
                bg="white"
                rounded="8px"
                boxSize="36px"
                aria-label="Descargar ejercicio del alumno"
                onClick={onAdjuntoDowload}
                isDisabled={user?.rol !== UserRolEnum.ADMIN}
                icon={<Icon as={BiDownload} boxSize="24px" color="gray_3" />}
              />
            </Flex>
          ) : (
            <Box fontSize="14px" fontWeight="medium">
              {entregable?.enlaceGithub || 'Sin entregar'}
            </Box>
          )}

          <Box bg="gray_3" h="1px" />

          <Flex direction="column" gap="20px">
            <Box fontSize="15px" lineHeight="18px" fontWeight="bold">
              Evaluación del tutor
            </Box>

            <Flex direction="column" gap="10px">
              <Box color="gray_5" fontSize="13px" fontWeight="bold" lineHeight="15px">
                Puntuación
              </Box>

              <Flex align="center" gap="15px">
                <Input
                  type="number"
                  min={0}
                  max={100}
                  w="56px"
                  p="12px 15px"
                  rounded="7px"
                  fontSize="14px"
                  lineHeight="16px"
                  fontWeight="medium"
                  border="1px solid #E6E8EE"
                  value={nota || 0}
                  onChange={(e: any) => setNota(e?.target.value)}
                  isDisabled={!isRoleAllowed([UserRolEnum.ADMIN], user?.rol)}
                />

                <Box fontSize="14px" lineHeight="21px" fontWeight="medium">
                  Evalua la tarea del 0 al 100
                </Box>
              </Flex>
            </Flex>

            <Flex direction="column" gap="10px">
              <Box color="gray_5" fontSize="13px" fontWeight="bold" lineHeight="15px">
                Observaciones
              </Box>

              <OpenEditor
                value={observaciones || ''}
                placeholder="Introduce el texto"
                onChange={setObservaciones}
                isDisabled={!isRoleAllowed([UserRolEnum.ADMIN], user?.rol)}
              />
            </Flex>

            <Button
              h="auto"
              p="10px"
              color="white"
              rounded="12px"
              w="fit-content"
              fontSize="14px"
              lineHeight="16px"
              fontWeight="semibold"
              bg="linear-gradient(0deg, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)), #26C8AB"
              onClick={corregirEntregable}
              isDisabled={entregarCorrecionDisabled || !isRoleAllowed([UserRolEnum.ADMIN], user?.rol)}
            >
              Guardar corrección
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};
