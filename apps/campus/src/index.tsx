import * as React from 'react';
import ReactDOM from 'react-dom';

import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';
import { ColorModeScript } from '@chakra-ui/react';

import App from './App';

//A TOMAR POR CULO EL SERVICE WORKER
navigator?.serviceWorker?.getRegistrations()?.then(function (registrations) {
  for (let registration of registrations) {
    registration.unregister();
  }
});

/** Inicialización de Smartlook
if (process.env.NX_SMARTLOOK_ID)
  smartlookClient.init(process.env.NX_SMARTLOOK_ID);
*/

/** Inicialización de Sentry */
if (process.env.NX_SENTRY_ID)
  Sentry.init({
    dsn: process.env.NX_SENTRY_ID,
    environment: process.env.NODE_ENV,
    release: `clevery@${process.env.npm_package_version}`, // 😅 process.env.npm_package_version is 'undefined'

    // This enables automatic instrumentation (highly recommended), but is not
    // necessary for purely manual usage
    integrations: [new Integrations.BrowserTracing()],

    // To set a uniform sample rate
    tracesSampleRate: 0.2,
  });

ReactDOM.render(
  <React.StrictMode>
    <ColorModeScript initialColorMode="system" />

    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
