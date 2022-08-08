import { useState, useEffect } from 'react';
import { Box, Flex } from '@chakra-ui/react';

import { FormInput, FormSelect, FormAsyncSelect, FormTextarea } from '../../../../../shared/components';
import { FormTextEditor } from 'ui';
import {
  BoostJornadaEnum,
  BoostRemotoEnum,
  getCertificaciones,
  getEmpresas,
  getEstados,
  getPaises,
  IEstado,
  IPais,
} from 'data';
import { useField } from 'formik';

const Step1 = () => {
  const [paises, setPaises] = useState([]);
  const [estados, setEstados] = useState([]);

  const [field, meta, helpers] = useField('pais');

  useEffect(() => {
    getPaises({}).then((res: any) =>
      setPaises(
        res?.map((pais: IPais) => ({
          value: pais,
          label: `${pais.bandera} ${pais.nombre}`,
          'data-cy': 'option_' + pais.nombre.toLocaleLowerCase(),
        }))
      )
    );
  }, []);

  useEffect(() => {
    if (field.value)
      getEstados({ query: [{ pais_id: field.value?.id }] }).then((res: any) =>
        setEstados(
          res?.map((estado: IEstado) => ({
            value: estado,
            label: estado.nombre,
            'data-cy': 'option_' + estado.nombre.toLocaleLowerCase(),
          }))
        )
      );
  }, [field.value]);

  const loadCertificacionesByNombre = async (value: any) => {
    const _certis = await getCertificaciones({
      client: 'admin',
      query: [{ nombre: value }],
    });

    return _certis?.data?.map((cert: any) => ({
      value: cert.id,
      label: cert.nombre,
    }));
  };

  const loadEmpresasByNombre = async (value: any) => {
    const _empresas = await getEmpresas({
      client: 'admin',
      query: [{ nombre: value }],
    });

    return _empresas?.data?.map((emp: any) => ({
      value: emp.id,
      label: emp.nombre,
    }));
  };

  return (
    <Flex bg="#fff" boxSize="100%" p="30px">
      <Flex direction="column" w="20%" mr="30px" rowGap="20px">
        <FormInput isRequired name="titulo" label="Título del boost" />

        <FormAsyncSelect
          isRequired
          name="empresaId"
          label="Empresa asociada"
          placeholder="Escribe para buscar"
          loadOptions={loadEmpresasByNombre}
        />

        <FormInput isRequired type="number" name="salarioMin" label="Salario mínimo" />

        <FormInput isRequired type="number" name="salarioMax" label="Salario máximo" />

        <FormSelect label="País de la oferta" name="pais" placeholder="Ej: España" options={paises} data-cy="pais" />

        <FormSelect
          label="Región de la oferta"
          name="estado"
          options={estados}
          placeholder="Ej: Comunidad Valenciana"
          data-cy="estado"
        />
      </Flex>

      <Flex direction="column" h="100%" w="80%" rowGap="20px">
        <Flex gap="20px" direction={{ base: 'column', md: 'row' }}>
          <FormSelect
            isRequired
            name="jornada"
            label="Jornada"
            placeholder="Selecciona una opción"
            options={Object.values(BoostJornadaEnum).map((k) => ({
              label: <Box textTransform="capitalize">{k}</Box>,
              value: k,
            }))}
          />

          <FormSelect
            isRequired
            name="remoto"
            label="Remoto"
            placeholder="Selecciona una opción"
            options={Object.values(BoostRemotoEnum).map((k) => ({
              label: <Box textTransform="capitalize">{k}</Box>,
              value: k,
            }))}
          />
        </Flex>

        <FormAsyncSelect
          isMulti
          name="certificacionesRequeridas"
          label="Certificaciones requeridas"
          placeholder="Escribe para buscar"
          loadOptions={loadCertificacionesByNombre}
        />

        <FormTextEditor isRequired name="descripcion" label="Descripción" />

        <FormTextarea name="icono" label="Icono del Boost" />
      </Flex>
    </Flex>
  );
};

export default Step1;
