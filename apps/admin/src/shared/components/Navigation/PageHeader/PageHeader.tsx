import React from 'react';

import { Box, Image, Button, IconButton, Flex } from '@chakra-ui/react';

import './PageHeader.scss';

type HeaderButton = {
  text: string;
  leftIcon?: any;
  isLoading?: boolean;
  isDisabled?: boolean;
  loadingText?: string;
  onClick: () => void;
};

type HeaderIconButton = {
  icon?: any;
  isLoading?: boolean;
  isDisabled?: boolean;
  onClick: () => void;
};

type PageHeaderProps = {
  head: {
    title?: string;
    subtitle?: string | React.ReactNode;
    image?: string;
    onClick?: () => void;
  };

  button?: HeaderButton;
  buttonGroup?: HeaderButton[];

  iconButtons?: HeaderIconButton[];
};

const PageHeader = ({
  head,
  button,
  iconButtons = [],
  buttonGroup = [],
}: PageHeaderProps) => {
  return (
    <div className="pageheader">
      <div className="pageheader--head">
        {head.image && (
          <Image
            fit="cover"
            objectPosition="center"
            minW="45px"
            h="45px"
            rounded="7px"
            src={head.image}
          />
        )}

        <Flex direction="column" gap="8px" width="100%">
          <Box className={`pageheader--head--title`} onClick={head.onClick}>
            {head.title || ''}
          </Box>

          {head.subtitle && (
            <Box
              color="gray_3"
              fontSize="14px"
              lineHeight="16px"
              fontWeight="medium"
            >
              {head.subtitle}
            </Box>
          )}
        </Flex>
      </div>

      <Flex minW="fit-content" align="center" gap="12px">
        {iconButtons?.map((iBtn, index) => (
          <IconButton
            key={`pageheader-iconbutton-${index}`}
            aria-label="boton"
            rounded="12px"
            icon={iBtn.icon}
            onClick={iBtn.onClick}
            isLoading={iBtn?.isLoading}
            isDisabled={iBtn?.isDisabled}
          />
        ))}

        {button && (
          <Button
            bg="#fff"
            rounded="12px"
            border="2px solid #E6E8EE"
            onClick={button?.onClick}
            leftIcon={button?.leftIcon}
            isLoading={button?.isLoading}
            isDisabled={button?.isDisabled}
            loadingText={button?.loadingText}
          >
            {button?.text}
          </Button>
        )}

        {buttonGroup?.map((btn, index) => (
          <Button
            key={`pageheader-buttongroup-${index}`}
            bg="#fff"
            rounded="12px"
            border="2px solid #E6E8EE"
            onClick={btn?.onClick}
            leftIcon={btn?.leftIcon}
            isLoading={btn?.isLoading}
            isDisabled={btn?.isDisabled}
            loadingText={button?.loadingText}
          >
            {btn?.text}
          </Button>
        ))}
      </Flex>
    </div>
  );
};

export { PageHeader };
