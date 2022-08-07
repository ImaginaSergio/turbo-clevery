import { useContext, useEffect, useState } from 'react';

import { BiPlay, BiCodeBlock, BiFullscreen, BiExitFullscreen } from 'react-icons/bi';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';
import { Badge, Box, Button, Flex, Icon, useToast } from '@chakra-ui/react';

import { ILeccion, ILivecoder, executeCode, IEntregable, entregarLivecoder, EntregableEstadoEnum } from 'data';
import { onFailure } from 'utils';
import { OpenLiveCoder, OpenParser } from 'ui';
import { LoginContext, PusherContext } from '../../../../../shared/context';

enum Tabs {
  CONSOLA = 'consola',
  LIVECODER = 'livecoder',
  DESCRIPCION = 'descripcion',
}

type EstadoEntregaProps = {
  leccion?: ILeccion;
  livecoder?: ILivecoder;
  entregable?: IEntregable;
  onFinishSubmit?: () => void;
};

const EstadoEntrega = ({ leccion, livecoder, entregable, onFinishSubmit = () => {} }: EstadoEntregaProps) => {
  const toast = useToast();
  const handle = useFullScreenHandle();

  const [tab, setTab] = useState<Tabs>(Tabs.DESCRIPCION);
  const [value, setValue] = useState(entregable?.codigoFuente || livecoder?.codigo || '');

  const { user } = useContext(LoginContext);
  const { pusher } = useContext(PusherContext);

  const [output, setOutput] = useState<any>();
  const [errorOutput, setErrorOutput] = useState<any>();
  const [nota, setNota] = useState<'aprobado' | 'suspendido'>();
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);
  const [loadingCompiler, setLoadingCompiler] = useState<boolean>(false);

  useEffect(() => {
    if (!pusher) return;
    let isLocalhost = process.env.NODE_ENV !== 'production';

    let newChannel = pusher.subscribe(`${isLocalhost ? '' : 'private-encrypted-'}user-${user?.id}`);

    newChannel.bind(`livecoder-resultado`, recieveCompileResult);
    newChannel.bind(`livecoder-ejercicio-corregido`, recieveEntregaResult);

    return () => {
      pusher.unsubscribe(`${isLocalhost ? '' : 'private-encrypted-'}user-${user?.id}`);
    };
  }, [leccion?.id]);

  const recieveCompileResult = (data: any) => {
    setOutput(data?.message?.stdout + (data?.message?.stderr ? data?.message?.stderr : ''));

    setErrorOutput(data?.message?.stderr);
    setLoadingCompiler(false);

    setTab(Tabs.CONSOLA);
  };

  const recieveEntregaResult = (data: any) => {
    setNota(data?.message?.nota);

    setLoadingSubmit(false);

    onFinishSubmit();
  };

  const compileCode = async () => {
    setLoadingCompiler(true);

    executeCode({
      source_code: value || livecoder?.codigo,
      language_id: livecoder?.lenguaje?.judge0Id + '',
    })
      .then((res: any) => {
        let status = res.status || res.fullResponse.status;

        if (status !== 201 && status !== 200) {
          setLoadingCompiler(false);
          onFailure(toast, 'Error al compilar', 'Pruebe de nuevo o contacte con soporte si el error persiste.');
        }
      })
      .catch((error) => {
        setLoadingCompiler(false);
        onFailure(toast, 'Error al compilar', 'Pruebe de nuevo o contacte con soporte si el error persiste.');
      });
  };

  const onSubmit = () => {
    setLoadingSubmit(true);

    entregarLivecoder({
      entregar: true,
      source_code: value,
      livecoder_id: livecoder?.id,
      entregable_id: entregable?.id,
    })
      .then((res: any) => {
        let status = res.status || res.fullResponse.status;

        if (status !== 201 && status !== 200) {
          setLoadingSubmit(false);
          onFailure(toast, 'Error al compilar', 'Pruebe de nuevo o contacte con soporte si el error persiste.');
        }
      })
      .catch((error) => {
        setLoadingSubmit(false);
        onFailure(toast, 'Error al compilar', 'Pruebe de nuevo o contacte con soporte si el error persiste.');
      });
  };

  return (
    <FullScreen handle={handle} className="livecoder_fullscreen">
      <FullScreenHeader isFullScreen={handle.active} onToggle={handle.active ? handle.exit : handle.enter} />
      <EstadoEntregaContent
        isFullScreen={handle.active}
        tab={tab}
        setTab={setTab}
        value={value}
        setValue={setValue}
        onSubmit={onSubmit}
        compileCode={compileCode}
        nota={nota}
        output={output}
        leccion={leccion}
        livecoder={livecoder}
        entregable={entregable}
        errorOutput={errorOutput}
        loadingSubmit={loadingSubmit}
        loadingCompiler={loadingCompiler}
      />
    </FullScreen>
  );
};

const FullScreenHeader = ({ onToggle, isFullScreen = false }: { onToggle: any; isFullScreen?: boolean }) => {
  return (
    <Flex bg="gray_2" p="12px 20px" align="center" gap="12px" w="100%" roundedTop="10px">
      <Icon color="gray_5" minW="24px" boxSize="24px" as={BiCodeBlock} />

      <Box w="100%" fontSize="14px" fontWeight="bold" lineHeight="17px">
        Live Code
      </Box>

      <Icon as={isFullScreen ? BiExitFullscreen : BiFullscreen} minW="24px" color="gray_5" boxSize="24px" onClick={onToggle} />
    </Flex>
  );
};

