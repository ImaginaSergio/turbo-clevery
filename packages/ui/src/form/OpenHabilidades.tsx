import { useEffect, useState } from 'react';

import AsyncSelect from 'react-select/async';
import { Flex, Box, Image } from '@chakra-ui/react';
import Select, { components, OptionProps } from 'react-select';

import { getHabilidades, HabilidadTiemposEnum } from 'data';

type HabExp = {
  value: any;
  label: string;
  icono: string;
  experiencia: HabilidadTiemposEnum;
  meta?: any;
};

type OpenHabilidadesProps = {
  name: string;
  label: string;
  isDisabled?: boolean;
  defaultValue?: HabExp[];
  onChange: (e?: any) => void;
};

export const OpenHabilidades = ({ isDisabled, name, label, onChange, defaultValue = [] }: OpenHabilidadesProps) => {
  const [inputValue, setInputValue] = useState<string>('');
  const [habilidades, setHabilidades] = useState<HabExp[]>([]);

  useEffect(() => {
    let newHabs = defaultValue || [];

    setHabilidades([...newHabs]);
  }, [defaultValue]);

  /** Carga asíncrona de las opciones del AsyncSelect */
  const loadOptions: any = async (search: string) => {
    const _habilidades = await getHabilidades({
      query: [{ nombre: search }, { es_superior: false }, { limit: 10000 }],
    });

    return (_habilidades?.data || [])?.map((hab: any) => ({
      ...hab,
      value: hab.id,
      label: hab.nombre,
      'data-cy': hab.nombre + '_option_habilidad',
    }));
  };

  /** Gestión del añadido de nuevas habilidades */
  const handleOnChange = (event: any) => {
    if (event.length < habilidades?.length) return;

    const newHabilidades: any[] = [...event]
      ?.map((habilidad: HabExp, index: number) => {
        if (!habilidad.value) return undefined;

        habilidad.experiencia = habilidades[index]?.experiencia || HabilidadTiemposEnum.MENOS_DE_UNO;

        return habilidad;
      })
      ?.filter((t) => t);

    onChange([...newHabilidades]);
    setHabilidades([...newHabilidades]);
  };

  /** Gestión del borrado de habilidades */
  const handleOnRemove = (index: number) => {
    const newHabilidades: any[] = (habilidades || [])
      ?.map((habilidad: HabExp, i: number) => {
        if (index === i) return undefined;
        else return habilidad;
      })
      ?.filter((t) => t);

    onChange([...newHabilidades]);
    setHabilidades([...newHabilidades]);
  };

  /** Gestión de la actualización de experiencia de habilidades */
  const handleOnExpUpdate = (index: number, experiencia: HabilidadTiemposEnum) => {
    const newHabilidades: any[] = [...habilidades]
      ?.map((habilidad: HabExp, i: number) => {
        if (!habilidad.value) {
          return undefined;
        } else if (index === i) {
          habilidad.experiencia = experiencia;

          return habilidad;
        } else {
          return habilidad;
        }
      })
      ?.filter((t) => t);

    onChange([...newHabilidades]);
    setHabilidades([...newHabilidades]);
  };

  return (
    <Flex w="100%" direction="column">
      <Box fontSize="14px" fontWeight="bold" mb="10px">
        {label}
      </Box>

      <Flex p="15px" gap="15px" bg="white" rounded="15px" direction="column" border="1px solid var(--chakra-colors-gray_3)">
        <Flex data-cy="open_habilidades">
          <AsyncSelect
            data-cy="open_habilidades"
            isMulti
            name={name}
            isSearchable
            defaultOptions
            isClearable={false}
            value={habilidades}
            isDisabled={isDisabled}
            components={{ Option: CustomOption }}
            onChange={handleOnChange}
            loadOptions={loadOptions}
            onInputChange={setInputValue}
            placeholder={
              process.env.NX_ORIGEN_CAMPUS === 'OPENMARKETERS'
                ? 'Busca habilidades para añadirlas'
                : 'Busca tecnologías para añadirlas'
            }
            loadingMessage={() => 'Buscando información...'}
            noOptionsMessage={() => (inputValue !== '' ? 'No se encuentran resultados' : 'Escribe para mostrar opciones...')}
            styles={{
              ...selectStyles,
              multiValue: (styles: any) => ({ ...styles, display: 'none' }),
            }}
          />
        </Flex>

        {habilidades?.length > 0 && (
          <Flex direction="column" gap="20px">
            {[...habilidades]?.map((m, index) => (
              <HabilidadItem
                key={index}
                index={index}
                icono={m.icono}
                titulo={m.label}
                onRemove={handleOnRemove}
                onExpUpdate={handleOnExpUpdate}
                exp={m.experiencia ? { label: m.experiencia, value: m.experiencia } : undefined}
              />
            ))}
          </Flex>
        )}
      </Flex>
    </Flex>
  );
};

