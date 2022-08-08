import { Box, Flex } from '@chakra-ui/react';

import { getHabilidades, ProcesoRemotoEnum } from 'data';
import { FormTextEditor } from 'ui';
import { FormInput, FormSelect, FormAsyncSelect } from '../../../../../shared/components';

const Step1 = () => {
  const loadHabilidadesByNombre = async (value: any) => {
    const _habilidades = await getHabilidades({
      client: 'admin',
      query: [{ nombre: value }],
    });

    return _habilidades?.data?.map((hab: any) => ({
      value: hab.id,
      label: hab.nombre,
    }));
  };

  return (
    <Flex bg="#fff" boxSize="100%" p="30px">
      <Flex direction="column" w="20%" mr="30px" rowGap="20px">
        <FormInput name="titulo" label="Título de la vacante" isRequired />

        <FormInput isRequired type="number" name="salarioMin" label="Salario mínimo" />

        <FormInput isRequired type="number" name="salarioMax" label="Salario máximo" />

        <FormInput isRequired type="number" name="numPlazas" label="Número de plazas" />

        <FormInput isRequired name="localidad" label="Localidad" />

        <FormSelect
          name="publicado"
          label="Vacante pública"
          placeholder="Selecciona una opción"
          options={[
            { label: 'Pública', value: true },
            { label: 'Oculta', value: false },
          ]}
        />
      </Flex>

      <Flex direction="column" h="100%" w="80%" rowGap="20px">
        <Flex gap="20px" direction={{ base: 'column', md: 'row' }}>
          <FormInput isRequired name="tipoPuesto" label="Tipo de puesto" />

          <FormInput isRequired name="tipoContrato" label="Tipo de contrato" />

          <FormSelect
            name="remoto"
            label="Tipo de trabajo"
            placeholder="Selecciona una opción"
            options={Object.values(ProcesoRemotoEnum).map((k) => ({
              label: <Box textTransform="capitalize">{k}</Box>,
              value: k,
            }))}
          />
        </Flex>

        <FormAsyncSelect
          isMulti
          name="habilidades"
          label="Habilidades"
          placeholder="Escribe para buscar"
          loadOptions={loadHabilidadesByNombre}
        />

        <FormTextEditor isRequired name="descripcion" label="Descripción" />

        <FormTextEditor isRequired name="bonificaciones" label="Bonificaciones" />
      </Flex>
    </Flex>
  );
};

export default Step1;
