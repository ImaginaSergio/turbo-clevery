import { Flex } from '@chakra-ui/react';
import { ILeccion, LeccionTipoEnum } from '@clevery/data';

import {
  InformationInput,
  InformationSelect,
  InformationTextEditor,
} from 'apps/admin/src/shared/components';

export const TabDetalles = ({
  leccion,
  updateValue,
}: {
  leccion?: ILeccion;
  updateValue: (e: any) => void;
}) => {
  return (
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
          updateValue={updateValue}
          isDisabled={!leccion?.id}
          defaultValue={
            leccion?.tipo
              ? { label: leccion?.tipo, value: leccion?.tipo }
              : undefined
          }
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
            label: leccion?.publicado ? 'Publicado' : 'Oculto',
            value: leccion?.publicado,
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
          name="duracion"
          label="Tiempo estimado de realización (min)"
          placeholder="Introduce el tiempo en minutos"
          defaultValue={leccion?.duracion || 0}
          updateValue={updateValue}
          isDisabled={!leccion?.id}
          style={{ width: '100%' }}
        />
      </Flex>

      <InformationTextEditor
        name="contenido"
        label="Descripción del ejercicio"
        updateValue={updateValue}
        isDisabled={!leccion?.id}
        style={{ width: '100%' }}
        defaultValue={leccion?.contenido || ''}
      />
    </Flex>
  );
};
