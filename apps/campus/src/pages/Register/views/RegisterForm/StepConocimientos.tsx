import { useState, useEffect } from 'react';

import * as Yup from 'yup';
import { Form, Formik } from 'formik';
import TagManager from 'react-gtm-module';
import { BiLeftArrowAlt } from 'react-icons/bi';
import { Flex, Text, Button, Image } from '@chakra-ui/react';

import { getCurso, getItem, getRutaByID, setItem, updateProgresoGlobal, updateUser } from 'data';
import { Stepper, StepsFormConocimientos } from '../../components';
import { USER_ONBOARDING_ID, USER_ONBOARDING_STEP_CONOCIMIENTOS } from '.';

import { LogoOBFullBlack } from 'apps/campus/src/assets/logos/openbootcamp/LogoOBFullBlack';
import { LogoOMFullBlack } from 'apps/campus/src/assets/logos/openmarketers/LogoOMFullBlack';
import { LogoImaginaFullBlack } from 'apps/campus/src/assets/logos/imagina/LogoImaginaFullBlack';

import '../../Register.scss';
import { useQuery } from 'utils';

type StepConocimientosProps = {
  totalSteps: number;
  currentStep: number;
  onNextStep: (nextStep?: number) => void;
  onPrevStep: () => void;
};

type StepConocimientosValues = {
  conocimientos?: 'principiante' | 'avanzado';
};

const validationSchema = Yup.object().shape({
  conocimientos: Yup.string().oneOf(['principiante', 'avanzado']).required(),
});

const onKeyDown = (keyEvent: any) => {
  if ((keyEvent.charCode || keyEvent.keyCode) === 13) keyEvent.stopPropagation();
};

const StepConocimientos = ({ totalSteps, currentStep, onNextStep, onPrevStep }: StepConocimientosProps) => {
  const query = useQuery();
  const [initialValues, setInitialValues] = useState<StepConocimientosValues>({
    conocimientos: undefined,
  });

  useEffect(() => {
    let storageValues = getItem(USER_ONBOARDING_STEP_CONOCIMIENTOS);

    if (storageValues) setInitialValues({ conocimientos: storageValues.conocimientos });
  }, []);

  const onSubmit = async (values: StepConocimientosValues) => {
    const userId = getItem(USER_ONBOARDING_ID);

    const rutaDestacadaId = query.get('ruta_id');
    const cursoDestacadoId = query.get('curso_id');

    // Guardamos los valores en el localStorage por si perdemos sesión
    setItem(USER_ONBOARDING_STEP_CONOCIMIENTOS, {
      conocimientos: values.conocimientos,
    });

    // Comprobamos que si existen el cursoID y rutaID, los guardamos en la BBDD.
    let storeCursoDestacado = false,
      storeRutaDestacada = false;

    // Primero comprobamos el curso
    if (cursoDestacadoId !== null)
      await getCurso({ id: cursoDestacadoId, treatData: false })
        .then(() => (storeCursoDestacado = true))
        .catch(() => (storeCursoDestacado = false));

    // Luego la ruta
    if (rutaDestacadaId !== null)
      await getRutaByID({ id: rutaDestacadaId })
        .then(() => (storeRutaDestacada = true))
        .catch(() => (storeRutaDestacada = false));

    if (userId) {
      let preferencias: any = { conocimientos: values.conocimientos };

      if (storeCursoDestacado) preferencias.cursoDestacado = cursoDestacadoId;

      await updateUser({
        id: userId,
        user: { preferencias },
      }).then((response) => {
        const progresoGlobalId = response.value?.data?.progresoGlobal?.id;

        if (progresoGlobalId && values.conocimientos === 'principiante') {
          updateProgresoGlobal({
            id: progresoGlobalId,
            progresoGlobal: {
              rutaId: process.env.NX_ORIGEN_CAMPUS === 'OPENMARKETERS' ? 1 : 14,
            },
          });
        } else if (progresoGlobalId && storeRutaDestacada) {
          updateProgresoGlobal({
            id: progresoGlobalId,
            progresoGlobal: { rutaId: rutaDestacadaId },
          });
        }
      });
    }

    // Enviamos a GTM el nivel de conocimientos
    TagManager.dataLayer({
      dataLayer: {
        knowledge: values.conocimientos === 'avanzado' ? 'pro' : 'rookie',
      },
    });

    if (values.conocimientos === 'principiante') {
      // Enviamos a GTM que la ruta es la de incubación
      TagManager.dataLayer({ dataLayer: { roadmap: 'incubation' } });

      // Saltamos al último paso
      onNextStep(5);
    } else if (query.get('ruta_id') !== null) {
      // Si el usuario ya escogió una ruta, saltamos al último paso.
      onNextStep(5);
    } else {
      // Si no, pasamos al siguiente paso
      onNextStep(4);
    }
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
      {process.env.NX_ORIGEN_CAMPUS === 'OPENBOOTCAMP' ? <LogoOBFullBlack /> : <LogoOMFullBlack w="184" h="51" />}

      <Stepper steps={totalSteps} currentStep={currentStep} />

      <Flex p="30px" gap="10px" direction="column" align={{ base: 'start', sm: 'center' }}>
        <Text variant="h1_heading" data-cy="third_step__title">
          {process.env.NX_ORIGEN_CAMPUS === 'OPENMARKETERS' ? '¿Ya sabes de marketing?' : '¿Sabes programar?'}
        </Text>

        <Text color="gray_4" fontSize="16px" variant="card_title" data-cy="third_step__description">
          Utilizaremos tu respuesta para crear una hoja de ruta personalizada que se adecúe a tu nivel de conocimientos y
          experiencia.
        </Text>
      </Flex>

      <Flex w="100%" maxW="100%" direction="column">
        <Formik enableReinitialize onSubmit={onSubmit} initialValues={initialValues} validationSchema={validationSchema}>
          {(props) => (
            <Form onSubmit={props.handleSubmit} onKeyDown={onKeyDown}>
              <Flex mb="30px" gap="30px" align="center" data-cy="third_step__form">
                <StepsFormConocimientos name="conocimientos" onSubmit={props.handleSubmit} />
              </Flex>

              <Flex
                w="100%"
                mt={{ base: '20px', sm: '50px' }}
                gap="12px"
                direction={{ base: 'column', sm: 'row' }}
                align={{ base: 'flex-end', sm: 'center' }}
                justify={{ base: 'center', sm: 'flex-end' }}
              >
                <Button
                  w={{ base: '100%', sm: 'unset' }}
                  id="register_previous_button"
                  className="cta_volver_3"
                  variant="outline"
                  onClick={onPrevStep}
                  isDisabled={props.isSubmitting}
                  leftIcon={<BiLeftArrowAlt />}
                >
                  Volver
                </Button>

                <Button
                  w={{ base: '100%', sm: 'unset' }}
                  type="submit"
                  variant="primary"
                  id="register_next_button"
                  className="cta_siguiente_3"
                  isLoading={props.isSubmitting}
                >
                  Siguiente paso
                </Button>
              </Flex>
            </Form>
          )}
        </Formik>
      </Flex>
    </Flex>
  );
};

export default StepConocimientos;
