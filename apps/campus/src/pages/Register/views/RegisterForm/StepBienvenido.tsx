import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import * as Yup from 'yup';
import { Formik, Form } from 'formik';
import TagManager from 'react-gtm-module';
import { BiLeftArrowAlt } from 'react-icons/bi';
import { Button, Flex, Text, Image } from '@chakra-ui/react';

import { capitalizeFirst, useQuery } from 'utils';
import { IPais, IEstado, getItem, getPaises, getEstados, updateUser, UserOrigenEnum, UserRemotoEnum } from 'data';

import { LoginContext } from '../../../../shared/context';
import { Stepper, StepsFormSelect, StepsFormRadio } from '../../components';
import { LogoOBFullBlack } from '../../../../assets/logos/openbootcamp/LogoOBFullBlack';
import { LogoOMFullBlack } from '../../../../assets/logos/openmarketers/LogoOMFullBlack';
import { USER_ONBOARDING_ID, USER_ONBOARDING_STEP_CONOCIMIENTOS, USER_ONBOARDING_TOKEN } from '.';

import '../../Register.scss';

const onKeyDown = (keyEvent: any) => {
  if ((keyEvent.charCode || keyEvent.keyCode) === 13) keyEvent.stopPropagation();
};

type StepBienvenidoValues = {
  pais?: any;
  estado?: any;
  origen?: string | null;
  trabajoRemoto?: UserRemotoEnum | null;
  posibilidadTraslado?: boolean | null;
};

const validationSchema = Yup.object().shape({
  pais: Yup.object().notRequired().nullable(),
  estado: Yup.object().notRequired().nullable(),
  trabajoRemoto: Yup.string()
    .oneOf([...Object.values(UserRemotoEnum), null])
    .notRequired()
    .nullable(),
  posibilidadTraslado: Yup.boolean().notRequired().nullable(),
  origen: Yup.string()
    .oneOf([...Object.values(UserOrigenEnum), null])
    .notRequired()
    .typeError('¡Escoge un valor del listado!')
    .nullable(),
});

const initialValues: StepBienvenidoValues = {
  pais: null,
  estado: null,
  origen: null,
  trabajoRemoto: null,
  posibilidadTraslado: null,
};

type StepBienvenidoProps = {
  totalSteps: number;
  currentStep: number;
  cleanStorage: (bool: boolean) => void;
  onPrevStep: (prevStep?: number) => void;
};

