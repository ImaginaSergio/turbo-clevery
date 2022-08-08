import { useEffect, useState } from 'react';

import {
  Box,
  Icon,
  Flex,
  Input,
  Accordion,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  AccordionButton,
  useToast,
} from '@chakra-ui/react';
import { BiPlusCircle, BiTrash } from 'react-icons/bi';

import {
  ILenguaje,
  ILivecoder,
  ITestLivecoder,
  addTestLivecoder,
  removeTestLivecoder,
  updateTestLivecoder,
} from '@clevery/data';
import {
  InformationInput,
  InformationMonaco,
} from 'apps/admin/src/shared/components';
import { onFailure } from '@clevery/utils';

export const TabTests = ({
  livecoder,
  refreshState,
}: {
  livecoder?: ILivecoder;
  refreshState: () => void;
}) => {
  const [tests, setTests] = useState<ITestLivecoder[]>(livecoder?.tests || []);
  const toast = useToast();

  useEffect(() => {
    setTests(livecoder?.tests || []);
  }, [livecoder?.tests]);

  const updateValue = (id: any, value: any) => {
    if (!id) return;

    let sum = 0;

    if (livecoder?.tests) {
      const array = livecoder?.tests?.map((item) => {
        if (id !== item?.id) return item?.puntuacion;
        else return 0;
      });

      const sumArray = array.reduce(
        (previousValue, currentValue) => previousValue + currentValue,
        sum
      );

      sum = +sumArray + +value?.puntuacion;
    }

    if (sum > 100) {
      onFailure(toast, 'Error', 'La puntuación maxima es de 100.');
      return Promise.reject('La puntuación máxima es de 100.');
    } else {
      return updateTestLivecoder({
        id,
        test: value,
        client: 'admin',
      }).then(() => {
        refreshState();
      });
    }
  };

  const handleRemove = (id: any) => {
    if (!id) return;

    setTests([...tests?.filter((test) => test.id !== id)]);

    removeTestLivecoder({ id }).then(() => {
      refreshState();
    });
  };

  const handleCreate = () => {
    if (!livecoder?.id) return;

    let sum = 0;

    if (livecoder?.tests) {
      const array = livecoder?.tests?.map((item) => {
        return item?.puntuacion;
      });

      const sumArray = array.reduce(
        (previousValue, currentValue) => previousValue + currentValue,
        sum
      );

      sum = sumArray;
    }

    if (sum >= 100) {
      onFailure(toast, 'Error', 'La puntuación maxima es de 100.');
      return Promise.reject('La puntuación máxima es de 100.');
    } else {
      return addTestLivecoder({
        test: {
          nombre: 'Test 1',
          puntuacion: 0,
          orden: tests.length + 1,
          livecoderId: livecoder.id,
          codigo: 'console.log("¡Hola mundo!")',
        },
      }).then(() => {
        refreshState();
      });
    }
  };

  return (
    <Flex direction="column" w="100%" gap="30px">
      <Accordion allowToggle>
        {tests
          ?.sort((a, b) => a.orden - b.orden)
          ?.map((test, index) => (
            <TestItem
              key={`test-item-${index}`}
              test={test}
              lenguaje={livecoder?.lenguaje}
              onRemove={() => handleRemove(test.id)}
              onEdit={(value: any) => updateValue(test.id, value)}
            />
          ))}
      </Accordion>

      <Flex
        h="44px"
        w="100%"
        mt="10px"
        gap="8px"
        p="10px 12px"
        rounded="12px"
        align="center"
        justify="center"
        color="#84889A"
        cursor="pointer"
        onClick={handleCreate}
        border="1px solid #E6E8EE"
        transition="all 0.3s ease-in-out"
        _hover={{
          bg: 'white',
          color: '#10172E',
          boxShadow: '0px 1px 7px rgba(7, 15, 48, 0.14)',
        }}
      >
        <Icon as={BiPlusCircle} boxSize="21px" />

        <Box fontSize="12px" fontWeight="semibold" textTransform="uppercase">
          Añadir nuevo test
        </Box>
      </Flex>
    </Flex>
  );
};

type TestItemProps = {
  test: ITestLivecoder;
  lenguaje?: ILenguaje;
  onRemove: () => void;
  onEdit: (e?: any) => void;
};

const TestItem = ({ test, lenguaje, onRemove, onEdit }: TestItemProps) => (
  <AccordionItem>
    <h2>
      <AccordionButton>
        <TextInput
          defaultValue={test.nombre}
          textStyle={{ width: '100%', textAlign: 'start' }}
          onChange={(value: string) => onEdit({ nombre: value })}
        />

        <Icon
          ml="10px"
          as={BiTrash}
          onClick={onRemove}
          _hover={{ opacity: 0.7 }}
        />

        <AccordionIcon />
      </AccordionButton>
    </h2>

    <AccordionPanel pb={4} h="100%">
      <Flex
        w="100%"
        mb="20px"
        gap="20px"
        direction={{ base: 'column', md: 'row' }}
      >
        <InformationInput
          name="orden"
          label="Orden"
          updateValue={onEdit}
          isDisabled={!test?.id}
          defaultValue={test?.orden}
          style={{ width: '100%' }}
        />

        <InformationInput
          type="number"
          step={1}
          min={0}
          max={100}
          name="puntuacion"
          label="Puntuación de 0 a 100"
          defaultValue={test?.puntuacion}
          updateValue={onEdit}
          isDisabled={!test?.id}
          style={{ width: '100%' }}
        />
      </Flex>

      <InformationMonaco
        name="codigo"
        updateValue={onEdit}
        isDisabled={!test?.id}
        defaultValue={test?.codigo || ''}
        style={{ width: '100%', minHeight: '340px' }}
        language={lenguaje?.monacoLang || 'javascript'}
      />
    </AccordionPanel>
  </AccordionItem>
);

const TextInput = ({
  defaultValue,
  onChange,
  inputStyle,
  textStyle,
}: {
  defaultValue: string;
  onChange: (value: string) => void;
  inputStyle?: React.CSSProperties;
  textStyle?: React.CSSProperties;
}) => {
  /**
   * -1: No se ha inicializado el valor
   * 0: Se deja de editar el input
   * 1: Se empieza a editar el input
   */
  const [isEditing, setEditing] = useState<-1 | 0 | 1>(0);
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  useEffect(() => {
    if (isEditing === 0 && value !== undefined) onChange(value);
  }, [isEditing]);

  const inputRefCallback = (inputElement: any) => {
    if (inputElement) inputElement.focus();

    function handleClickOutside(event: any) {
      if (event.type === 'keypress' && event.key === 'Enter' && inputElement)
        setEditing(0);
    }

    document.addEventListener('keypress', handleClickOutside);

    // Unbind the event listener on clean up
    return () => document.removeEventListener('keypress', handleClickOutside);
  };

  const handleInputChange = (e: any) => {
    const value = e.target.value;
    setValue(value);
  };

  return (
    <>
      {isEditing === 1 ? (
        <Input
          value={value}
          style={inputStyle}
          ref={inputRefCallback}
          onChange={handleInputChange}
          className="inputtooltip-input"
          onBlur={() => setEditing(0)}
        />
      ) : (
        <div style={textStyle} onClick={() => setEditing(1)}>
          {value || 'Sin especificar'}
        </div>
      )}
    </>
  );
};
