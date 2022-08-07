import { useContext, useState } from 'react';

import { Flex, Button, Box } from '@chakra-ui/react';

import { OpenRadio, OpenSelect, OpenRangeInput, OpenHabilidades } from 'ui';
import { UserRemotoEnum } from 'data';
import { capitalizeFirst } from 'utils';

import { LoginContext } from '../../../shared/context';

export const TabEmpleo = ({
  updateValue,
  onRefresh,
}: {
  updateValue: any;
  onRefresh: ({ newUser }: { newUser: any }) => any;
}) => {
  const { user } = useContext(LoginContext);
  const [pending, setPending] = useState<boolean>(false);

  const [trabajoRemoto, setTrabajoRemoto] = useState<UserRemotoEnum | undefined>(user?.trabajoRemoto);

  const [posibilidadTraslado, setPosibilidadTraslado] = useState<boolean | undefined>(user?.posibilidadTraslado);

  const [tieneExperiencia, setTieneExperiencia] = useState<boolean | undefined>(user?.tieneExperiencia);

  const [actualmenteTrabajando, setActualmenteTrabajando] = useState<boolean | undefined>(user?.actualmenteTrabajando);

  const [expectativasSalariales, setExpectativasSalariales] = useState<[number | undefined, number | undefined]>([
    user?.expectativasSalarialesMin || undefined,
    user?.expectativasSalarialesMax || undefined,
  ]);

  const [habilidades, setHabilidades] = useState<any[]>(
    (user?.habilidades || []).map((h: any) => ({
      value: h.id,
      icono: h.icono,
      label: h.nombre,
      experiencia: h.meta.pivot_experiencia,
    }))
  );

  const handleUpdate = () => {
    let newData: any = {
      trabajoRemoto,
      tieneExperiencia,
      posibilidadTraslado,
      actualmenteTrabajando,
      habilidades: treatHabilidadesObj(),
      expectativasSalarialesMin: expectativasSalariales[0],
      expectativasSalarialesMax: expectativasSalariales[1],
    };

    updateValue({ newData });
    setPending(false);
  };

  const treatHabilidadesObj = (): any => {
    const habilidadesResponse: any = {};

    [...habilidades]?.forEach((habilidad: any) => {
      if (!habilidad.value) return undefined;

      habilidadesResponse[habilidad.value + ''] = {
        experiencia: habilidad?.experiencia,
      };

      return habilidad;
    });

    return habilidadesResponse;
  };

  return (
    <Flex w="100%" direction="column" gap="32px">
      <Box fontSize="15px" lineHeight="22px">
        Estas preferencias serán privadas y nos serán útiles para encontrar ofertas de trabajo adecuadas para ti:
      </Box>

      <OpenRadio
        name="actualmenteTrabajando"
        label={
          process.env.NX_ORIGEN_CAMPUS === 'OPENMARKETERS'
            ? '¿Estás trabajando como marketer actualmente?'
            : '¿Estás trabajando como desarrollador actualmente?'
        }
        defaultValue={actualmenteTrabajando === true ? 'Sí' : actualmenteTrabajando === false ? 'No' : undefined}
        onChange={(e: any) => {
          setPending(true);
          setActualmenteTrabajando(
            e.actualmenteTrabajando === 'Sí' ? true : e.actualmenteTrabajando === 'No' ? false : undefined
          );
        }}
        radios={[
          { label: 'Sí', value: 'Sí' },
          { label: 'No', value: 'No' },
        ]}
      />

      <OpenRadio
        name="tieneExperiencia"
        label={
          process.env.NX_ORIGEN_CAMPUS === 'OPENMARKETERS'
            ? '¿Tienes experiencia en alguna habilidad?'
            : '¿Tienes experiencia en alguna tecnología?'
        }
        defaultValue={tieneExperiencia === true ? 'Sí' : tieneExperiencia === false ? 'No' : undefined}
        onChange={(e: any) => {
          setPending(true);
          setTieneExperiencia(e.tieneExperiencia === 'Sí' ? true : e.tieneExperiencia === 'No' ? false : undefined);
        }}
        radios={[
          { label: 'Sí', value: 'Sí' },
          { label: 'No', value: 'No' },
        ]}
      />

      {tieneExperiencia && (
        <OpenHabilidades
          name="habilidades"
          label={`${
            process.env.NX_ORIGEN_CAMPUS === 'OPENMARKETERS' ? 'Habilidades' : 'Tecnologías'
          } que conoces y los años de experiencia en cada una:`}
          defaultValue={habilidades}
          onChange={(e: any) => {
            if (!pending) setPending(true);
            setHabilidades(e);
          }}
        />
      )}

      <OpenSelect
        name="trabajoRemoto"
        label="¿Qué tipo de trabajo prefieres?"
        placeholder="Elige una opción del listado"
        onChange={(e: any) => {
          if (!pending) setPending(true);
          setTrabajoRemoto(e);
        }}
        options={[
          {
            label: 'Remoto',
            value: UserRemotoEnum.REMOTO,
            'data-cy': 'Remoto_option',
          },
          {
            label: 'Presencial',
            value: UserRemotoEnum.PRESENCIAL,
            'data-cy': 'Presencial_option',
          },
          {
            label: 'Híbrido',
            value: UserRemotoEnum.HIBRIDO,
            'data-cy': 'Híbrido_option',
          },
          {
            label: 'Indiferente',
            value: UserRemotoEnum.INDIFERENTE,
            'data-cy': 'Indiferente_option',
          },
        ]}
        defaultValue={trabajoRemoto ? { label: capitalizeFirst(trabajoRemoto), value: trabajoRemoto } : null}
      />

      <OpenRangeInput
        name="expectativasSalariales"
        label="¿Qué expectativas salariales tienes? (Cantidad en bruto €/año)"
        defaultValue={expectativasSalariales}
        onChange={(e: any) => {
          if (!pending) setPending(true);
          setExpectativasSalariales(e.expectativasSalariales);
        }}
      />

      <OpenRadio
        name="posibilidadTraslado"
        label="¿Estás dispuesto a trasladarte por trabajo?"
        defaultValue={posibilidadTraslado === true ? 'Sí' : posibilidadTraslado === false ? 'No' : undefined}
        onChange={(e: any) => {
          setPosibilidadTraslado(e.posibilidadTraslado === 'Sí' ? true : e.posibilidadTraslado === 'No' ? false : undefined);
        }}
        radios={[
          { label: 'Sí', value: 'Sí' },
          { label: 'No', value: 'No' },
        ]}
      />

      {pending && (
        <Flex w="100%" justify="flex-start" mb="40px">
          <Button h="46px" bg="gray_3" rounded="12px" fontSize="14px" fontWeight="bold" onClick={() => setPending(false)}>
            Descartar cambios
          </Button>

          <Button
            fontWeight="bold"
            fontSize="14px"
            rounded="12px"
            h="46px"
            ml="17px"
            bg="primary"
            color="white"
            onClick={handleUpdate}
            data-cy="guardar_cambios"
          >
            Guardar cambios
          </Button>
        </Flex>
      )}
    </Flex>
  );
};
