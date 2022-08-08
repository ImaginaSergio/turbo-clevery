import { Flex } from '@chakra-ui/react';

import {
  InformationInput,
  InformationSelect,
  InformationTextEditor,
  InformationPuntosclave,
} from '../../../../../../shared/components';
import { ILeccion, LeccionTipoEnum } from '@clevery/data';

export const LeccionVideo = ({
  leccion,
  updateValue,
}: {
  leccion: ILeccion;
  updateValue: any;
}) => (
  <Flex direction="column" w="100%" gap="30px">
    <Flex w="100%" gap="30px" direction={{ lg: 'column', xl: 'row' }}>
      <InformationInput
        name="titulo"
        label="Título de la lección"
        updateValue={updateValue}
        isDisabled={!leccion?.id}
        style={{ width: '100%' }}
        defaultValue={leccion?.titulo || ''}
      />

      <InformationSelect
        name="tipo"
        label="Tipo de lección"
        placeholder="Selecciona una opción"
        defaultValue={{ label: leccion?.tipo, value: leccion?.tipo }}
        options={Object.values(LeccionTipoEnum).map((value) => ({
          label: value,
          value: value,
        }))}
        updateValue={updateValue}
        isDisabled={!leccion?.id}
        style={{ width: '100%' }}
      />

      <InformationInput
        name="duracion"
        label="Duración del vídeo (min)"
        defaultValue={leccion?.duracion || 0}
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

    <Flex w="100%" gap="30px">
      <InformationInput
        name="contenido"
        label="Enlace al video (VIMEO)"
        defaultValue={leccion?.contenido || ''}
        updateValue={updateValue}
        isDisabled={!leccion?.id}
        style={{ width: '100%' }}
      />
    </Flex>

    <Flex w="100%" gap="30px" direction={{ lg: 'column', xl: 'row' }}>
      <InformationTextEditor
        name="descripcion"
        label="Descripción"
        updateValue={updateValue}
        isDisabled={!leccion?.id}
        defaultValue={leccion?.descripcion || ''}
        style={{ width: '100%' }}
      />

      <InformationPuntosclave
        leccionId={leccion?.id}
        isDisabled={!leccion?.id}
      />
    </Flex>
  </Flex>
);
