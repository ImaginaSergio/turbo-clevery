import { Flex } from '@chakra-ui/react';

import { ILeccion, LeccionTipoEnum } from '@clevery/data';
import {
  InformationInput,
  InformationSelect,
} from '../../../../../../shared/components';

export const LeccionRecurso = ({
  leccion,
  updateValue,
}: {
  leccion: ILeccion;
  updateValue: (e?: any) => any;
}) => (
  <Flex direction="column" w="100%" gap="30px">
    <Flex w="100%" gap="30px" direction={{ lg: 'column', xl: 'row' }}>
      <InformationInput
        name="titulo"
        label="Título de la lección"
        defaultValue={leccion?.titulo}
        updateValue={updateValue}
        isDisabled={!leccion?.id}
        style={{ width: '100%' }}
      />

      <InformationSelect
        name="tipo"
        label="Tipo de lección"
        placeholder="Selecciona una opción"
        defaultValue={{ label: leccion?.tipo, value: leccion?.tipo }}
        updateValue={updateValue}
        isDisabled={!leccion?.id}
        options={Object.values(LeccionTipoEnum).map((k) => ({
          label: k,
          value: k,
        }))}
        style={{ width: '100%' }}
      />
    </Flex>

    <Flex w="100%" gap="30px" direction={{ lg: 'column', xl: 'row' }}>
      <InformationSelect
        name="publicado"
        label="Estado"
        placeholder="Selecciona una opción"
        updateValue={updateValue}
        style={{ width: '100%' }}
        defaultValue={{
          label: leccion.publicado ? 'Publicado' : 'Oculto',
          value: leccion.publicado,
        }}
        options={[
          { label: 'Publicado', value: true },
          { label: 'Oculto', value: false },
        ]}
      />

      <InformationInput
        name="orden"
        label="Orden"
        defaultValue={leccion?.orden}
        updateValue={updateValue}
        isDisabled={!leccion?.id}
        style={{ width: '100%' }}
      />
    </Flex>

    <Flex w="100%" gap="30px">
      <InformationInput
        name="contenido"
        label="Enlace al recurso"
        defaultValue={leccion?.contenido || ''}
        placeholder="Introduce un enlace a GitHub o OneDrive"
        updateValue={updateValue}
        isDisabled={!leccion?.id}
        style={{ width: '100%' }}
        validator="https://"
      />
    </Flex>
  </Flex>
);