const TabDescripcion = ({
  descripcion = '',
  estado = EntregableEstadoEnum.PENDIENTE_ENTREGA,
}: {
  descripcion?: string;
  estado?: EntregableEstadoEnum;
}) => {
  return (
    <Flex boxSize="100%" direction="column" gap="20px" p="30px">
      <Flex w="100%" h="fit-content" fontSize="15px" overflow="auto">
        <OpenParser value={descripcion} />
      </Flex>
    </Flex>
  );
};

const TabConsola = ({
  isFullScreen,
  nota,
  output,
  errorOutput,
  isLoading = false,
  isDisabled = false,
  onSubmit = () => {},
}: {
  isFullScreen?: boolean;
  nota?: 'aprobado' | 'suspendido';
  output: string;
  errorOutput: string;
  isLoading: boolean;
  isDisabled: boolean;
  onSubmit: () => void;
}) => {
  return (
    <Flex direction="column" boxSize="100%">
      <OpenLiveCoder
        readOnly
        language="bat"
        defaultValue={(output ? output : errorOutput) || 'Ejecuta tu código para ver el resultado.'}
      />

      <Flex bg="white" p="10px 20px" align="center" justify="space-between" borderBottomLeftRadius="20px">
        <Box gap="5px">
          <Box fontSize="13px" fontWeight="bold" lineHeight="16px">
            Resultado del test
          </Box>

          {nota && (
            <Badge
              p="4px 10px"
              rounded="4px"
              color={nota === 'suspendido' ? '#EC555E' : '#09C598'}
              bg={nota === 'suspendido' ? 'rgba(236, 85, 94, 0.15)' : 'rgba(40, 237, 178, 0.15)'}
            >
              <Box fontSize="14px" lineHeight="100%" fontWeight="semibold" textTransform="uppercase">
                {nota === 'suspendido' ? 'CÓDIGO INCORRECTO' : 'CÓDIGO CORRECTO'}
              </Box>
            </Badge>
          )}
        </Box>

        <Button
          h="auto"
          p="10px"
          bg="gray_4"
          rounded="8px"
          onClick={onSubmit}
          isLoading={isLoading}
          isDisabled={isDisabled}
          loadingText="Validando..."
        >
          Validar el código
        </Button>
      </Flex>
    </Flex>
  );
};

export { EstadoEntrega };

const EstadoEntregaContent = ({
  isFullScreen,
  setTab,
  tab,
  entregable,
  leccion,
  onSubmit,
  nota,
  output,
  errorOutput,
  loadingSubmit,
  loadingCompiler,
  livecoder,
  compileCode,
  value,
  setValue,
}: any) => {
  return (
    <Flex
      maxH="auto"
      boxSize="100%"
      overflow="hidden"
      roundedBottom="10px"
      border="1px solid"
      borderColor="gray_3"
      direction={{ base: 'column', md: 'row' }}
    >
      <Flex boxSize="100%" direction="column" minW={{ base: '100%', md: '400px' }}>
        <Flex w="100%" px="20px" gap="10px" minH="65px" align="center" borderBottom="1px solid" borderBottomColor="gray_3">
          <Button
            h="35px"
            size="sm"
            rounded="8px"
            onClick={() => setTab(Tabs.DESCRIPCION)}
            bg={tab === Tabs.DESCRIPCION ? 'gray_2' : 'unset'}
            color={tab === Tabs.DESCRIPCION ? 'black' : 'gray_4'}
          >
            Descripción
          </Button>

          <Button
            h="35px"
            size="sm"
            rounded="8px"
            onClick={() => setTab(Tabs.CONSOLA)}
            bg={tab === Tabs.CONSOLA ? 'gray_2' : 'unset'}
            color={tab === Tabs.CONSOLA ? 'black' : 'gray_4'}
          >
            Consola
          </Button>
        </Flex>

        {tab === Tabs.DESCRIPCION && <TabDescripcion estado={entregable?.estado} descripcion={leccion?.contenido || ''} />}

        {tab === Tabs.CONSOLA && (
          <TabConsola
            isFullScreen={isFullScreen}
            nota={nota}
            output={output}
            onSubmit={onSubmit}
            errorOutput={errorOutput}
            isLoading={loadingSubmit}
            isDisabled={loadingSubmit || loadingCompiler}
          />
        )}
      </Flex>

      <Box minW="10px" bg="gray_3" h={{ base: '10px', md: '100%' }} w={{ base: '100%', md: '10px' }} />

      <Flex boxSize="100%" direction="column" minW={{ base: '100%', md: '400px' }}>
        <Flex
          w="100%"
          px="20px"
          minH="65px"
          align="center"
          justify="space-between"
          borderBottom="1px solid var(--chakra-colors-gray_3)"
        >
          <Box fontSize="14px" fontWeight="bold">
            Código {livecoder?.lenguaje?.nombre}
          </Box>

          <Button
            h="35px"
            size="sm"
            bg="black"
            color="white"
            rounded="8px"
            onClick={compileCode}
            loadingText="Ejecutando..."
            isLoading={loadingCompiler}
            isDisabled={loadingSubmit || loadingCompiler}
            rightIcon={<Icon as={BiPlay} />}
            _hover={{ opacity: 0.5 }}
          >
            Ejecutar
          </Button>
        </Flex>

        <Flex boxSize="100%">
          <OpenLiveCoder onChange={setValue} defaultValue={value} language={livecoder?.lenguaje?.monacoLang || 'javascript'} />
        </Flex>
      </Flex>
    </Flex>
  );
};
