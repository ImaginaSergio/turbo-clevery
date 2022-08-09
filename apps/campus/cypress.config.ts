import { defineConfig } from 'cypress';

export default defineConfig({
  fileServerFolder: '.',
  fixturesFolder: './cypress/fixtures',
  video: true,
  videosFolder: './build/cypress/apps/campus-e2e/videos',
  screenshotsFolder: './build/cypress/apps/campus-e2e/screenshots',
  chromeWebSecurity: false,
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require('./cypress/plugins/index.js')(on, config);
    },
    baseUrl: 'http://localhost:3000',
    specPattern: './cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
  },
});
