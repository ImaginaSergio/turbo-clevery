import { useContext, useEffect, useState } from 'react';

import { BiPlay } from 'react-icons/bi';
import { Flex, Image, Icon } from '@chakra-ui/react';

import { LoginContext } from '../../../../shared/context';

const yt_enlace = 'https://www.youtube.com/watch?v=01byq8fmu8s';
const yt_thumbnail = 'https://i.ytimg.com/vi/01byq8fmu8s/maxresdefault.jpg';

export const YoutubeWidget = () => {
  const { user } = useContext(LoginContext);

  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    if (process.env.REACT_APP_SHOW_YOUTUBE === 'FALSE') setOpen(false);
    else setOpen(true);
  }, [user]);

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
      <Flex
        as="a"
        href={process.env.REACT_APP_YOUTUBE_URL || yt_enlace}
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
          src={process.env.REACT_APP_YOUTUBE_THUMBNAIL || yt_thumbnail}
          zIndex={{ base: 0, md: 'unset' }}
          position={{ base: 'absolute', md: 'static' }}
        />
      </a>
    </Flex>
  );
};
