import { useCallback, useEffect, useState } from 'react';

import { debounce } from 'lodash';
import { BiX } from 'react-icons/bi';
import AsyncSelect from 'react-select/async';
import { AiOutlineCloudSync } from 'react-icons/ai';
import { Flex, Badge, Icon, Spinner, Box, Center } from '@chakra-ui/react';

import { IHabilidad } from '@clevery/data';

import './InformationHabilidades.scss';

type InformationHabilidadesProps = {
  label?: string;
  loadOptions: any;
  isDisabled?: boolean;
  defaultValue: any;
  placeholder?: string;
  updateValue: (e?: any) => any | void;
  style?: React.CSSProperties;
};

export const InformationHabilidades = ({
  label = 'Habilidades',
  defaultValue,
  style,
  loadOptions,
  isDisabled,
  placeholder,
  updateValue,
}: InformationHabilidadesProps) => {
  const [_habilidades, setHabilidades] = useState(
    defaultValue.map((habilidad: any) => ({
      ...habilidad,
      value: habilidad.id,
      label: habilidad.nombre,
    }))
  );

  const [update, setUpdate] = useState<'idle' | 'editing' | 'loading'>('idle');

  useEffect(() => {
    setHabilidades(
      defaultValue.map((habilidad: any) => ({
        ...habilidad,
        value: habilidad.id,
        label: habilidad.nombre,
      }))
    );
  }, [defaultValue]);

  const onChange = (event: any) => {
    if (event.length < _habilidades?.length) return;

    setUpdate('loading');

    const habilidadesResponse: any = {};
    const newHabilidades = [...event]?.map(
      (habilidad: IHabilidad, i: number) => {
        if (!habilidad.id) return undefined;

        habilidadesResponse[habilidad.id + ''] = {
          nivel: habilidad?.meta?.pivot_nivel || 1,
        };

        return habilidad;
      }
    );

    setHabilidades(newHabilidades?.filter((i: any) => i));
    updateValue({ habilidades: habilidadesResponse }).then((res: any) =>
      setUpdate('idle')
    );
  };

  const removeTag = (index: number) => {
    setUpdate('loading');

    const habilidadesResponse: any = {};
    const newHabilidades = [..._habilidades]?.map(
      (habilidad: IHabilidad, i: number) => {
        if (!habilidad.id) return habilidad;
        if (i === index) return undefined;

        habilidadesResponse[habilidad.id + ''] = {
          nivel: habilidad.meta.pivot_nivel,
        };

        return habilidad;
      }
    );

    setHabilidades(newHabilidades.filter((t) => t));
    updateValue({ habilidades: habilidadesResponse }).then((res: any) =>
      setUpdate('idle')
    );
  };

  const updateLevel = (index: number) => {
    setUpdate('loading');

    const habilidadesResponse: any = {};
    const newHabilidades = [..._habilidades]?.map(
      (habilidad: IHabilidad, i: number) => {
        if (!habilidad.id) return undefined;

        if (i === index) {
          const newLevel =
            habilidad.meta.pivot_nivel === 3
              ? 1
              : habilidad.meta.pivot_nivel + 1;

          habilidadesResponse[habilidad.id + ''] = { nivel: newLevel };
          habilidad.meta.pivot_nivel = newLevel;

          return habilidad;
        } else {
          habilidadesResponse[habilidad.id + ''] = {
            nivel: habilidad.meta.pivot_nivel,
          };

          return habilidad;
        }
      }
    );

    setHabilidades(newHabilidades?.filter((t) => t));

    updateValue({ habilidades: habilidadesResponse }).then((res: any) =>
      setUpdate('idle')
    );
  };

  const _loadOptions = useCallback(
    debounce((inputValue, callback) => {
      loadOptions(inputValue).then((options: any) => callback(options));
    }, 350),
    []
  );

  return (
    <Flex w="100%" direction="column" fontSize="14px" style={style}>
      <label className="information-block-label">
        {label}

        {update === 'editing' ? (
          <Icon as={AiOutlineCloudSync} ml="2" />
        ) : update === 'loading' ? (
          <Spinner ml="2" boxSize="14px" />
        ) : null}
      </label>

      <AsyncSelect
        isMulti
        isSearchable
        menuPlacement="top"
        isClearable={false}
        onChange={onChange}
        value={_habilidades}
        placeholder={placeholder}
        loadOptions={_loadOptions}
        loadingMessage={() => 'Buscando información...'}
        isDisabled={update === 'loading' || isDisabled}
        styles={{
          ...reactSelectStyles,
          multiValue: (styles: any) => ({ ...styles, display: 'none' }),
        }}
      />

      <Flex wrap="wrap" pt="10px" gap="10px">
        {_habilidades?.map(
          (
            habilidad: { label: string; value: any; meta: any },
            index: number
          ) => (
            <Badge
              display="flex"
              p="7px 12px"
              gap="8px"
              rounded="10px"
              key={`info-habilidades-${index}`}
              bg={habilidad.meta.pivot_nivel ? '#D3FDF8' : '#e8e8e8'}
              color={habilidad.meta.pivot_nivel ? '#31B9A9' : '#a5a5a5'}
            >
              <Box fontSize="14px" fontWeight="medium">
                {habilidad.label}
              </Box>

              <Flex w="fit-content" gap="4px" align="center">
                <Icon
                  as={BiX}
                  boxSize="21px"
                  cursor="pointer"
                  onClick={(e) => removeTag(index)}
                />

                <Center
                  w="fit-content"
                  h="21px"
                  rounded="50%"
                  cursor="pointer"
                  onClick={(e) => updateLevel(index)}
                  title={
                    habilidad.meta.pivot_nivel === 1
                      ? 'Nivel Inicial'
                      : habilidad.meta.pivot_nivel === 2
                      ? 'Nivel Intermedio'
                      : habilidad.meta.pivot_nivel === 3
                      ? 'Nivel avanzado'
                      : 'Sin definir'
                  }
                >
                  {habilidad.meta.pivot_nivel === 1
                    ? 'Ini.'
                    : habilidad.meta.pivot_nivel === 2
                    ? 'Inter.'
                    : habilidad.meta.pivot_nivel === 3
                    ? 'Av.'
                    : 'Sin definir'}
                </Center>
              </Flex>
            </Badge>
          )
        )}
      </Flex>
    </Flex>
  );
};

const reactSelectStyles = {
  control: (styles: any) => ({
    ...styles,
    backgroundColor: 'white',
    border: '1px solid #E7E7E7',
  }),
  singleValue: (styles: any) => ({ ...styles, color: '#273360' }),
  placeholder: (styles: any) => ({
    ...styles,
    color: '#DDDDDD',
    fontSize: '14px',
  }),
  indicatorSeparator: (styles: any) => ({ ...styles, display: 'none' }),
  dropdownIndicator: (styles: any) => ({ ...styles, color: '#DBDBDB' }),
  option: (styles: any, { isFocused }: any) => ({
    ...styles,
    backgroundColor: isFocused ? '#E8EDFF' : 'white',
    color: '#131340',
    fontSize: '14px',
  }),
};
