import { useEffect, useState } from 'react';

import { Flex, Box, Icon, Image } from '@chakra-ui/react';

import { AiFillQuestionCircle } from 'react-icons/ai';
import { InformationInputTooltip } from './InformationInputTooltip/InformationInputTooltip';

const COLOR_REGEX = 'colorReplaceMe';

type Props = {
  title?: string;
  picture?: string;
  subtitle?: string;
  nameTitle?: string;
  nameSubtitle?: string;
  updateValueTitle?: (x: any) => void;
  updateValueSubtitle?: (x: any) => void;
  subtitleSuffix?: string;
};
export const InformationHead = ({
  title,
  picture = '',
  subtitle = '',
  nameTitle,
  nameSubtitle,
  updateValueTitle,
  updateValueSubtitle,
  subtitleSuffix,
}: Props) => {
  const [_title, setTitle] = useState(title);
  const [_subtitle, setSubtitle] = useState(subtitle);

  useEffect(() => {
    setTitle(title);
    setSubtitle(subtitle);
  }, [title, subtitle]);

  function onChangeTitle(value: any, target: string) {
    setTitle(value);
    if (updateValueTitle) updateValueTitle({ [target]: value });
  }

  function onChangeSubtitle(value: any, target: string) {
    setSubtitle(value);
    if (updateValueSubtitle) updateValueSubtitle({ [target]: value });
  }

  function setColorTo(elem: any, color = '%23273360') {
    return elem?.replaceAll(COLOR_REGEX, color);
  }

  return (
    <Flex align="center" justify="flex-start">
      {picture ? (
        <Image
          src={`data:image/svg+xml;utf8,${setColorTo(picture)}`}
          alt=""
          bg="#fff"
          boxSize="90px"
          p="8px"
          rounded="15px"
          border="1px solid #EBE8F0"
        />
      ) : (
        <Icon
          as={AiFillQuestionCircle}
          bgColor="#fff"
          h="90px"
          w="90px"
          rounded="15px"
        />
      )}

      <Flex
        direction="column"
        justify="center"
        fontSize="18px"
        ml="30px"
        position="relative"
        w="100%"
      >
        {updateValueTitle ? (
          <InformationInputTooltip
            value={_title}
            onChange={(e: any) => {
              if (nameTitle) onChangeTitle(e, nameTitle);
            }}
            textStyle={{
              marginBottom: '10px',
              color: '#131340',
              fontWeight: 600,
              cursor: 'pointer',
              width: '100%',
            }}
            inputStyle={{
              border: '2px solid #5997F3',
              boxShadow: '0px 1px 10px rgba(26, 20, 66, 0.2)',
              borderRadius: '2px',
              boxSizing: 'border-box',
              width: '100%',
            }}
          />
        ) : (
          <Box mb="10px" fontWeight="semibold" color="#131340">
            {_title}
          </Box>
        )}

        {updateValueSubtitle ? (
          <InformationInputTooltip
            value={_subtitle}
            textSuffix={subtitleSuffix}
            onChange={(e: any) => {
              if (nameSubtitle) onChangeSubtitle(e, nameSubtitle);
            }}
            textStyle={{ color: '#BFC4D3', fontWeight: 600, cursor: 'pointer' }}
            inputStyle={{
              border: '2px solid #5997F3',
              boxShadow: '0px 1px 10px rgba(26, 20, 66, 0.2)',
              borderRadius: '2px',
              boxSizing: 'border-box',
              width: '240px',
            }}
          />
        ) : (
          <Box fontWeight="semibold" color="#BFC4D3">
            {_subtitle}
          </Box>
        )}
      </Flex>
    </Flex>
  );
};
