import { useNavigate } from 'react-router-dom';

import { Flex, Icon, Link, LinkProps, Box } from '@chakra-ui/react';

interface NavLinkProps extends LinkProps {
  icon: any;
  to: string;
  label: string;
  isActive?: boolean;
  isDisabled?: boolean;
  showLabel?: boolean;
}

export const NavLink = ({
  to,
  label,
  icon,
  isActive,
  isDisabled,
  showLabel,
  ...rest
}: NavLinkProps) => {
  const navigate = useNavigate();

  return (
    <Link
      title={label}
      h="64px"
      color="#fff"
      display="flex"
      align="center"
      onClick={isDisabled ? undefined : () => navigate(to)}
      transition="all 0.3s"
      aria-current={isActive ? 'page' : undefined}
      cursor={isDisabled ? 'not-allowed' : 'pointer'}
      {...rest}
    >
      <Box
        minW="5px"
        h="100%"
        bg={isActive ? 'white' : undefined}
        rounded="0px 5px 5px 0px"
      />

      <Flex w="100%" p="10px 15px 10px 10px" justify="center" align="center">
        <Flex
          w="100%"
          p="10px"
          align="center"
          justify="center"
          rounded="12px"
          _hover={isDisabled ? undefined : { bg: 'rgba(255, 255, 255, 0.15)' }}
          bg={isActive ? 'rgba(255, 255, 255, 0.15)' : undefined}
        >
          <Icon
            as={icon}
            w="24px"
            h="24px"
            color={isActive ? 'white' : '#84889A'}
          />
        </Flex>
      </Flex>
    </Link>
  );
};
