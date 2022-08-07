import { Image } from '@chakra-ui/react';

interface AvatarProps {
  // Image for avatar
  src?: string;
  // Name for fallback
  name: string;
  // Size
  size?: string;
  // Variant for boring Icons
  variant?: 'bauhaus' | 'marble' | 'beam';
  // Size for fallback
  fontSize?: string;
  // Have border?
  outline?: boolean;
  // Variant color
  colorVariant?: 'hot' | 'cold';
}

/**
 * Primary UI component for user interaction
 */
export const Avatar = ({
  src,
  name,
  size,
  outline,
  fontSize,
  variant = 'beam',
  colorVariant = 'cold',
  ...props
}: AvatarProps) => {
  let boringURL = `https://source.boringavatars.com/${variant}/120/${name}?colors=${
    colorVariant === 'hot' ? 'BB4275,FBC865,EB915F,D36D56,9C68C6' : '3C558C,65CE99,5BCEBF,33B4BB,2E9EBF'
  }`;

  return (
    <Image fit="cover" alt={name} src={src || boringURL} {...props} minW={size} minH={size} boxSize={size} rounded="150px" />
  );
};
