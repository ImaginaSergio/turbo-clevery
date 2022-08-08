import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { BiLogOut, BiSlideshow, BiChevronDown, BiChevronLeft } from 'react-icons/bi';
import { Box, Flex, Icon, Menu, Portal, MenuItem, MenuList, IconButton, MenuButton } from '@chakra-ui/react';

import { Avatar } from '@clevery/ui';

import { LoginContext } from '../../../context';

import './Header.scss';

type HeaderProps = {
  head: {
    title: string;
    onClick: () => void;
    children?: { title: string; isActive?: boolean; onClick?: () => void }[];
  };
};

const Header = ({ head }: HeaderProps) => {
  const navigate = useNavigate();
  const { user, logout } = useContext(LoginContext);

  return (
    <div className="header">
      <div className="header--head">
        <Box className={`header--head--item ${!head.children ? 'header--head--item__active' : ''}`} onClick={head.onClick}>
          {head.title}
        </Box>

        {head?.children?.map((child: any, index: number) => (
          <Flex onClick={child.onClick} key={`header-breadcrumb-item-${index}`} className="header--head--breadcrumb_item">
            <Icon as={BiChevronLeft} boxSize="21px" opacity={0.6} color="#fff" />

            <Box className={`header--head--item ${child.isActive ? 'header--head--item__active' : ''}`}>{child.title}</Box>
          </Flex>
        ))}
      </div>

      <Flex className="header-utils" columnGap="30px" align="center">
        <Flex align="center" columnGap="12px">
          <Flex
            align="end"
            fontSize="15px"
            rowGap="4px"
            direction="column"
            minW="fit-content"
            fontWeight="bold"
            lineHeight="100%"
            textTransform="capitalize"
          >
            <Box>{user?.nombre}</Box>

            <Box opacity="0.6">{user?.apellidos}</Box>
          </Flex>

          <Avatar
            size="40px"
            src={user?.avatar?.url}
            name={user?.fullName || 'Avatar del usuario'}
            colorVariant={(user?.id || 0) % 2 == 1 ? 'hot' : 'cold'}
          />

          <Menu>
            <MenuButton
              as={IconButton}
              aria-label="Options"
              icon={<Icon as={BiChevronDown} boxSize="20px" />}
              outline="none"
              bg="transparent"
              minW="fit-content"
              _hover={{ bg: 'transparent' }}
              _focus={{ bg: 'transparent' }}
              _active={{ bg: 'transparent' }}
              _expanded={{ bg: 'transparent' }}
            />

            <Portal>
              <MenuList zIndex="dropdown" py={0} color="black">
                <MenuItem
                  as="a"
                  target="_blank"
                  href={process.env.REACT_APP_CAMPUS_URL || ''}
                  icon={<Icon as={BiSlideshow} boxSize="16px" />}
                >
                  Volver al campus
                </MenuItem>

                <MenuItem
                  icon={<Icon as={BiLogOut} boxSize="16px" />}
                  onClick={() => {
                    logout();
                    navigate('/login');
                  }}
                >
                  Cerrar sesión
                </MenuItem>
              </MenuList>
            </Portal>
          </Menu>
        </Flex>
      </Flex>
    </div>
  );
};

export { Header };