const CustomOption = (props: any) =>
  components.Option && (
    <components.Option
      {...props}
      innerProps={Object.assign({}, props?.innerProps, props?.data['data-cy'] ? { 'data-cy': props?.data['data-cy'] } : {})}
    />
  );

const Option = (props: OptionProps<any>) => {
  return (
    <components.Option
      {...props}
      children={
        <Flex gap="15px" align="center">
          <Image minW="32px" boxSize="32px" src={`data:image/svg+xml;utf8,${props?.data?.icono}`} />

          <Box w="100%" fontWeight="medium" fontSize="16px" lineHeight="26px">
            {props?.data?.label}
          </Box>
        </Flex>
      }
    />
  );
};

const setLabel = (label?: string) => {
  switch (label) {
    case HabilidadTiemposEnum.MENOS_DE_UNO:
      return 'Menos de 1 año';
    case HabilidadTiemposEnum.UNO_A_TRES:
      return '1-3 años';
    case HabilidadTiemposEnum.CUATRO_A_SIETE:
      return '4-7 años';
    case HabilidadTiemposEnum.OCHO_A_DIEZ:
      return '8-10 años';
    case HabilidadTiemposEnum.MAS_DE_DIEZ:
      return 'Más de 10 años';
    default:
      return '';
  }
};

const HabilidadItem = ({
  index,
  icono,
  titulo,
  exp,
  onRemove,
  onExpUpdate,
}: {
  index: number;
  icono?: string;
  titulo: string;
  exp?: { label: string; value: HabilidadTiemposEnum | 'BORRAR' };
  onRemove: (id: number) => void;
  onExpUpdate: (index: number, experiencia: HabilidadTiemposEnum) => void;
}) => {
  const [value, setValue] = useState<{ label: string; value: any } | null>(
    exp ? { label: setLabel(exp?.label), value: exp?.value } : null
  );

  useEffect(() => {
    if (exp) setValue({ label: setLabel(exp?.label), value: exp?.value });
    else setValue(null);
  }, [exp]);

  const handleOnChange = (newValue: any) => {
    if (!newValue || newValue?.value === 'BORRAR') {
      onRemove(index);
    } else {
      setValue(newValue);
      onExpUpdate(index, newValue.value);
    }
  };

  return (
    <Flex gap="15px" align="center">
      <Image minW="32px" boxSize="32px" src={`data:image/svg+xml;utf8,${icono}`} />

      <Box w="100%" fontWeight="medium" fontSize="16px" lineHeight="26px">
        {titulo}
      </Box>

      <Select
        value={value}
        onChange={handleOnChange}
        placeholder="Experiencia"
        options={[
          { label: 'Menos de 1 año', value: HabilidadTiemposEnum.MENOS_DE_UNO },
          { label: '1-3 años', value: HabilidadTiemposEnum.UNO_A_TRES },
          { label: '4-7 años', value: HabilidadTiemposEnum.CUATRO_A_SIETE },
          { label: '8-10 años', value: HabilidadTiemposEnum.OCHO_A_DIEZ },
          { label: 'Más de 10 años', value: HabilidadTiemposEnum.MAS_DE_DIEZ },
          { label: '❌ | Quitar tecnología', value: 'BORRAR' },
        ]}
        styles={{
          ...selectStyles,
          container: (styles: any) => ({
            ...styles,
            width: '200px',
            minWidth: '200px',
          }),
        }}
      />
    </Flex>
  );
};

const selectStyles = {
  indicatorSeparator: (styles: any) => ({ ...styles, display: 'none' }),
  control: (styles: any, { isDisabled }: any) => ({
    ...styles,
    width: '100%',
    height: '40px',
    textAlign: 'left',
    padding: '0px 12px',
    borderRadius: '8px',
    cursor: isDisabled ? 'not-allowed' : 'default',
    backgroundColor: 'var(--chakra-colors-gray_2)',
    border: '1px solid var(--chakra-colors-gray_3)',
  }),
  dropdownIndicator: (styles: any) => ({
    ...styles,
    color: 'var(--chakra-colors-black)',
  }),
  container: (styles: any) => ({ ...styles, width: '100%' }),
  menu: (styles: any) => ({
    ...styles,
    backgroundColor: 'var(--chakra-colors-white)',
  }),
  valueContainer: (styles: any) => ({ ...styles, padding: '0px' }),
  option: (styles: any, { isFocused }: any) => ({
    ...styles,
    cursor: 'pointer',
    textAlign: 'left',
    fontWeight: 'medium',
    color: 'var(--chakra-colors-black)',
    backgroundColor: isFocused ? 'var(--chakra-colors-primary_light)' : 'var(--chakra-colors-white)',
  }),
  singleValue: (styles: any) => ({
    ...styles,
    color: 'var(--chakra-colors-black)',
    fontWeight: 'medium',
  }),
};
