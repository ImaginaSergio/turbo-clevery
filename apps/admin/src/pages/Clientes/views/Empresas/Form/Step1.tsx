import { Flex } from '@chakra-ui/react';

import { FormTextEditor } from '@clevery/ui';

import { FormInput, FormTextarea } from '../../../../../shared/components';

const Step1 = () => {
  return (
    <Flex bg="#fff" boxSize="100%" p="30px">
      <Flex direction="column" w="30%" mr="30px" rowGap="20px">
        <FormInput name="nombre" label="Nombre de la empresa" isRequired />

        <FormInput name="email" label="Email de contacto" isRequired />
        <FormInput name="telefono" label="Teléfono de contacto" isRequired />
        <FormInput
          name="personaContacto"
          label="Persona de contacto"
          isRequired
        />

        <FormInput name="cif" label="Cif de la empresa" />
        <FormInput name="sector" label="Sector de la empresa" />
      </Flex>

      <Flex direction="column" h="100%" w="70%" rowGap="20px">
        <FormTextarea
          name="icono"
          label="Icono"
          placeholder="Introduce un icono como svg."
        />

        <FormTextEditor
          name="descripcion"
          label="Descripción"
          placeholder="Introduce la descripción de la empresa"
        />
      </Flex>
    </Flex>
  );
};

export default Step1;