const StepBienvenido = ({ totalSteps, currentStep, onPrevStep, cleanStorage }: StepBienvenidoProps) => {
  const query = useQuery();
  const navigate = useNavigate();
  const { login } = useContext(LoginContext);

  const [pais, setPais] = useState<IPais | null>(null);
  const [paises, setPaises] = useState([]);
  const [estados, setEstados] = useState([]);

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
    if (pais)
      getEstados({ query: [{ pais_id: pais?.id }] }).then((res: any) =>
        setEstados(
          res?.map((estado: IEstado) => ({
            value: estado,
            label: estado.nombre,
            'data-cy': 'option_' + estado.nombre.toLocaleLowerCase(),
          }))
        )
      );
  }, [pais]);

  const onSubmit = async (values: any) => {
    values.step = 5;

    const userId = getItem(USER_ONBOARDING_ID);
    const userToken = getItem(USER_ONBOARDING_TOKEN);

    try {
      if (userId)
        await updateUser({
          id: userId,
          user: {
            origen: values.origen,
            paisId: values.pais?.id,
            estadoId: values.estado?.id,
            trabajoRemoto: values.trabajoRemoto,
            posibilidadTraslado: values.posibilidadTraslado,
            onboardingCompletado: true,
          },
        });
    } catch (error) {
      console.log('❌ Error al actualizar el usuario');
    }

    await login({ token: userToken }, userId, true)
      .then(() => {
        navigate('/');

        cleanStorage(false);
      })
      .catch((error: any) => {
        console.log('Error en el login del register', { error, userId });
        navigate('/login');

        cleanStorage(true);
      });

    // Enviamos a GTM que ha terminado el OnBoarding
    TagManager.dataLayer({ dataLayer: { onBoarding: 'ended' } });
  };

  const handleonPrevStep = () => {
    let storageValues = getItem(USER_ONBOARDING_STEP_CONOCIMIENTOS);

    if (query.get('ruta_id') !== null || storageValues.conocimientos === 'principiante') onPrevStep(3);
    else onPrevStep(4);
  };

  return (
    <Flex
      boxSize="100%"
      align="center"
      justify="start"
      direction="column"
      pt={{ base: '45px', sm: '75px' }}
      gap={{ base: '30px', sm: '60px' }}
    >
      {process.env.REACT_APP_ORIGEN_CAMPUS === 'OPENBOOTCAMP' ? <LogoOBFullBlack /> : <LogoOMFullBlack w="184" h="51" />}

      <Stepper steps={totalSteps} currentStep={currentStep} />

      <Flex gap="10px" id="head_last_step" direction="column" align="center">
        <Text
          variant="h1_heading"
          id="head_last_step__title"
          data-cy="last_step__title"
          align={{ base: 'center', sm: 'unset' }}
        >
          ¡Ya estás casi!
        </Text>

        <Text
          color="gray_4"
          variant="card_title"
          id="head_last_step__description"
          data-cy="last_step__description"
          align={{ base: 'center', sm: 'unset' }}
        >
          Con estos datos buscaremos ofertas de trabajo que encajen contigo.
        </Text>
      </Flex>

      <Flex w="100%" maxW="100%" direction="column">
        <Formik enableReinitialize onSubmit={onSubmit} initialValues={initialValues} validationSchema={validationSchema}>
          {(props) => (
            <Form onSubmit={props.handleSubmit} onKeyDown={onKeyDown}>
              <Flex w="100%" mb="30px" gap="30px" direction="column" id="body_last_step" data-cy="last_step__form">
                <StepsFormSelect
                  data-cy="pais"
                  name="pais"
                  label="¿En qué país vives?"
                  placeholder="Ej: España"
                  options={paises}
                  onChange={(e: any) => setPais(e.value)}
                />

                <StepsFormSelect
                  data-cy="estado"
                  name="estado"
                  label="¿En qué región?"
                  options={estados}
                  placeholder="Ej: Comunidad Valenciana"
                />

                <StepsFormSelect
                  data-cy="trabajoRemoto"
                  name="trabajoRemoto"
                  label="¿Qué tipo de trabajo prefieres?"
                  placeholder="Elige una opción del listado"
                  options={[
                    {
                      label: 'Remoto',
                      value: UserRemotoEnum.REMOTO,
                      'data-cy': 'option_remoto',
                    },
                    {
                      label: 'Presencial',
                      value: UserRemotoEnum.PRESENCIAL,
                      'data-cy': 'option_presencial',
                    },
                    {
                      label: 'Híbrido',
                      value: UserRemotoEnum.HIBRIDO,
                      'data-cy': 'option_hibrido',
                    },
                    {
                      label: 'Indiferente',
                      value: UserRemotoEnum.INDIFERENTE,
                      'data-cy': 'option_indiferente',
                    },
                  ]}
                />

                <StepsFormSelect
                  name="origen"
                  data-cy="origen"
                  label="¿Cómo nos has conocido?"
                  placeholder="Elige una opción del listado"
                  options={Object.values(UserOrigenEnum).map((v) => ({
                    label: capitalizeFirst(v),
                    value: v,
                    'data-cy': 'option_' + v.toLocaleLowerCase(),
                  }))}
                />

                <StepsFormRadio
                  name="posibilidadTraslado"
                  data-cy="posibilidadTraslado"
                  label="¿Estarías dispuesto a trasladarte?"
                  options={[
                    { label: 'Sí', value: 'true', 'data-cy': 'option_si' },
                    { label: 'No', value: 'false', 'data-cy': 'option_no' },
                  ]}
                />
              </Flex>

              <Flex
                w="100%"
                mb="50px"
                gap="12px"
                direction={{ base: 'column', sm: 'row' }}
                align={{ base: 'flex-end', sm: 'center' }}
                justify={{ base: 'center', sm: 'flex-end' }}
              >
                <Button
                  w={{ base: '100%', sm: 'unset' }}
                  id="register_previous_button"
                  className="cta_volver_5"
                  variant="outline"
                  leftIcon={<BiLeftArrowAlt />}
                  onClick={handleonPrevStep}
                  isDisabled={props.isSubmitting}
                >
                  Volver
                </Button>

                <Button
                  w={{ base: '100%', sm: 'unset' }}
                  id="acces_to_campus_button"
                  type="submit"
                  variant="primary"
                  className="cta_siguiente_5"
                  isLoading={props.isSubmitting}
                >
                  ¡Empezar mi formación!
                </Button>
              </Flex>
            </Form>
          )}
        </Formik>
      </Flex>
    </Flex>
  );
};

export default StepBienvenido;
