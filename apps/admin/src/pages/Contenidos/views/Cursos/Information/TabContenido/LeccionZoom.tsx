import { Flex } from '@chakra-ui/react';

import {
  InformationInput,
  InformationSelect,
  InformationDateInput,
  InformationTextEditor,
} from '../../../../../../shared/components';
import { LeccionTipoEnum } from 'data';

export const LeccionZoom = ({ leccion, updateValue }: any) => (
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
        options={Object.values(LeccionTipoEnum).map((k) => ({
          label: k,
          value: k,
        }))}
        updateValue={updateValue}
        isDisabled={!leccion?.id}
        style={{ width: '100%' }}
      />

      <InformationInput
        name="duracion"
        label="Duración de la sesión (min)"
        defaultValue={leccion?.duracion}
        updateValue={updateValue}
        isDisabled={!leccion?.id}
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

    <Flex w="100%" gap="30px" direction={{ lg: 'column', xl: 'row' }}>
      <InformationInput
        name="contenido"
        label="Enlace a zoom"
        defaultValue={leccion?.contenido || ''}
        updateValue={updateValue}
        isDisabled={!leccion?.id}
        style={{ width: '100%' }}
      />

      <InformationDateInput
        name="fechaPublicacion"
        label="Fecha de publicación"
        type="datetime"
        defaultValue={leccion?.fechaPublicacion}
        updateValue={updateValue}
        isDisabled={!leccion?.id}
        style={{ width: '100%' }}
      />
    </Flex>

    <Flex w="100%" gap="30px">
      <InformationTextEditor
        name="descripcion"
        label="Descripción"
        defaultValue={leccion?.descripcion}
        updateValue={updateValue}
        isDisabled={!leccion?.id}
        style={{ width: '100%' }}
      />
    </Flex>
  </Flex>
);
