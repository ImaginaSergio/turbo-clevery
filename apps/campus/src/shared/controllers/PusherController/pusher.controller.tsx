import { useState, useEffect } from 'react';

import * as Pusher from 'pusher-js/with-encryption';

import { PusherContext } from '../../context';
import { getItem } from 'data';

export const PusherController = ({ children, ...props }: any) => {
  const [pusher, setPusher] = useState<Pusher.default>();

  useEffect(() => {
    if (process.env.REACT_APP_PUSHER_APP_KEY)
      setPusher(
        new Pusher.default(process.env.REACT_APP_PUSHER_APP_KEY, {
          authEndpoint: process.env.REACT_APP_API_URL + '/openAPI/authenticatePusher',
          auth: {
            headers: { Authorization: `Bearer ${getItem('loginToken')}` },
          },
          cluster: process.env.REACT_APP_PUSHER_CLUSTER,
        })
      );
  }, []);

  return <PusherContext.Provider value={{ pusher }}>{children}</PusherContext.Provider>;
};
