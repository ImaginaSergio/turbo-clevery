import { Box, Flex } from '@chakra-ui/react';

import {
  InformationMde,
  InformationInput,
  InformationSelect,
  InformationFilepond,
  InformationTextEditor,
  InformationAsyncSelect,
} from '../../../../../shared/components';
import { CursoNivelEnum, ICurso, getUsers } from '@clevery/data';

type TabInformacionProps = {
  curso: ICurso;
  updateValue: (value: any) => void;
};

export const TabInformacion = ({ curso, updateValue }: TabInformacionProps) => {
  const loadProfesores = async (value: string) => {
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
    <Flex
      p="30px"
      overflow="auto"
      boxSize="100%"
      rowGap="30px"
      direction="column"
    >
      <Flex minH="fit-content" w="100%" direction="column" rowGap="8px">
        <Box fontSize="18px" fontWeight="semibold">
          Información General
        </Box>

        <Box fontSize="14px" fontWeight="medium" color="#84889A">
          Información sobre el curso, como el título del mismo, descripción,
          logotipo, etc...
        </Box>
      </Flex>

      <Flex direction={{ base: 'column', lg: 'row' }} gap="30px" w="100%">
        <Flex direction="column" w="100%" gap="30px">
          <InformationInput
            name="titulo"
            label="Titulo"
            defaultValue={curso.titulo}
            updateValue={updateValue}
          />

          <InformationAsyncSelect
            name="profesorId"
            label="Profesor"
            placeholder="Escribe para buscar"
            updateValue={updateValue}
            loadOptions={loadProfesores}
            defaultValue={{
              label: curso.profesor?.username,
              value: curso.profesorId,
            }}
          />

          <Flex
            gap="30px"
            width="100%"
            direction={{ base: 'column', lg: 'row' }}
          >
            <InformationSelect
              name="publicado"
              label="Estado"
              updateValue={updateValue}
              placeholder="Selecciona una opción"
              style={{ width: '100%' }}
              defaultValue={{
                label: curso.publicado ? 'Publicado' : 'Oculto',
                value: curso.publicado,
              }}
              options={[
                { label: 'Publicado', value: true },
                { label: 'Oculto', value: false },
              ]}
            />

            <InformationSelect
              name="disponible"
              label="Disponible"
              updateValue={updateValue}
              placeholder="Selecciona una opción"
              style={{ width: '100%' }}
              defaultValue={{
                label: curso.disponible ? 'Disponible' : 'No disponible',
                value: curso.disponible,
              }}
              options={[
                { label: 'Disponible', value: true },
                { label: 'No disponible', value: false },
              ]}
            />

            <InformationSelect
              name="extra"
              label="Curso extra"
              placeholder="Selecciona una opción"
              updateValue={updateValue}
              style={{ width: '100%' }}
              defaultValue={{
                label: curso.extra ? 'Sí' : 'No',
                value: curso.extra,
              }}
              options={[
                { label: 'Sí', value: true },
                { label: 'No', value: false },
              ]}
            />
          </Flex>

          <Flex
            gap="30px"
            width="100%"
            direction={{ base: 'column', lg: 'row' }}
          >
            <InformationSelect
              name="nivel"
              label="Nivel"
              style={{ width: '100%' }}
              updateValue={updateValue}
              placeholder="Selecciona una opción"
              defaultValue={{ label: curso.nivel, value: curso.nivel }}
              options={[
                {
                  label: CursoNivelEnum.AVANZADO,
                  value: CursoNivelEnum.AVANZADO,
                },
                {
                  label: CursoNivelEnum.INTERMEDIO,
                  value: CursoNivelEnum.INTERMEDIO,
                },
                {
                  label: CursoNivelEnum.INICIAL,
                  value: CursoNivelEnum.INICIAL,
                },
                { label: CursoNivelEnum.EXTRA, value: CursoNivelEnum.EXTRA },
              ]}
            />

            <InformationSelect
              name="habilitarCodemirror"
              label="Habilitar CodeMirror"
              placeholder="Selecciona una opción"
              updateValue={updateValue}
              style={{ width: '100%' }}
              defaultValue={
                curso?.habilitarCodemirror
                  ? {
                      label: curso?.habilitarCodemirror
                        ? 'CodeMirror Habilitado'
                        : 'CodeMirror Deshabilitado',
                      value: curso?.habilitarCodemirror,
                    }
                  : undefined
              }
              options={[
                { label: 'CodeMirror Habilitado', value: true },
                { label: 'CodeMirror Deshabilitado', value: false },
              ]}
            />
          </Flex>

          <InformationTextEditor
            name="descripcion"
            label="Descripción del curso"
            placeholder="Introduce el texto"
            defaultValue={curso.descripcion}
            updateValue={updateValue}
          />
        </Flex>

        <Flex direction="column" w="100%" gap="30px">
          <InformationFilepond
            name="imagen"
            label="Portada"
            putEP={'/godAPI/cursos/' + curso.id}
            isDisabled={!curso?.id}
          />

          <InformationMde
            allowCopy
            name="icono"
            label="Icono del curso"
            placeholder="Introduce el texto"
            updateValue={updateValue}
            isDisabled={!curso?.id}
            defaultValue={curso?.icono}
          />
        </Flex>
      </Flex>
    </Flex>
  );
};
