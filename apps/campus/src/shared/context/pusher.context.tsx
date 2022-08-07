import { createContext } from 'react';
import * as Pusher from 'pusher-js';

interface ContextProps {
  pusher?: Pusher.default;
}

export const PusherContext = createContext<ContextProps>({
  pusher: undefined,
});
