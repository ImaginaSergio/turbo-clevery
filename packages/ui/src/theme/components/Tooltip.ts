import { mode, cssVar, SystemStyleFunction } from '@chakra-ui/theme-tools';

const $bg = cssVar('tooltip-bg');
const $arrowBg = cssVar('popper-arrow-bg');

const baseStyle: SystemStyleFunction = (props) => {
  const bg = mode('white', 'gray.700')(props);

  return {
    [$bg.variable]: `colors.${bg}`,
    px: '8px',
    py: '2px',
    bg: [$bg.reference],
    [$arrowBg.variable]: [$bg.reference],
    color: mode('gray.900', 'whiteAlpha.900')(props),
    borderRadius: 'sm',
    fontWeight: 'medium',
    fontSize: 'sm',
    boxShadow: 'lg',
    maxW: '320px',
    zIndex: 'tooltip',
  };
};

export default {
  baseStyle,
};
