import { useContext, useEffect, useState } from 'react';

import { Icon, Flex, Text, Image, Button, useToast, CloseButton, IconButton } from '@chakra-ui/react';

import { BsDiscord } from 'react-icons/bs';
import { onFailure } from 'ui';
import { getUserByID, updateUser } from 'data';
import { LoginContext } from '../../../../shared/context';

import BgDiscord from '../../../../assets/home/DiscordWidgetBG.png';

export const DiscordWidget = () => {
  const toast = useToast();

  const { user, setUser } = useContext(LoginContext);

  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    if (user?.preferencias?.showDiscord === false || process.env.REACT_APP_SHOW_DISCORD === 'FALSE') setOpen(false);
    else setOpen(true);
  }, [user]);

  const closeDiscord = () => {
    if (!user?.id) {
      onFailure(toast, 'Error inesperado', 'El ID de usuario es undefined. Por favor, contacte con soporte.');
      return;
    }

    setOpen(false);

    updateUser({
      id: user.id,
      user: {
        preferencias: { ...(user?.preferencias || {}), showDiscord: false },
      },
    })
      .then(async (res) => {
        const dataUser = await getUserByID({ id: user.id || 0 });

        if (!dataUser.isAxiosError) setUser({ ...dataUser });
        else console.error({ error: dataUser });
      })
      .catch((err) => console.error({ err }));
  };

  return !open ? null : (
    <Flex
      overflow="hidden"
      direction="column"
      position="relative"
      justify="space-between"
      rounded={{ base: 'none', sm: '2xl' }}
      h={{ base: 'fit-content', md: '278px' }}
      minH={{ base: '90px', md: '278px' }}
      bg="linear-gradient(180deg, #443DBD 0%, #2B38AF 100%)"
    >
      <Flex
        w="100%"
        p="28px"
        gap="28px"
        justify="space-between"
        zIndex={{ base: 10, md: '' }}
        align={{ base: 'center', md: 'start' }}
        direction={{ base: 'row-reverse', md: 'column' }}
      >
        <Flex w={{ base: 'fit-content', md: '100%' }} justify={{ base: 'center', md: 'space-between' }}>
          <Text color="#fff" fontSize="14px" decoration="none" display={{ base: 'none', md: 'flex' }}>
            {process.env.REACT_APP_ORIGEN_CAMPUS === 'OPENMARKETERS' ? 'OpenMarketers' : 'OpenBootcamp'} Discord
          </Text>

          <CloseButton
            zIndex="10"
            color="#fff"
            rounded="full"
            onClick={closeDiscord}
            _hover={{ opacity: 0.8 }}
            boxSize={{ base: '44px', md: '10px' }}
            bgColor={{ base: 'rgba(255, 255, 255, 0.16)', md: 'transparent' }}
          />
        </Flex>

        <Text w="100%" color="#fff" decoration="none" textTransform="uppercase" fontSize={{ base: '16px', md: '24px' }}>
          Aprende y Comparte en <strong>Comunidad</strong>
        </Text>

        <a target="_blank" rel="noreferrer" style={{ width: 'fit-content' }} href={process.env.REACT_APP_DISCORD_INVITATION}>
          <Button
            bg="#475AE1"
            w="fit-content"
            rounded="12px"
            color="#FFFFFF"
            fontSize="16px"
            fontWeight="bold"
            lineHeight="16px"
            _hover={{ opacity: '0.8' }}
            rightIcon={<Icon as={BsDiscord} />}
            display={{ base: 'none', md: 'flex' }}
          >
            Ir a Discord
          </Button>

          <IconButton
            aria-label="Ir a Discord"
            color="#fff"
            bg="transparent"
            _hover={{ opacity: '0.8' }}
            display={{ base: 'flex', md: 'none' }}
            icon={<Icon as={BsDiscord} boxSize="40px" />}
          />
        </a>
      </Flex>

      <Image
        w="100%"
        src={BgDiscord}
        zIndex={{ base: 0, md: 'unset' }}
        opacity={{ base: '0.5', md: '1' }}
        position={{ base: 'absolute', md: 'static' }}
      />
    </Flex>
  );
};
