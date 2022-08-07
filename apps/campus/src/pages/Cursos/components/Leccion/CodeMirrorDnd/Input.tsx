import { useEffect, useState } from 'react';

import { Box, Flex, Icon, Select, Button, useColorMode } from '@chakra-ui/react';
import { BiPlay } from 'react-icons/bi';
import { OpenLiveCoder } from 'ui';

type Option = { label?: string; value?: string };

type InputProps = {
  value?: string;
  isLoading?: boolean;
  setValue: (e?: any) => void | any;
  setLanguage: (e?: any) => void | any;
  compileCode: (e?: any) => void | any;
  languages: Option[];
  languageSelected?: Option;
};

function OBCodeInput({ value, setValue, languages, isLoading, setLanguage, compileCode, languageSelected }: InputProps) {
  const { colorMode } = useColorMode();
  const [state, setState] = useState<Option | undefined>(languageSelected);

  useEffect(() => {
    setState(languageSelected);
  }, [languageSelected]);

  const onSelectLanguage = (event: any) => {
    let newLanguage = event.target.value;

    setLanguage(newLanguage);
    setState(languages?.find((l) => l.value === newLanguage));
  };

  return (
    <Flex direction="column" w="100%">
      <Flex
        h="70px"
        w="100%"
        gap="10px"
        minH="70px"
        p="15px 20px"
        align="center"
        justify="space-between"
        bg={colorMode === 'dark' ? '#242529' : 'white'}
        borderBottom="1px solid var(--chakra-colors-gray_3)"
      >
        <Flex gap="15px" align="center">
          <Box color="black" fontSize="14px" fontWeight="bold">
            Lenguaje
          </Box>

          <Select
            value={state?.value}
            color="black"
            border="none"
            w="fit-content"
            fontSize="14px"
            fontWeight="bold"
            onChange={onSelectLanguage}
            _hover={{ border: 'none' }}
            _focus={{ border: 'none' }}
            bg={colorMode === 'dark' ? '#1D1E22' : '#F0F0F3'}
          >
            {languages?.map((language) => (
              <option
                value={language?.value}
                style={{
                  color: 'white',
                  whiteSpace: 'nowrap',
                  backgroundColor: 'rgba(18, 22, 37, 1)',
                }}
              >
                {language?.label}
              </option>
            ))}
          </Select>
        </Flex>

        <Button
          p="10px"
          bg="black"
          color="white"
          rounded="8px"
          fontSize="13px"
          cursor="pointer"
          fontWeight="bold"
          isDisabled={!value}
          isLoading={isLoading}
          onClick={compileCode}
          _hover={{ opacity: 0.7 }}
          loadingText="Ejecutando..."
          rightIcon={<Icon as={BiPlay} boxSize="22px" />}
        >
          Ejecutar
        </Button>
      </Flex>

      <OpenLiveCoder
        onChange={setValue}
        isLoading={isLoading}
        language={state?.value || 'javascript'}
        defaultValue={`// Por favor, escribe tu código aquí.`}
      />
    </Flex>
  );
}

export default OBCodeInput;
