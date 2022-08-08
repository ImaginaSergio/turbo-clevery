import { Box, Flex } from '@chakra-ui/react';

import {
  ICurso,
  getCursos,
  IHabilidad,
  ICertificacion,
  getHabilidades,
} from '@clevery/data';

import {
  InformationMde,
  InformationInput,
  InformationSelect,
  InformationFilepond,
  InformationTextEditor,
  InformationAsyncSelect,
} from '../../../../../shared/components';

type TabInformacionProps = {
  certificacion: ICertificacion;
  updateValue: (value: any) => void;
};

export const TabInformacion = ({
  certificacion,
  updateValue,
}: TabInformacionProps) => {
  const loadCursos = async (value: string) => {
    const _cursos = await getCursos({
      client: 'admin',
      treatData: false,
      query: [{ titulo: value }],
    });

    return (_cursos?.data || [])?.map((curso: ICurso) => ({
      value: curso.id,
      label: curso.titulo,
    }));
  };

  const loadHabilidades = async (value: string) => {
    const _habilidades = await getHabilidades({
      client: 'admin',
      query: [{ nombre: value }],
    });

    return (_habilidades?.data || [])?.map((hab: IHabilidad) => ({
      value: hab.id,
      label: hab.nombre,
    }));
  };

  return (
    <Flex
      p="30px"
      rowGap="30px"
      boxSize="100%"
      overflow="auto"
      direction="column"
    >
      <Flex w="100%" rowGap="8px" direction="column" minH="fit-content">
        <Box fontSize="18px" fontWeight="semibold">
          Información General
        </Box>

        <Box fontSize="14px" fontWeight="medium" color="#84889A">
          Información sobre la certificación, como el título del mismo,
          descripción, logotipo, etc...
        </Box>
      </Flex>

      <Flex direction={{ base: 'column', lg: 'row' }} gap="30px" w="100%">
        <Flex w="100%" gap="30px" direction="column">
          <InformationInput
            name="nombre"
            label="Nombre"
            updateValue={updateValue}
            defaultValue={certificacion.nombre}
          />

          <Flex w="100%" gap="20px" direction={{ base: 'column', md: 'row' }}>
            <InformationSelect
              name="publicado"
              label="Estado"
              updateValue={updateValue}
              placeholder="Selecciona una opción"
              style={{ width: '100%' }}
              defaultValue={{
                label: certificacion.publicado ? 'Publicada' : 'Privada',
                value: certificacion.publicado,
              }}
              options={[
                { label: 'Publicada', value: true },
                { label: 'Privada', value: false },
              ]}
            />

            <InformationAsyncSelect
              name="cursoId"
              label="Curso asociado"
              loadOptions={loadCursos}
              updateValue={updateValue}
              placeholder="Escribe para buscar"
              style={{ width: '100%' }}
              defaultValue={
                certificacion.curso && {
                  label: certificacion.curso?.titulo,
                  value: certificacion.cursoId,
                }
              }
            />
          </Flex>

          <Flex w="100%" gap="20px" direction={{ base: 'column', md: 'row' }}>
            <InformationSelect
              name="disponible"
              label="Disponible"
              updateValue={updateValue}
              placeholder="Selecciona una opción"
              isDisabled={(certificacion?.examenes?.length || 0) === 0}
              style={{ width: '100%' }}
              defaultValue={{
                label: certificacion.disponible
                  ? 'Disponible'
                  : 'No disponible',
                value: certificacion.disponible,
              }}
              options={[
                { label: 'Disponible', value: true },
                { label: 'No disponible', value: false },
              ]}
            />

            <InformationSelect
              name="nivel"
              label="Nivel"
              updateValue={updateValue}
              placeholder="Selecciona una opción"
              style={{ width: '100%' }}
              defaultValue={{
                label:
                  certificacion.nivel === 1
                    ? 'Nivel Inicial (1)'
                    : certificacion.nivel === 2
                    ? 'Nivel Intermedio (2)'
                    : 'Nivel Avanzado (3)',
                value: certificacion.nivel,
              }}
              options={[
                { label: 'Nivel Inicial (1)', value: 1 },
                { label: 'Nivel Intermedio (2)', value: 2 },
                { label: 'Nivel Avanzado (3)', value: 3 },
              ]}
            />
          </Flex>

          <InformationTextEditor
            name="descripcion"
            label="Descripción del certificación"
            placeholder="Introduce el texto"
            updateValue={updateValue}
            defaultValue={certificacion.descripcion}
          />
        </Flex>

        <Flex w="100%" gap="30px" direction="column">
          <InformationFilepond
            name="imagen"
            label="Portada"
            isDisabled={!certificacion?.id}
            putEP={'/godAPI/certificaciones/' + certificacion.id}
          />

          <InformationAsyncSelect
            name="habilidadId"
            label="Habilidad"
            placeholder="Escribe para buscar"
            updateValue={updateValue}
            loadOptions={loadHabilidades}
            defaultValue={{
              label: certificacion.habilidad?.nombre,
              value: certificacion.habilidadId,
            }}
          />

          <InformationMde
            allowCopy
            name="icono"
            label="Icono de la certificación"
            placeholder="Introduce el icono en svg (texto)"
            updateValue={updateValue}
            isDisabled={!certificacion?.id}
            defaultValue={certificacion?.icono}
          />
        </Flex>
      </Flex>
    </Flex>
  );
};
