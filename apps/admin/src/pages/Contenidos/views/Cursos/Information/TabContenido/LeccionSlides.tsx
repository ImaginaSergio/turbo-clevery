import { Flex } from '@chakra-ui/react';

import { ILeccion, LeccionTipoEnum } from 'data';
import { InformationInput, InformationSelect, InformationTextEditor } from '../../../../../../shared/components';

export const LeccionSlides = ({ leccion, updateValue }: { leccion: ILeccion; updateValue: (e?: any) => any }) => (
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
        label="Tiempo de lectura estimado (min)"
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

    <InformationInput
      name="contenido"
      label="Enlace a slides"
      placeholder={`https://imaginaformacion.slides.com/imaginaformacion/tema-11-0ce491/embed?token=fQCjY6Qx`}
      defaultValue={leccion?.contenido || ''}
      updateValue={updateValue}
      isDisabled={!leccion?.id}
      validator={'https://imaginaformacion.slides.com/imaginaformacion/'}
      style={{ width: '100%' }}
    />

    <InformationTextEditor
      name="descripcion"
      label="Descripción"
      defaultValue={leccion?.descripcion || ''}
      updateValue={updateValue}
      isDisabled={!leccion?.id}
      style={{ width: '100%' }}
    />
  </Flex>
);
