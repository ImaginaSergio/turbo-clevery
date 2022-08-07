import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { Box, Flex, Icon, Link, LinkProps } from '@chakra-ui/react';

import { LayoutContext } from '../../../context';

interface NavLinkProps extends LinkProps {
  icon: any;
  to: string;
  title: string;
  state?: any;
  isActive?: boolean;
  isHover?: boolean
  isDisabled?: boolean;
  onClose?: any;
  "data-cy"?: string
}

export const NavLinkNoMobile = ({
  to,
  state = {},
  title,
  icon,
  isHover,
  isActive,
  onClose,
  ...rest
}: NavLinkProps) => {
  const navigate = useNavigate();
  const { isMobile } = useContext(LayoutContext);

  return (
      <Link
        w="100%"
        color="gray_4"
        position="relative"
        transition="all 0.3s"
        onClick={() => {
          navigate(to, { state });
          if (onClose) onClose();
        }}
        _hover={{ color: 'primary' }}
        _activeLink={{ color: 'primary' }}
        aria-current={isActive ? 'page' : undefined}
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        {...rest}
      >
        <Flex
          w="5px"
          h="100%"
          left="0"
          bottom="0"
          mr="18.5px"
          position="absolute"
          overflow="hidden"
          rounded="0px 5px 5px 0px"
          bg={isActive ? 'primary' : undefined}
        />

        <Flex p="10px" w="100%" align="center" justify="flex-start" ml="21px" overflow="hidden">
          <Icon as={icon} boxSize="24px" />
          <Box
            pl="13px"
            maxH="auto"
            fontSize="14px"
            position="relative"
            overflow="hidden"
            display={{base: isHover ? 'flex' : 'none', '2xl': 'flex'}}
          >
            {title}
          </Box>
        </Flex>
      </Link>
  );
};
