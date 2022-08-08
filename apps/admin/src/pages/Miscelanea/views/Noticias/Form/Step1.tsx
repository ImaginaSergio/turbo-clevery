import { Flex } from '@chakra-ui/react';
import { getCursos, getUsers } from '@clevery/data';

import {
  FormInput,
  FormSelect,
  FormAsyncCreatableSelect,
  FormAsyncSelect,
} from '../../../../../shared/components';
import { FormTextEditor } from '@clevery/ui';

const Step1 = () => {
  const loadCursos = async (value: any) => {
    const _cursos = await getCursos({
      client: 'admin',
      treatData: false,
      query: [{ titulo: value }],
    });

    return _cursos?.data?.map((curso: any) => ({
      value: curso.id,
      label: curso.titulo,
    }));
  };

  const loadAutores = async (value: string) => {
    if (value.includes('@')) {
      const _usuarios = await getUsers({
        client: 'admin',
        query: [{ email: value }],
      });

      return _usuarios?.data?.map((user: any) => ({
        value: user.id,
        label: user.email,
      }));
    } else {
      const _usuarios = await getUsers({
        client: 'admin',
        query: [{ nombre: value }],
      });

      return _usuarios?.data?.map((user: any) => ({
        value: user.id,
        label: (user?.nombre || ' ') + ' ' + (user?.apellidos || ' '),
      }));
    }
  };

  return (
    <Flex bg="#fff" boxSize="100%" p="30px" h="100%">
      <Flex direction="column" w="20%" mr="30px" gap="20px" h="100%">
        <FormInput isRequired name="titulo" label="Título de la Noticia" />

        <FormSelect
          isRequired
          name="publicado"
          label="Noticia pública"
          placeholder="Selecciona una opción"
          options={[
            { label: 'Pública', value: true },
            { label: 'Oculta', value: false },
          ]}
        />

        <FormAsyncSelect
          isRequired
          name="autorId"
          label="Autor"
          placeholder="Escribe para buscar"
          loadOptions={loadAutores}
        />

        <FormAsyncCreatableSelect
          isClearable
          name="cursoId"
          label="Curso relacionado"
          placeholder="Escribe para buscar"
          loadOptions={loadCursos}
        />
      </Flex>

      <Flex direction="column" h="100%" w="80%" rowGap="20px">
        <FormTextEditor
          isRequired
          name="descripcionCorta"
          label="Descripción corta"
        />

        <FormTextEditor isRequired name="contenido" label="Contenido" />
      </Flex>
    </Flex>
  );
};

export default Step1;
