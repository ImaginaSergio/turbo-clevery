// 1. Import `extendTheme`
import { extendTheme, ThemeConfig } from '@chakra-ui/react';
import { createBreakpoints } from '@chakra-ui/theme-tools';

import { colors_ob } from './colors/openbootcamp';
import { colors_om } from './colors/openmarketers';

import { components } from './components';

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};

const breakpoints = createBreakpoints({
  xs: '480px',
  sm: '768px',
  md: '1024px',
  lg: '1440px',
  xl: '1740px',
  '2xl': '2040px',
});

// 2. Call `extendTheme` and pass your custom values
const theme = extendTheme({
  config,
  breakpoints,
  components,
  semanticTokens: {
    colors: process.env.REACT_APP_ORIGEN_CAMPUS === 'OPENBOOTCAMP' ? colors_ob : colors_om,
  },
});

export { theme };
