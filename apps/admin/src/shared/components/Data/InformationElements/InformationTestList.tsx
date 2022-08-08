import { useEffect, useState } from 'react';

import { Box, Center, Flex, Icon, Input } from '@chakra-ui/react';
import {
  BiCheckSquare,
  BiChevronDown,
  BiChevronUp,
  BiPlusCircle,
  BiSquareRounded,
  BiTrash,
} from 'react-icons/bi';

export type PreguntasTestListProps = {
  preguntas: PreguntasItem[];
  isDisabled?: boolean;

  onCreatePregunta: () => void;
  createTitle?: string;
};

export type PreguntasItem = {
  title: string;
  pretitle: string;

  respuestas: RespuestaUnica[];

  onEditPregunta: (value?: any) => void;
  onDeletePregunta: () => void;
  onCreateRespuesta: () => void;

  createTitle?: string;
};

export type RespuestaUnica = {
  title: string;
  isCheck: boolean;

  onCheckRespuesta: () => void;
  onEditRespuesta: (value?: any) => void;
  onDeleteRespuesta: () => void;
};

export const InformationTestList = ({
  preguntas,
  onCreatePregunta,
  createTitle,
  isDisabled,
  ...props
}: PreguntasTestListProps) => {
  return (
    <Flex direction="column" w="100%">
      <Flex w="100%" direction="column" rowGap="10px">
        {preguntas?.map((pregunta: PreguntasItem, index: number) => (
          <>
            <PreguntaItem
              key={`list-pregunta-${index}`}
              props={{ ...pregunta }}
              index={index + 1}
            />

            <Box w="100%" h="1px" bg="#E6E8EE" _last={{ display: 'none' }} />
          </>
        ))}

        <Flex
          w="100%"
          align="center"
          justify="center"
          columnGap="8px"
          p="10px 12px"
          rounded="12px"
          color="#84889A"
          cursor={isDisabled ? 'not-allowed' : 'pointer'}
          onClick={isDisabled ? undefined : onCreatePregunta}
          border="1px solid #E6E8EE"
          transition="all 0.3s ease-in-out"
          _hover={
            isDisabled
              ? undefined
              : {
                  bg: 'white',
                  color: '#10172E',
                  boxShadow: '0px 1px 7px rgba(7, 15, 48, 0.14)',
                }
          }
        >
          <Icon as={BiPlusCircle} boxSize="21px" />

          <Box fontSize="12px" fontWeight="semibold" textTransform="uppercase">
            {createTitle}
          </Box>
        </Flex>
      </Flex>
    </Flex>
  );
};

const PreguntaItem = ({
  index,
  props,
}: {
  index: number;
  props: PreguntasItem;
}) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <Flex direction="column">
      <Flex
        className="list-item"
        h="44px"
        rounded="12px"
        align="center"
        p="10px 12px"
        cursor="pointer"
        gap="12px"
        justify="space-between"
        onClick={() => setOpen(!open)}
      >
        <Flex w="100%" align="center" gap="12px">
          <Center
            p="10px"
            bg="#E6E8EE"
            rounded="6px"
            boxSize="40px"
            fontSize="13px"
            lineHeight="15px"
            fontWeight="semibold"
          >
            {index}
          </Center>

          <Box w="100%">
            <Box
              fontSize="12px"
              fontWeight="medium"
              lineHeight="14px"
              fontStyle="italic"
              color="#26C8AB"
            >
              {props.pretitle}
            </Box>

            <TextInput
              defaultValue={props.title}
              textStyle={{
                fontSize: '16px',
                fontWeight: 500,
                lineHeight: '19px',
              }}
              onChange={(value: string) =>
                props.onEditPregunta({ contenido: value })
              }
            />
          </Box>
        </Flex>

        <Flex align="center" columnGap="10px">
          <Flex
            display="none"
            align="center"
            color="#878EA0"
            columnGap="10px"
            sx={{ '.list-item:hover &': { display: 'flex' } }}
          >
            {props.onDeletePregunta && (
              <Icon
                as={BiTrash}
                boxSize="21px"
                onClick={(e) => {
                  e.stopPropagation();
                  if (props.onDeletePregunta) props.onDeletePregunta();
                }}
              />
            )}
          </Flex>

          <Icon
            as={open ? BiChevronUp : BiChevronDown}
            boxSize="24px"
            color="#878EA0"
          />
        </Flex>
      </Flex>

      {open && (
        <Flex direction="column" w="100%" p="10px 12px">
          <Box mb="12px" bg="#fff" h="1px" />

          <Flex w="100%" direction="column" rowGap="7px">
            {props.respuestas?.map((respuesta, _index) => (
              <RespuestaItem
                key={`list-pregunta-${index}-respuesta-${_index}`}
                {...respuesta}
              />
            ))}
          </Flex>

          <Flex
            w="100%"
            align="center"
            columnGap="8px"
            p="10px 12px"
            rounded="12px"
            color="#84889A"
            cursor="pointer"
            onClick={props.onCreateRespuesta}
            transition="all 0.3s ease-in-out"
            _hover={{ color: '#10172E' }}
          >
            <Icon as={BiPlusCircle} boxSize="21px" />

            <Box fontSize="12px" fontWeight="medium">
              {props.createTitle}
            </Box>
          </Flex>
        </Flex>
      )}
    </Flex>
  );
};

const RespuestaItem = (props: RespuestaUnica) => {
  return (
    <Flex
      h="35px"
      className="list-subitem"
      rounded="6px"
      align="center"
      justify="space-between"
      p="10px 12px"
      cursor="pointer"
      gap="12px"
      bg={props.isCheck ? '#26C8AB1A' : 'white'}
      borderLeft={props.isCheck ? '4px solid #26C8AB' : '4px solid white'}
    >
      <Flex w="100%" align="center" columnGap="12px">
        <Icon
          as={props.isCheck ? BiCheckSquare : BiSquareRounded}
          boxSize="16px"
          onClick={props.onCheckRespuesta}
          color={props.isCheck ? '#26C8AB' : '#878EA0'}
        />

        <TextInput
          defaultValue={props.title}
          textStyle={{ fontSize: '14px', fontWeight: 500, lineHeight: '16px' }}
          onChange={(value: string) =>
            props.onEditRespuesta({ contenido: value })
          }
        />
      </Flex>

      <Flex
        display="none"
        align="center"
        color="#878EA0"
        columnGap="10px"
        sx={{
          '.list-subitem:hover &': { display: 'flex' },
        }}
      >
        <Icon
          as={BiTrash}
          boxSize="21px"
          onClick={(e) => {
            e.stopPropagation();
            if (props.onDeleteRespuesta) props.onDeleteRespuesta();
          }}
        />
      </Flex>
    </Flex>
  );
};

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
