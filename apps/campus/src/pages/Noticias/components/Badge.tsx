import { Center } from '@chakra-ui/react';

export const NoticiaBadge = ({
  label = '',
  bg = 'black',
  color = 'white',
}: {
  bg: string;
  color: string;
  label?: string;
}) => {
  return (
    <Center
      p="5px 8px"
      noOfLines={1}
      bg={bg}
      rounded="10px"
      fontSize="13px"
      fontWeight="bold"
      lineHeight="16px"
      color={color}
    >
      {label}
    </Center>
  );
};

const variantPrimary = {
  bg: '#0C97C21A',
  color: '#0C97C2',
};

const variantPrimary_Destacado = {
  bg: '#FFFFFF1A',
  color: 'white',
};

const variantSecondary = {
  bg: '#2834BA1A',
  color: 'secondary_dark',
};

const variantSecondary_Destacado = {
  bg: '#2834BA1A',
  color: 'secondary_dark',
};

const variantDefault = {
  bg: '#0C97C21A',
  color: '#0C97C2',
};
