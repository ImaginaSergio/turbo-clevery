import { Field } from 'formik';
import {
  Text,
  Image,
  FormControl,
  Flex,
  FormErrorMessage,
} from '@chakra-ui/react';

import AvanzadoOB from '../../../../assets/onboarding/openbootcamp/AvanzadoIMG.png';
import AvanzadoOM from '../../../../assets/onboarding/openmarketers/AvanzadoIMG.png';
import PrincipianteOB from '../../../../assets/onboarding/openbootcamp/PrincipianteIMG.png';
import PrincipianteOM from '../../../../assets/onboarding/openmarketers/PrincipianteIMG.png';

export const StepsFormConocimientos = ({
  name,
  onSubmit = () => {},
}: {
  name: string;
  onSubmit?: any;
}) => {
  return (
    <Field name={name}>
      {({ field, form }: { field: any; form: any }) => (
        <FormControl
          className="steps-form--form-control"
          isInvalid={form.errors[name] && form.touched[name]}
        >
          <Flex
            gap="20px"
            align="center"
            justify="center"
            direction={{ base: 'column', sm: 'row' }}
          >
            <Card
              icon={
                process.env.NX_ORIGEN_CAMPUS === 'OPENMARKETERS'
                  ? AvanzadoOM
                  : AvanzadoOB
              }
              data-cy="conocimientos_avanzado"
              title="Ya cuento con conocimientos"
              isActive={field.value === 'avanzado'}
              onClick={() => form.setFieldValue(name, 'avanzado')}
            />

            <Card
              icon={
                process.env.NX_ORIGEN_CAMPUS === 'OPENMARKETERS'
                  ? PrincipianteOM
                  : PrincipianteOB
              }
              data-cy="conocimientos_principiante"
              title="Soy principiante"
              isActive={field.value === 'principiante'}
              onClick={() => {
                form.setFieldValue(name, 'principiante');
                onSubmit();
              }}
            />
          </Flex>
        </FormControl>
      )}
    </Field>
  );
};

const Card = ({
  title,
  icon,
  isActive,
  onClick,
  ...props
}: {
  title: string;
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
      bg="white"
      gap={{ base: '0px', sm: '19px' }}
      minH={{ base: '110px', sm: '223px' }}
      maxH={{ base: '110px', sm: 'unset' }}
      p={{ base: '20px 0px', sm: '20px 24px' }}
      rounded="13px"
      align="center"
      cursor="pointer"
      overflow="visible"
      direction={{ base: 'unset', sm: 'column' }}
      transition="all 0.2s ease"
      minW={{ base: '327px', sm: '396px' }}
      maxW={{ base: '340px', sm: 'unset' }}
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
      position="relative"
      {...props}
    >
      <Image
        src={icon}
        alt={title}
        maxW={{ base: '160px', sm: '300px' }}
        bottom={{ base: '0px', sm: '52px' }}
        position={{ base: 'relative', sm: 'absolute' }}
      />

      <Text
        variant="card_title"
        position={{ base: 'relative', sm: 'absolute' }}
        bottom={{ base: '0px', sm: '30px' }}
      >
        {title}
      </Text>
    </Flex>
  );
};
