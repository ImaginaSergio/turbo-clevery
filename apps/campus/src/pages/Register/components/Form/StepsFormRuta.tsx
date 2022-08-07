import { Text, Image, FormControl, Flex, FormErrorMessage } from '@chakra-ui/react';
import { Field } from 'formik';

import Backend from '../../../../assets/onboarding/openbootcamp/Backend.png';
import Frontend from '../../../../assets/onboarding/openbootcamp/Frontend.png';
import Fullstack from '../../../../assets/onboarding/openbootcamp/Fullstack.png';

import SEO from '../../../../assets/onboarding/openmarketers/SEO.png';
import Branding from '../../../../assets/onboarding/openmarketers/Branding.png';
import Analista from '../../../../assets/onboarding/openmarketers/Analista.png';
import Estrategia from '../../../../assets/onboarding/openmarketers/Estrategia.png';
import Performance from '../../../../assets/onboarding/openmarketers/Performance.png';
import Principiantes from '../../../../assets/onboarding/openmarketers/Principiantes.png';

export const StepsFormRuta = ({ name }: any) => {
  return (
    <Field name={name}>
      {({ field, form }: { field: any; form: any }) => (
        <FormControl className="steps-form--form-control" isInvalid={form.errors[name] && form.touched[name]}>
          {process.env.REACT_APP_ORIGEN_CAMPUS === 'OPENMARKETERS' ? (
            <>
              <Flex mb="20px" gap="20px" wrap="wrap" align="start" justify="center">
                <Card
                  icon={Estrategia}
                  title="Estrategia y Organización Marketing"
                  data-cy="ruta_estrategia_organizacion"
                  description="Un trabajo de éxito comienza con una buena base organizativa."
                  isActive={field.value === 'estrategia_organizacion'}
                  onClick={() => form.setFieldValue(name, 'estrategia_organizacion')}
                />

                <Card
                  icon={Branding}
                  title="Branding y Comunicación"
                  data-cy="ruta_branding_comunicacion"
                  description="Encuentra las palabras adecuadas para conectar con tu público."
                  isActive={field.value === 'branding_comunicacion'}
                  onClick={() => form.setFieldValue(name, 'branding_comunicacion')}
                />
                <Card
                  icon={Principiantes}
                  title="Principiantes Programación"
                  data-cy="ruta_principiantes_programacion"
                  description="Aprende los lenguajes de programación más utilizados en marketing digital."
                  isActive={field.value === 'principiantes_programacion'}
                  onClick={() => form.setFieldValue(name, 'principiantes_programacion')}
                />
              </Flex>

              <Flex gap="20px" align="start" wrap="wrap" justify="center">
                <Card
                  icon={Performance}
                  title="Performance"
                  data-cy="ruta_performance"
                  description="Aprende a gestionar cuentas publicitarias y obtener resultados."
                  isActive={field.value === 'performance'}
                  onClick={() => form.setFieldValue(name, 'performance')}
                />

                <Card
                  icon={Analista}
                  title="Analista Web"
                  data-cy="ruta_analista_web"
                  description="Conoce cómo leer resultados para extraer conclusiones y hacer mejoras."
                  isActive={field.value === 'analista_web'}
                  onClick={() => form.setFieldValue(name, 'analista_web')}
                />

                <Card
                  icon={SEO}
                  title="SEO, Contenidos y CRO"
                  data-cy="ruta_seo_contenidos_cro"
                  description="Maneja las técnicas para hacer crecer tráfico y ventas orgánicamente."
                  isActive={field.value === 'seo_contenidos_cro'}
                  onClick={() => form.setFieldValue(name, 'seo_contenidos_cro')}
                />
              </Flex>
            </>
          ) : (
            <Flex gap="20px" align="start" wrap="wrap" justify="center">
              <Card
                icon={Fullstack}
                title="Fullstack"
                data-cy="ruta_fullstack"
                description="Aprende tanto Front como Back para poder hacer aplicaciones web."
                isActive={field.value === 'fullstack'}
                onClick={() => form.setFieldValue(name, 'fullstack')}
              />

              <Card
                icon={Frontend}
                title="Frontend"
                data-cy="ruta_frontend"
                description="Céntrate en el Desarrollo Front con los frameworks más modernos."
                isActive={field.value === 'frontend'}
                onClick={() => form.setFieldValue(name, 'frontend')}
              />

              <Card
                icon={Backend}
                title="Backend"
                data-cy="ruta_backend"
                description="Adquiere conocimientos en la tecnología de back más novedosa."
                isActive={field.value === 'backend'}
                onClick={() => form.setFieldValue(name, 'backend')}
              />
            </Flex>
          )}
        </FormControl>
      )}
    </Field>
  );
};

const Card = ({
  title,
  description,
  icon,
  isActive,
  onClick,
  ...props
}: {
  title: string;
  description: string;
  icon: any;
  isActive: boolean;
  onClick: () => any;
  'data-cy'?: string;
}) => {
  return (
    <Flex
      zIndex={1}
      tabIndex={-1}
      onClick={onClick}
      gap="19px"
      bg="white"
      align="start"
      minH={{ base: 'fit-content', sm: '201px' }}
      maxW={{ base: '327px', sm: '256px' }}
      p="20px 24px"
      rounded="13px"
      cursor="pointer"
      overflow="visible"
      direction={{ base: 'row', sm: 'column' }}
      transition="all 0.2s ease"
      border="1px solid"
      borderColor={isActive ? 'primary_neon' : 'gray_5'}
      boxShadow={isActive ? '0px 9px 16px 0px rgba(0, 0, 0, 0.18)' : ''}
      _hover={{
        zIndex: 2,
        transform: 'translate(0px, -5px)',
        boxShadow: '0px 9px 16px 0px rgba(0, 0, 0, 0.18)',
      }}
      _focus={{
        zIndex: 2,
        transform: 'translate(0px, -5px)',
        boxShadow: '0px 9px 16px 0px rgba(0, 0, 0, 0.18)',
      }}
      {...props}
    >
      <Image src={icon} alt={title} boxSize={{ base: '60px', sm: '75px' }} />

      <Flex w="100%" h="fit-content" direction="column">
        <Text fontSize={{ base: '16px', sm: '18px' }} variant="card_title">
          {title}
        </Text>
        <Text fontSize={{ base: '11px', sm: '16px' }} variant="card_text">
          {description}
        </Text>
      </Flex>
    </Flex>
  );
};
