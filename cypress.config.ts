import { defineConfig } from 'cypress'

export default defineConfig({
  projectId: 'gyar5n',
  videoUploadOnPasses: false,
  defaultCommandTimeout: 10000,
  chromeWebSecurity: false,
  e2e: {
    setupNodeEvents(on, config) {
      return {
        ...config,
        // Only enable Chrome.
        // Electron (the default) has issues injecting window.ethereum before pageload, so it is not viable.
        browsers: config.browsers.filter(({ name }) => name === 'chrome'),
      }
    },
    specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}',
  },
})
