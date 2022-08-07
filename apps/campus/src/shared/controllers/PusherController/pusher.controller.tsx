import { useState, useEffect } from 'react';

import * as Pusher from 'pusher-js/with-encryption';

import { PusherContext } from '../../context';
import { getItem } from 'data';

export const PusherController = ({ children, ...props }: any) => {
  const [pusher, setPusher] = useState<Pusher.default>();

  useEffect(() => {
    if (process.env.NX_PUSHER_APP_KEY)
      setPusher(
        new Pusher.default(process.env.NX_PUSHER_APP_KEY, {
          authEndpoint: process.env.NX_API_URL + '/openAPI/authenticatePusher',
          auth: {
            headers: { Authorization: `Bearer ${getItem('loginToken')}` },
          },
          cluster: process.env.NX_PUSHER_CLUSTER,
        })
      );
  }, []);

  return <PusherContext.Provider value={{ pusher }}>{children}</PusherContext.Provider>;
};
