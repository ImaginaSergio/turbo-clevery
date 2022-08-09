import { Box, Text, Link, VStack, Code, Grid } from '@chakra-ui/react';

import { ColorModeSwitcher } from './ColorModeSwitcher';

import { Card } from 'ui';

export const App = () => (
  <Box textAlign="center" fontSize="xl">
    <Grid minH="100vh" p={3}>
      <ColorModeSwitcher justifySelf="flex-end" />

      <VStack spacing={8}>
        <Card name="Jhon Doe" title="Frontend Developer" likes="27k" followers="7.2k" />

        <Text>
          Edit <Code fontSize="xl">src/App.tsx</Code> and save to reload.
        </Text>

        <Link color="teal.500" href="https://chakra-ui.com" fontSize="2xl" target="_blank" rel="noopener noreferrer">
          Learn Chakra
        </Link>
      </VStack>
    </Grid>
  </Box>
);
