import { useContext, useEffect, useState } from 'react';

import { Flex, Image, useToast, CloseButton, Button, Icon, Box } from '@chakra-ui/react';

import { onFailure } from 'ui';
import { getUserByID, updateUser } from 'data';
import { LoginContext } from '../../../../shared/context';
import { useNavigate } from 'react-router-dom';
import { BiPlay } from 'react-icons/bi';

const yt_enlace = 'https://www.youtube.com/watch?v=kQYudTGkmBw';
const yt_thumbnail = 'https://i.ytimg.com/vi/kQYudTGkmBw/hqdefault.jpg';

export const YoutubeWidget = () => {
  const toast = useToast();
  const navigate = useNavigate();

  const { user, setUser } = useContext(LoginContext);

  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    if (user?.preferencias?.showYoutube === false || process.env.REACT_APP_SHOW_YOUTUBE === 'FALSE') setOpen(false);
    else setOpen(true);
  }, [user]);

  const closeYoutube = () => {
    if (!user?.id) {
      onFailure(toast, 'Error inesperado', 'El ID de usuario es undefined. Por favor, contacte con soporte.');
      return;
    }

    setOpen(false);

    updateUser({
      id: user.id,
      user: {
        preferencias: { ...(user?.preferencias || {}), showYoutube: false },
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
      minH="278px"
      rounded="2xl"
      h="fit-content"
      overflow="hidden"
      direction="column"
      position="relative"
      justify="space-between"
      bg="linear-gradient(237.96deg, #8925ED -16.34%, #121784 102.3%)"
    >
      <CloseButton
        pos="absolute"
        top={5}
        right={5}
        zIndex={5}
        color="#fff"
        rounded="full"
        onClick={closeYoutube}
        _hover={{ opacity: 0.8 }}
        boxSize={{ base: '44px', md: '10px' }}
        bgColor={{ base: 'rgba(255, 255, 255, 0.16)', md: 'transparent' }}
      />

      <Flex
        as="a"
        href={yt_enlace}
        target="_blank"
        rounded="112.5px"
        w="128px"
        h="52px"
        mt="-28px"
        ml="-64px"
        zIndex={10}
        pos="absolute"
        left="50%"
        top="50%"
        color="#fff"
        fontSize="16px"
        letterSpacing="-0.02em"
        bg="rgba(0, 0, 0, 0.5)"
        align="center"
        p="10px 17px 10px 10px"
        _hover={{ bg: 'rgba(0, 0, 0, 0.8)' }}
      >
        <Icon as={BiPlay} boxSize="32px" /> Ver vídeo
      </Flex>

      <a href={yt_enlace} target="_blank">
        <Image
          w="100%"
          h="278px"
          fit="cover"
          bgPos="center"
          src={yt_thumbnail}
          zIndex={{ base: 0, md: 'unset' }}
          position={{ base: 'absolute', md: 'static' }}
        />
      </a>
    </Flex>
  );
};
